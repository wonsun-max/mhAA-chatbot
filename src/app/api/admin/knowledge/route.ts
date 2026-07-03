import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { indexSource } from "@/lib/ai/knowledge";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Returns current RAG index stats. */
export async function GET() {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [chunkCount, sources] = await Promise.all([
        prisma.knowledgeChunk.count(),
        prisma.knowledgeChunk.groupBy({
            by: ["sourceType"],
            _count: { _all: true },
        }),
    ]);

    return NextResponse.json({
        chunkCount,
        bySourceType: Object.fromEntries(sources.map((s) => [s.sourceType, s._count._all])),
    });
}

/** Rebuilds the RAG index from all visible notices. */
export async function POST() {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const notices = await prisma.notice.findMany({
            where: { isVisible: true },
            select: { id: true, title: true, content: true },
            orderBy: { createdAt: "asc" },
        });

        // Drop chunks of notices that no longer exist or were hidden.
        await prisma.knowledgeChunk.deleteMany({
            where: {
                sourceType: "NOTICE",
                sourceId: { notIn: notices.map((n) => n.id) },
            },
        });

        let indexed = 0;
        let totalChunks = 0;
        const failures: string[] = [];

        for (const notice of notices) {
            try {
                totalChunks += await indexSource("NOTICE", notice.id, notice.title, notice.content);
                indexed++;
            } catch (error) {
                console.error(`[Knowledge] Failed to index notice ${notice.id}:`, error);
                failures.push(notice.id);
            }
        }

        return NextResponse.json({
            success: failures.length === 0,
            indexedNotices: indexed,
            totalChunks,
            failures,
        });
    } catch (error) {
        console.error("[Knowledge] Reindex failed:", error);
        return NextResponse.json({ error: "Failed to rebuild knowledge index" }, { status: 500 });
    }
}
