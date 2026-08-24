import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncInstagramFromRss } from "@/lib/instagram-rss";

export const dynamic = "force-dynamic";

export async function POST() {
    try {
        // 1. Delete broken dummy test notices
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

        // 2. Perform live sync from the live Instagram feed
        const syncResult = await syncInstagramFromRss();

        // 3. Query all active notices
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
