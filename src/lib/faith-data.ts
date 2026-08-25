export interface ChapelEvent {
  id: string;
  month: number;
  day: number;
  dayOfWeek?: string; // "월", "수", "화"
  speaker: string;
  organizer: string;
  note?: string;
  type: "MISSION" | "GRADE" | "SPECIAL" | "EXAM" | "SCHOOL";
}

export interface StudentMember {
  name: string;
  grade: number; // 7, 8, 9, 10, 11, 12
  role?: "팀장" | "조장" | "부조장" | "팀원" | "조원";
}

export interface MissionTeam {
  id: string;
  name: string;
  leader: StudentMember;
  chapelDate: string; // e.g. "11월 11일"
  accentColor: string;
  glowColor: string;
  members: StudentMember[];
}

export interface QtGroup {
  id: number;
  name: string;
  leader: StudentMember;
  subLeader: StudentMember;
  members: StudentMember[];
}

// 2026-2 MHA 채플 계획표
export const CHAPEL_SCHEDULE_2026_2: ChapelEvent[] = [
  { id: "c-1", month: 8, day: 10, dayOfWeek: "월", speaker: "이은세", organizer: "교목실", note: "개학식(월요일)", type: "SCHOOL" },
  { id: "c-2", month: 8, day: 19, dayOfWeek: "수", speaker: "담당자", organizer: "학생회", type: "SPECIAL" },
  { id: "c-3", month: 8, day: 26, dayOfWeek: "수", speaker: "담당자", organizer: "12-1학년", type: "GRADE" },
  { id: "c-4", month: 9, day: 2, dayOfWeek: "수", speaker: "담당자", organizer: "필리핀 1팀", note: "선교 예배", type: "MISSION" },
  { id: "c-5", month: 9, day: 9, dayOfWeek: "수", speaker: "담당자", organizer: "12-2학년", type: "GRADE" },
  { id: "c-6", month: 9, day: 16, dayOfWeek: "수", speaker: "담당자", organizer: "필리핀 2팀", note: "선교 예배", type: "MISSION" },
  { id: "c-7", month: 9, day: 23, dayOfWeek: "수", speaker: "담당자", organizer: "11학년", type: "GRADE" },
  { id: "c-8", month: 9, day: 30, dayOfWeek: "수", speaker: "담당자", organizer: "10학년", type: "GRADE" },
  { id: "c-9", month: 10, day: 7, dayOfWeek: "수", speaker: "담당자", organizer: "교사", note: "중간고사 (10/2~6)", type: "EXAM" },
  { id: "c-10", month: 10, day: 14, dayOfWeek: "수", speaker: "담당자", organizer: "동아시아팀", note: "선교 예배", type: "MISSION" },
  { id: "c-11", month: 10, day: 21, dayOfWeek: "수", speaker: "담당자", organizer: "9학년", type: "GRADE" },
  { id: "c-12", month: 10, day: 28, dayOfWeek: "수", speaker: "담당자", organizer: "초등 연합", note: "트립 주간", type: "SPECIAL" },
  { id: "c-13", month: 11, day: 4, dayOfWeek: "수", speaker: "담당자", organizer: "8학년", type: "GRADE" },
  { id: "c-14", month: 11, day: 11, dayOfWeek: "수", speaker: "담당자", organizer: "글로벌팀", note: "선교 예배", type: "MISSION" },
  { id: "c-15", month: 11, day: 18, dayOfWeek: "수", speaker: "설교자", organizer: "추수감사예배", note: "절기 예배", type: "SPECIAL" },
  { id: "c-16", month: 11, day: 25, dayOfWeek: "수", speaker: "담당자", organizer: "7학년", type: "GRADE" },
  { id: "c-17", month: 12, day: 2, dayOfWeek: "수", speaker: "담당자", organizer: "교사", note: "기말고사 (12/4~9)", type: "EXAM" },
  { id: "c-18", month: 12, day: 9, dayOfWeek: "수", speaker: "설교자", organizer: "기말고사", note: "기말고사 주간", type: "EXAM" },
  { id: "c-19", month: 12, day: 16, dayOfWeek: "수", speaker: "담당자", organizer: "특별 예배", note: "시청각 설교", type: "SPECIAL" },
  { id: "c-20", month: 12, day: 22, dayOfWeek: "화", speaker: "이은세", organizer: "교목실", note: "종업식(화요일)", type: "SCHOOL" },
];

// 4대 선교팀 데이터
export const MISSION_TEAMS: MissionTeam[] = [
  {
    id: "global",
    name: "글로벌팀",
    leader: { name: "김현민", grade: 11, role: "팀장" },
    chapelDate: "11월 11일",
    accentColor: "text-blue-400",
    glowColor: "bg-blue-500/15",
    members: [
      { name: "황은호", grade: 12 }, { name: "김주상", grade: 12 }, { name: "이원선", grade: 12 },
      { name: "윤다애", grade: 12 }, { name: "윤다정", grade: 12 }, { name: "이은성", grade: 12 },
      { name: "이조은", grade: 12 }, { name: "박시우", grade: 11 }, { name: "송예임", grade: 11 },
      { name: "박희윤", grade: 11 }, { name: "박한결", grade: 11 }, { name: "윤서원", grade: 11 },
      { name: "조수하", grade: 11 }, { name: "김주찬", grade: 10 }, { name: "김주원", grade: 10 },
      { name: "박요한", grade: 10 }, { name: "이규은", grade: 10 }, { name: "박승리", grade: 10 },
      { name: "김태연", grade: 9 }, { name: "김수현", grade: 9 }, { name: "이하진", grade: 9 },
      { name: "박세희", grade: 9 }, { name: "송예주", grade: 9 },
    ],
  },
  {
    id: "east-asia",
    name: "동아시아팀",
    leader: { name: "박서정", grade: 11, role: "팀장" },
    chapelDate: "10월 14일",
    accentColor: "text-amber-400",
    glowColor: "bg-amber-500/15",
    members: [
      { name: "김무진", grade: 12 }, { name: "고애령", grade: 12 }, { name: "나현서", grade: 12 },
      { name: "한은총", grade: 12 }, { name: "장태은", grade: 12 }, { name: "김다온", grade: 12 },
      { name: "신유주", grade: 12 }, { name: "박지수", grade: 11 }, { name: "오영광", grade: 11 },
      { name: "박진수", grade: 10 }, { name: "이다인", grade: 9 }, { name: "이지연", grade: 9 },
      { name: "윤주아", grade: 9 }, { name: "김은혜", grade: 9 }, { name: "오시온", grade: 8 },
    ],
  },
  {
    id: "philippines-1",
    name: "필리핀 1팀",
    leader: { name: "하승민", grade: 11, role: "팀장" },
    chapelDate: "9월 2일",
    accentColor: "text-emerald-400",
    glowColor: "bg-emerald-500/15",
    members: [
      { name: "노하진", grade: 12 }, { name: "박예준", grade: 12 }, { name: "이은채", grade: 12 },
      { name: "윤준서", grade: 12 }, { name: "정진서", grade: 12 }, { name: "이다빗", grade: 12 },
      { name: "김예린", grade: 12 }, { name: "노하임", grade: 11 }, { name: "박한나", grade: 11 },
      { name: "권하겸", grade: 10 }, { name: "신예슬", grade: 10 }, { name: "김나현", grade: 10 },
      { name: "고은찬", grade: 10 }, { name: "이시현", grade: 9 }, { name: "손지언", grade: 9 },
      { name: "주향유", grade: 9 }, { name: "손우주", grade: 8 }, { name: "노하린", grade: 8 },
      { name: "장하진", grade: 8 }, { name: "송명서", grade: 7 }, { name: "서다함", grade: 7 },
      { name: "고은결", grade: 7 },
    ],
  },
  {
    id: "philippines-2",
    name: "필리핀 2팀",
    leader: { name: "김성환", grade: 11, role: "팀장" },
    chapelDate: "9월 16일",
    accentColor: "text-rose-400",
    glowColor: "bg-rose-500/15",
    members: [
      { name: "박하은", grade: 12 }, { name: "강한나", grade: 12 }, { name: "이성진", grade: 12 },
      { name: "조세빈", grade: 12 }, { name: "강예서", grade: 12 }, { name: "김민준", grade: 11 },
      { name: "곽주원", grade: 11 }, { name: "김기찬", grade: 11 }, { name: "김건", grade: 10 },
      { name: "윤은서", grade: 10 }, { name: "은선주", grade: 10 }, { name: "이하엘", grade: 10 },
      { name: "이지효", grade: 9 }, { name: "박정우", grade: 9 }, { name: "박예신", grade: 9 },
      { name: "정진주", grade: 9 }, { name: "은시온", grade: 8 }, { name: "최민준", grade: 8 },
      { name: "신예준", grade: 7 }, { name: "임예지", grade: 7 }, { name: "최사랑", grade: 7 },
    ],
  },
];

// 8대 QT조 데이터
export const QT_GROUPS: QtGroup[] = [
  {
    id: 1,
    name: "1조",
    leader: { name: "노하임", grade: 11, role: "조장" },
    subLeader: { name: "윤다애", grade: 12, role: "부조장" },
    members: [
      { name: "윤준서", grade: 12 }, { name: "이조은", grade: 12 }, { name: "곽주원", grade: 11 },
      { name: "박진수", grade: 10 }, { name: "김주찬", grade: 10 }, { name: "이지연", grade: 9 },
      { name: "김수현", grade: 9 }, { name: "손우주", grade: 8 }, { name: "고은결", grade: 7 },
    ],
  },
  {
    id: 2,
    name: "2조",
    leader: { name: "김성환", grade: 11, role: "조장" },
    subLeader: { name: "정진서", grade: 12, role: "부조장" },
    members: [
      { name: "이다빗", grade: 12 }, { name: "이은성", grade: 12 }, { name: "조세빈", grade: 12 },
      { name: "박한나", grade: 11 }, { name: "박승리", grade: 10 }, { name: "송예주", grade: 9 },
      { name: "박예신", grade: 9 }, { name: "은시온", grade: 8 }, { name: "신예준", grade: 7 },
    ],
  },
  {
    id: 3,
    name: "3조",
    leader: { name: "김현민", grade: 11, role: "조장" },
    subLeader: { name: "노하진", grade: 12, role: "부조장" },
    members: [
      { name: "박하은", grade: 12 }, { name: "나현서", grade: 12 }, { name: "김민준", grade: 11 },
      { name: "박희윤", grade: 11 }, { name: "이하엘", grade: 10 }, { name: "이지효", grade: 9 },
      { name: "박정우", grade: 9 }, { name: "장하진", grade: 8 }, { name: "송명서", grade: 7 },
    ],
  },
  {
    id: 4,
    name: "4조",
    leader: { name: "하승민", grade: 11, role: "조장" },
    subLeader: { name: "김주상", grade: 12, role: "부조장" },
    members: [
      { name: "장태은", grade: 12 }, { name: "윤다정", grade: 12 }, { name: "고애령", grade: 12 },
      { name: "조수하", grade: 11 }, { name: "신예슬", grade: 10 }, { name: "고은찬", grade: 10 },
      { name: "윤주아", grade: 9 }, { name: "이하진", grade: 9 }, { name: "최사랑", grade: 7 },
    ],
  },
  {
    id: 5,
    name: "5조",
    leader: { name: "박서정", grade: 11, role: "조장" },
    subLeader: { name: "강예서", grade: 12, role: "부조장" },
    members: [
      { name: "김예린", grade: 12 }, { name: "김무진", grade: 12 }, { name: "오영광", grade: 11 },
      { name: "은선주", grade: 10 }, { name: "김건", grade: 10 }, { name: "손지언", grade: 9 },
      { name: "주향유", grade: 9 }, { name: "최민준", grade: 8 }, { name: "서다함", grade: 7 },
    ],
  },
  {
    id: 6,
    name: "6조",
    leader: { name: "박시우", grade: 11, role: "조장" },
    subLeader: { name: "신유주", grade: 12, role: "부조장" },
    members: [
      { name: "김다온", grade: 12 }, { name: "한은총", grade: 12 }, { name: "윤서원", grade: 11 },
      { name: "윤은서", grade: 10 }, { name: "박요한", grade: 10 }, { name: "김태연", grade: 9 },
      { name: "김은혜", grade: 9 }, { name: "노하린", grade: 8 },
    ],
  },
  {
    id: 7,
    name: "7조",
    leader: { name: "박한결", grade: 11, role: "조장" },
    subLeader: { name: "이원선", grade: 12, role: "부조장" },
    members: [
      { name: "강한나", grade: 12 }, { name: "이성진", grade: 12 }, { name: "박지수", grade: 11 },
      { name: "김나현", grade: 10 }, { name: "권하겸", grade: 10 }, { name: "이시현", grade: 9 },
      { name: "박세희", grade: 9 }, { name: "오시온", grade: 8 },
    ],
  },
  {
    id: 8,
    name: "8조",
    leader: { name: "송예임", grade: 11, role: "조장" },
    subLeader: { name: "황은호", grade: 12, role: "부조장" },
    members: [
      { name: "이은채", grade: 12 }, { name: "박예준", grade: 12 }, { name: "김기찬", grade: 11 },
      { name: "김주원", grade: 10 }, { name: "이규은", grade: 10 }, { name: "정진주", grade: 9 },
      { name: "이다인", grade: 9 }, { name: "임예지", grade: 7 },
    ],
  },
];

/**
 * 학생 이름으로 소속 선교팀 및 QT조 정보를 검색합니다.
 */
export function findStudentMembership(searchName: string) {
  const query = searchName.trim();
  if (!query) return null;

  let foundMission: { team: MissionTeam; role: string; grade: number } | null = null;
  let foundQt: { group: QtGroup; role: string; grade: number } | null = null;

  // 1. Search in Mission Teams
  for (const team of MISSION_TEAMS) {
    if (team.leader.name === query) {
      foundMission = { team, role: "팀장", grade: team.leader.grade };
      break;
    }
    const member = team.members.find((m) => m.name === query);
    if (member) {
      foundMission = { team, role: "팀원", grade: member.grade };
      break;
    }
  }

  // 2. Search in QT Groups
  for (const group of QT_GROUPS) {
    if (group.leader.name === query) {
      foundQt = { group, role: "조장", grade: group.leader.grade };
      break;
    }
    if (group.subLeader.name === query) {
      foundQt = { group, role: "부조장", grade: group.subLeader.grade };
      break;
    }
    const member = group.members.find((m) => m.name === query);
    if (member) {
      foundQt = { group, role: "조원", grade: member.grade };
      break;
    }
  }

  if (!foundMission && !foundQt) return null;

  return {
    name: query,
    grade: foundMission?.grade || foundQt?.grade || 0,
    missionTeam: foundMission?.team,
    missionRole: foundMission?.role,
    qtGroup: foundQt?.group,
    qtRole: foundQt?.role,
  };
}
