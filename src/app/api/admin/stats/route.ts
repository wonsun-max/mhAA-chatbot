import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any)?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const [totalUsers, pendingUsers, totalNotices] = await Promise.all([
            // @ts-ignore
            prisma.user.count(),
            // @ts-ignore
            prisma.user.count({ where: { status: "PENDING" } }),
            // @ts-ignore
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
