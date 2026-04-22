import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const meals = await prisma.schoolMeal.findMany({
            orderBy: { date: 'asc' }
        })

        return NextResponse.json({ meals })
    } catch (error) {
        console.error("Error fetching meals:", error)
        return NextResponse.json({ error: "Failed to fetch meals" }, { status: 500 })
    }
}
