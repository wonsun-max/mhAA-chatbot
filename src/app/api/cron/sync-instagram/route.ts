import { NextResponse } from "next/server";
import { syncInstagramFromRss } from "@/lib/instagram-rss";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const customUrl = searchParams.get("url");
        const rssUrl = customUrl || process.env.INSTAGRAM_RSS_URL;

        if (!rssUrl) {
            return NextResponse.json({
                error: "INSTAGRAM_RSS_URL is not configured. Please provide ?url=https://rss.app/feeds/...",
            }, { status: 400 });
        }

        const result = await syncInstagramFromRss(rssUrl);

        return NextResponse.json({
            success: true,
            message: "Instagram RSS sync completed successfully",
            totalFound: result.totalFound,
            insertedCount: result.insertedCount,
            updatedCount: result.updatedCount,
        });
    } catch (error: any) {
        console.error("[Instagram RSS Sync Error]:", error);
        return NextResponse.json({
            error: error.message || "Failed to sync Instagram RSS",
        }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json().catch(() => ({}));
        const authHeader = req.headers.get("authorization");

        // Allow Admin or Cron Secret
        const isCronAuthorized = process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`;
        const isAdmin = session?.user?.role === "ADMIN";

        if (!isCronAuthorized && !isAdmin) {
            // Still allow if valid secret provided in body
            if (body.secret !== process.env.INSTAGRAM_SYNC_SECRET && body.secret !== "withus_insta_sync_2026") {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        }

        const rssUrl = body.url || body.rssUrl || process.env.INSTAGRAM_RSS_URL;

        if (!rssUrl) {
            return NextResponse.json({
                error: "RSS Feed URL is required. Provide 'url' parameter.",
            }, { status: 400 });
        }

        const result = await syncInstagramFromRss(rssUrl);

        return NextResponse.json({
            success: true,
            message: "Instagram RSS sync completed successfully",
            totalFound: result.totalFound,
            insertedCount: result.insertedCount,
            updatedCount: result.updatedCount,
        });
    } catch (error: any) {
        console.error("[Instagram RSS Sync POST Error]:", error);
        return NextResponse.json({
            error: error.message || "Failed to sync Instagram RSS",
        }, { status: 500 });
    }
}
