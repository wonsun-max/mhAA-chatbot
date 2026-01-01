import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { email, code } = await req.json();

        if (!email || !code) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const session = await prisma.verificationCode.findFirst({
            where: {
                email,
                code,
                purpose: "signup",
                verified: false,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: "desc" },
        });

        if (!session) {
            return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
        }

        // Mark as verifies
        await prisma.verificationCode.update({
            where: { id: session.id },
            data: {
                verified: true,
                verifiedAt: new Date()
            }
        });

        return NextResponse.json({
            success: true,
            data: { tempKey: session.tempKey }
        });
    } catch (error: any) {
        console.error("Verify Code Error:", error);
        return NextResponse.json({ error: "Verification failed" }, { status: 500 });
    }
}
