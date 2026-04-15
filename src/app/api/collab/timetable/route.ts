import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const gradeFilter = searchParams.get("grade");

        const queryOptions: Prisma.TimetableFindManyArgs = {
            where: gradeFilter ? { grade: gradeFilter } : undefined,
            orderBy: [
                { grade: "asc" },
                { dayOfWeek: "asc" },
                { period: "asc" },
            ],
        };

        const timetables = await prisma.timetable.findMany(queryOptions);

        return NextResponse.json({ timetables });
    } catch (error) {
        console.error("Error fetching timetables:", error);
        return NextResponse.json({ error: "Failed to fetch timetables" }, { status: 500 });
    }
}
