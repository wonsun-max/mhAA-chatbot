import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Verify path to authOptions
import type { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(Number.parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.min(Math.max(Number.parseInt(searchParams.get("limit") || "20", 10), 1), 100);
    const authorId = searchParams.get("authorId");
    const skip = (page - 1) * limit;

    const where: Prisma.PostWhereInput = { isDeleted: false };
    if (authorId) {
      where.authorId = authorId;
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        authorNickname: true,
        viewCount: true,
        createdAt: true,
        _count: {
          select: { comments: { where: { isDeleted: false } }, likes: true },
        },
      },
    });

    const totalCount = await prisma.post.count({ where });

    return NextResponse.json({
      posts,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch community posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only approved users can post
    const status = session.user.status;
    if (status && status !== "APPROVED") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { title, content } = await req.json();
    const safeTitle = typeof title === "string" ? title.trim() : "";
    const safeContent = typeof content === "string" ? content.trim() : "";

    if (!safeTitle || !safeContent) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const newPost = await prisma.post.create({
      data: {
        title: safeTitle,
        content: safeContent,
        authorId: session.user.id,
        authorNickname: session.user.nickname || session.user.name || "Anonymous",
      },
    });

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
