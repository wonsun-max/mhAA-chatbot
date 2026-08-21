import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateIcsContent } from "@/lib/calendar-export";

export async function GET() {
    try {
        const events = await prisma.schoolCalendar.findMany({
            orderBy: { startDate: "asc" },
        });

        const exportItems = events.map((e) => ({
            id: e.id,
            title: `[${e.eventType || "학사일정"}] ${e.name}`,
            startDate: e.startDate,
            endDate: e.endDate || e.startDate,
            description: `마닐라한국아카데미 학사일정: ${e.name} (${e.eventType})\n기간: ${e.startDate} ~ ${e.endDate}\nhttps://mhawithus.shop/collab/calendar`,
            location: "마닐라한국아카데미",
        }));

        const icsData = generateIcsContent("MHA 학사일정 (WITHUS)", exportItems);

        return new NextResponse(icsData, {
            status: 200,
            headers: {
                "Content-Type": "text/calendar; charset=utf-8",
                "Content-Disposition": 'inline; filename="mha-calendar.ics"',
                "Cache-Control": "public, max-age=3600, s-maxage=3600",
            },
        });
    } catch (error) {
        console.error("Failed to generate calendar feed:", error);
        return NextResponse.json({ error: "Failed to generate calendar feed" }, { status: 500 });
    }
}
