import { base, tables } from "../airtable";

export const toolDefinitions = [
    {
        name: "get_meals",
        description: "Get the school meal menu. Defaults to today if no date provided.",
        parameters: {
            type: "object",
            properties: {
                date: { type: "string", description: "Optional: Date in YYYY-MM-DD format" },
            },
        },
    },
    {
        name: "get_upcoming_birthdays",
        description: "Get a list of upcoming student birthdays for the next week or month.",
        parameters: {
            type: "object",
            properties: {
                limit: { type: "integer", description: "Number of birthdays to show (default 5)" },
            },
        },
    },
    {
        name: "get_stats",
        description: "Get statistics about the student body (e.g., student counts by grade or country).",
        parameters: {
            type: "object",
            properties: {
                grade: { type: "string" },
                country: { type: "string" },
            },
        },
    },
    {
        name: "get_schedule",
        description: "Get the school schedule for a specific grade.",
        parameters: {
            type: "object",
            properties: {
                Grade: { type: "string" },
            },
            required: ["Grade"],
        },
    },
    {
        name: "get_upcoming_events",
        description: "Get the list of upcoming school events or holidays (학교 일정).",
        parameters: {
            type: "object",
            properties: {},
        },
    },
];

export const aiTools = {
    get_meals: async ({ date }: { date?: string }) => {
        try {
            const targetDate = date || new Date().toISOString().split('T')[0];
            const records = await base(tables.MEALS)
                .select({ filterByFormula: `IS_SAME({Date}, '${targetDate}', 'day')` })
                .firstPage();
            if (records.length === 0) return `No meal data available for ${targetDate}.`;

            const record = records[0];
            const menu = record.get("Menu");
            const day = record.get("Day of Week");

            let response = `**${day || 'Menu'} (${targetDate})**\n\n`;
            response += `${menu}\n`;

            return response;
        } catch {
            return "Error fetching meal data.";
        }
    },

    get_upcoming_birthdays: async ({ limit = 5 }: { limit?: number }) => {
        try {
            const records = await base(tables.STUDENT_DIRECTORY).select({
                fields: ["English_name", "Korean_Name", "Birth(birthday)"],
            }).all();

            const today = new Date();
            const currentMonth = today.getMonth() + 1;
            const currentDay = today.getDate();

            const students = records.map(r => {
                const birthStr = r.get("Birth(birthday)") as string;
                if (!birthStr) return null;
                // Airtable dates are YYYY-MM-DD
                const parts = birthStr.split('-');
                if (parts.length < 3) return null;
                
                return {
                    name: (r.get("English_name") || r.get("Korean_Name")) as string,
                    month: parseInt(parts[1], 10),
                    day: parseInt(parts[2], 10),
                };
            }).filter((s): s is { name: string; month: number; day: number } => s !== null);

            // Sort by month then day, relative to today
            students.sort((a, b) => {
                const aVal = a.month * 100 + a.day;
                const bVal = b.month * 100 + b.day;
                const todayVal = currentMonth * 100 + currentDay;

                const aRelative = aVal >= todayVal ? aVal : aVal + 1200;
                const bRelative = bVal >= todayVal ? bVal : bVal + 1200;

                return aRelative - bRelative;
            });

            const upcoming = students.slice(0, limit);
            if (upcoming.length === 0) return "No student birthdays found in the directory.";

            return upcoming.map(s => `- ${s.name}: ${s.month}/${s.day}`).join("\n");
        } catch (error) {
            console.error("Birthday fetch error:", error);
            return "Error fetching birthday data.";
        }
    },

    get_stats: async ({ grade, country }: { grade?: string; country?: string }) => {
        try {
            let formula = "TRUE()";
            if (grade) formula = `AND(${formula}, {Grade} = '${grade}')`;
            if (country) formula = `AND(${formula}, {Missionary_Country} = '${country}')`;

            const records = await base(tables.STUDENT_DIRECTORY)
                .select({ filterByFormula: formula })
                .all();
            return `Count: ${records.length}`;
        } catch {
            return "Error fetching statistics.";
        }
    },

    get_schedule: async ({ Grade }: { Grade: string }) => {
        try {
            const records = await base(tables.SCHEDULES)
                .select({
                    filterByFormula: `{Grade} = '${Grade}'`,
                    sort: [{ field: "Period", direction: "asc" }]
                })
                .all();
            if (records.length === 0) return `No schedule data available for grade ${Grade}.`;
            
            return records.map(r => {
                const subject = r.get("Subject");
                const period = r.get("Period");
                const time = r.get("Time");
                const teacher = r.get("Teacher");
                const day = r.get("Day of week");

                return `- [${day}] Period ${period}${time ? ` (${time})` : ""}: **${subject}**${teacher ? ` - ${teacher}` : ""}`;
            }).join("\n");
        } catch {
            return "Error fetching schedule.";
        }
    },

    get_upcoming_events: async () => {
        try {
            const formula = "OR(IS_AFTER({Start_Date}, TODAY()), IS_SAME({Start_Date}, TODAY()))";

            const records = await base(tables.EVENTS)
                .select({
                    filterByFormula: formula,
                    sort: [{ field: "Start_Date", direction: "asc" }],
                    maxRecords: 10,
                })
                .firstPage();

            if (records.length === 0) return "No upcoming school events found.";

            return records.map(r => {
                const name = r.get("Name");
                const type = r.get("Event_Type");
                const start = r.get("Start_Date");
                const end = r.get("End_Date");

                return `- [${type || 'Event'}] ${name}: ${start}${end ? ` to ${end}` : ""}`;
            }).join("\n");
        } catch {
            return "Error fetching event data.";
        }
    },
};
