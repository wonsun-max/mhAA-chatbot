import { prisma } from "@/lib/prisma";

export interface ParsedRssItem {
    guid: string;
    title: string;
    description: string;
    imageUrls: string[];
    link: string;
    pubDate: Date;
}

/**
 * Parses XML RSS feed string into structured Instagram post items.
 * Extracts ALL carousel slide images (not just the first thumbnail) from enclosures, media tags, and description.
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
        rawTitle = rawTitle.replace(/<[^>]+>/g, "").replace(/#[^\s#]+/g, "").trim();
        const title = rawTitle.length > 3 ? rawTitle.slice(0, 60) : "WITHUS 인스타그램 소식";

        // 3. Description / Caption
        const descMatch = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i) 
            || itemXml.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/i)
            || itemXml.match(/<description>([\s\S]*?)<\/description>/i);
        
        const rawDesc = descMatch ? descMatch[1] : "";
        
        // 4. Extract ALL Images (Enclosure, Media Content, and all <img> in description)
        const imageUrlsSet = new Set<string>();

        // Check <enclosure>
        const enclosureMatches = itemXml.matchAll(/<enclosure[^>]+url=["'](https?:\/\/[^"']+)["']/gi);
        for (const m of enclosureMatches) {
            if (m[1]) imageUrlsSet.add(m[1].trim());
        }

        // Check <media:content>
        const mediaMatches = itemXml.matchAll(/<media:content[^>]+url=["'](https?:\/\/[^"']+)["']/gi);
        for (const m of mediaMatches) {
            if (m[1]) imageUrlsSet.add(m[1].trim());
        }

        // Check all <img> tags inside description
        const imgTagMatches = rawDesc.matchAll(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/gi);
        for (const m of imgTagMatches) {
            if (m[1] && !m[1].includes("emoji") && !m[1].includes("icon")) {
                imageUrlsSet.add(m[1].trim());
            }
        }

        const imageUrls = Array.from(imageUrlsSet);

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
            imageUrls,
            link,
            pubDate,
        });
    }

    return items;
}

/**
 * Synchronizes Instagram posts with full multi-image carousel support.
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

    // Support JSON Feed format
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
                return {
                    guid: it.id || it.url || it.link || `insta_${Date.now()}_${Math.random()}`,
                    title: (it.title || it.content_text || "").replace(/#[^\s#]+/g, "").trim().slice(0, 60) || "WITHUS 인스타그램 소식",
                    description: it.content_text || it.summary || it.title || "",
                    imageUrls: Array.from(new Set(images)),
                    link: it.url || it.link || "https://www.instagram.com/mha_withus",
                    pubDate: it.date_published ? new Date(it.date_published) : new Date(),
                };
            });
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

        // Format clean notice content with ALL slide images embedded
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
            // Update if image was missing or updated
            await prisma.notice.update({
                where: { id: existingNotice.id },
                data: { content: formattedContent },
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
