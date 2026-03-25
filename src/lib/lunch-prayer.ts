// 점심기도 일정 관리 파일 (Lunchtime Prayer Schedule)
// 요일별 규칙:
// - 월, 수, 금: 자유 기도회 (모임시간 12:20-12:45, 교사 학생 모두 참여 가능)
// - 화, 목: 기도회 (모임시간 12:25-12:45, 큐티조 당번 및 신앙부 2명) - 콘서트 콰이어 참여 학생은 필참 아님

export type LunchPrayerStatus = 'prayer_meeting' | 'no_meeting' | 'exam' | 'open_prayer';

export interface LunchPrayerSchedule {
  date: string; // YYYY-MM-DD
  type: LunchPrayerStatus;
  qtGroup?: number;
  faithMembers?: string[];
  label?: string; // e.g. "쉬는날", "중간고사"
}

// 사용자 제공 일정 (화/목 위주로 작성됨)
export const lunchPrayerSchedule: LunchPrayerSchedule[] = [
  { date: "2026-03-17", type: 'prayer_meeting', qtGroup: 1, faithMembers: ["신유주", "오시온"] },
  { date: "2026-03-19", type: 'prayer_meeting', qtGroup: 2, faithMembers: ["박하은", "박요한"] },
  { date: "2026-03-24", type: 'prayer_meeting', qtGroup: 3, faithMembers: ["나현서", "김예린"] },
  { date: "2026-03-26", type: 'prayer_meeting', qtGroup: 4, faithMembers: ["이하진", "박세희"] },
  { date: "2026-03-31", type: 'prayer_meeting', qtGroup: 5, faithMembers: ["김민준", "노하진"] },
  { date: "2026-04-02", type: 'no_meeting', label: "쉬는날" },
  { date: "2026-04-07", type: 'prayer_meeting', qtGroup: 6, faithMembers: ["손우주", "고은결"] },
  { date: "2026-04-09", type: 'no_meeting', label: "쉬는날" },
  { date: "2026-04-14", type: 'prayer_meeting', qtGroup: 7, faithMembers: ["송명서", "곽주원"] },
  { date: "2026-04-16", type: 'prayer_meeting', qtGroup: 8, faithMembers: ["신유주", "오시온"] },
  { date: "2026-04-21", type: 'exam', label: "중간고사" },
  { date: "2026-04-23", type: 'exam', label: "중간고사" },
  { date: "2026-04-28", type: 'exam', label: "중간고사" },
  { date: "2026-04-30", type: 'prayer_meeting', qtGroup: 1, faithMembers: ["박하은", "박요한"] },
  { date: "2026-05-05", type: 'prayer_meeting', qtGroup: 2, faithMembers: ["나현서", "김예린"] },
  { date: "2026-05-07", type: 'prayer_meeting', qtGroup: 3, faithMembers: ["이하진", "박세희"] },
  { date: "2026-05-12", type: 'prayer_meeting', qtGroup: 4, faithMembers: ["김민준", "노하진"] },
  { date: "2026-05-14", type: 'prayer_meeting', qtGroup: 5, faithMembers: ["손우주", "고은결"] },
  { date: "2026-05-19", type: 'prayer_meeting', qtGroup: 6, faithMembers: ["송명서", "곽주원"] },
  { date: "2026-05-21", type: 'prayer_meeting', qtGroup: 7, faithMembers: ["신유주", "오시온"] },
  { date: "2026-05-26", type: 'prayer_meeting', qtGroup: 8, faithMembers: ["박하은", "박요한"] },
  { date: "2026-05-28", type: 'prayer_meeting', qtGroup: 1, faithMembers: ["나현서", "김예린"] },
  { date: "2026-06-02", type: 'prayer_meeting', qtGroup: 2, faithMembers: ["이하진", "박세희"] },
  { date: "2026-06-04", type: 'prayer_meeting', qtGroup: 3, faithMembers: ["김민준", "노하진"] },
  { date: "2026-06-09", type: 'prayer_meeting', qtGroup: 4, faithMembers: ["손우주", "고은결"] },
  { date: "2026-06-11", type: 'no_meeting', label: "쉬는날" },
  { date: "2026-06-16", type: 'prayer_meeting', qtGroup: 5, faithMembers: ["송명서", "곽주원"] },
  { date: "2026-06-18", type: 'prayer_meeting', qtGroup: 6, faithMembers: ["신유주", "오시온"] },
  { date: "2026-06-22", type: 'exam', label: "기말 전주" },
  { date: "2026-06-25", type: 'exam', label: "기말 전주" },
  { date: "2026-06-30", type: 'exam', label: "기말고사" },
  { date: "2026-07-02", type: 'exam', label: "기말고사" },
];

/**
 * 특정 날짜의 점심기도 일정을 반환합니다.
 */
export function getLunchPrayerByDate(dateObj: Date): LunchPrayerSchedule | { type: 'open_prayer', label: string } | null {
  // Use local time based YYYY-MM-DD
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}-${mm}-${dd}`;

  // 1. 배정된 일정이 있는지 확인 (화/목)
  const assigned = lunchPrayerSchedule.find(s => s.date === dateStr);
  if (assigned) {
    return assigned;
  }

  // 2. 월, 수, 금인지 확인 (자유 기도회)
  const dayOfWeek = dateObj.getDay(); // 0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri, 6: Sat
  if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
    return { type: 'open_prayer', label: "자유 기도 (교사/학생 누구나 참여 가능)" };
  }

  // 주말이거나 특별한 일정이 없는 경우
  return null;
}
