import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: postId, commentId } = await params;

    const comment = await prisma.comment.findUnique({ where: { id: commentId } });

    if (!comment || comment.isDeleted) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (comment.postId !== postId) {
      return NextResponse.json({ error: "Invalid comment for this post" }, { status: 400 });
    }

    const userRole = (session as any).user?.role;
    // Check if owner or ADMIN
    if (comment.authorId !== session.user.id && userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Soft delete to maintain thread integrity
    await prisma.comment.update({
      where: { id: commentId },
      data: { isDeleted: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete comment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
