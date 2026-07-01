import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAcademicSemester, getAcademicYear } from "@/lib/academic-calendar";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const grade = searchParams.get("grade");
        const year = Number(searchParams.get("year") || getAcademicYear());
        const semester = searchParams.get("semester") || getAcademicSemester();

        if (!grade) {
            return NextResponse.json({ error: "grade is required" }, { status: 400 });
        }

        const subjects = await prisma.subjectCredit.findMany({
            where: { grade, year, semester: String(semester) },
            orderBy: { subject: "asc" },
        });

        // Fallback: if current year/semester has no data, return any available data
        if (subjects.length === 0) {
            const latest = await prisma.subjectCredit.findFirst({
                where: { grade },
                orderBy: [{ year: "desc" }, { semester: "desc" }],
                select: { year: true, semester: true },
            });
            if (latest) {
                const fallback = await prisma.subjectCredit.findMany({
                    where: { grade, year: latest.year, semester: latest.semester },
                    orderBy: { subject: "asc" },
                });
                return NextResponse.json({ subjects: fallback, year: latest.year, semester: latest.semester });
            }
        }

        return NextResponse.json({ subjects, year, semester });
    } catch (error) {
        console.error("Error fetching GPA subjects:", error);
        return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 });
    }
}
