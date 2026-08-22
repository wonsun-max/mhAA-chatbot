import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SYNC_SECRET = process.env.INSTAGRAM_SYNC_SECRET || "withus_insta_sync_2026";

/**
 * Extracts a clean title from an Instagram caption.
 */
function extractTitleFromCaption(caption: string): string {
    if (!caption || !caption.trim()) return "WITHUS 인스타그램 새 소식";

    const lines = caption.split("\n").map(l => l.trim()).filter(Boolean);
    const firstLine = lines[0] || "WITHUS 인스타그램 소식";

    // Remove leading/trailing hashtags or emojis for clean title
    const cleanFirstLine = firstLine.replace(/#[^\s#]+/g, "").trim();
    if (cleanFirstLine.length >= 3) {
        return cleanFirstLine.slice(0, 60);
    }

    return firstLine.slice(0, 60);
}

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        console.log("[Instagram Sync Received Payload]:", JSON.stringify(body));

        const authHeader = req.headers.get("x-sync-secret") || req.headers.get("authorization")?.replace("Bearer ", "");
        const providedSecret = authHeader || body.secret;

        if (providedSecret !== SYNC_SECRET) {
            return NextResponse.json({ error: "Unauthorized: Invalid sync secret" }, { status: 401 });
        }

        // Support multiple parameter names from different Make / Zapier modules
        const rawCaption = body.caption || body.text || body.message || body.title || body.description || body.content || "";
        const rawImageUrl = body.imageUrl || body.image_url || body.mediaUrl || body.media_url || body.thumbnailUrl || body.thumbnail_url || body.display_url || null;
        const rawPermalink = body.permalink || body.link || body.postUrl || body.post_url || body.url || "https://www.instagram.com/mha_withus";
        const isPinned = body.isPinned !== undefined ? Boolean(body.isPinned) : true;

        const effectiveCaption = typeof rawCaption === "string" ? rawCaption.trim() : "";
        const effectiveImageUrl = typeof rawImageUrl === "string" && rawImageUrl.startsWith("http") ? rawImageUrl.trim() : null;
        const effectivePermalink = typeof rawPermalink === "string" && rawPermalink.startsWith("http") ? rawPermalink.trim() : "https://www.instagram.com/mha_withus";

        // Check if this Instagram post has already been synced
        if (effectivePermalink && effectivePermalink !== "https://www.instagram.com/mha_withus") {
            const existingNotice = await prisma.notice.findFirst({
                where: {
                    content: {
                        contains: effectivePermalink,
                    },
                },
            });

            if (existingNotice) {
                return NextResponse.json({
                    success: true,
                    message: "Notice already synced",
                    noticeId: existingNotice.id,
                });
            }
        }

        const title = extractTitleFromCaption(effectiveCaption);

        // Format clean notice content
        let formattedContent = effectiveCaption || "WITHUS 인스타그램 새 소식이 등록되었습니다.";
        if (effectiveImageUrl) {
            formattedContent += `\n\n![Instagram Image](${effectiveImageUrl})`;
        }
        if (effectivePermalink) {
            formattedContent += `\n\n[Instagram 원본 게시물 보기](${effectivePermalink})`;
        }

        // Create notice in DB
        const notice = await prisma.notice.create({
            data: {
                title,
                content: formattedContent,
                category: "Instagram",
                isPinned,
                isVisible: true,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Instagram notice successfully synced",
            notice: {
                id: notice.id,
                title: notice.title,
                category: notice.category,
                createdAt: notice.createdAt,
            },
        });
    } catch (error) {
        console.error("[Instagram Sync API Error]:", error);
        return NextResponse.json({ error: "Failed to sync Instagram post" }, { status: 500 });
    }
}
