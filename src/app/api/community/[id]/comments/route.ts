import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: postId } = await params;
    const { content, parentId } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post || post.isDeleted) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (parentId) {
      // Validate parent comment exists and belongs to this post
      const parentComment = await prisma.comment.findUnique({ where: { id: parentId } });
      if (!parentComment || parentComment.postId !== postId || parentComment.isDeleted) {
        return NextResponse.json({ error: "Invalid parent comment" }, { status: 400 });
      }
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        postId,
        parentId: parentId || null,
        authorId: session.user.id,
        authorNickname: (session.user as any).nickname || session.user.name || "Anonymous",
      },
    });

    return NextResponse.json({ comment: newComment }, { status: 201 });
  } catch (error) {
    console.error("Failed to add comment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
