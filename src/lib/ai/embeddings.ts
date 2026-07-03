import { embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai";

/**
 * Embedding model shared by indexing and retrieval.
 * Dimensions (1536) must match the vector(1536) column on KnowledgeChunk.
 */
const embeddingModel = openai.embedding("text-embedding-3-small");

export async function embedText(text: string): Promise<number[]> {
    const { embedding } = await embed({
        model: embeddingModel,
        value: text,
    });
    return embedding;
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) return [];
    const { embeddings } = await embedMany({
        model: embeddingModel,
        values: texts,
    });
    return embeddings;
}
