import { streamText, tool, type ModelMessage, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { aiTools } from "@/lib/ai/tools";
import { CHATBOT_SYSTEM_PROMPT } from "@/lib/openai";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * Represents a raw message from the client.
 * The client may send either UIMessage (with parts) or a simple format (with content).
 */
interface RawClientMessage {
    id?: string;
    role: 'system' | 'user' | 'assistant';
    content?: string;
    parts?: Array<{ type: string; text?: string }>;
}

/**
 * Converts raw client messages to ModelMessage format for streamText.
 * Handles both UIMessage (with parts) and simple message formats.
 */
function convertToModelMessages(rawMessages: RawClientMessage[]): ModelMessage[] {
    return rawMessages.map((msg): ModelMessage => {
        // Extract content from parts if present, otherwise use content directly
        let content: string;
        if (msg.parts && Array.isArray(msg.parts)) {
            content = msg.parts
                .filter((p) => p.type === 'text' && p.text)
                .map((p) => p.text!)
                .join('');
        } else {
            content = msg.content || '';
        }

        return {
            role: msg.role,
            content,
        } as ModelMessage;
    });
}

/**
 * POST handler for the MissionLink AI Assistant chat endpoint.
 * This endpoint processes user messages, retrieves user context from Prisma,
 * and generates a streaming response using the Vercel AI SDK.
 * 
 * @param {Request} req - The incoming HTTP request containing the chat messages.
 * @returns {Promise<Response>} A streaming data response from the AI SDK.
 */
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new Response(
                JSON.stringify({ error: "Unauthorized: Access requires a valid mission session." }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const body = await req.json();
        const { messages: rawMessages, text } = body;

        // Normalize messages for different input formats
        let clientMessages: RawClientMessage[] = rawMessages;
        if (!clientMessages && text) {
            clientMessages = [{ role: 'user', content: text }];
        }

        if (!clientMessages || !Array.isArray(clientMessages)) {
            return new Response(
                JSON.stringify({ error: "Bad Request: Missing or invalid message payload." }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Convert to ModelMessage format for streamText
        const messages: ModelMessage[] = convertToModelMessages(clientMessages);

        // Retrieve full user profile for rich prompt context
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                koreanName: true,
                name: true,
                grade: true,
                role: true,
            }
        });

        if (!user) {
            return new Response(
                JSON.stringify({ error: "Forbidden: User record synchronization failure." }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const displayName = user.koreanName || user.name || "Member";
        const gradeLabel = user.grade ? String(user.grade) : "N/A";

        // Precise localized time for schedule/meal queries
        const currentTime = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

        const systemPrompt = CHATBOT_SYSTEM_PROMPT
            .replace("{{currentTime}}", currentTime)
            .replace("{{displayName}}", displayName)
            .replace("{{grade}}", gradeLabel)
            .replace("{{country}}", "Global Mission Field");

        // Extract the latest user query for logging
        const latestUserMessage = messages
            .filter(m => m.role === 'user')
            .pop();
        const userQuery = typeof latestUserMessage?.content === 'string'
            ? latestUserMessage.content
            : '';
        const userId = session.user.id;

        const result = streamText({
            model: openai("gpt-4o"),
            system: systemPrompt,
            messages,
            tools: {
                get_meals: tool({
                    description: "Get the school meal menu for a specific date (YYYY-MM-DD).",
                    inputSchema: z.object({ date: z.string().optional() }),
                    execute: async ({ date }: { date?: string }) => aiTools.get_meals({ date }),
                }),
                get_upcoming_birthdays: tool({
                    description: "Get list of students with upcoming birthdays.",
                    inputSchema: z.object({ limit: z.number().optional() }),
                    execute: async ({ limit }: { limit?: number }) => aiTools.get_upcoming_birthdays({ limit }),
                }),
                get_schedule: tool({
                    description: "Retrieve class schedules.",
                    inputSchema: z.object({ Grade: z.string() }),
                    execute: async ({ Grade }: { Grade: string }) => aiTools.get_schedule({ Grade }),
                }),
                get_upcoming_events: tool({
                    description: "Get upcoming school events.",
                    inputSchema: z.object({}),
                    execute: async () => aiTools.get_upcoming_events(),
                }),
            },
            stopWhen: stepCountIs(5),
            /**
             * onFinish callback - Persists chat log to Neon database.
             * Runs after streaming completes, captures full response and tools used.
             */
            onFinish: async ({ text, steps }) => {
                try {
                    // Extract tools called from all steps
                    const toolsCalled = steps
                        .flatMap(step => step.toolCalls || [])
                        .map(tc => tc.toolName);

                    await prisma.chatLog.create({
                        data: {
                            userId,
                            query: userQuery,
                            response: text || '',
                            toolsCalled: toolsCalled.length > 0 ? JSON.stringify(toolsCalled) : null,
                            status: 'success',
                        },
                    });
                    console.log(`[ChatLog] Saved for user ${userId}`);
                } catch (logError) {
                    // Non-blocking: log error but don't fail the request
                    console.error('[ChatLog] Failed to save:', logError);
                }
            },
        });

        return result.toUIMessageStreamResponse();

    } catch (error: any) {
        console.error("[ChatAPI] Processing Error:", error);
        return new Response(
            JSON.stringify({ error: "System Error: The AI core encountered an unexpected disruption.", details: error.message }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

