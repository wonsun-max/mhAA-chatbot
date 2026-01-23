// @ts-nocheck
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { CHATBOT_SYSTEM_PROMPT } from "@/lib/openai";
import { aiTools } from "@/lib/ai/tools";
import { UserStatus } from "@prisma/client";
import { streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const maxDuration = 30; // Recommended for tool calls

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 1. Validate User & Chatbot Access
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user || user.status !== UserStatus.ACTIVE || !user.aiEnabled) {
            return NextResponse.json({ error: "Access Denied" }, { status: 403 });
        }

        // 2. Identity Masking & Context Enrichment
        const displayName = user.koreanName || user.name || "Member";
        const grade = String(user.grade || "N/A");
        const country = "N/A";

        const { messages } = await req.json();

        // 3. Prepare Time-Aware System Prompt
        const currentTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" });
        const systemPrompt = CHATBOT_SYSTEM_PROMPT
            .replace("{{currentTime}}", currentTime)
            .replace("{{displayName}}", displayName)
            .replace("{{grade}}", grade)
            .replace("{{country}}", country);

        // 4. AI Stream with Tool Support
        const tools: any = {
            get_meals: tool({
                description: "Get the school meal menu. Defaults to today if no date provided.",
                parameters: z.object({
                    date: z.string().optional().describe("Date in YYYY-MM-DD format")
                }),
                execute: async (args: any) => aiTools.get_meals(args),
            }),
            get_upcoming_birthdays: tool({
                description: "Get a list of upcoming student birthdays for the next week or month.",
                parameters: z.object({
                    limit: z.number().optional().describe("Number of birthdays to show (default 5)")
                }),
                execute: async (args: any) => aiTools.get_upcoming_birthdays(args),
            }),
            get_schedule: tool({
                description: "Get the school schedule for a specific grade.",
                parameters: z.object({
                    Grade: z.string().describe("The grade level (e.g., 'Grade 11')")
                }),
                execute: async (args: any) => aiTools.get_schedule(args),
            }),
            get_upcoming_events: tool({
                description: "Get the list of upcoming school events or holidays (학교 일정).",
                parameters: z.object({
                    Grade: z.string().optional().describe("Filter events by grade")
                }),
                execute: async (args: any) => aiTools.get_upcoming_events(args),
            }),
            get_stats: tool({
                description: "Get statistics about the student body.",
                parameters: z.object({
                    grade: z.string().optional(),
                    country: z.string().optional(),
                }),
                execute: async (args: any) => aiTools.get_stats(args),
            }),
        };

        const result = await streamText({
            model: openai("gpt-4o"),
            messages,
            system: systemPrompt,
            tools,
            onFinish: async ({ text, toolCalls }) => {
                // Async background audit logging
                prisma.chatLog.create({
                    data: {
                        userId: user.id,
                        query: messages[messages.length - 1]?.content || "",
                        response: text || "System generated tool call response.",
                        toolsCalled: toolCalls && toolCalls.length > 0 ? JSON.stringify(toolCalls) : null,
                    }
                }).catch(err => console.error("Audit log error:", err));
            }
        });

        return result.toDataStreamResponse();

    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
