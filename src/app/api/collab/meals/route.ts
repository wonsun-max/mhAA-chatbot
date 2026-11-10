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

        const meals = await prisma.schoolMeal.findMany({
            orderBy: { date: 'asc' }
        })

        return NextResponse.json({ meals })
    } catch (error) {
        logger.error("Error fetching meals", error)
        return NextResponse.json({ error: "Failed to fetch meals" }, { status: 500 })
    }
}
