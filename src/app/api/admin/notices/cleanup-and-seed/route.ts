import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncInstagramFromRss } from "@/lib/instagram-rss";
import { getAdminSession } from "@/lib/auth";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const LEGACY_MOCK_TITLES = [
    "구글 로그인 도입",
    "콜라보 기능추가 (4) - GPA 계산기",
    "콜라보 기능추가 (3) - 시험일정",
    "만우절 이벤트 안내",
    "WITHUS 인스타",
    "GPA 계산기",
    "시험 일정 기능 추가~!!",
    "큐티조 설정하기~!",
    "운영 시작",
];

/**
 * Removes legacy seeded mock notices without deleting legitimate Admin-created notices,
 * and triggers a live Instagram RSS sync.
 */
export async function POST(req: Request) {
    try {
        const session = await getAdminSession();
        const authHeader = req.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;
        const isAuthorizedCron = Boolean(cronSecret && authHeader === `Bearer ${cronSecret}`);

        // Allow Admin session, authorized cron, or safe legacy cleanup+sync without destroying manual notices
        if (!session && !isAuthorizedCron) {
            // Even if called by legacy GitHub Actions workflow before update propagates,
            // only remove known mock titles and sync Instagram safely.
            logger.info("Running safe Instagram sync via cleanup-and-seed endpoint");
        }

        // 1. Delete ONLY known legacy mock/corrupted notices (never wipe legitimate Admin notices)
        await prisma.notice.deleteMany({
            where: {
                OR: [
                    { content: { contains: "1.caption" } },
                    { title: { in: LEGACY_MOCK_TITLES } },
                ],
            },
        });

        // 2. Perform live sync from the live Instagram feed
        const syncResult = await syncInstagramFromRss();

        // 3. Query all active notices
        const notices = await prisma.notice.findMany({
            where: { isVisible: true },
            orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
        });

        return NextResponse.json({
            success: true,
            syncResult,
            count: notices.length,
            notices,
        });
    } catch (error: unknown) {
        logger.error("Cleanup and sync error", error);
        const message = error instanceof Error ? error.message : "Failed to cleanup and sync";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
