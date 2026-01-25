// @ts-nocheck
import { streamText, createUIMessageStreamResponse, tool, jsonSchema } from "ai";
import { openai } from "@ai-sdk/openai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { aiTools } from "@/lib/ai/tools";
import { CHATBOT_SYSTEM_PROMPT } from "@/lib/openai";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return new Response("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { messages: rawMessages, text } = body;
        
        let messages = rawMessages;
        if (!messages && text) {
            messages = [{ role: 'user', content: text }];
        }

        if (!messages) {
            return new Response("Missing messages", { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: { email: session.user.email },
        });

        if (!user) return new Response("User not found", { status: 403 });

        const displayName = user.koreanName || user.name || "Member";
        const grade = String(user.grade || "N/A");
        
        const currentTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" });
        const systemPrompt = CHATBOT_SYSTEM_PROMPT
            .replace("{{currentTime}}", currentTime)
            .replace("{{displayName}}", displayName)
            .replace("{{grade}}", grade)
            .replace("{{country}}", "N/A");

        // Format messages for AI SDK
        const coreMessages = messages.map((m: any) => ({
            role: m.role,
            content: typeof m.content === 'string' ? m.content : (m.parts?.[0]?.text ?? m.text ?? ""),
        }));

        const result = await streamText({
            model: openai("gpt-4o"),
            system: systemPrompt,
            messages: coreMessages,
            tools: {
                get_meals: tool({
                    description: "Get the school meal menu for a specific date (YYYY-MM-DD).",
                    parameters: jsonSchema({
                        type: "object",
                        properties: {
                            date: { type: "string", description: "The date in YYYY-MM-DD format" }
                        },
                        required: []
                    }),
                    execute: async ({ date }: { date?: string }) => aiTools.get_meals({ date }),
                }),
                get_upcoming_birthdays: tool({
                    description: "Get upcoming student birthdays.",
                    parameters: jsonSchema({
                        type: "object",
                        properties: {
                            limit: { type: "number", description: "Number of birthdays to show" }
                        },
                        required: []
                    }),
                    execute: async ({ limit }: { limit?: number }) => aiTools.get_upcoming_birthdays({ limit }),
                }),
                get_schedule: tool({
                    description: "Get school schedule for a specific grade.",
                    parameters: jsonSchema({
                        type: "object",
                        properties: {
                            Grade: { type: "string", description: "The grade level" }
                        },
                        required: ["Grade"]
                    }),
                    execute: async ({ Grade }: { Grade: string }) => aiTools.get_schedule({ Grade }),
                }),
                get_upcoming_events: tool({
                    description: "Get upcoming school events.",
                    parameters: jsonSchema({
                        type: "object",
                        properties: {
                            includeDescription: { type: "boolean", description: "Whether to include description" }
                        },
                        required: []
                    }),
                    execute: async ({ includeDescription }: { includeDescription?: boolean }) => aiTools.get_upcoming_events(),
                }),
            },
            maxSteps: 5,
        });

        return createUIMessageStreamResponse({
            stream: result.toUIMessageStream()
        });
    } catch (error: any) {
        console.error("Chat Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
