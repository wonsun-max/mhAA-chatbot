import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getApprovedSession } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getApprovedSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingPost = await prisma.post.findUnique({
      where: { id },
      select: { isDeleted: true }
    });

    if (!existingPost || existingPost.isDeleted) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Increment view count and fetch post in a single atomic operation
    const post = await prisma.post.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
      include: {
        _count: {
          select: { likes: true },
        },
        comments: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Mask soft-deleted comment payloads before sending over network
    const sanitizedPost = {
      ...post,
      comments: post.comments.map((c) =>
        c.isDeleted
          ? { ...c, content: "", authorNickname: null }
          : c
      ),
    };

    let hasLiked = false;
    if (session?.user?.id) {
      const like = await prisma.postLike.findUnique({
        where: {
          postId_userId: {
            postId: id,
            userId: session.user.id,
          },
        },
      });
      hasLiked = !!like;
    }

    return NextResponse.json({ post: sanitizedPost, hasLiked });
  } catch (error) {
    logger.error("Failed to fetch post", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getApprovedSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post || post.isDeleted) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const userRole = session.user.role;
    // Check if owner or ADMIN
    if (post.authorId !== session.user.id && userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.post.update({
      where: { id },
      data: { isDeleted: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Failed to delete post", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
