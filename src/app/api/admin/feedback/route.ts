import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type"); // IDEA | BUG
        const status = searchParams.get("status"); // PENDING | REVIEWED | RESOLVED

        const feedbacks = await prisma.feedback.findMany({
            where: {
                ...(type ? { type: type as any } : {}),
                ...(status ? { status: status as any } : {}),
            },
            include: {
                user: {
                    select: {
                        name: true,
                        nickname: true,
                        email: true,
                        grade: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({ feedbacks });
    } catch (error: any) {
        console.error("Admin feedback fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch feedbacks" }, { status: 500 });
    }
}
