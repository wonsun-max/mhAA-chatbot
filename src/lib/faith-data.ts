import { prisma } from "@/lib/prisma";

export interface ChapelScheduleItem {
  id: string;
  month: number;
  day: number;
  dayOfWeek: string;
  speaker: string;
  organizer: string;
  note?: string | null;
  type: string;
}

export interface StudentMembershipResult {
  name: string;
  grade: number;
  missionTeam: { name: string; role: string; chapelDate?: string } | null;
  qtGroup: { name: string; role: string; leader?: string; subLeader?: string } | null;
}

/**
 * 100% Database-driven query function to lookup a student's team membership via Prisma.
 */
export async function getStudentMembershipFromDb(studentName: string): Promise<StudentMembershipResult | null> {
  const query = studentName.trim();
  if (!query) return null;

  const [missionMember, qtMember] = await Promise.all([
    prisma.missionTeamMember.findFirst({
      where: { name: { equals: query, mode: "insensitive" } },
      include: { team: true },
    }),
    prisma.qtGroupMember.findFirst({
      where: { name: { equals: query, mode: "insensitive" } },
      include: { group: true },
    }),
  ]);

  if (!missionMember && !qtMember) return null;

  return {
    name: query,
    grade: missionMember?.grade || qtMember?.grade || 0,
    missionTeam: missionMember
      ? {
          name: missionMember.team.name,
          role: missionMember.role,
          chapelDate: missionMember.team.chapelDate,
        }
      : null,
    qtGroup: qtMember
      ? {
          name: qtMember.group.name,
          role: qtMember.role,
          leader: `${qtMember.group.leaderName} (${qtMember.group.leaderGrade}학년)`,
          subLeader: `${qtMember.group.subLeaderName} (${qtMember.group.subLeaderGrade}학년)`,
        }
      : null,
  };
}
