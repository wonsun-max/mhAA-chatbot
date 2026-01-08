import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { openai, CHATBOT_SYSTEM_PROMPT } from "@/lib/openai";
import { aiTools, toolDefinitions } from "@/lib/ai/tools";
import { UserStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

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


        // Prioritize: DB Korean Name -> DB Name -> "Member"
        const displayName = user.koreanName || user.name || "Member";
        const grade = String(user.grade || "N/A");
        const country = "N/A"; // Country not in User model

        const { messages } = await req.json();

        // 3. Prepare Time-Aware System Prompt
        const currentTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" });
        const systemPrompt = CHATBOT_SYSTEM_PROMPT
            .replace("{{currentTime}}", currentTime)
            .replace("{{displayName}}", displayName)
            .replace("{{grade}}", grade)
            .replace("{{country}}", country);

        // 4. Initial AI Request
        console.log(`[AI Request] User: ${user.email}, Prompt: ${messages[messages.length - 1].content}`);

        const response = await openai.chat.completions.create({
            model: "gpt-4o", // Upgraded for better tool calling
            messages: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
            tools: toolDefinitions.map(t => ({ type: "function", function: t })),
        });

        let message = response.choices[0].message;

        // 5. Handle Tool Calls
        if (message.tool_calls) {
            const toolMessages = [
                { role: "system", content: systemPrompt },
                ...messages,
                message
            ];

            for (const toolCall of message.tool_calls) {
                if (toolCall.type !== "function") continue;

                const functionName = toolCall.function.name as keyof typeof aiTools;
                const args = JSON.parse(toolCall.function.arguments);

                const toolResult = await aiTools[functionName](args);

                toolMessages.push({
                    role: "tool",
                    tool_call_id: toolCall.id,
                    content: String(toolResult),
                } as any);
            }

            // Second AI request with tool results
            const finalResponse = await openai.chat.completions.create({
                model: "gpt-4-turbo-preview",
                messages: toolMessages as any,
            });
            message = finalResponse.choices[0].message;
        }

        // 6. Audit Logging (Async)
        prisma.chatLog.create({
            data: {
                userId: user.id,
                query: messages[messages.length - 1]?.content || "",
                response: message.content || "",
                toolsCalled: message.tool_calls ? JSON.stringify(message.tool_calls) : null,
            }
        }).catch(err => console.error("Audit log error:", err));

        return NextResponse.json({
            content: message.content,
            role: message.role
        });

    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
