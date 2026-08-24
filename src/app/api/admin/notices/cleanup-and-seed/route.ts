import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncInstagramFromRss } from "@/lib/instagram-rss";

export const dynamic = "force-dynamic";

export async function POST() {
    try {
        // 1. Delete ALL non-Instagram or mock test notices completely
        await prisma.notice.deleteMany({
            where: {
                OR: [
                    { category: { not: "Instagram" } },
                    { content: { not: { contains: "/p/" } } },
                    { content: { contains: "1.caption" } },
                    { title: "구글 로그인 도입" },
                    { title: "콜라보 기능추가 (4) - GPA 계산기" },
                    { title: "콜라보 기능추가 (3) - 시험일정" },
                    { title: "만우절 이벤트 안내" },
                    { title: "WITHUS 인스타" },
                    { title: "GPA 계산기" },
                    { title: "시험 일정 기능 추가~!!" },
                    { title: "큐티조 설정하기~!" },
                    { title: "운영 시작" },
                ]
            }
        });

        // 2. Perform live sync from the live Instagram feed
        const syncResult = await syncInstagramFromRss();

        // 3. Query all active notices (Only 100% REAL Instagram posts)
        const notices = await prisma.notice.findMany({
            where: { isVisible: true },
            orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }]
        });

        return NextResponse.json({
            success: true,
            syncResult,
            count: notices.length,
            notices,
        });
    } catch (error: any) {
        console.error("Cleanup and sync error:", error);
        return NextResponse.json({ error: error.message || "Failed to cleanup and sync" }, { status: 500 });
    }
}

export async function GET() {
    return POST();
}
