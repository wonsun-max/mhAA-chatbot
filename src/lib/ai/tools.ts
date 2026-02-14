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
            let formula = "";
            if (date) {
                formula = `IS_SAME({Date}, '${date}', 'day')`;
            } else if (startDate && endDate) {
                formula = `AND(IS_AFTER({Date}, DATEADD('${startDate}', -1, 'days')), IS_BEFORE({Date}, DATEADD('${endDate}', 1, 'days')))`;
            } else if (startDate) {
                formula = `IS_AFTER({Date}, DATEADD('${startDate}', -1, 'days'))`;
            }

            return await getRecords(tables.MEALS, { 
                filterByFormula: formula,
                sort: [{ field: "Date", direction: "asc" }]
            });
        },
    }),
    getSchedules: tool({
        description: "Fetch class schedules. You can filter by grade, day of week, teacher, or subject.",
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
                // Handle common variations for day of week. Note: Schedules uses 'Day of week'
                filters.push(`OR({Day of week} = '${dayOfWeek}', {Day of week} = '${dayOfWeek}요일')`);
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

