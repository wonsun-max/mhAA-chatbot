import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const { email, code, name, nickname, grade, password } = await request.json();

        if (!email || !code || !name || !nickname || !grade || !password) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
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
            return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 });
        }

        // Check if user already exists
        const existingEmail = await prisma.user.findUnique({
            where: { email },
        });

        if (existingEmail) {
            return NextResponse.json({ error: "User already exists with this email" }, { status: 400 });
        }

        const existingNickname = await prisma.user.findUnique({
            where: { nickname },
        });

        if (existingNickname) {
            return NextResponse.json({ error: "Nickname is already taken" }, { status: 400 });
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
            message: "User registered successfully. Waiting for admin approval.",
            user: { id: user.id, email: user.email, name: user.name }
        });
    } catch (error) {
        console.error("Error in register route:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
