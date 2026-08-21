import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateIcsContent } from "@/lib/calendar-export";

export async function GET() {
    try {
        const meals = await prisma.schoolMeal.findMany({
            orderBy: { date: "asc" },
        });

        const exportItems = meals.map((m) => ({
            id: m.id,
            title: `[MHA 급식] ${m.menu.split(",")[0].trim()} 외`,
            startDate: m.date,
            description: `📍 마닐라한국아카데미 급식\n\n${m.menu.split(",").map(item => `• ${item.trim()}`).join("\n")}\n\nhttps://mhawithus.shop/collab/meals`,
            location: "마닐라한국아카데미 급식실",
        }));

        const icsData = generateIcsContent("MHA 급식표 (WITHUS)", exportItems);

        return new NextResponse(icsData, {
            status: 200,
            headers: {
                "Content-Type": "text/calendar; charset=utf-8",
                "Content-Disposition": 'inline; filename="mha-meals.ics"',
                "Cache-Control": "public, max-age=1800, s-maxage=1800",
            },
        });
    } catch (error) {
        console.error("Failed to generate meals feed:", error);
        return NextResponse.json({ error: "Failed to generate meals feed" }, { status: 500 });
    }
}
