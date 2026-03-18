import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const { email, code, name, nickname, grade, password, qtGroup } = await request.json();

        if (!email || !code || !name || !nickname || !grade || !password || !qtGroup) {
            return NextResponse.json({ error: "모든 필드를 입력해야 합니다." }, { status: 400 });
        }

        // Verify code
        const verification = await prisma.verificationCode.findFirst({
            where: {
                email,
                code,
                verified: false,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: "desc" },
        });

        if (!verification) {
            return NextResponse.json({ error: "인증 코드가 올바르지 않거나 만료되었습니다." }, { status: 400 });
        }

        // Check if user already exists
        const existingEmail = await prisma.user.findUnique({
            where: { email },
        });

        if (existingEmail) {
            return NextResponse.json({ error: "이미 가입된 이메일입니다." }, { status: 400 });
        }

        const existingNickname = await prisma.user.findUnique({
            where: { nickname },
        });

        if (existingNickname) {
            return NextResponse.json({ error: "이미 사용 중인 닉네임입니다." }, { status: 400 });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                name,
                nickname,
                grade,
                passwordHash,
                qtGroup,
                status: "PENDING", // Require admin approval
                role: "STUDENT",   // Default role
            },
        });

        // Mark code as verified ONLY after user creation succeeds
        await prisma.verificationCode.update({
            where: { id: verification.id },
            data: { verified: true },
        });

        return NextResponse.json({
            message: "회원가입이 완료되었습니다. 관리자 승인을 기다려주세요.",
            user: { id: user.id, email: user.email, name: user.name }
        });
    } catch (error) {
        console.error("Error in register route:", error);
        return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
    }
}
