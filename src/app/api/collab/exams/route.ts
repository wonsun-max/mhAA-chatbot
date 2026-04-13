import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * Handle GET: Fetch exam schedule for students
 * Filters for the current academic year and semester
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const year = searchParams.get("year") || "2026"
        const semester = searchParams.get("semester") || "1"
        const type = searchParams.get("type") || "MIDTERM"

        const exams = await prisma.examSchedule.findMany({
            where: {
                year: Number(year),
                semester: String(semester),
                examType: String(type),
            },
            orderBy: [
                { date: 'asc' },
                { period: 'asc' }
            ]
        })

        return NextResponse.json({ exams })
    } catch (error) {
        console.error("Error fetching exams:", error)
        return NextResponse.json({ error: "Failed to fetch exams" }, { status: 500 })
    }
}
