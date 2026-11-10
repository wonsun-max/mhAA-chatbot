import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getApprovedSession } from "@/lib/auth"
import { logger } from "@/lib/logger"

export async function GET() {
    try {
        const session = await getApprovedSession()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const events = await prisma.schoolCalendar.findMany({
            orderBy: { startDate: 'asc' }
        })

        return NextResponse.json({ events })
    } catch (error) {
        logger.error("Error fetching calendar events", error)
        return NextResponse.json({ error: "Failed to fetch calendar events" }, { status: 500 })
    }
}
