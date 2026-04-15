import { z } from "zod";
import { tool, zodSchema } from "ai";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { getAcademicSemester, getAcademicYear } from "@/lib/academic-calendar";
import { matchesExamGrade } from "@/lib/exam-grade";

/**
 * Normalizes a date string to YYYY-MM-DD format.
 */
function normalizeDate(dateStr?: string): string | undefined {
    if (!dateStr) return undefined;
    return dateStr.split('T')[0];
}

/**
 * Normalizes a subject name for fuzzy matching (lowercase, no special chars).
 */
function normalizeSubject(s?: string): string {
    if (!s) return "";
    return s.toLowerCase().replace(/[^a-zA-Z0-9가-힣]/g, "");
}

/**
 * Retrieval tools for the WITHUS AI Assistant.
 * Migrated from Airtable to Prisma/Neon for better performance and consistency.
 */
export const aiTools = {
    getEvents: tool({
        description: "Fetch school events, exams, vacations, and holidays. Use YYYY-MM-DD format for dates.",
        inputSchema: zodSchema(z.object({
            startDate: z.string().optional().describe("Start date in YYYY-MM-DD format"),
            endDate: z.string().optional().describe("End date in YYYY-MM-DD format"),
            type: z.enum(["Exam", "Vacation", "Events", "Holiday"]).optional(),
        })),
        execute: async ({ startDate, endDate, type }) => {
            const start = normalizeDate(startDate);
            const end = normalizeDate(endDate);
            
            const where: Prisma.SchoolCalendarWhereInput = {};
            if (start && end) {
                where.OR = [
                    {
                        AND: [
                            { startDate: { lte: end } },
                            { endDate: { gte: start } }
                        ]
                    }
                ];
            } else if (start) {
                where.endDate = { gte: start };
            } else if (end) {
                where.startDate = { lte: end };
            }

            if (type) where.eventType = type;

            return await prisma.schoolCalendar.findMany({
                where,
                orderBy: { startDate: 'asc' }
            });
        },
    }),
    getMeals: tool({
        description: "Fetch school meal menus (breakfast, lunch, dinner). Use YYYY-MM-DD format for dates.",
        inputSchema: zodSchema(z.object({
            date: z.string().optional().describe("Specific date in YYYY-MM-DD format"),
            startDate: z.string().optional().describe("Start date for range in YYYY-MM-DD format"),
            endDate: z.string().optional().describe("End date for range in YYYY-MM-DD format"),
        })),
        execute: async ({ date, startDate, endDate }) => {
            const d = normalizeDate(date);
            const start = normalizeDate(startDate);
            const end = normalizeDate(endDate);

            const where: Prisma.SchoolMealWhereInput = {};
            if (d) {
                where.date = d;
            } else if (start && end) {
                where.date = { gte: start, lte: end };
            } else if (start) {
                where.date = { gte: start };
            }

            return await prisma.schoolMeal.findMany({
                where,
                orderBy: { date: 'asc' }
            });
        },
    }),
    getSchedules: tool({
        description: "Fetch class schedules. You can filter by grade (e.g., 7, 8, 12-1), day of week, teacher, or subject.",
        inputSchema: zodSchema(z.object({
            grade: z.string().optional().describe("Grade/Class, e.g., '7', '8', '12-1', '12-2'"),
            dayOfWeek: z.string().optional().describe("Day of week in Korean (월요일) or English (Monday/Mon)"),
            teacher: z.string().optional(),
            subject: z.string().optional(),
        })),
        execute: async ({ grade, dayOfWeek, teacher, subject }) => {
            const where: Prisma.TimetableWhereInput = {};
            if (grade) where.grade = grade;

            if (dayOfWeek) {
                const dayMap: Record<string, string> = {
                    "월요일": "MON", "화요일": "TUE", "수요일": "WED", "목요일": "THU", "금요일": "FRI", "토요일": "SAT", "일요일": "SUN",
                    "월": "MON", "화": "TUE", "수": "WED", "목": "THU", "금": "FRI", "토": "SAT", "일": "SUN",
                    "MONDAY": "MON", "TUESDAY": "TUE", "WEDNESDAY": "WED", "THURSDAY": "THU", "FRIDAY": "FRI", "SATURDAY": "SAT", "SUNDAY": "SUN",
                    "MON": "MON", "TUE": "TUE", "WED": "WED", "THU": "THU", "FRI": "FRI", "SAT": "SAT", "SUN": "SUN"
                };
                const upperDay = dayOfWeek.toUpperCase();
                const normalizedDay = dayMap[upperDay] || dayMap[dayOfWeek] || (upperDay.length > 3 ? upperDay.substring(0, 3) : upperDay);
                where.dayOfWeek = normalizedDay;
            }

            if (teacher) where.teacher = { contains: teacher, mode: 'insensitive' };
            
            // Fetch records for base filtering
            let records = await prisma.timetable.findMany({
                where,
                orderBy: [
                    { period: 'asc' }
                ]
            });

            // If subject is provided, perform fuzzy matching
            if (subject) {
                const querySub = normalizeSubject(subject);
                records = records.filter(r => {
                    const dbSub = normalizeSubject(r.subject);
                    // Match if query is inside db name or vice versa (fuzzy)
                    return dbSub.includes(querySub) || querySub.includes(dbSub);
                });
            }

            return records;
        },
    }),
    getExamSchedules: tool({
        description: "Fetch detailed exam schedules (Midterms/Finals). Supports grade, year, semester, and exam type filters, including multi-grade labels like 12-1, 12-2, 11-12, or All.",
        inputSchema: zodSchema(z.object({
            grade: z.string().optional().describe("Grade to filter for, e.g., '12', '12-1', or '12th grade'"),
            year: z.number().optional().describe("Academic year, e.g., 2026"),
            semester: z.string().optional().describe("Semester, '1' or '2'"),
            examType: z.enum(["MIDTERM", "FINALS"]).optional(),
        })),
        execute: async ({ grade, year, semester, examType }) => {
            const where: Prisma.ExamScheduleWhereInput = {};
            const academicYear = year ?? getAcademicYear();
            const academicSemester = semester ?? (year === undefined ? getAcademicSemester() : undefined);

            where.year = academicYear;
            if (academicSemester) where.semester = academicSemester;
            if (examType) where.examType = examType;

            let records = await prisma.examSchedule.findMany({
                where,
                orderBy: [
                    { date: 'asc' },
                    { period: 'asc' }
                ]
            });

            if (records.length === 0 && year === undefined) {
                const latestCycle = await prisma.examSchedule.findFirst({
                    where: {
                        ...(examType ? { examType } : {}),
                        ...(semester ? { semester } : {}),
                    },
                    select: { year: true, semester: true },
                    orderBy: [
                        { year: 'desc' },
                        { semester: 'desc' },
                        { date: 'desc' },
                        { period: 'desc' }
                    ]
                });

                if (latestCycle) {
                    records = await prisma.examSchedule.findMany({
                        where: {
                            year: latestCycle.year,
                            semester: semester ?? latestCycle.semester,
                            ...(examType ? { examType } : {}),
                        },
                        orderBy: [
                            { date: 'asc' },
                            { period: 'asc' }
                        ]
                    });
                }
            }

            if (grade) {
                records = records.filter((record) => matchesExamGrade(grade, record.grades));
            }

            return records;
        },
    }),
};
