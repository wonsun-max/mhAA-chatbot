import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        
        const notice = await prisma.notice.findUnique({
            where: { id },
        });

        if (!notice) {
            return NextResponse.json({ error: "Notice not found" }, { status: 404 });
        }

        return NextResponse.json(notice);
    } catch (error) {
        console.error("Failed to fetch notice:", error);
        return NextResponse.json({ error: "Failed to fetch notice" }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, content, category, isVisible, isPinned } = await req.json();
        const safeTitle = typeof title === "string" ? title.trim() : undefined;
        const safeContent = typeof content === "string" ? content.trim() : undefined;
        const safeCategory = typeof category === "string" ? category.trim() : undefined;

        const notice = await prisma.notice.update({
            where: { id },
            data: {
                ...(safeTitle && { title: safeTitle }),
                ...(safeContent && { content: safeContent }),
                ...(safeCategory && { category: safeCategory }),
                ...(isVisible !== undefined && { isVisible }),
                ...(isPinned !== undefined && { isPinned }),
            },
        });

        return NextResponse.json(notice);
    } catch (error) {
        console.error("Failed to update notice:", error);
        return NextResponse.json({ error: "Failed to update notice" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.notice.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete notice:", error);
        return NextResponse.json({ error: "Failed to delete notice" }, { status: 500 });
    }
}

