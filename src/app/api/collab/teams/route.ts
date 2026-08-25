import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { matchesStudentName } from "@/lib/hangul-search";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.trim();

    // 1. If search query is provided, perform Chosung + Substring + Given Name search across all DB members
    if (query) {
      const [allMissionMembers, allQtMembers] = await Promise.all([
        prisma.missionTeamMember.findMany({
          include: { team: true },
        }),
        prisma.qtGroupMember.findMany({
          include: { group: true },
        }),
      ]);

      // Collect unique student names matching query
      const matchedNamesSet = new Set<string>();

      allMissionMembers.forEach((m) => {
        if (matchesStudentName(m.name, query)) {
          matchedNamesSet.add(m.name);
        }
      });

      allQtMembers.forEach((q) => {
        if (matchesStudentName(q.name, query)) {
          matchedNamesSet.add(q.name);
        }
      });

      const matchedResults = Array.from(matchedNamesSet).map((name) => {
        const missionInfo = allMissionMembers.find((m) => m.name === name);
        const qtInfo = allQtMembers.find((q) => q.name === name);

        return {
          name,
          grade: missionInfo?.grade || qtInfo?.grade || 0,
          missionTeam: missionInfo
            ? {
                name: missionInfo.team.name,
                role: missionInfo.role,
                chapelDate: missionInfo.team.chapelDate,
                leaderName: missionInfo.team.leaderName,
              }
            : null,
          qtGroup: qtInfo
            ? {
                name: qtInfo.group.name,
                role: qtInfo.role,
                leaderName: qtInfo.group.leaderName,
                subLeaderName: qtInfo.group.subLeaderName,
              }
            : null,
        };
      });

      // Sort by grade desc, then name asc
      matchedResults.sort((a, b) => b.grade - a.grade || a.name.localeCompare(b.name, "ko"));

      return NextResponse.json({ results: matchedResults });
    }

    // 2. Otherwise, return full lists of Mission Teams & QT Groups from DB
    const [missionTeams, qtGroups] = await Promise.all([
      prisma.missionTeam.findMany({
        include: {
          members: {
            orderBy: [{ grade: "desc" }, { name: "asc" }],
          },
        },
        orderBy: { name: "asc" },
      }),
      prisma.qtGroup.findMany({
        include: {
          members: {
            orderBy: [{ grade: "desc" }, { name: "asc" }],
          },
        },
        orderBy: { id: "asc" },
      }),
    ]);

    return NextResponse.json({ missionTeams, qtGroups });
  } catch (error) {
    console.error("[API Teams] Error:", error);
    return NextResponse.json({ error: "Failed to fetch teams and groups" }, { status: 500 });
  }
}
