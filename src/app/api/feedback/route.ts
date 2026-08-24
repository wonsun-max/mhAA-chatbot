import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();

        const { type, content, contact } = body;

        const safeContent = typeof content === "string" ? content.trim() : "";
        if (!safeContent) {
            return NextResponse.json({ error: "내용을 입력해 주세요." }, { status: 400 });
        }

        const validTypes = ["IDEA", "BUG"];
        const feedbackType = validTypes.includes(type) ? type : "IDEA";

        // Extract contact info if logged in or provided
        let userContact = typeof contact === "string" ? contact.trim() : null;
        if (!userContact && session?.user?.email) {
            userContact = `${session.user.name || session.user.nickname || "학생"} (${session.user.email})`;
        }

        const feedback = await prisma.feedback.create({
            data: {
                type: feedbackType as "IDEA" | "BUG",
                content: safeContent,
                contact: userContact,
                userId: session?.user?.id || null,
            },
        });

        return NextResponse.json({
            success: true,
            message: "소중한 의견이 등록되었습니다. 감사합니다!",
            feedback,
        });
    } catch (error: any) {
        console.error("Feedback submission error:", error);
        return NextResponse.json({ error: "의견 등록 중 오류가 발생했습니다." }, { status: 500 });
    }
}
