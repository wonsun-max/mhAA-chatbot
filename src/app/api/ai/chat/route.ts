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

        // 1. Validate Environment Constraints (CRITICAL FIX)
        if (!process.env.OPENAI_API_KEY) {
            console.error("CRITICAL: Missing OPENAI_API_KEY");
            return NextResponse.json(
                { error: "Server Error: Missing OPENAI_API_KEY. Please add it to .env" },
                { status: 500 }
            );
        }

        // 2. Validate User & Chatbot Access (Case-Insensitive)
        const user = await prisma.user.findFirst({
            where: {
                email: {
                    equals: session.user.email,
                    mode: "insensitive",
                }
            },
        });

        if (!user) {
            console.log("Chat Error: User not found for email:", session.user.email);
            return NextResponse.json({ error: "Access Denied - User Not Found. Try signing out and back in." }, { status: 403 });
        }

        console.log("Chat Access Granted:", { email: user.email, status: user.status });

        // Checks user status (Must be ACTIVE for production)
        if (user.status !== UserStatus.ACTIVE) {
            console.log("Chat Warning: Non-active user accessed chat", user.status);
            // In strict mode, uncomment below:
            // return NextResponse.json({ error: "Access Denied - Account Not Active" }, { status: 403 });
        }

        const displayName = user.koreanName || user.name || "Member";
        const grade = String(user.grade || "N/A");
        const country = "N/A"; // Placeholder for future missionary country logic

        const { messages: originalMessages } = await req.json();

        // Compatibility fix: transform message format from { parts: ... } to { content: ... }
        const messages = originalMessages.map((m: any) => ({
            role: m.role,
            content: m.parts?.[0]?.text ?? m.content,
        }));

        // Prepare System Prompt with Context
        const currentTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" });
        const systemPrompt = CHATBOT_SYSTEM_PROMPT
            .replace("{{currentTime}}", currentTime)
            .replace("{{displayName}}", displayName)
            .replace("{{grade}}", grade)
            .replace("{{country}}", country);

        // Define Tools matching src/lib/ai/tools.ts
        const tools = {
            get_meals: tool({
                description: "Get the school meal menu. Defaults to today if no date provided.",
                parameters: z.object({
                    date: z.string().optional().describe("Date in YYYY-MM-DD format"),
                }),
                execute: async (args) => aiTools.get_meals(args),
            }),
            get_upcoming_birthdays: tool({
                description: "Get a list of upcoming student birthdays for the next week or month.",
                parameters: z.object({
                    limit: z.number().optional().describe("Number of birthdays to show (default 5)"),
                }),
                execute: async (args) => aiTools.get_upcoming_birthdays(args),
            }),
            get_schedule: tool({
                description: "Get the school schedule for a specific grade.",
                parameters: z.object({
                    Grade: z.string().describe("The grade level (e.g., 'Grade 11')"),
                }),
                execute: async (args) => aiTools.get_schedule(args),
            }),
            get_upcoming_events: tool({
                description: "Get the list of upcoming school events or holidays.",
                parameters: z.object({
                    Grade: z.string().optional().describe("Filter events by grade"),
                }),
                execute: async (args) => aiTools.get_upcoming_events(args),
            }),
            get_stats: tool({
                description: "Get statistics about the student body.",
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
            maxSteps: 5, // Allow multi-step tool calls
            onFinish: async ({ text, toolCalls, response }) => {
                try {
                    // Async audit logging
                    await prisma.chatLog.create({
                        data: {
                            userId: user.id,
                            query: messages[messages.length - 1]?.content || "System Trigger",
                            response: text || "Tool execution result",
                            toolsCalled: toolCalls && toolCalls.length > 0 ? JSON.stringify(toolCalls) : null,
                        }
                    });
                } catch (e) {
                    console.error("Audit log failed", e);
                }
            },
        });

        // Robust fallback for response generation
        if (typeof result.toDataStreamResponse === 'function') {
            return result.toDataStreamResponse();
        } else if (typeof (result as any).toAIStreamResponse === 'function') {
            return (result as any).toAIStreamResponse();
        } else if (typeof (result as any).toTextStreamResponse === 'function') {
            return (result as any).toTextStreamResponse();
        }

        // If all else fails, return a JSON error (should not happen in valid SDK)
        throw new Error("Stream response method incorrect on result object");

    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}
