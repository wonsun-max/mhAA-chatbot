import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                createdAt: true,
                status: true,
                grade: true,
            }
        })

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

        const chatCount = await prisma.chatLog.count({
            where: { userId }
        })

        const stats = {
            totalChats: chatCount,
            memberSince: user.createdAt.toISOString(),
            status: user.status,
            grade: user.grade || "미지정"
        }

        return NextResponse.json(stats)
    } catch (error) {
        console.error("Error fetching user stats:", error)
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
    }
}
