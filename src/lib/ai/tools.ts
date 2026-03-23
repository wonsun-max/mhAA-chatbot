import { z } from "zod";
import { tool, zodSchema } from "ai";
import { prisma } from "@/lib/prisma";

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
            
            const where: any = {};
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

            const where: any = {};
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
            const where: any = {};
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
};
