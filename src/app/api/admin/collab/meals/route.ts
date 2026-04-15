import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Handle POST: Create new meal
export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (session?.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    try {
        const { date, dayOfWeek, menu } = await req.json()

        if (!date || !dayOfWeek || !menu) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const mealData = await prisma.schoolMeal.create({
            data: {
                date,
                dayOfWeek,
                menu,
            },
        })

        return NextResponse.json({ meal: mealData })
    } catch (error) {
        console.error("Error creating meal:", error)
        return NextResponse.json({ error: "Failed to create meal" }, { status: 500 })
    }
}

// Handle GET: Fetch meals
export async function GET() {
    const session = await getServerSession(authOptions)

    if (session?.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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

// Handle DELETE: Remove a meal
export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions)

    if (session?.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "Missing meal ID" }, { status: 400 })
        }

        await prisma.schoolMeal.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting meal:", error)
        return NextResponse.json({ error: "Failed to delete meal" }, { status: 500 })
    }
}
