import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAcademicSemester, getAcademicYear } from "@/lib/academic-calendar"

/**
 * Handle GET: Fetch exam schedule for students
 * Filters for the current academic year and semester
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const year = Number(searchParams.get("year") || getAcademicYear())
        const semester = searchParams.get("semester") || getAcademicSemester()
        const type = searchParams.get("type") || "MIDTERM"

        let exams = await prisma.examSchedule.findMany({
            where: {
                year,
                semester: String(semester),
                examType: String(type),
            },
            orderBy: [
                { date: 'asc' },
                { period: 'asc' }
            ]
        })

        if (exams.length === 0 && !searchParams.get("year")) {
            const latestCycle = await prisma.examSchedule.findFirst({
                where: { examType: String(type) },
                select: { year: true, semester: true },
                orderBy: [
                    { year: "desc" },
                    { semester: "desc" },
                    { date: "desc" },
                    { period: "desc" },
                ],
            })

            if (latestCycle) {
                exams = await prisma.examSchedule.findMany({
                    where: {
                        year: latestCycle.year,
                        semester: latestCycle.semester,
                        examType: String(type),
                    },
                    orderBy: [
                        { date: "asc" },
                        { period: "asc" },
                    ],
                })
            }
        }

        return NextResponse.json({ exams })
    } catch (error) {
        console.error("Error fetching exams:", error)
        return NextResponse.json({ error: "Failed to fetch exams" }, { status: 500 })
    }
}
