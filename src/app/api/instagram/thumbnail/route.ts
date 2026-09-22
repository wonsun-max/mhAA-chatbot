import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Serves the real first slide (cover photo) of an Instagram post.
 * Fetches the public post page using a crawler user-agent to obtain the fresh og:image CDN URL,
 * then proxies the image directly so client browsers never encounter 403 Forbidden or expired token errors.
 *
 * @param req Next.js incoming request containing `?code={shortcode}`
 * @returns Proxy response with image binary and caching headers
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const code = searchParams.get("code");

        if (!code || !/^[a-zA-Z0-9_-]+$/.test(code)) {
            return new NextResponse("Invalid Instagram post code", { status: 400 });
        }

        const instagramPageUrl = `https://www.instagram.com/p/${code}/`;

        const pageRes = await fetch(instagramPageUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
            },
            next: { revalidate: 86400 }, // Cache HTML lookup for 24 hours
        });

        if (!pageRes.ok) {
            return new NextResponse("Failed to fetch Instagram page", { status: 502 });
        }

        const html = await pageRes.text();

        // 1. Prioritize uncropped full-resolution 1080x1350 image URL (stp=dst-jpg_e35_tt6)
        const uncroppedMatch = html.match(/https:\/\/[^"'\s\\]+stp=dst-jpg_e35_tt6[^"'\s\\]*/);
        let rawImageUrl = uncroppedMatch
            ? uncroppedMatch[0].replace(/\\u0026/g, "&").replace(/&amp;/g, "&")
            : null;

        // 2. Fallback to standard og:image if full resolution tag is not present
        if (!rawImageUrl) {
            const match =
                html.match(/property="og:image"\s+content="([^"]+)"/) ||
                html.match(/content="([^"]+)"\s+property="og:image"/);
            if (match && match[1]) {
                rawImageUrl = match[1].replace(/&amp;/g, "&");
            }
        }

        if (!rawImageUrl) {
            return new NextResponse("No cover image found", { status: 404 });
        }

        // Fetch the fresh image from Meta CDN
        const imageRes = await fetch(rawImageUrl, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            },
        });

        if (!imageRes.ok) {
            return new NextResponse("Failed to download image from CDN", { status: 502 });
        }

        const contentType = imageRes.headers.get("content-type") || "image/jpeg";
        const imageBuffer = await imageRes.arrayBuffer();

        return new NextResponse(imageBuffer, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
            },
        });
    } catch (error) {
        console.error("[Instagram Thumbnail Proxy Error]:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
