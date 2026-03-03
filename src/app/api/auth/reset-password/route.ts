import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * POST /api/auth/reset-password
 * Verifies the code and updates the user's password.
 */
export async function POST(request: Request) {
    try {
        const { email, code, password } = await request.json();

        if (!email || !code || !password) {
            return NextResponse.json({ error: "모든 항목을 입력해주세요." }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: "비밀번호는 최소 6자 이상이어야 합니다." }, { status: 400 });
        }

        // Validate the verification code
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

        // Mark code as used
        await prisma.verificationCode.update({
            where: { id: verification.id },
            data: { verified: true },
        });

        // Hash new password and update user record
        const passwordHash = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { email },
            data: { passwordHash },
        });

        return NextResponse.json({ message: "비밀번호가 성공적으로 변경되었습니다." });
    } catch (error) {
        console.error("[reset-password] Error:", error);
        return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
    }
}
