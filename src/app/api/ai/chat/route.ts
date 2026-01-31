import { streamText } from "ai";
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
        let messages = rawMessages;
        if (!messages && text) {
            messages = [{ role: 'user', content: text }];
        }

        if (!messages || !Array.isArray(messages)) {
            return new Response(
                JSON.stringify({ error: "Bad Request: Missing or invalid message payload." }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

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

        // Map messages to core AI SDK format
        const coreMessages = messages.map((m: any) => ({
            role: m.role,
            content: typeof m.content === 'string' ? m.content : (m.parts?.[0]?.text ?? m.text ?? ""),
        }));

        const result = streamText({
            model: openai("gpt-4o"),
            system: systemPrompt,
            messages: coreMessages,
            tools: {
                get_meals: {
                    description: "Get the school meal menu for a specific date (YYYY-MM-DD).",
                    parameters: z.object({ date: z.string().optional() }),
                    execute: async ({ date }: { date?: string }) => aiTools.get_meals({ date }),
                },
                get_upcoming_birthdays: {
                    description: "Get list of students with upcoming birthdays.",
                    parameters: z.object({ limit: z.number().optional() }),
                    execute: async ({ limit }: { limit?: number }) => aiTools.get_upcoming_birthdays({ limit }),
                },
                get_schedule: {
                    description: "Retrieve class schedules.",
                    parameters: z.object({ Grade: z.string() }),
                    execute: async ({ Grade }: { Grade: string }) => aiTools.get_schedule({ Grade }),
                },
                get_upcoming_events: {
                    description: "Get upcoming school events.",
                    parameters: z.object({}),
                    execute: async () => aiTools.get_upcoming_events(),
                },
            },
            maxSteps: 5,
        } as any);



        return (result as any).toDataStreamResponse();

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

