import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
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
            return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
        }

        return NextResponse.json({ message: "Verification code sent" });
    } catch (error) {
        console.error("Error in send-code route:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
