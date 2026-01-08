import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole, UserStatus } from "@prisma/client";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const {
            tempKey,
            username,
            password,
            role,
            name,
            koreanName,
            birthdate,
            gender,
            age,
            grade,
            studentName
        } = data;

        // 1. Validate tempKey
        const session = await prisma.verificationCode.findUnique({
            where: { tempKey },
        });

        if (!session || !session.verified || session.expiresAt < new Date()) {
            return NextResponse.json({ error: "Invalid or expired verification session" }, { status: 400 });
        }

        // 2. Check existing username/email
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: session.email },
                    { username }
                ]
            }
        });

        if (existingUser) {
            return NextResponse.json({ error: "User with this email or username already exists" }, { status: 400 });
        }

        // 3. Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // 4. Determine Role (First user becomes ACTIVE ADMIN automatically)
        const userCount = await prisma.user.count();
        const isFirstUser = userCount === 0;

        await prisma.user.create({
            data: {
                email: session.email,
                username,
                passwordHash,
                role: isFirstUser ? UserRole.ADMIN : (role as UserRole),
                name,
                koreanName,
                birthdate: new Date(birthdate),
                gender,
                age: parseInt(age),
                grade: grade ? parseInt(grade) : null,
                studentName: studentName || null,
                status: isFirstUser ? UserStatus.ACTIVE : UserStatus.PENDING,
                emailVerified: true,
                aiEnabled: isFirstUser ? true : false,
            },
        });

        // 5. Cleanup session (Safe cleanup, don't block success)
        try {
            await prisma.verificationCode.delete({
                where: { tempKey },
            });
        } catch (cleanupError) {
            console.error("Session cleanup error:", cleanupError);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Complete Signup Error:", error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : "Signup completion failed"
        }, { status: 500 });
    }
}
