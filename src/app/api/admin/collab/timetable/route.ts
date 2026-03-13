import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Handle POST: Create new timetable entry
export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    try {
        const { grade, dayOfWeek, period, time, subject, teacher } = await req.json()

        if (!grade || !dayOfWeek || !period || !time || !subject || !teacher) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const ttEntry = await prisma.timetable.create({
            data: {
                grade,
                dayOfWeek,
                period,
                time,
                subject,
                teacher,
            },
        })

        return NextResponse.json({ timetable: ttEntry })
    } catch (error) {
        console.error("Error creating timetable entry:", error)
        return NextResponse.json({ error: "Failed to create timetable entry" }, { status: 500 })
    }
}

// Handle GET: Fetch all timetable entries
export async function GET(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    try {
        const { searchParams } = new URL(req.url)
        const gradeFilter = searchParams.get("grade")
        
        let queryOptions: any = {
            orderBy: [
                { grade: 'asc' },
                { dayOfWeek: 'asc' },
                { period: 'asc' }
            ]
        }
        
        if (gradeFilter) {
             queryOptions.where = { grade: gradeFilter }
        }

        const timetables = await prisma.timetable.findMany(queryOptions)

        return NextResponse.json({ timetables })
    } catch (error) {
        console.error("Error fetching timetables:", error)
        return NextResponse.json({ error: "Failed to fetch timetables" }, { status: 500 })
    }
}

// Handle DELETE: Remove a timetable entry
export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "Missing timetable ID" }, { status: 400 })
        }

        await prisma.timetable.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting timetable entry:", error)
        return NextResponse.json({ error: "Failed to delete timetable entry" }, { status: 500 })
    }
}
