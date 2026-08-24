import { prisma } from "@/lib/prisma";

export interface ParsedRssItem {
    guid: string;
    title: string;
    description: string;
    imageUrls: string[];
    link: string;
    pubDate: Date;
}

export const DEFAULT_INSTAGRAM_FEED_URL = "https://rss.app/feeds/v1.1/TKmaaZRoN7kWXrVJ.json";

/**
 * Synchronizes Instagram posts with full multi-image carousel support and unique post deduplication.
 */
export async function syncInstagramFromRss(rssUrl = DEFAULT_INSTAGRAM_FEED_URL) {
    const targetUrl = rssUrl || process.env.INSTAGRAM_RSS_URL || DEFAULT_INSTAGRAM_FEED_URL;

    const response = await fetch(targetUrl, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) WITHUS/1.0",
            "Accept": "application/json, application/rss+xml, */*",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch RSS Feed: HTTP ${response.status}`);
    }

    const text = await response.text();
    let parsedItems: ParsedRssItem[] = [];

    if (text.trim().startsWith("{")) {
        try {
            const jsonData = JSON.parse(text);
            const rawItems = jsonData.items || jsonData.entries || [];
            parsedItems = rawItems.map((it: any) => {
                const images: string[] = [];
                if (it.image) images.push(it.image);
                if (it.image_url) images.push(it.image_url);
                if (it.banner_image) images.push(it.banner_image);
                if (Array.isArray(it.attachments)) {
                    it.attachments.forEach((att: any) => {
                        if (att.url && (att.mime_type?.startsWith("image") || att.url.match(/\.(jpeg|jpg|png|webp)/i))) {
                            images.push(att.url);
                        }
                    });
                }

                const postUrl = it.url || it.link || "";
                const cleanTitle = (it.title || it.content_text || "WITHUS 인스타그램 소식")
                    .split("\n")[0]
                    .replace(/#[^\s#]+/g, "")
                    .trim()
                    .slice(0, 60) || "WITHUS 인스타그램 소식";

                return {
                    guid: it.id || postUrl || `insta_${Date.now()}_${Math.random()}`,
                    title: cleanTitle,
                    description: it.content_text || it.summary || it.title || "",
                    imageUrls: Array.from(new Set(images)),
                    link: postUrl || "https://www.instagram.com/mha_withus",
                    pubDate: it.date_published ? new Date(it.date_published) : new Date(),
                };
            });
        } catch (e) {
            console.error("JSON parse error in RSS feed:", e);
        }
    }

    let insertedCount = 0;
    let updatedCount = 0;

    for (const item of parsedItems) {
        // Extract post identifier (e.g. /p/DV6EgqwktZE or guid)
        const postShortcodeMatch = item.link.match(/\/p\/([a-zA-Z0-9_-]+)/);
        const searchIdentifier = postShortcodeMatch ? postShortcodeMatch[1] : item.guid;

        const existingNotice = await prisma.notice.findFirst({
            where: {
                OR: [
                    { content: { contains: searchIdentifier } },
                    { title: item.title },
                ],
            },
        });

        // Format notice content with ALL slide images and post permalink
        let formattedContent = item.description || item.title;
        if (item.imageUrls.length > 0) {
            item.imageUrls.forEach((img, idx) => {
                formattedContent += `\n\n![Instagram Slide ${idx + 1}](${img})`;
            });
        }
        formattedContent += `\n\n[Instagram 원본 게시물 보기](${item.link})`;

        if (!existingNotice) {
            await prisma.notice.create({
                data: {
                    title: item.title,
                    content: formattedContent,
                    category: "Instagram",
                    isPinned: true,
                    isVisible: true,
                    createdAt: item.pubDate,
                },
            });
            insertedCount++;
        } else {
            // Update existing notice with real image and full content if missing
            await prisma.notice.update({
                where: { id: existingNotice.id },
                data: {
                    title: item.title,
                    content: formattedContent,
                    category: "Instagram",
                    createdAt: item.pubDate,
                },
            });
            updatedCount++;
        }
    }

    return {
        totalFound: parsedItems.length,
        insertedCount,
        updatedCount,
        parsedItems,
    };
}
