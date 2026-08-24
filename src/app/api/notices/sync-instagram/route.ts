import { NextResponse } from "next/server";
import { syncInstagramFromRss } from "@/lib/instagram-rss";

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const rssUrl = body.url || body.rssUrl || process.env.INSTAGRAM_RSS_URL;

        if (rssUrl) {
            const result = await syncInstagramFromRss(rssUrl);
            return NextResponse.json({ success: true, result });
        }

        return NextResponse.json({ success: true, message: "Use /api/cron/sync-instagram for RSS feed sync." });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
