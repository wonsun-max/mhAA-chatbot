import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { indexSource } from "@/lib/ai/knowledge";
import { syncInstagramFromRss } from "@/lib/instagram-rss";

let lastAutoSyncTime = 0;
const SYNC_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const parsedLimit = searchParams.get("limit");
        const limit = parsedLimit ? Number.parseInt(parsedLimit, 10) : undefined;
        const safeLimit = limit && limit > 0 ? limit : undefined;

        // Auto-sync in background if 5 minutes elapsed (Zero manual work)
        const now = Date.now();
        if (now - lastAutoSyncTime > SYNC_INTERVAL_MS) {
            lastAutoSyncTime = now;
            // Run sync in non-blocking manner so request is instantaneous
            syncInstagramFromRss().catch((err) => {
                console.error("[Auto Instagram Sync Error]:", err);
            });
        }

        const notices = await prisma.notice.findMany({
            where: {
                isVisible: true,
                ...(category ? { category } : {}),
            },
            orderBy: [
                { isPinned: "desc" },
                { createdAt: "desc" },
            ],
            take: safeLimit,
        });

        return NextResponse.json(notices);
    } catch (error) {
        console.error("Failed to fetch notices:", error);
        return NextResponse.json({ error: "Failed to fetch notices" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, content, category, isPinned } = await req.json();
        const safeTitle = typeof title === "string" ? title.trim() : "";
        const safeContent = typeof content === "string" ? content.trim() : "";
        const safeCategory = typeof category === "string" ? category.trim() : "";

        if (!safeTitle || !safeContent || !safeCategory) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const notice = await prisma.notice.create({
            data: {
                title: safeTitle,
                content: safeContent,
                category: safeCategory,
                isPinned: Boolean(isPinned),
                authorId: session.user.id,
            },
        });

        try {
            await indexSource("NOTICE", notice.id, notice.title, notice.content);
        } catch (indexError) {
            console.error("[Knowledge] Failed to index notice:", indexError);
        }

        return NextResponse.json(notice);
    } catch (error) {
        console.error("Failed to create notice:", error);
        return NextResponse.json({ error: "Failed to create notice" }, { status: 500 });
    }
}
