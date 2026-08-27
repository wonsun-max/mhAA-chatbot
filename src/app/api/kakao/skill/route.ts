import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";
import { getStudentMembershipFromDb } from "@/lib/faith-data";
import { getLunchPrayerByDate } from "@/lib/lunch-prayer";

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
  { label: "⏰ 시간표", action: "message", messageText: "시간표" },
  { label: "⛪ 수요채플", action: "message", messageText: "수요채플" },
  { label: "📅 학사일정", action: "message", messageText: "학사일정" },
  { label: "📝 시험시간표", action: "message", messageText: "시험 시간표" },
  { label: "🤝 QT/선교팀", action: "message", messageText: "QT조 선교팀" },
  { label: "🙏 점심기도실", action: "message", messageText: "점심 기도실" },
  { label: "🎬 VOD 미디어", action: "message", messageText: "VOD" },
  { label: "📊 GPA 계산기", action: "message", messageText: "GPA 계산기" },
  { label: "💡 건의함", action: "message", messageText: "건의함" },
];

/**
 * Formats Date into YYYY-MM-DD string with day offset.
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
 * Covers 100% of WITHUS Collab Services:
 * 1. Schedule & Campus: Timetable (All Grades 7-12), Calendar, Meals
 * 2. Academics: Exams, GPA Calculator
 * 3. Faith & Media: Chapel, Mission Teams & QT Groups, Lunch Prayer, VOD
 * 4. Campus Community: Idea Portal (Feedback), Student Roster Lookup, AI Assistant
 */
export async function POST(req: Request) {
  try {
    const body: KakaoSkillPayload = await req.json().catch(() => ({}));
    const rawUtterance = body.userRequest?.utterance?.trim() || "";
    const utterance = rawUtterance.toLowerCase();

    const { dateStr: todayStr, month: todayMonth, day: todayDay, dayOfWeek: todayDayOfWeek } = getDateString(0);

    // ==========================================
    // 0. Welcome / Help / Collab Hub Overview Menu
    // ==========================================
    if (
      !rawUtterance ||
      rawUtterance === "발화 내용" ||
      utterance === "도움말" ||
      utterance === "안녕" ||
      utterance === "시작" ||
      utterance === "메뉴" ||
      utterance === "전체메뉴" ||
      utterance === "콜라보"
    ) {
      return buildKakaoResponse([
        {
          carousel: {
            type: "basicCard",
            items: [
              {
                title: "📅 01 / 일정 & 학교 생활",
                description: "• 시간표: 7~12학년 요일별 수업 시간표\n• 오늘의 급식: 실시간 점심 메뉴\n• 학사일정: 월별 주요 일정 및 D-Day",
                thumbnail: {
                  imageUrl: "https://mhawithus.shop/images/hero-premium.png",
                },
                buttons: [
                  { action: "message", label: "🍱 오늘 급식", messageText: "오늘 급식" },
                  { action: "message", label: "⏰ 시간표", messageText: "시간표" },
                  { action: "message", label: "📅 학사일정", messageText: "학사일정" },
                ],
              },
              {
                title: "✍️ 02 / 시험 & 학업 관리",
                description: "• 시험 일정표: 중간/기말고사 과목별 시간표\n• GPA 계산기: 4.5 만점 기준 내신 학점 산출\n• 학업 허브: 시험 대비 일정 총정리",
                buttons: [
                  { action: "message", label: "📝 시험 시간표", messageText: "시험 시간표" },
                  { action: "message", label: "📊 GPA 계산기", messageText: "GPA 계산기" },
                  { action: "webLink", label: "웹 허브 가기", webLinkUrl: "https://mhawithus.shop/collab" },
                ],
              },
              {
                title: "🕊️ 03 / 신앙 & 미디어 허브",
                description: "• 수요채플: 매주 채플 주관 및 설교자\n• QT조 & 선교팀: 조원 명단 및 내 소속 조회\n• 점심 기도실: 오늘의 담당 QT조\n• VOD: 마한아 유튜브 공식 채널",
                buttons: [
                  { action: "message", label: "⛪ 수요채플", messageText: "수요채플" },
                  { action: "message", label: "🤝 QT/선교팀", messageText: "선교팀" },
                  { action: "message", label: "🙏 점심 기도실", messageText: "점심 기도실" },
                ],
              },
            ],
          },
        },
      ]);
    }

    // ==========================================
    // 1. Timetable (시간표 - 7학년 ~ 12학년)
    // ==========================================
    if (utterance.includes("시간표") || utterance.includes("교시") || utterance.includes("수업")) {
      // 1-A. Target Day of Week (Check if user specified a day)
      let targetDay = todayDayOfWeek;
      if (utterance.includes("월")) targetDay = "월";
      else if (utterance.includes("화")) targetDay = "화";
      else if (utterance.includes("수")) targetDay = "수";
      else if (utterance.includes("목")) targetDay = "목";
      else if (utterance.includes("금")) targetDay = "금";

      const KOR_TO_ENG_DAY: Record<string, string> = {
        "월": "MON",
        "화": "TUE",
        "수": "WED",
        "목": "THU",
        "금": "FRI",
        "토": "MON",
        "일": "MON",
      };
      const dbDay = KOR_TO_ENG_DAY[targetDay] || "MON";

      // 1-B. Check Grade mentions (12, 11, 10, 9, 8, 7)
      const has12 = utterance.includes("12") || utterance.includes("십이");
      const has11 = utterance.includes("11") || utterance.includes("십일");
      const has10 = utterance.includes("10") || utterance.includes("십");
      const has9 = utterance.includes("9") || utterance.includes("구");
      const has8 = utterance.includes("8") || utterance.includes("팔");
      const has7 = utterance.includes("7") || utterance.includes("칠");

      // Special handling for Grade 12 (has 12-1 and 12-2)
      if (has12) {
        const is12_1 = utterance.includes("12-1") || utterance.includes("12학년 1반") || utterance.includes("1반");
        const is12_2 = utterance.includes("12-2") || utterance.includes("12학년 2반") || utterance.includes("2반");

        const targetGrades = is12_1 ? ["12-1"] : is12_2 ? ["12-2"] : ["12-1", "12-2"];
        const rows = await prisma.timetable.findMany({
          where: {
            grade: { in: targetGrades },
            dayOfWeek: dbDay,
          },
          orderBy: [{ grade: "asc" }, { period: "asc" }],
        });

        if (rows.length > 0) {
          const g1 = rows.filter(r => r.grade === "12-1");
          const g2 = rows.filter(r => r.grade === "12-2");

          const items: KakaoBasicCard[] = [];
          if (g1.length > 0) {
            items.push({
              title: `⏰ [12-1반 ${targetDay}요일] 시간표`,
              description: g1.map(r => `${r.period}교시: ${r.subject} (${r.teacher})`).join("\n"),
              buttons: [
                { action: "webLink", label: "전체 시간표 보기", webLinkUrl: "https://mhawithus.shop/collab/timetable" },
              ],
            });
          }
          if (g2.length > 0) {
            items.push({
              title: `⏰ [12-2반 ${targetDay}요일] 시간표`,
              description: g2.map(r => `${r.period}교시: ${r.subject} (${r.teacher})`).join("\n"),
              buttons: [
                { action: "webLink", label: "전체 시간표 보기", webLinkUrl: "https://mhawithus.shop/collab/timetable" },
              ],
            });
          }

          if (items.length === 1) {
            return buildKakaoResponse([{ basicCard: items[0] }]);
          } else if (items.length > 1) {
            return buildKakaoResponse([{ carousel: { type: "basicCard", items } }]);
          }
        }
      }

      // Handling for Grades 7, 8, 9, 10, 11
      const matchedGrade = has11 ? "11" : has10 ? "10" : has9 ? "9" : has8 ? "8" : has7 ? "7" : null;

      if (matchedGrade) {
        const rows = await prisma.timetable.findMany({
          where: {
            grade: matchedGrade,
            dayOfWeek: dbDay,
          },
          orderBy: { period: "asc" },
        });

        if (rows.length > 0) {
          const lines = rows.map(r => `${r.period}교시: ${r.subject} (${r.teacher})`).join("\n");
          return buildKakaoResponse([
            {
              basicCard: {
                title: `⏰ [${matchedGrade}학년 ${targetDay}요일] 시간표`,
                description: lines,
                buttons: [
                  { action: "webLink", label: "웹에서 시간표 보기", webLinkUrl: "https://mhawithus.shop/collab/timetable" },
                ],
              },
            },
          ]);
        }
      }

      // If no grade was specified, guide user with quick reply buttons for each grade
      return buildKakaoResponse(
        [
          {
            basicCard: {
              title: "⏰ 마한아 학년별 시간표 안내",
              description: `확인하고 싶은 학년을 선택해 주세요.\n현재 요일(${todayDayOfWeek}요일) 기준으로 안내해 드립니다.`,
              buttons: [
                { action: "message", label: "12학년 시간표", messageText: "12학년 시간표" },
                { action: "message", label: "11학년 시간표", messageText: "11학년 시간표" },
                { action: "webLink", label: "전체 시간표 웹에서 보기", webLinkUrl: "https://mhawithus.shop/collab/timetable" },
              ],
            },
          },
        ],
        [
          { label: "12학년 시간표", action: "message", messageText: "12학년 시간표" },
          { label: "11학년 시간표", action: "message", messageText: "11학년 시간표" },
          { label: "10학년 시간표", action: "message", messageText: "10학년 시간표" },
          { label: "9학년 시간표", action: "message", messageText: "9학년 시간표" },
          { label: "8학년 시간표", action: "message", messageText: "8학년 시간표" },
          { label: "7학년 시간표", action: "message", messageText: "7학년 시간표" },
        ]
      );
    }

    // ==========================================
    // 2. School Meals (급식 / 식단)
    // ==========================================
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
              description: `해당 날짜의 등록된 급식 메뉴가 없습니다.\n주말/휴일이거나 아직 식단표가 등록되지 않았을 수 있습니다.`,
              buttons: [
                {
                  action: "webLink",
                  label: "이번 달 전체 식단표 보기",
                  webLinkUrl: "https://mhawithus.shop/collab/meals",
                },
              ],
            },
          },
        ]);
      }

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

    // ==========================================
    // 3. Wednesday Chapel (수요채플 일정표)
    // ==========================================
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

    // ==========================================
    // 4. Academic Calendar (학사일정 / 행사 / 방학 / 휴일)
    // ==========================================
    if (utterance.includes("학사일정") || utterance.includes("일정") || utterance.includes("방학") || utterance.includes("개학") || utterance.includes("행사") || utterance.includes("휴일") || utterance.includes("공휴일")) {
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

    // ==========================================
    // 5. Exam Schedules (시험 / 중간고사 / 기말고사)
    // ==========================================
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

    // ==========================================
    // 6. Lunch Prayer (점심 기도실)
    // ==========================================
    if (utterance.includes("기도실") || utterance.includes("기도") || utterance.includes("점심기도")) {
      const prayerInfo = getLunchPrayerByDate(new Date());

      let description = "• 월·수·금: 교사·학생 누구나 자율 기도 (12:20 ~ 12:45)\n• 화·목: 지정된 QT조 및 신앙부 기도회 (12:25 ~ 12:45)\n• 장소: 도서관 방향 기도실";
      if (prayerInfo && "qtGroup" in prayerInfo && prayerInfo.qtGroup) {
        description = `오늘의 담당: [${prayerInfo.qtGroup}조]\n신앙부: ${prayerInfo.faithMembers?.join(", ") || "지정"}\n\n${description}`;
      }

      return buildKakaoResponse([
        {
          basicCard: {
            title: `🙏 마한아 점심 기도실 안내`,
            description,
            buttons: [
              {
                action: "webLink",
                label: "점심기도실 일정표 보기",
                webLinkUrl: "https://mhawithus.shop/collab/lunch-prayer",
              },
            ],
          },
        },
      ]);
    }

    // ==========================================
    // 7. Mission Teams & QT Groups (선교팀 / QT조 & 학생 이름 검색)
    // ==========================================
    if (utterance.includes("선교팀") || utterance.includes("qt") || utterance.includes("큐티") || utterance.includes("조장")) {
      return buildKakaoResponse([
        {
          basicCard: {
            title: "🤝 마한아 4대 선교팀 & 8대 QT조",
            description: "• 4대 선교팀: 글로벌팀, 동아시아팀, 필리핀 1팀, 필리핀 2팀\n• 8개 QT조: 1조 ~ 8조\n\n학생 이름을 입력하시면 소속된 선교팀과 QT조를 바로 찾아드립니다! (예: '이원선 소속')",
            buttons: [
              {
                action: "webLink",
                label: "내 소속 및 전체 명단 보기",
                webLinkUrl: "https://mhawithus.shop/collab/teams",
              },
            ],
          },
        },
      ]);
    }

    // ==========================================
    // 8. MHA VOD Media Hub (YouTube 미디어)
    // ==========================================
    if (utterance.includes("vod") || utterance.includes("유튜브") || utterance.includes("영상") || utterance.includes("미디어") || utterance.includes("방송")) {
      return buildKakaoResponse([
        {
          basicCard: {
            title: "🎬 마한아 VOD 미디어 허브",
            description: "마한아 4대 공식 및 학생 YouTube 채널의 실시간 영상들을 모아보세요.\n\n• Manila Hankuk Academy 공식 채널\n• 한아인-MHA 학생 채널\n• Actualize One & 선교사자녀학교이야기",
            buttons: [
              {
                action: "webLink",
                label: "VOD 미디어 허브 바로가기",
                webLinkUrl: "https://mhawithus.shop/collab/vod",
              },
            ],
          },
        },
      ]);
    }

    // ==========================================
    // 9. GPA Calculator (GPA 학점 계산기)
    // ==========================================
    if (utterance.includes("gpa") || utterance.includes("학점") || utterance.includes("내신") || utterance.includes("성적")) {
      return buildKakaoResponse([
        {
          basicCard: {
            title: "📊 마한아 GPA 학점 계산기",
            description: "학기별 과목 성적을 입력하고 4.5 만점 기준 내신 GPA를 실시간으로 간편하게 산출하세요.",
            buttons: [
              {
                action: "webLink",
                label: "GPA 계산기 실행하기",
                webLinkUrl: "https://mhawithus.shop/collab/gpa",
              },
            ],
          },
        },
      ]);
    }

    // ==========================================
    // 10. Idea Portal / Feedback (건의함)
    // ==========================================
    if (utterance.includes("건의") || utterance.includes("피드백") || utterance.includes("아이디어") || utterance.includes("문의")) {
      return buildKakaoResponse([
        {
          basicCard: {
            title: "💡 마한아 학생 건의함 & 아이디어 포털",
            description: "학교 생활 개선 아이디어나 건의사항이 있으신가요? 5초 만에 건의사항을 등록해 주세요!",
            buttons: [
              {
                action: "webLink",
                label: "건의함 바로가기",
                webLinkUrl: "https://mhawithus.shop/collab",
              },
            ],
          },
        },
      ]);
    }

    // ==========================================
    // 11. Student Name Community Lookup (학생 이름 검색)
    // ==========================================
    // Check if the user is typing a student name (2~4 korean characters)
    const cleanedName = rawUtterance.replace(/학생|소속|조|선교팀|어디|누구/g, "").trim();
    if (cleanedName.length >= 2 && cleanedName.length <= 4) {
      const studentInfo = await getStudentMembershipFromDb(cleanedName);
      if (studentInfo) {
        const missionText = studentInfo.missionTeam ? `${studentInfo.missionTeam.name} (${studentInfo.missionTeam.role})` : "미지정";
        const qtText = studentInfo.qtGroup ? `${studentInfo.qtGroup.name} (${studentInfo.qtGroup.role})` : "미지정";

        return buildKakaoResponse([
          {
            basicCard: {
              title: `👤 [${studentInfo.name} 학생] 소속 조회`,
              description: `• 학년: ${studentInfo.grade}학년\n• 선교팀: ${missionText}\n• QT조: ${qtText}\n${studentInfo.qtGroup?.leader ? `• 조장: ${studentInfo.qtGroup.leader}` : ""}`,
              buttons: [
                {
                  action: "webLink",
                  label: "전체 명단 확인",
                  webLinkUrl: "https://mhawithus.shop/collab/teams",
                },
              ],
            },
          },
        ]);
      }
    }

    // ==========================================
    // 12. General AI Assistant Fallback (with 3.5s Timeout Guard)
    // ==========================================
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
            description: `"${rawUtterance}"에 대한 정보를 찾고 계신가요?\n아래 버튼을 눌러 원하는 기능을 확인해 보세요.`,
            buttons: [
              {
                action: "webLink",
                label: "WITHUS 웹 포털 방문",
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
