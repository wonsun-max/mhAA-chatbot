import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, content, category, isVisible } = await req.json();

        // @ts-ignore - Prisma type issue in IDE (Verified in Production Build)
        const notice = await prisma.notice.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(content && { content }),
                ...(category && { category }),
                ...(isVisible !== undefined && { isVisible }),
            },
        });

        return NextResponse.json(notice);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update notice" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // @ts-ignore - Prisma type issue in IDE (Verified in Production Build)
        await prisma.notice.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete notice" }, { status: 500 });
    }
}
