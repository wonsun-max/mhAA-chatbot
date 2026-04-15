import { streamText, type ModelMessage, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CHATBOT_SYSTEM_PROMPT } from "@/lib/openai";
import { aiTools } from "@/lib/ai/tools";
import { getDailyContent } from "@/lib/daily-content";
import { getMealOrder } from "@/lib/meal-utils";
import { lunchPrayerSchedule } from "@/lib/lunch-prayer";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

interface RawClientMessage {
    id?: string;
    role: 'system' | 'user' | 'assistant';
    content?: string;
    parts?: Array<{ type: string; text?: string }>;
}

interface SessionUserContext {
    id: string;
    name?: string | null;
    grade?: string | null;
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
        const sessionUser = session.user as SessionUserContext;

        const displayName = sessionUser.name || "Member";
        const userGradeText = sessionUser.grade || "Unknown";

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

        const { firstGroup, secondGroup } = getMealOrder(new Date()) || { firstGroup: "None", secondGroup: "None" };
        const mealOrderText = firstGroup === "None" 
            ? "No meal order today (Weekend/Holiday)" 
            : `First to eat (먼저 먹는 학년): ${firstGroup}, Second to eat (나중에/늦게 먹는 학년): ${secondGroup}`;

        const lunchPrayerContext = `
[점심기도 안내 및 당번표 (Lunchtime Prayer)]
- 장소: 학교 2층 도서관 방향 기도실
- 월/수/금: 12:20~12:45 자유 기도회 (지정 당번 없음, 누구나 참여 가능)
- 화/목: 12:25~12:45 지정 당번 필수 참여 (해당 날짜 큐티조 및 신앙부 2명). 단, 콘서트 콰이어(합창단) 참여 학생은 예외.
- 학기 일정:
${lunchPrayerSchedule.map(s => {
    if (s.type === 'prayer_meeting') return `  * ${s.date}: 운영 (당번: ${s.qtGroup}조, 신앙부: ${s.faithMembers?.join(', ')})`;
    return `  * ${s.date}: ${s.label} (운영 안함)`;
}).join('\n')}
`;

        const operationalScheduleInstructions = `
[Additional Schedule Access Rules]
- The "Today's Meal Order" line above is authoritative for questions about 먼저 먹는 학년, 나중에 먹는 학년, lunch turn, or meal order.
- The [점심기도 안내 및 당번표] block below is authoritative for questions about lunch prayer, duty rotation, no-meeting dates, or exam-related prayer pauses.
- For specific exam timing questions, always call getExamSchedules before getEvents. Use school calendar events only for broad exam windows or general calendar summaries.
- Grade-specific exam requests must match direct grades, homeroom labels (e.g., 12-1, 12-2), and multi-grade/range labels that include the requested grade.
- When presenting exam schedules, use a Markdown table with columns: Date | Day | Period | Time | Subject | Grades.
`;

        const systemPrompt = CHATBOT_SYSTEM_PROMPT
            .replace("{{currentTime}}", currentTime)
            .replace("{{displayName}}", displayName)
            .replace("{{userGrade}}", userGradeText)
            .replace("{{mealOrder}}", mealOrderText)
            + "\n\n" + operationalScheduleInstructions
            + "\n\n" + dailyContext
            + "\n\n" + lunchPrayerContext;

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

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("[ChatAPI] Processing Error:", error);
        return new Response(
            JSON.stringify({ error: "System Error: The AI core encountered an unexpected disruption.", details: errorMessage }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}
