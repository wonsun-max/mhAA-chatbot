import { NextResponse } from "next/server";
import { syncInstagramFromRss, DEFAULT_INSTAGRAM_FEED_URL } from "@/lib/instagram-rss";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const customUrl = searchParams.get("url");
        const rssUrl = customUrl || process.env.INSTAGRAM_RSS_URL || DEFAULT_INSTAGRAM_FEED_URL;

        const result = await syncInstagramFromRss(rssUrl);

        return NextResponse.json({
            success: true,
            message: "Instagram live sync completed successfully",
            totalFound: result.totalFound,
            insertedCount: result.insertedCount,
            updatedCount: result.updatedCount,
        });
    } catch (error: any) {
        console.error("[Instagram Live Sync Error]:", error);
        return NextResponse.json({
            error: error.message || "Failed to sync Instagram feed",
        }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const rssUrl = body.url || body.rssUrl || process.env.INSTAGRAM_RSS_URL || DEFAULT_INSTAGRAM_FEED_URL;

        const result = await syncInstagramFromRss(rssUrl);

        return NextResponse.json({
            success: true,
            message: "Instagram live sync completed successfully",
            totalFound: result.totalFound,
            insertedCount: result.insertedCount,
            updatedCount: result.updatedCount,
        });
    } catch (error: any) {
        console.error("[Instagram Live Sync POST Error]:", error);
        return NextResponse.json({
            error: error.message || "Failed to sync Instagram feed",
        }, { status: 500 });
    }
}
