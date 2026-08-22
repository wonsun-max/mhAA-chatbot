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
        const authHeader = req.headers.get("x-sync-secret") || req.headers.get("authorization")?.replace("Bearer ", "");
        const providedSecret = authHeader || body.secret;

        if (providedSecret !== SYNC_SECRET) {
            return NextResponse.json({ error: "Unauthorized: Invalid sync secret" }, { status: 401 });
        }

        const {
            caption = "",
            imageUrl,
            mediaUrl,
            permalink,
            url,
            isPinned = true,
        } = body;

        const effectiveImageUrl = imageUrl || mediaUrl || null;
        const effectivePermalink = permalink || url || "https://www.instagram.com/mha_withus";

        if (!caption.trim() && !effectiveImageUrl) {
            return NextResponse.json({ error: "Caption or image URL is required" }, { status: 400 });
        }

        const title = extractTitleFromCaption(caption);

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

        // Format clean notice content
        let formattedContent = caption.trim();
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
                isPinned: Boolean(isPinned),
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
