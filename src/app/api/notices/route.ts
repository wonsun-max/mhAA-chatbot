import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

        // @ts-ignore - Prisma type issue in IDE (Verified in Production Build)
        const notices = await prisma.notice.findMany({
            where: {
                isVisible: true,
                ...(category ? { category } : {}),
            },
            orderBy: {
                createdAt: "desc",
            },
            take: limit,
        });

        return NextResponse.json(notices);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch notices" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, content, category } = await req.json();

        if (!title || !content || !category) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // @ts-ignore - Prisma type issue in IDE (Verified in Production Build)
        const notice = await prisma.notice.create({
            data: {
                title,
                content,
                category,
                authorId: session.user.id,
            },
        });

        return NextResponse.json(notice);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create notice" }, { status: 500 });
    }
}
