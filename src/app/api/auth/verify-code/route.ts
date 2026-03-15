import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** Verifies a 6-digit code without consuming it (consumed on final register) */
export async function POST(request: Request) {
    try {
        const { email, code } = await request.json();

        if (!email || !code) {
            return NextResponse.json({ error: "이메일과 인증 코드가 필요합니다." }, { status: 400 });
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
            return NextResponse.json({ error: "인증 코드가 올바르지 않거나 만료되었습니다." }, { status: 400 });
        }

        return NextResponse.json({ message: "인증 코드가 확인되었습니다." });
    } catch (error) {
        console.error("Error in verify-code route:", error);
        return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
    }
}
