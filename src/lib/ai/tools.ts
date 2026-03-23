import { z } from "zod";
import { tool, zodSchema } from "ai";
import { prisma } from "@/lib/prisma";

/**
 * Retrieval tools for the WITHUS AI Assistant.
 * Migrated from Airtable to Prisma/Neon for better performance and consistency.
 */
export const aiTools = {
    getEvents: tool({
        description: "Fetch school events, exams, vacations, and holidays. You can filter by date range or event type.",
        inputSchema: zodSchema(z.object({
            startDate: z.string().optional(),
            endDate: z.string().optional(),
            type: z.enum(["Exam", "Vacation", "Events", "Holiday"]).optional(),
        })),
        execute: async ({ startDate, endDate, type }) => {
            const where: any = {};
            if (startDate && endDate) {
                // (startDate <= EndDate) AND (endDate >= StartDate)
                where.OR = [
                    {
                        AND: [
                            { startDate: { lte: endDate } },
                            { endDate: { gte: startDate } }
                        ]
                    }
                ];
            } else if (startDate) {
                where.endDate = { gte: startDate };
            } else if (endDate) {
                where.startDate = { lte: endDate };
            }

            if (type) where.eventType = type;

            return await prisma.schoolCalendar.findMany({
                where,
                orderBy: { startDate: 'asc' }
            });
        },
    }),
    getMeals: tool({
        description: "Fetch school meal menus (breakfast, lunch, dinner).",
        inputSchema: zodSchema(z.object({
            date: z.string().optional(),
            startDate: z.string().optional(),
            endDate: z.string().optional(),
        })),
        execute: async ({ date, startDate, endDate }) => {
            const where: any = {};
            if (date) {
                where.date = date;
            } else if (startDate && endDate) {
                where.date = { gte: startDate, lte: endDate };
            } else if (startDate) {
                where.date = { gte: startDate };
            }

            return await prisma.schoolMeal.findMany({
                where,
                orderBy: { date: 'asc' }
            });
        },
    }),
    getSchedules: tool({
        description: "Fetch class schedules. You can filter by grade, day of week (e.g., MON, TUE, or 월요일, 화요일), teacher, or subject.",
        inputSchema: zodSchema(z.object({
            grade: z.string().optional(),
            dayOfWeek: z.string().optional(),
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
                    "MONDAY": "MON", "TUESDAY": "TUE", "WEDNESDAY": "WED", "THURSDAY": "THU", "FRIDAY": "FRI", "SATURDAY": "SAT", "SUNDAY": "SUN"
                };
                const upperDay = dayOfWeek.toUpperCase();
                const normalizedDay = dayMap[upperDay] || dayMap[dayOfWeek] || (upperDay.length > 3 ? upperDay.substring(0, 3) : upperDay);
                where.dayOfWeek = normalizedDay;
            }

            if (teacher) where.teacher = { contains: teacher, mode: 'insensitive' };
            if (subject) where.subject = { contains: subject, mode: 'insensitive' };

            return await prisma.timetable.findMany({
                where,
                orderBy: [
                    { period: 'asc' }
                ]
            });
        },
    }),
};
