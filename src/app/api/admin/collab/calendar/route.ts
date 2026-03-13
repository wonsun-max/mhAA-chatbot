import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Handle POST: Create new calendar event
export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    try {
        const { name, startDate, endDate, eventType } = await req.json()

        if (!name || !startDate || !endDate || !eventType) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const calEvent = await prisma.schoolCalendar.create({
            data: {
                name,
                startDate,
                endDate,
                eventType,
            },
        })

        return NextResponse.json({ event: calEvent })
    } catch (error) {
        console.error("Error creating calendar event:", error)
        return NextResponse.json({ error: "Failed to create calendar event" }, { status: 500 })
    }
}

// Handle GET: Fetch all calendar events
export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const events = await prisma.schoolCalendar.findMany({
            orderBy: { startDate: 'asc' }
        })

        return NextResponse.json({ events })
    } catch (error) {
        console.error("Error fetching calendar events:", error)
        return NextResponse.json({ error: "Failed to fetch calendar events" }, { status: 500 })
    }
}

// Handle DELETE: Remove a calendar event
export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "Missing event ID" }, { status: 400 })
        }

        await prisma.schoolCalendar.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting calendar event:", error)
        return NextResponse.json({ error: "Failed to delete calendar event" }, { status: 500 })
    }
}
