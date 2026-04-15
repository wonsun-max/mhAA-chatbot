import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const pendingUsers = await prisma.user.findMany({
            where: { status: "PENDING" },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(pendingUsers);
    } catch (error) {
        console.error("Error fetching pending users:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
