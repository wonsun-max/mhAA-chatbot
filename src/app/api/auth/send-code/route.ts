import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "이메일 주소가 필요합니다." }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "이미 등록된 이메일입니다." }, { status: 400 });
        }

        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Store in DB
        await prisma.verificationCode.create({
            data: {
                email,
                code,
                expiresAt,
            },
        });

        // Send email
        const emailSent = await sendVerificationEmail(email, code);

        if (!emailSent) {
            return NextResponse.json({ error: "이메일 전송에 실패했습니다." }, { status: 500 });
        }

        return NextResponse.json({ message: "인증 코드가 전송되었습니다." });
    } catch (error) {
        console.error("Error in send-code route:", error);
        return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
    }
}
