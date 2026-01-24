// @ts-nocheck
import { streamText, createUIMessageStreamResponse, tool } from "ai";
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
                    description: "Get the school meal menu.",
                    parameters: z.object({ 
                        date: z.string().describe("Optional: Date in YYYY-MM-DD format").optional() 
                    }),
                    execute: async ({ date }) => aiTools.get_meals({ date }),
                }),
                get_upcoming_birthdays: tool({
                    description: "Get upcoming student birthdays.",
                    parameters: z.object({ 
                        limit: z.number().describe("Number of birthdays to show").optional() 
                    }),
                    execute: async ({ limit }) => aiTools.get_upcoming_birthdays({ limit }),
                }),
                get_schedule: tool({
                    description: "Get school schedule.",
                    parameters: z.object({ 
                        Grade: z.string().describe("The grade level (e.g., 'Grade 11')") 
                    }),
                    execute: async ({ Grade }) => aiTools.get_schedule({ Grade }),
                }),
                get_upcoming_events: tool({
                    description: "Get upcoming school events.",
                    parameters: z.object({
                        includeDescription: z.boolean().describe("Whether to include event descriptions").optional()
                    }),
                    execute: async () => aiTools.get_upcoming_events(),
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
