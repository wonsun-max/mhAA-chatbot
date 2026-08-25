import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding 2026-2 Chapel, Mission Teams, and QT Groups into PostgreSQL...");

  // 1. Seed Chapel Schedules
  await prisma.chapelSchedule.deleteMany();
  const chapelEvents = [
    { month: 8, day: 10, dayOfWeek: "월", date: "2026-08-10", speaker: "이은세", organizer: "교목실", note: "개학식(월요일)", type: "SCHOOL" },
    { month: 8, day: 19, dayOfWeek: "수", date: "2026-08-19", speaker: "담당자", organizer: "학생회", type: "SPECIAL" },
    { month: 8, day: 26, dayOfWeek: "수", date: "2026-08-26", speaker: "담당자", organizer: "12-1학년", type: "GRADE" },
    { month: 9, day: 2, dayOfWeek: "수", date: "2026-09-02", speaker: "담당자", organizer: "필리핀 1팀", note: "선교 예배", type: "MISSION" },
    { month: 9, day: 9, dayOfWeek: "수", date: "2026-09-09", speaker: "담당자", organizer: "12-2학년", type: "GRADE" },
    { month: 9, day: 16, dayOfWeek: "수", date: "2026-09-16", speaker: "담당자", organizer: "필리핀 2팀", note: "선교 예배", type: "MISSION" },
    { month: 9, day: 23, dayOfWeek: "수", date: "2026-09-23", speaker: "담당자", organizer: "11학년", type: "GRADE" },
    { month: 9, day: 30, dayOfWeek: "수", date: "2026-09-30", speaker: "담당자", organizer: "10학년", type: "GRADE" },
    { month: 10, day: 7, dayOfWeek: "수", date: "2026-10-07", speaker: "담당자", organizer: "교사", note: "중간고사 (10/2~6)", type: "EXAM" },
    { month: 10, day: 14, dayOfWeek: "수", date: "2026-10-14", speaker: "담당자", organizer: "동아시아팀", note: "선교 예배", type: "MISSION" },
    { month: 10, day: 21, dayOfWeek: "수", date: "2026-10-21", speaker: "담당자", organizer: "9학년", type: "GRADE" },
    { month: 10, day: 28, dayOfWeek: "수", date: "2026-10-28", speaker: "담당자", organizer: "초등 연합", note: "트립 주간", type: "SPECIAL" },
    { month: 11, day: 4, dayOfWeek: "수", date: "2026-11-04", speaker: "담당자", organizer: "8학년", type: "GRADE" },
    { month: 11, day: 11, dayOfWeek: "수", date: "2026-11-11", speaker: "담당자", organizer: "글로벌팀", note: "선교 예배", type: "MISSION" },
    { month: 11, day: 18, dayOfWeek: "수", date: "2026-11-18", speaker: "설교자", organizer: "추수감사예배", note: "절기 예배", type: "SPECIAL" },
    { month: 11, day: 25, dayOfWeek: "수", date: "2026-11-25", speaker: "담당자", organizer: "7학년", type: "GRADE" },
    { month: 12, day: 2, dayOfWeek: "수", date: "2026-12-02", speaker: "담당자", organizer: "교사", note: "기말고사 (12/4~9)", type: "EXAM" },
    { month: 12, day: 9, dayOfWeek: "수", date: "2026-12-09", speaker: "설교자", organizer: "기말고사", note: "기말고사 주간", type: "EXAM" },
    { month: 12, day: 16, dayOfWeek: "수", date: "2026-12-16", speaker: "담당자", organizer: "특별 예배", note: "시청각 설교", type: "SPECIAL" },
    { month: 12, day: 22, dayOfWeek: "화", date: "2026-12-22", speaker: "이은세", organizer: "교목실", note: "종업식(화요일)", type: "SCHOOL" },
  ];

  for (const c of chapelEvents) {
    await prisma.chapelSchedule.create({ data: c });
  }
  console.log(`Created ${chapelEvents.length} chapel schedules.`);

  // 2. Seed Mission Teams
  await prisma.missionTeam.deleteMany();
  const missionTeamsData = [
    {
      name: "글로벌팀",
      leaderName: "김현민",
      leaderGrade: 11,
      chapelDate: "11월 11일",
      members: [
        { name: "황은호", grade: 12 }, { name: "김주상", grade: 12 }, { name: "이원선", grade: 12 },
        { name: "윤다애", grade: 12 }, { name: "윤다정", grade: 12 }, { name: "이은성", grade: 12 },
        { name: "이조은", grade: 12 }, { name: "박시우", grade: 11 }, { name: "송예임", grade: 11 },
        { name: "박희윤", grade: 11 }, { name: "박한결", grade: 11 }, { name: "윤서원", grade: 11 },
        { name: "조수하", grade: 11 }, { name: "김주찬", grade: 10 }, { name: "김주원", grade: 10 },
        { name: "박요한", grade: 10 }, { name: "이규은", grade: 10 }, { name: "박승리", grade: 10 },
        { name: "김태연", grade: 9 }, { name: "김수현", grade: 9 }, { name: "이하진", grade: 9 },
        { name: "박세희", grade: 9 }, { name: "송예주", grade: 9 },
      ]
    },
    {
      name: "동아시아팀",
      leaderName: "박서정",
      leaderGrade: 11,
      chapelDate: "10월 14일",
      members: [
        { name: "김무진", grade: 12 }, { name: "고애령", grade: 12 }, { name: "나현서", grade: 12 },
        { name: "한은총", grade: 12 }, { name: "장태은", grade: 12 }, { name: "김다온", grade: 12 },
        { name: "신유주", grade: 12 }, { name: "박지수", grade: 11 }, { name: "오영광", grade: 11 },
        { name: "박진수", grade: 10 }, { name: "이다인", grade: 9 }, { name: "이지연", grade: 9 },
        { name: "윤주아", grade: 9 }, { name: "김은혜", grade: 9 }, { name: "오시온", grade: 8 },
      ]
    },
    {
      name: "필리핀 1팀",
      leaderName: "하승민",
      leaderGrade: 11,
      chapelDate: "9월 2일",
      members: [
        { name: "노하진", grade: 12 }, { name: "박예준", grade: 12 }, { name: "이은채", grade: 12 },
        { name: "윤준서", grade: 12 }, { name: "정진서", grade: 12 }, { name: "이다빗", grade: 12 },
        { name: "김예린", grade: 12 }, { name: "노하임", grade: 11 }, { name: "박한나", grade: 11 },
        { name: "권하겸", grade: 10 }, { name: "신예슬", grade: 10 }, { name: "김나현", grade: 10 },
        { name: "고은찬", grade: 10 }, { name: "이시현", grade: 9 }, { name: "손지언", grade: 9 },
        { name: "주향유", grade: 9 }, { name: "손우주", grade: 8 }, { name: "노하린", grade: 8 },
        { name: "장하진", grade: 8 }, { name: "송명서", grade: 7 }, { name: "서다함", grade: 7 },
        { name: "고은결", grade: 7 },
      ]
    },
    {
      name: "필리핀 2팀",
      leaderName: "김성환",
      leaderGrade: 11,
      chapelDate: "9월 16일",
      members: [
        { name: "박하은", grade: 12 }, { name: "강한나", grade: 12 }, { name: "이성진", grade: 12 },
        { name: "조세빈", grade: 12 }, { name: "강예서", grade: 12 }, { name: "김민준", grade: 11 },
        { name: "곽주원", grade: 11 }, { name: "김기찬", grade: 11 }, { name: "김건", grade: 10 },
        { name: "윤은서", grade: 10 }, { name: "은선주", grade: 10 }, { name: "이하엘", grade: 10 },
        { name: "이지효", grade: 9 }, { name: "박정우", grade: 9 }, { name: "박예신", grade: 9 },
        { name: "정진주", grade: 9 }, { name: "은시온", grade: 8 }, { name: "최민준", grade: 8 },
        { name: "신예준", grade: 7 }, { name: "임예지", grade: 7 }, { name: "최사랑", grade: 7 },
      ]
    }
  ];

  for (const t of missionTeamsData) {
    const team = await prisma.missionTeam.create({
      data: {
        name: t.name,
        leaderName: t.leaderName,
        leaderGrade: t.leaderGrade,
        chapelDate: t.chapelDate,
      }
    });

    // Add leader as member too with role 팀장
    await prisma.missionTeamMember.create({
      data: {
        teamId: team.id,
        name: t.leaderName,
        grade: t.leaderGrade,
        role: "팀장",
      }
    });

    for (const m of t.members) {
      await prisma.missionTeamMember.create({
        data: {
          teamId: team.id,
          name: m.name,
          grade: m.grade,
          role: "팀원",
        }
      });
    }
  }
  console.log("Seeded 4 Mission Teams & members.");

  // 3. Seed QT Groups
  await prisma.qtGroup.deleteMany();
  const qtGroupsData = [
    {
      id: 1,
      name: "1조",
      leaderName: "노하임",
      leaderGrade: 11,
      subLeaderName: "윤다애",
      subLeaderGrade: 12,
      members: [
        { name: "윤준서", grade: 12 }, { name: "이조은", grade: 12 }, { name: "곽주원", grade: 11 },
        { name: "박진수", grade: 10 }, { name: "김주찬", grade: 10 }, { name: "이지연", grade: 9 },
        { name: "김수현", grade: 9 }, { name: "손우주", grade: 8 }, { name: "고은결", grade: 7 },
      ]
    },
    {
      id: 2,
      name: "2조",
      leaderName: "김성환",
      leaderGrade: 11,
      subLeaderName: "정진서",
      subLeaderGrade: 12,
      members: [
        { name: "이다빗", grade: 12 }, { name: "이은성", grade: 12 }, { name: "조세빈", grade: 12 },
        { name: "박한나", grade: 11 }, { name: "박승리", grade: 10 }, { name: "송예주", grade: 9 },
        { name: "박예신", grade: 9 }, { name: "은시온", grade: 8 }, { name: "신예준", grade: 7 },
      ]
    },
    {
      id: 3,
      name: "3조",
      leaderName: "김현민",
      leaderGrade: 11,
      subLeaderName: "노하진",
      subLeaderGrade: 12,
      members: [
        { name: "박하은", grade: 12 }, { name: "나현서", grade: 12 }, { name: "김민준", grade: 11 },
        { name: "박희윤", grade: 11 }, { name: "이하엘", grade: 10 }, { name: "이지효", grade: 9 },
        { name: "박정우", grade: 9 }, { name: "장하진", grade: 8 }, { name: "송명서", grade: 7 },
      ]
    },
    {
      id: 4,
      name: "4조",
      leaderName: "하승민",
      leaderGrade: 11,
      subLeaderName: "김주상",
      subLeaderGrade: 12,
      members: [
        { name: "장태은", grade: 12 }, { name: "윤다정", grade: 12 }, { name: "고애령", grade: 12 },
        { name: "조수하", grade: 11 }, { name: "신예슬", grade: 10 }, { name: "고은찬", grade: 10 },
        { name: "윤주아", grade: 9 }, { name: "이하진", grade: 9 }, { name: "최사랑", grade: 7 },
      ]
    },
    {
      id: 5,
      name: "5조",
      leaderName: "박서정",
      leaderGrade: 11,
      subLeaderName: "강예서",
      subLeaderGrade: 12,
      members: [
        { name: "김예린", grade: 12 }, { name: "김무진", grade: 12 }, { name: "오영광", grade: 11 },
        { name: "은선주", grade: 10 }, { name: "김건", grade: 10 }, { name: "손지언", grade: 9 },
        { name: "주향유", grade: 9 }, { name: "최민준", grade: 8 }, { name: "서다함", grade: 7 },
      ]
    },
    {
      id: 6,
      name: "6조",
      leaderName: "박시우",
      leaderGrade: 11,
      subLeaderName: "신유주",
      subLeaderGrade: 12,
      members: [
        { name: "김다온", grade: 12 }, { name: "한은총", grade: 12 }, { name: "윤서원", grade: 11 },
        { name: "윤은서", grade: 10 }, { name: "박요한", grade: 10 }, { name: "김태연", grade: 9 },
        { name: "김은혜", grade: 9 }, { name: "노하린", grade: 8 },
      ]
    },
    {
      id: 7,
      name: "7조",
      leaderName: "박한결",
      leaderGrade: 11,
      subLeaderName: "이원선",
      subLeaderGrade: 12,
      members: [
        { name: "강한나", grade: 12 }, { name: "이성진", grade: 12 }, { name: "박지수", grade: 11 },
        { name: "김나현", grade: 10 }, { name: "권하겸", grade: 10 }, { name: "이시현", grade: 9 },
        { name: "박세희", grade: 9 }, { name: "오시온", grade: 8 },
      ]
    },
    {
      id: 8,
      name: "8조",
      leaderName: "송예임",
      leaderGrade: 11,
      subLeaderName: "황은호",
      subLeaderGrade: 12,
      members: [
        { name: "이은채", grade: 12 }, { name: "박예준", grade: 12 }, { name: "김기찬", grade: 11 },
        { name: "김주원", grade: 10 }, { name: "이규은", grade: 10 }, { name: "정진주", grade: 9 },
        { name: "이다인", grade: 9 }, { name: "임예지", grade: 7 },
      ]
    }
  ];

  for (const g of qtGroupsData) {
    const group = await prisma.qtGroup.create({
      data: {
        id: g.id,
        name: g.name,
        leaderName: g.leaderName,
        leaderGrade: g.leaderGrade,
        subLeaderName: g.subLeaderName,
        subLeaderGrade: g.subLeaderGrade,
      }
    });

    // Leader
    await prisma.qtGroupMember.create({
      data: { groupId: group.id, name: g.leaderName, grade: g.leaderGrade, role: "조장" }
    });

    // SubLeader
    await prisma.qtGroupMember.create({
      data: { groupId: group.id, name: g.subLeaderName, grade: g.subLeaderGrade, role: "부조장" }
    });

    // Members
    for (const m of g.members) {
      await prisma.qtGroupMember.create({
        data: { groupId: group.id, name: m.name, grade: m.grade, role: "조원" }
      });
    }
  }

  console.log("Seeded 8 QT Groups & members.");
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
