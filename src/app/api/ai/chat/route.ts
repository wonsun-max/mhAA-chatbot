import { streamText, type ModelMessage, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CHATBOT_SYSTEM_PROMPT } from "@/lib/openai";
import { aiTools } from "@/lib/ai/tools";
import { getDailyContent } from "@/lib/daily-content";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

interface RawClientMessage {
    id?: string;
    role: 'system' | 'user' | 'assistant';
    content?: string;
    parts?: Array<{ type: string; text?: string }>;
}

function convertToModelMessages(rawMessages: RawClientMessage[]): ModelMessage[] {
    return rawMessages.map((msg): ModelMessage => {
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

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new Response(
                JSON.stringify({ error: "Unauthorized: Access requires a valid WITHUS session." }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const body = await req.json();
        const { messages: rawMessages, text } = body;

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

        const messages: ModelMessage[] = convertToModelMessages(clientMessages);

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                name: true,
                grade: true,
            }
        });

        if (!user) {
            return new Response(
                JSON.stringify({ error: "Forbidden: User record synchronization failure." }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const displayName = user.name || "Member";
        const userGradeText = user.grade || "Unknown";

        const currentTime = new Intl.DateTimeFormat("ko-KR", {
            timeZone: "Asia/Manila",
            dateStyle: "full",
            timeStyle: "short"
        }).format(new Date());

        const { verse, word } = getDailyContent();
        const dailyContext = `
Today's Scripture: "${verse.verse}" (${verse.ref})
Today's English Word: ${word.word} (${word.meaning}) - Example: ${word.example}
`;

        const systemPrompt = CHATBOT_SYSTEM_PROMPT
            .replace("{{currentTime}}", currentTime)
            .replace("{{displayName}}", displayName)
            .replace("{{userGrade}}", userGradeText)
            + "\n\n" + dailyContext;

        const latestUserMessage = messages
            .filter(m => m.role === 'user')
            .pop();
        const userQuery = typeof latestUserMessage?.content === 'string'
            ? latestUserMessage.content
            : '';
        const userId = session.user.id;

        const result = streamText({
            model: openai("gpt-4o-mini"),
            system: systemPrompt,
            messages,
            tools: aiTools,
            stopWhen: stepCountIs(5),
            onFinish: async ({ text }) => {
                try {
                    await prisma.chatLog.create({
                        data: {
                            userId,
                            query: userQuery,
                            response: text || '',
                        },
                    });
                } catch (logError) {
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
