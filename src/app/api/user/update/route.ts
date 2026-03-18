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

        const body = await req.json();
        const { nickname, qtGroup } = body;
        const userId = (session.user as any).id;

        const updateData: any = {};

        if (nickname !== undefined) {
            if (nickname.trim().length < 2) {
                return NextResponse.json({ error: "닉네임은 최소 2글자 이상이어야 합니다." }, { status: 400 });
            }

            // Check for duplicates
            const existingUser = await prisma.user.findFirst({
                where: {
                    nickname: nickname.trim(),
                    NOT: { id: userId }
                }
            });

            if (existingUser) {
                return NextResponse.json({ error: "이미 사용 중인 닉네임입니다." }, { status: 400 });
            }
            updateData.nickname = nickname.trim();
        }

        if (qtGroup !== undefined) {
            updateData.qtGroup = qtGroup;
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: "수정할 내용이 없습니다." }, { status: 400 });
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        return NextResponse.json({ 
            message: "프로필이 성공적으로 변경되었습니다.",
            user: {
                nickname: updatedUser.nickname,
                qtGroup: updatedUser.qtGroup
            }
        });
    } catch (error) {
        console.error("[User Update API Error]:", error);
        return NextResponse.json({ error: "서버 내부 오류가 발생했습니다." }, { status: 500 });
    }
}
