import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.trim();

    // If search query is provided, perform live DB search across members
    if (query) {
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

      if (!missionMember && !qtMember) {
        return NextResponse.json({ result: null });
      }

      return NextResponse.json({
        result: {
          name: query,
          grade: missionMember?.grade || qtMember?.grade || 0,
          missionTeam: missionMember ? { name: missionMember.team.name, role: missionMember.role } : null,
          qtGroup: qtMember ? { name: qtMember.group.name, role: qtMember.role } : null,
        },
      });
    }

    // Otherwise, return full lists of Mission Teams & QT Groups from DB
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
