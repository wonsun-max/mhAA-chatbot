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
export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        console.log("Chat Request Body:", JSON.stringify(body).slice(0, 200));

        // Handle both { messages } and { text } (for some versions of sendMessage)
        let originalMessages = body.messages;
        if (!originalMessages && body.text) {
            originalMessages = [{ role: 'user', content: body.text }];
        }

        if (!originalMessages || !Array.isArray(originalMessages)) {
            console.error("Invalid messages format", body);
            return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: {
                email: {
                    equals: session.user.email,
                    mode: "insensitive",
                }
            },
        });

        if (!user) {
            return NextResponse.json({ error: "Access Denied" }, { status: 403 });
        }

        const displayName = user.koreanName || user.name || "Member";
        const grade = String(user.grade || "N/A");
        const country = "N/A";

        const messages = originalMessages.map((m: any) => ({
            role: m.role,
            content: typeof m.content === 'string' ? m.content : (m.parts?.[0]?.text ?? ""),
        }));

        const currentTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" });
        const systemPrompt = CHATBOT_SYSTEM_PROMPT
            .replace("{{currentTime}}", currentTime)
            .replace("{{displayName}}", displayName)
            .replace("{{grade}}", grade)
            .replace("{{country}}", country);

        const tools = {
            get_meals: tool({
                description: "Get the school meal menu.",
                parameters: z.object({
                    date: z.string().describe("YYYY-MM-DD").optional(),
                }),
                execute: async ({ date }) => aiTools.get_meals({ date }),
            }),
            get_upcoming_birthdays: tool({
                description: "Get upcoming student birthdays.",
                parameters: z.object({
                    limit: z.number().optional(),
                }),
                execute: async ({ limit }) => aiTools.get_upcoming_birthdays({ limit }),
            }),
            get_schedule: tool({
                description: "Get school schedule.",
                parameters: z.object({
                    Grade: z.string(),
                }),
                execute: async ({ Grade }) => aiTools.get_schedule({ Grade }),
            }),
            get_upcoming_events: tool({
                description: "Get upcoming school events.",
                parameters: z.object({}),
                execute: async () => aiTools.get_upcoming_events(),
            }),
            get_stats: tool({
                description: "Get student statistics.",
                parameters: z.object({
                    grade: z.string().optional(),
                    country: z.string().optional(),
                }),
                execute: async (args) => aiTools.get_stats(args),
            }),
        };

        const result = await streamText({
            model: openai("gpt-4o"),
            system: systemPrompt,
            messages,
            tools,
            maxSteps: 5,
        });

        return result.toDataStreamResponse();

    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}
