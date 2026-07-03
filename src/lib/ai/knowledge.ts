import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { embedText, embedTexts } from "@/lib/ai/embeddings";

/**
 * RAG knowledge base over pgvector.
 *
 * Chunks live in the KnowledgeChunk table. The embedding column is an
 * Unsupported("vector") type, so all reads/writes touching it go through
 * raw SQL; Prisma-level defaults (@updatedAt) are supplied manually.
 *
 * sourceType currently only uses NOTICE; DOCUMENT is reserved for
 * school documents (handbook, admission guides) to be indexed later.
 */

export type KnowledgeSourceType = "NOTICE" | "DOCUMENT";

export interface KnowledgeSearchResult {
    sourceType: string;
    sourceId: string;
    title: string;
    content: string;
    similarity: number;
}

const CHUNK_MAX_CHARS = 1200;
const SEARCH_MIN_SIMILARITY = 0.25;

/** Strips HTML tags and collapses whitespace so rich-text content embeds cleanly. */
export function toPlainText(input: string): string {
    return input
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

/** Splits text into chunks of at most CHUNK_MAX_CHARS, preferring paragraph boundaries. */
export function chunkText(text: string): string[] {
    const clean = text.trim();
    if (!clean) return [];
    if (clean.length <= CHUNK_MAX_CHARS) return [clean];

    const paragraphs = clean.split(/\n\s*\n/);
    const chunks: string[] = [];
    let current = "";

    const flush = () => {
        if (current.trim()) chunks.push(current.trim());
        current = "";
    };

    for (const paragraph of paragraphs) {
        // A single paragraph longer than the limit is hard-split.
        if (paragraph.length > CHUNK_MAX_CHARS) {
            flush();
            for (let i = 0; i < paragraph.length; i += CHUNK_MAX_CHARS) {
                chunks.push(paragraph.slice(i, i + CHUNK_MAX_CHARS).trim());
            }
            continue;
        }
        if (current.length + paragraph.length + 2 > CHUNK_MAX_CHARS) flush();
        current = current ? `${current}\n\n${paragraph}` : paragraph;
    }
    flush();

    return chunks.filter(Boolean);
}

function toVectorLiteral(embedding: number[]): string {
    return `[${embedding.join(",")}]`;
}

export async function removeFromIndex(sourceType: KnowledgeSourceType, sourceId: string): Promise<void> {
    await prisma.knowledgeChunk.deleteMany({ where: { sourceType, sourceId } });
}

/**
 * (Re)indexes a single source: replaces all of its chunks with fresh
 * embeddings. Callers should treat failures as non-fatal (log and move on)
 * so indexing never breaks the underlying CRUD operation.
 */
export async function indexSource(
    sourceType: KnowledgeSourceType,
    sourceId: string,
    title: string,
    rawContent: string,
): Promise<number> {
    const body = toPlainText(rawContent);
    const chunks = chunkText(body ? `${title}\n\n${body}` : title);

    await removeFromIndex(sourceType, sourceId);
    if (chunks.length === 0) return 0;

    const embeddings = await embedTexts(chunks);

    await prisma.$transaction(
        chunks.map((content, i) => prisma.$executeRaw`
            INSERT INTO "KnowledgeChunk"
                ("id", "sourceType", "sourceId", "chunkIndex", "title", "content", "embedding", "updatedAt")
            VALUES
                (${randomUUID()}, ${sourceType}, ${sourceId}, ${i}, ${title}, ${content},
                 ${toVectorLiteral(embeddings[i])}::vector, NOW())
        `),
    );

    return chunks.length;
}

/** Semantic search over the knowledge base using cosine similarity. */
export async function searchKnowledge(query: string, limit = 5): Promise<KnowledgeSearchResult[]> {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const queryVector = toVectorLiteral(await embedText(trimmed));

    const rows = await prisma.$queryRaw<Array<KnowledgeSearchResult & { similarity: number }>>(
        Prisma.sql`
            SELECT
                "sourceType",
                "sourceId",
                "title",
                "content",
                1 - ("embedding" <=> ${queryVector}::vector) AS similarity
            FROM "KnowledgeChunk"
            WHERE "embedding" IS NOT NULL
            ORDER BY "embedding" <=> ${queryVector}::vector
            LIMIT ${limit}
        `,
    );

    return rows
        .filter((row) => row.similarity >= SEARCH_MIN_SIMILARITY)
        .map((row) => ({ ...row, similarity: Number(row.similarity.toFixed(4)) }));
}
