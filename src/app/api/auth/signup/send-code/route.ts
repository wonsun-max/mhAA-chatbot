import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        // Generate a temporary key to identify this session
        const tempKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        // Store in DB with 10 min expiry
        await prisma.verificationSession.create({
            data: {
                email,
                code: verificationCode,
                tempKey,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
            },
        });

        // Send email
        await sendVerificationEmail(email, verificationCode);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Send Code Error:", error);
        return NextResponse.json({ error: "Failed to send code" }, { status: 500 });
    }
}
