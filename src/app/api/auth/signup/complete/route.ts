import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

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
        const session = await prisma.verificationSession.findUnique({
            where: { tempKey },
        });

        if (!session || session.expiresAt < new Date()) {
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

        const user = await prisma.user.create({
            data: {
                email: session.email,
                username,
                passwordHash,
                role: isFirstUser ? "ADMIN" : role,
                name,
                koreanName,
                birthdate: new Date(birthdate),
                gender,
                age: parseInt(age),
                grade: grade ? parseInt(grade) : null,
                studentName: studentName || null,
                status: isFirstUser ? "ACTIVE" : "PENDING",
                emailVerified: true,
                aiEnabled: isFirstUser ? true : false,
            } as any, // Cast to any because the locally generated Prisma client might not have updated types yet
        });

        // 5. Cleanup session (Safe cleanup, don't block success)
        try {
            await prisma.verificationSession.delete({
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
