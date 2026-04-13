import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * Handle POST: Create new exam schedule entry
 */
export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    try {
        const { examType, semester, year, date, dayOfWeek, period, time, subject, grades } = await req.json()

        if (!examType || !semester || !year || !date || !dayOfWeek || !period || !time || !subject || !grades) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const examEntry = await prisma.examSchedule.create({
            data: {
                examType,
                semester: String(semester),
                year: Number(year),
                date,
                dayOfWeek,
                period: Number(period),
                time,
                subject,
                grades: Array.isArray(grades) ? grades : grades.split(",").map((g: string) => g.trim()),
            },
        })

        return NextResponse.json({ exam: examEntry })
    } catch (error) {
        console.error("Error creating exam entry:", error)
        return NextResponse.json({ error: "Failed to create exam entry" }, { status: 500 })
    }
}

/**
 * Handle GET: Fetch all exam entries for admin management
 */
export async function GET(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    try {
        const { searchParams } = new URL(req.url)
        const year = searchParams.get("year")
        const type = searchParams.get("type")
        
        let queryOptions: any = {
            orderBy: [
                { year: 'desc' },
                { semester: 'desc' },
                { date: 'asc' },
                { period: 'asc' }
            ]
        }
        
        const filter: any = {}
        if (year) filter.year = Number(year)
        if (type) filter.examType = type
        
        if (Object.keys(filter).length > 0) {
            queryOptions.where = filter
        }

        const exams = await prisma.examSchedule.findMany(queryOptions)

        return NextResponse.json({ exams })
    } catch (error) {
        console.error("Error fetching exams:", error)
        return NextResponse.json({ error: "Failed to fetch exams" }, { status: 500 })
    }
}

/**
 * Handle DELETE: Remove an exam entry
 */
export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "Missing exam ID" }, { status: 400 })
        }

        await prisma.examSchedule.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting exam entry:", error)
        return NextResponse.json({ error: "Failed to delete exam entry" }, { status: 500 })
    }
}
