import { NextResponse } from "next/server";
import { syncInstagramFromRss } from "@/lib/instagram-rss";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const result = await syncInstagramFromRss();
        return NextResponse.json({ success: true, result });
    } catch (error: any) {
        console.error("[Instagram Live Sync GET Error]:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const rssUrl = body.url || body.rssUrl;
        const result = await syncInstagramFromRss(rssUrl);
        return NextResponse.json({ success: true, result });
    } catch (error: any) {
        console.error("[Instagram Live Sync POST Error]:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
