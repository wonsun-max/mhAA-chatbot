import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
        }

        const { nickname } = await req.json();

        if (!nickname || nickname.trim().length < 2) {
            return NextResponse.json({ error: "닉네임은 최소 2글자 이상이어야 합니다." }, { status: 400 });
        }

        // Check for duplicates
        const existingUser = await prisma.user.findFirst({
            where: {
                nickname,
                NOT: { id: (session.user as any).id }
            }
        });

        if (existingUser) {
            return NextResponse.json({ error: "이미 사용 중인 닉네임입니다." }, { status: 400 });
        }

        // Update nickname
        await prisma.user.update({
            where: { id: (session.user as any).id },
            data: { nickname: nickname.trim() }
        });

        return NextResponse.json({ message: "닉네임이 성공적으로 변경되었습니다." });
    } catch (error) {
        console.error("[Nickname Update API Error]:", error);
        return NextResponse.json({ error: "서버 내부 오류가 발생했습니다." }, { status: 500 });
    }
}
