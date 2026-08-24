import { prisma } from "@/lib/prisma";

export interface ParsedRssItem {
    guid: string;
    title: string;
    description: string;
    imageUrl: string | null;
    link: string;
    pubDate: Date;
}

/**
 * Parses XML RSS feed string into structured Instagram post items.
 * Handles both RSS 2.0, Atom, and RSS.app / FetchRSS formats with media enclosures.
 */
export function parseInstagramRssXml(xmlText: string): ParsedRssItem[] {
    const items: ParsedRssItem[] = [];
    const itemRegex = /<item[\s\S]*?<\/item>/gi;
    const itemMatches = xmlText.match(itemRegex) || [];

    for (const itemXml of itemMatches) {
        // 1. Link / Guid
        const linkMatch = itemXml.match(/<link>(https?:\/\/[^<]+)<\/link>/i);
        const guidMatch = itemXml.match(/<guid[^>]*>(https?:\/\/[^<]+)<\/guid>/i);
        const link = (linkMatch ? linkMatch[1] : (guidMatch ? guidMatch[1] : "")).trim() || "https://www.instagram.com/mha_withus";
        const guid = (guidMatch ? guidMatch[1] : link).trim();

        // 2. Title
        const titleMatch = itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i) || itemXml.match(/<title>([\s\S]*?)<\/title>/i);
        let rawTitle = titleMatch ? titleMatch[1].trim() : "WITHUS 인스타그램 소식";
        // Clean title
        rawTitle = rawTitle.replace(/<[^>]+>/g, "").replace(/#[^\s#]+/g, "").trim();
        const title = rawTitle.length > 3 ? rawTitle.slice(0, 60) : "WITHUS 인스타그램 소식";

        // 3. Description / Caption
        const descMatch = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i) 
            || itemXml.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/i)
            || itemXml.match(/<description>([\s\S]*?)<\/description>/i);
        
        let rawDesc = descMatch ? descMatch[1] : "";
        
        // 4. Image Extraction (Enclosure, Media Content, or <img> tag)
        let imageUrl: string | null = null;
        const enclosureMatch = itemXml.match(/<enclosure[^>]+url=["'](https?:\/\/[^"']+)["']/i);
        const mediaMatch = itemXml.match(/<media:content[^>]+url=["'](https?:\/\/[^"']+)["']/i);
        const imgTagMatch = rawDesc.match(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/i);

        if (enclosureMatch) {
            imageUrl = enclosureMatch[1];
        } else if (mediaMatch) {
            imageUrl = mediaMatch[1];
        } else if (imgTagMatch) {
            imageUrl = imgTagMatch[1];
        }

        // Clean HTML tags from description while preserving text line breaks
        const cleanDescription = rawDesc
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<\/p>/gi, "\n\n")
            .replace(/<[^>]+>/g, "")
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .trim();

        // 5. PubDate
        const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);
        let pubDate = new Date();
        if (pubDateMatch) {
            const parsed = new Date(pubDateMatch[1].trim());
            if (!isNaN(parsed.getTime())) {
                pubDate = parsed;
            }
        }

        items.push({
            guid,
            title: cleanDescription.split("\n")[0]?.replace(/#[^\s#]+/g, "").trim().slice(0, 60) || title,
            description: cleanDescription,
            imageUrl,
            link,
            pubDate,
        });
    }

    return items;
}

/**
 * Synchronizes Instagram posts from an RSS Feed into the Prisma Notice database.
 * Prevents duplicates, embeds high-res images and direct links.
 */
export async function syncInstagramFromRss(rssUrl: string) {
    if (!rssUrl || !rssUrl.startsWith("http")) {
        throw new Error("Invalid RSS Feed URL");
    }

    const response = await fetch(rssUrl, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) WITHUS/1.0",
            "Accept": "application/rss+xml, application/xml, text/xml, application/json, */*",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch RSS Feed: HTTP ${response.status}`);
    }

    const text = await response.text();
    let parsedItems: ParsedRssItem[] = [];

    // Support JSON Feed format if provided by RSS.app
    if (text.trim().startsWith("{")) {
        try {
            const jsonData = JSON.parse(text);
            const rawItems = jsonData.items || jsonData.entries || [];
            parsedItems = rawItems.map((it: any) => ({
                guid: it.id || it.url || it.link || `insta_${Date.now()}_${Math.random()}`,
                title: (it.title || it.content_text || "").replace(/#[^\s#]+/g, "").trim().slice(0, 60) || "WITHUS 인스타그램 소식",
                description: it.content_text || it.summary || it.title || "",
                imageUrl: it.image || it.image_url || it.banner_image || (it.attachments && it.attachments[0]?.url) || null,
                link: it.url || it.link || "https://www.instagram.com/mha_withus",
                pubDate: it.date_published ? new Date(it.date_published) : new Date(),
            }));
        } catch {
            parsedItems = parseInstagramRssXml(text);
        }
    } else {
        parsedItems = parseInstagramRssXml(text);
    }

    let insertedCount = 0;
    let updatedCount = 0;

    for (const item of parsedItems) {
        // Check if notice with this link already exists
        const existingNotice = await prisma.notice.findFirst({
            where: {
                OR: [
                    { content: { contains: item.link } },
                    { content: { contains: item.guid } },
                ],
            },
        });

        // Format clean notice content
        let formattedContent = item.description || item.title;
        if (item.imageUrl) {
            formattedContent += `\n\n![Instagram Image](${item.imageUrl})`;
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
            // Update if image or content was missing
            if (!existingNotice.content.includes("![Instagram Image]") && item.imageUrl) {
                await prisma.notice.update({
                    where: { id: existingNotice.id },
                    data: { content: formattedContent },
                });
                updatedCount++;
            }
        }
    }

    return {
        totalFound: parsedItems.length,
        insertedCount,
        updatedCount,
        parsedItems,
    };
}
