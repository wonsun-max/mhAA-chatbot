import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    const session = await getServerSession(authOptions)

    if (session?.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const [totalUsers, pendingUsers, totalNotices] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { status: "PENDING" } }),
            prisma.notice.count()
        ])

        return NextResponse.json({
            stats: {
                totalUsers,
                pendingUsers,
                totalNotices,
            }
        })
    } catch (error) {
        console.error("Dashboard stats error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
