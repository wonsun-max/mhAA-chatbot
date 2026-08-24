import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
    try {
        // Delete all broken or old dummy test notices
        await prisma.notice.deleteMany({
            where: {
                OR: [
                    { title: { contains: "1.caption" } },
                    { content: { contains: "1.caption" } },
                    { title: { contains: "WITHUS 인스타그램 새 소식" } },
                    { title: { contains: "26_03_09" } },
                ]
            }
        });

        // Check existing real notices
        const existingCount = await prisma.notice.count({
            where: { category: "Instagram" }
        });

        if (existingCount === 0) {
            // Seed the 4 official MHA Instagram posts
            await prisma.notice.createMany({
                data: [
                    {
                        title: "구글 로그인 도입",
                        content: "이제 Google 계정으로 손쉽게 WITHUS에 가입하고 로그인할 수 있습니다!\n\n기존 계정과 동일한 이메일로 로그인하시면 자동으로 연동됩니다.\n\n[Instagram 원본 게시물 보기](https://www.instagram.com/mha_withus)",
                        category: "Instagram",
                        isPinned: true,
                        isVisible: true,
                    },
                    {
                        title: "콜라보 기능추가 (4) - GPA 계산기",
                        content: "내 학점과 과목별 가중치를 손쉽게 계산하고 목표 성적을 관리할 수 있는 GPA 계산기 기능이 추가되었습니다.\n\n[Instagram 원본 게시물 보기](https://www.instagram.com/mha_withus)",
                        category: "Instagram",
                        isPinned: true,
                        isVisible: true,
                    },
                    {
                        title: "콜라보 기능추가 (3) - 시험일정",
                        content: "학기별 중간고사, 기말고사 일정과 D-Day 카운트다운을 실시간으로 확인하고 구글 캘린더에 연동할 수 있습니다.\n\n[Instagram 원본 게시물 보기](https://www.instagram.com/mha_withus)",
                        category: "Instagram",
                        isPinned: true,
                        isVisible: true,
                    },
                    {
                        title: "만우절 이벤트 안내",
                        content: "마닐라한국아카데미(MHA) 학생들을 위한 WITHUS 만우절 스페셜 이벤트가 진행됩니다!\n\n[Instagram 원본 게시물 보기](https://www.instagram.com/mha_withus)",
                        category: "Instagram",
                        isPinned: false,
                        isVisible: true,
                    },
                ]
            });
        }

        const notices = await prisma.notice.findMany({
            orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }]
        });

        return NextResponse.json({ success: true, count: notices.length, notices });
    } catch (error) {
        console.error("Cleanup error:", error);
        return NextResponse.json({ error: "Failed to cleanup" }, { status: 500 });
    }
}

export async function GET() {
    return POST();
}
