import { z } from "zod";
import { tool, zodSchema } from "ai";
import { getRecords, tables } from "@/lib/airtable";

/**
 * Retrieval tools for the MissionLink AI Assistant.
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
            const filters = [];
            if (startDate && endDate) {
                // Overlapping range logic: (Start_Date <= endDate) AND (End_Date >= startDate)
                filters.push(`AND(IS_BEFORE({Start_Date}, DATEADD('${endDate}', 1, 'days')), IS_AFTER({End_Date}, DATEADD('${startDate}', -1, 'days')))`);
            } else if (startDate) {
                filters.push(`IS_AFTER({End_Date}, DATEADD('${startDate}', -1, 'days'))`);
            } else if (endDate) {
                filters.push(`IS_BEFORE({Start_Date}, DATEADD('${endDate}', 1, 'days'))`);
            }

            if (type) filters.push(`{Event_Type} = '${type}'`);

            const formula = filters.length > 0 ? `AND(${filters.join(", ")})` : "";

            return await getRecords(tables.EVENTS, {
                filterByFormula: formula,
                sort: [{ field: "Start_Date", direction: "asc" }]
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
            const filters = [];
            if (date) {
                filters.push(`IS_SAME({Date}, '${date}', 'day')`);
            } else if (startDate && endDate) {
                filters.push(`AND(IS_AFTER({Date}, DATEADD('${startDate}', -1, 'days')), IS_BEFORE({Date}, DATEADD('${endDate}', 1, 'days')))`);
            } else if (startDate) {
                filters.push(`IS_AFTER({Date}, DATEADD('${startDate}', -1, 'days'))`);
            }

            const formula = filters.length > 0 ? `AND(${filters.join(", ")})` : "";

            return await getRecords(tables.MEALS, {
                filterByFormula: formula,
                sort: [{ field: "Date", direction: "asc" }]
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
            const filters = [];
            if (grade) filters.push(`{Grade} = '${grade}'`);

            if (dayOfWeek) {
                // Map common Korean day names to English abbreviations if necessary, 
                // or just handle both as the current records show MON/FRI etc.
                const dayMap: Record<string, string> = {
                    "월요일": "MON", "화요일": "TUE", "수요일": "WED", "목요일": "THU", "금요일": "FRI", "토요일": "SAT", "일요일": "SUN",
                    "월": "MON", "화": "TUE", "수": "WED", "목": "THU", "금": "FRI", "토": "SAT", "일": "SUN"
                };
                const normalizedDay = dayMap[dayOfWeek] || dayOfWeek.toUpperCase();

                // The Airtable field is 'Day of week' (lowercase 'w')
                filters.push(`OR({Day of week} = '${normalizedDay}', {Day of week} = '${dayOfWeek}')`);
            }

            if (teacher) filters.push(`FIND('${teacher}', {Teacher})`);
            if (subject) filters.push(`FIND('${subject}', {Subject})`);

            const formula = filters.length > 0 ? `AND(${filters.join(", ")})` : "";

            return await getRecords(tables.SCHEDULES, {
                filterByFormula: formula,
                sort: [
                    { field: "Period", direction: "asc" }
                ]
            });
        },
    }),
    getStudentInfo: tool({
        description: "Search for student information by student number, grade, or sex. Note: This directory does not contain names for privacy.",
        inputSchema: zodSchema(z.object({
            number: z.string().optional(),
            grade: z.string().optional(),
            sex: z.enum(["Male", "Female"]).optional(),
        })),
        execute: async ({ number, grade, sex }) => {
            const filters = [];
            if (number) filters.push(`{number} = '${number}'`);
            if (grade) filters.push(`{Grade} = '${grade}'`);
            if (sex) filters.push(`{Sex} = '${sex}'`);

            const formula = filters.length > 0 ? `AND(${filters.join(", ")})` : "";

            return await getRecords(tables.STUDENT_DIRECTORY, {
                filterByFormula: formula,
                sort: [{ field: "Grade", direction: "asc" }, { field: "number", direction: "asc" }]
            });
        },
    }),
};

