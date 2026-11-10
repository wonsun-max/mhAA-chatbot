import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { logger } from "@/lib/logger";

/**
 * Lists users for Admin UserManager filtered by status (defaults to PENDING).
 * Explicitly omits passwordHash and sensitive fields.
 */
export async function GET(request: Request) {
    try {
        const session = await getAdminSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const statusParam = searchParams.get("status");
        const statusFilter =
            statusParam === "APPROVED" || statusParam === "SUSPENDED"
                ? statusParam
                : "PENDING";

        const users = await prisma.user.findMany({
            where: { status: statusFilter },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                nickname: true,
                email: true,
                role: true,
                grade: true,
                qtGroup: true,
                status: true,
                createdAt: true,
            },
        });

        return NextResponse.json(users);
    } catch (error) {
        logger.error("Error fetching users", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
