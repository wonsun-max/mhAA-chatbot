import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Endpoint to check current user's live database status.
 * Used for real-time approval detection on the pending page and session sync.
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                email: true,
                name: true,
                status: true,
                role: true,
                grade: true,
                nickname: true,
                qtGroup: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            user,
            isApproved: user.status === "APPROVED",
        });
    } catch (error) {
        console.error("[User Status API Error]:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
