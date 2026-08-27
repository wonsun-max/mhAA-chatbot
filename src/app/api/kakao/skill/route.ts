import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";

export const dynamic = "force-dynamic";

/**
 * Kakao i OpenBuilder Skill v2.0 Request Payload
 */
interface KakaoSkillPayload {
  intent?: {
    id: string;
    name: string;
  };
  userRequest?: {
    timezone?: string;
    params?: Record<string, string>;
    block?: {
      id: string;
      name: string;
    };
    utterance?: string;
    lang?: string | null;
    user?: {
      id: string;
      type: string;
    };
  };
}

/**
 * Kakao i OpenBuilder Skill v2.0 Button
 */
interface KakaoButton {
  action: "webLink" | "message" | "phone" | "block";
  label: string;
  webLinkUrl?: string;
  messageText?: string;
}

/**
 * Kakao i OpenBuilder Skill v2.0 BasicCard
 */
interface KakaoBasicCard {
  title?: string;
  description: string;
  thumbnail?: {
    imageUrl: string;
    link?: { web: string };
  };
  buttons?: KakaoButton[];
}

/**
 * Kakao i OpenBuilder Skill v2.0 QuickReply
 */
interface KakaoQuickReply {
  label: string;
  action: "message" | "block";
  messageText: string;
}

const DEFAULT_QUICK_REPLIES: KakaoQuickReply[] = [
  { label: "🍱 오늘 급식", action: "message", messageText: "오늘 급식" },
  { label: "🍱 내일 급식", action: "message", messageText: "내일 급식" },
  { label: "⛪ 수요채플", action: "message", messageText: "수요채플" },
  { label: "📅 학사일정", action: "message", messageText: "학사일정" },
  { label: "📝 시험 시간표", action: "message", messageText: "시험 시간표" },
  { label: "⏰ 시간표", action: "message", messageText: "시간표" },
];

/**
 * Formats a Date into YYYY-MM-DD string with optional day offset.
 */
function getDateString(offsetDays = 0): { dateStr: string; month: number; day: number; dayOfWeek: string } {
  const d = new Date();
  if (offsetDays !== 0) {
    d.setDate(d.getDate() + offsetDays);
  }
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeek = dayNames[d.getDay()];

  const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return { dateStr, month, day, dayOfWeek };
}

/**
 * Calculates human-readable D-Day.
 */
function getDDay(targetDateStr: string, baseDateStr: string): string {
  const target = new Date(targetDateStr);
  target.setHours(0, 0, 0, 0);
  const base = new Date(baseDateStr);
  base.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - base.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "D-Day";
  if (diffDays < 0) return `D+${Math.abs(diffDays)}`;
  return `D-${diffDays}`;
}

/**
 * Constructs a compliant Kakao i OpenBuilder Skill v2.0 response.
 */
function buildKakaoResponse(outputs: any[], quickReplies = DEFAULT_QUICK_REPLIES) {
  return NextResponse.json({
    version: "2.0",
    template: {
      outputs,
      quickReplies,
    },
  });
}

/**
 * Handles incoming Kakao i OpenBuilder Skill Webhook requests.
 *
 * Provides real-time school information (Meals, Chapel, Calendar, Timetable, Exams)
 * directly from PostgreSQL via Prisma, with automated fallback to WITHUS AI knowledge.
 */
export async function POST(req: Request) {
  try {
    const body: KakaoSkillPayload = await req.json().catch(() => ({}));
    const rawUtterance = body.userRequest?.utterance?.trim() || "";
    const utterance = rawUtterance.toLowerCase();

    const { dateStr: todayStr, month: todayMonth, day: todayDay, dayOfWeek: todayDayOfWeek } = getDateString(0);

    // 1. Initial Test / Welcome / Help Intent
    if (!rawUtterance || rawUtterance === "발화 내용" || utterance === "도움말" || utterance === "안녕" || utterance === "시작") {
      return buildKakaoResponse([
        {
          basicCard: {
            title: "마닐라한국아카데미 WITHUS 챗봇",
            description: "샬롬! 마한아 학교생활 도우미 챗봇입니다.\n\n급식, 수요채플, 학사일정, 시간표, 시험 정보 등을 카카오톡에서 실시간으로 확인해보세요!",
            thumbnail: {
              imageUrl: "https://mhawithus.shop/images/hero-premium.png",
            },
            buttons: [
              {
                action: "webLink",
                label: "WITHUS 포털 바로가기",
                webLinkUrl: "https://mhawithus.shop",
              },
            ],
          },
        },
      ]);
    }

    // 2. School Meals (급식 / 식단)
    if (utterance.includes("급식") || utterance.includes("식단") || utterance.includes("점심") || utterance.includes("밥") || utterance.includes("메뉴")) {
      const isTomorrow = utterance.includes("내일") || utterance.includes("다음날");
      const target = isTomorrow ? getDateString(1) : { dateStr: todayStr, month: todayMonth, day: todayDay, dayOfWeek: todayDayOfWeek };

      const meal = await prisma.schoolMeal.findFirst({
        where: { date: target.dateStr },
      });

      if (!meal || !meal.menu) {
        return buildKakaoResponse([
          {
            basicCard: {
              title: `🍱 [${target.month}월 ${target.day}일 (${target.dayOfWeek})] 급식 안내`,
              description: `해당 날짜의 등록된 급식 메뉴가 없습니다.\n주말/방학이거나 아직 식단표가 업데이트되지 않았을 수 있습니다.`,
              buttons: [
                {
                  action: "webLink",
                  label: "웹에서 전체 식단표 보기",
                  webLinkUrl: "https://mhawithus.shop/collab/meals",
                },
              ],
            },
          },
        ]);
      }

      // Format menu text nicely
      const menuLines = meal.menu.split("\n").map(l => l.trim()).filter(Boolean).join(", ");

      return buildKakaoResponse([
        {
          basicCard: {
            title: `🍱 [${target.month}월 ${target.day}일 (${target.dayOfWeek})] ${isTomorrow ? "내일" : "오늘"}의 급식`,
            description: `메뉴: ${menuLines}`,
            buttons: [
              {
                action: "webLink",
                label: "이번 달 전체 식단 보기",
                webLinkUrl: "https://mhawithus.shop/collab/meals",
              },
            ],
          },
        },
      ]);
    }

    // 3. Wednesday Chapel Schedules (수요채플 / 예배)
    if (utterance.includes("채플") || utterance.includes("예배") || utterance.includes("선교예배") || utterance.includes("설교")) {
      const upcomingChapels = await prisma.chapelSchedule.findMany({
        where: { date: { gte: todayStr } },
        orderBy: { date: "asc" },
        take: 3,
      });

      if (upcomingChapels.length === 0) {
        return buildKakaoResponse([
          {
            simpleText: {
              text: "이번 학기에 예정된 남은 채플 일정이 모두 완료되었습니다.",
            },
          },
        ]);
      }

      const items: KakaoBasicCard[] = upcomingChapels.map((c) => ({
        title: `⛪ [${c.month}월 ${c.day}일 (${c.dayOfWeek || "수"})] ${c.organizer} 주관`,
        description: `설교자: ${c.speaker}\n구분: ${c.type === "MISSION" ? "선교예배" : c.type === "GRADE" ? "학년주관" : "특별예배"}${c.note ? `\n비고: ${c.note}` : ""}\nD-Day: ${getDDay(c.date, todayStr)}`,
        buttons: [
          {
            action: "webLink",
            label: "채플 캘린더 보기",
            webLinkUrl: "https://mhawithus.shop/collab/chapel",
          },
        ],
      }));

      return buildKakaoResponse([
        {
          carousel: {
            type: "basicCard",
            items,
          },
        },
      ]);
    }

    // 4. Academic Calendar (학사일정 / 일정 / 방학 / 휴일)
    if (utterance.includes("학사일정") || utterance.includes("일정") || utterance.includes("방학") || utterance.includes("개학") || utterance.includes("행사") || utterance.includes("휴일")) {
      const events = await prisma.schoolCalendar.findMany({
        where: { endDate: { gte: todayStr } },
        orderBy: { startDate: "asc" },
        take: 3,
      });

      if (events.length === 0) {
        return buildKakaoResponse([
          {
            simpleText: {
              text: "등록된 다가오는 학사 일정이 없습니다.",
            },
          },
        ]);
      }

      const items: KakaoBasicCard[] = events.map((evt) => ({
        title: `📅 ${evt.name}`,
        description: `기간: ${evt.startDate} ~ ${evt.endDate}\n구분: ${evt.eventType}\n카운트다운: ${getDDay(evt.startDate, todayStr)}`,
        buttons: [
          {
            action: "webLink",
            label: "학사일정 캘린더 보기",
            webLinkUrl: "https://mhawithus.shop/collab/calendar",
          },
        ],
      }));

      return buildKakaoResponse([
        {
          carousel: {
            type: "basicCard",
            items,
          },
        },
      ]);
    }

    // 5. Exam Schedules (시험 / 중간고사 / 기말고사)
    if (utterance.includes("시험") || utterance.includes("중간고사") || utterance.includes("기말고사")) {
      const examEvent = await prisma.schoolCalendar.findFirst({
        where: {
          eventType: "Exam",
          endDate: { gte: todayStr },
        },
        orderBy: { startDate: "asc" },
      });

      if (examEvent) {
        const dday = getDDay(examEvent.startDate, todayStr);
        return buildKakaoResponse([
          {
            basicCard: {
              title: `📝 [시험 일정] ${examEvent.name}`,
              description: `기간: ${examEvent.startDate} ~ ${examEvent.endDate}\n카운트다운: ${dday}\n\n과목별 세부 시험 시간표를 웹에서 확인하세요.`,
              buttons: [
                {
                  action: "webLink",
                  label: "과목별 시험 시간표",
                  webLinkUrl: "https://mhawithus.shop/collab/exams",
                },
              ],
            },
          },
        ]);
      }

      return buildKakaoResponse([
        {
          basicCard: {
            title: "📝 시험 시간표 안내",
            description: "현재 예정된 시험 일정이 없거나 시험 시간표가 준비 중입니다.",
            buttons: [
              {
                action: "webLink",
                label: "시험 정보 허브",
                webLinkUrl: "https://mhawithus.shop/collab/exams",
              },
            ],
          },
        },
      ]);
    }

    // 6. Timetable (시간표 / 학년별 시간표)
    if (utterance.includes("시간표") || utterance.includes("수업") || utterance.includes("교시")) {
      // Extract grade if mentioned (e.g. "11", "12", "10", "9", "8", "7")
      const gradeMatch = utterance.match(/(7|8|9|10|11|12)/);
      const grade = gradeMatch ? gradeMatch[1] : "11";

      const timetables = await prisma.timetable.findMany({
        where: {
          grade,
          dayOfWeek: todayDayOfWeek,
        },
        orderBy: { period: "asc" },
      });

      if (timetables.length > 0) {
        const lines = timetables.map(t => `${t.period}교시: ${t.subject} (${t.teacher})`).join("\n");
        return buildKakaoResponse([
          {
            basicCard: {
              title: `⏰ [${grade}학년 ${todayDayOfWeek}요일] 시간표`,
              description: lines,
              buttons: [
                {
                  action: "webLink",
                  label: "전체 시간표 확인",
                  webLinkUrl: "https://mhawithus.shop/collab/timetable",
                },
              ],
            },
          },
        ]);
      }

      return buildKakaoResponse([
        {
          basicCard: {
            title: `⏰ [${grade}학년] 시간표 안내`,
            description: `오늘(${todayDayOfWeek}요일) 등록된 수업이 없거나 주말입니다.\n웹 허브에서 전 학년 시간표를 확인하실 수 있습니다.`,
            buttons: [
              {
                action: "webLink",
                label: "전체 시간표 보기",
                webLinkUrl: "https://mhawithus.shop/collab/timetable",
              },
            ],
          },
        },
      ]);
    }

    // 7. Mission Teams & QT Groups (선교팀 / QT조)
    if (utterance.includes("선교팀") || utterance.includes("qt") || utterance.includes("큐티") || utterance.includes("조장")) {
      return buildKakaoResponse([
        {
          basicCard: {
            title: "🤝 마한아 4대 선교팀 & 8개 QT조",
            description: "글로벌팀, 동아시아팀, 필리핀 1팀, 필리핀 2팀 및 1조~8조 명단과 조장을 확인하세요.",
            buttons: [
              {
                action: "webLink",
                label: "내 소속 및 명단 조회",
                webLinkUrl: "https://mhawithus.shop/collab/teams",
              },
            ],
          },
        },
      ]);
    }

    // 8. General AI Assistant Fallback (with strict 3.5s timeout protection)
    try {
      const aiPromise = openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are WITHUS AI, friendly school assistant for Manila Hankook Academy (MHA). Reply in concise, polite Korean within 2-3 sentences. If you don't know, suggest visiting https://mhawithus.shop.",
          },
          {
            role: "user",
            content: rawUtterance,
          },
        ],
        max_tokens: 150,
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("AI Timeout")), 3500)
      );

      const response: any = await Promise.race([aiPromise, timeoutPromise]);
      const reply = response.choices?.[0]?.message?.content?.trim() || "샬롬! 학교 생활에 대해 궁금한 점을 버튼을 눌러 확인해 보세요.";

      return buildKakaoResponse([
        {
          simpleText: {
            text: reply,
          },
        },
      ]);
    } catch {
      return buildKakaoResponse([
        {
          basicCard: {
            title: "WITHUS 학사 도우미",
            description: `"${rawUtterance}"에 대한 답변을 준비 중입니다.\n아래 버튼을 눌러 빠른 조회를 이용하시거나 웹 포털을 방문해 보세요.`,
            buttons: [
              {
                action: "webLink",
                label: "WITHUS 웹사이트 방문",
                webLinkUrl: "https://mhawithus.shop",
              },
            ],
          },
        },
      ]);
    }
  } catch (error) {
    console.error("[Kakao Skill Error]", error);
    return buildKakaoResponse([
      {
        simpleText: {
          text: "일시적으로 서비스 연결이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.",
        },
      },
    ]);
  }
}
