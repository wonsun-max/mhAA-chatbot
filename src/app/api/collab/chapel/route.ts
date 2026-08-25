import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const semester = searchParams.get("semester") || "2";
    const year = parseInt(searchParams.get("year") || "2026", 10);

    const where: any = { year, semester };
    if (type && type !== "ALL") {
      where.type = type;
    }

    const schedules = await prisma.chapelSchedule.findMany({
      where,
      orderBy: [{ month: "asc" }, { day: "asc" }],
    });

    return NextResponse.json({ schedules });
  } catch (error) {
    console.error("[API Chapel Schedule] Error:", error);
    return NextResponse.json({ error: "Failed to fetch chapel schedules" }, { status: 500 });
  }
}
