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
            properties: {
                Grade: { type: "string", description: "Optional: Filter events by grade" },
            },
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
            const summary = record.get("Meal Summary");
            const tags = record.get("Meal Tags");
            const day = record.get("Day of Week");

            let response = `**${day || 'Menu'} (${targetDate})**\n`;
            if (summary) response += `✨ *${summary}* (Summary)\n\n`;
            response += `${menu}\n`;
            if (tags && (tags as string[]).length > 0) {
                response += `\n🏷️ Tags: ${(tags as string[]).join(", ")}`;
            }

            return response;
        } catch {
            return "Error fetching meal data.";
        }
    },

    get_upcoming_birthdays: async ({ limit = 5 }: { limit?: number }) => {
        try {
            // Fetch all students and filter/sort in JS since Airtable complex date math is tricky
            const records = await base(tables.STUDENT_DIRECTORY).select({
                fields: ["Display_Name", "Birthday_Month", "Birthday_Day"],
            }).all();

            const today = new Date();
            const currentMonth = today.getMonth() + 1;
            const currentDay = today.getDate();

            const students = records.map(r => ({
                name: r.get("Display_Name") as string,
                month: r.get("Birthday_Month") as number,
                day: r.get("Birthday_Day") as number,
            })).filter(s => s.month && s.day);

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
        } catch {
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
                .select({ filterByFormula: `{Grade} = '${Grade}'` })
                .all();
            if (records.length === 0) return "No schedule data available for this grade.";
            return records.map(r => {
                const subject = r.get("Subject");
                const period = r.get("Period");
                const time = r.get("Time");
                const teacher = r.get("Teacher");
                const room = r.get("Room");
                const summary = r.get("Schedule Summary");

                let line = `- **${subject}**${time ? ` (${time})` : ""}${teacher ? ` - ${teacher}` : ""}`;
                if (room) line += ` @ ${room}`;
                line += ` [Period ${period}]`;
                if (summary) line += `\n  - ${summary}`;
                return line;
            }).join("\n");
        } catch {
            return "Error fetching schedule.";
        }
    },

    get_upcoming_events: async ({ Grade }: { Grade?: string }) => {
        try {
            let formula = "OR(IS_AFTER({Start_Date}, TODAY()), AND(IS_BEFORE({Start_Date}, TODAY()), IS_AFTER({End_Date}, TODAY())))";

            if (Grade) {
                // Check if the event's Associated_Grades contains the requested Grade
                formula = `AND(${formula}, SEARCH('${Grade}', {Associated_Grades}))`;
            }

            const records = await base(tables.EVENTS)
                .select({
                    filterByFormula: formula,
                    sort: [{ field: "Start_Date", direction: "asc" }],
                    maxRecords: 10,
                })
                .firstPage();

            if (records.length === 0) return Grade ? `No upcoming school events found for Grade ${Grade}.` : "No upcoming school events found.";

            return records.map(r => {
                const name = r.get("Name");
                const type = r.get("Event_Type");
                const start = r.get("Start_Date");
                const end = r.get("End_Date");
                const desc = r.get("Description");

                let line = `- [${type || 'Event'}] ${name}: ${start}${end ? ` to ${end}` : ""}`;
                if (desc) line += `\n  - ${desc}`;
                return line;
            }).join("\n");
        } catch {
            return "Error fetching event data.";
        }
    },
};
