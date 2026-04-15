import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/mail";

/**
 * POST /api/auth/forgot-password
 * Validates that the email belongs to an APPROVED user, then sends a 6-digit reset code.
 */
export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "이메일을 입력해주세요." }, { status: 400 });
        }

        // Only allow APPROVED users to reset their password
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, status: true },
        });

        if (!user || user.status !== "APPROVED") {
            // Return a generic success message to prevent user enumeration
            return NextResponse.json({ message: "비밀번호 재설정 코드가 전송되었습니다." });
        }

        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Store in DB (reuses VerificationCode model)
        await prisma.verificationCode.create({
            data: { email, code, expiresAt },
        });

        // Send password reset email
        const emailSent = await sendVerificationEmail(email, code);

        if (!emailSent) {
            return NextResponse.json({ error: "이메일 전송에 실패했습니다. 다시 시도해주세요." }, { status: 500 });
        }

        return NextResponse.json({ message: "비밀번호 재설정 코드가 전송되었습니다." });
    } catch (error) {
        console.error("[forgot-password] Error:", error);
        return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
    }
}
