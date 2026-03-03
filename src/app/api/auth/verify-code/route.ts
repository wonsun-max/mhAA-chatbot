import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** Verifies a 6-digit code without consuming it (consumed on final register) */
export async function POST(request: Request) {
    try {
        const { email, code } = await request.json();

        if (!email || !code) {
            return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
        }

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
            return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 });
        }

        return NextResponse.json({ message: "Code is valid" });
    } catch (error) {
        console.error("Error in verify-code route:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
