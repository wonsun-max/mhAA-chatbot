import { NextResponse } from "next/server";
import { syncInstagramFromRss, DEFAULT_INSTAGRAM_FEED_URL } from "@/lib/instagram-rss";
import { getAdminSession } from "@/lib/auth";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

/**
 * Triggers live Instagram RSS synchronization using the configured feed URL.
 */
export async function GET() {
    try {
        const result = await syncInstagramFromRss(process.env.INSTAGRAM_RSS_URL || DEFAULT_INSTAGRAM_FEED_URL);
        return NextResponse.json({
            success: true,
            result,
            totalFound: result.totalFound,
            insertedCount: result.insertedCount,
            updatedCount: result.updatedCount,
        });
    } catch (error: unknown) {
        logger.error("[Instagram Live Sync GET Error]", error);
        const message = error instanceof Error ? error.message : "Failed to sync Instagram feed";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

/**
 * Triggers live Instagram RSS synchronization.
 * Custom feed URL override is restricted to authenticated ADMIN users to prevent SSRF / feed injection.
 */
export async function POST(req: Request) {
    try {
        const session = await getAdminSession();
        let rssUrl = process.env.INSTAGRAM_RSS_URL || DEFAULT_INSTAGRAM_FEED_URL;

        if (session) {
            const body = await req.json().catch(() => ({}));
            const candidate = body.url || body.rssUrl;
            if (typeof candidate === "string" && candidate.startsWith("https://rss.app/")) {
                rssUrl = candidate;
            }
        }

        const result = await syncInstagramFromRss(rssUrl);
        return NextResponse.json({
            success: true,
            result,
            totalFound: result.totalFound,
            insertedCount: result.insertedCount,
            updatedCount: result.updatedCount,
        });
    } catch (error: unknown) {
        logger.error("[Instagram Live Sync POST Error]", error);
        const message = error instanceof Error ? error.message : "Failed to sync Instagram feed";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
