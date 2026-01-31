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

/**
 * Retrieval tools for the MissionLink School Assistant.
 * These tools bridge the Large Language Model with Airtable data sources.
 */
export const aiTools = {
    /**
     * Fetches the school meal menu for a specific date or today.
     * @param {Object} params - Tool parameters.
     * @param {string} [params.date] - Optional date in YYYY-MM-DD format.
     * @returns {Promise<string>} Formatted meal description or error message.
     */
    get_meals: async ({ date }: { date?: string }): Promise<string> => {
        try {
            const targetDate = date || new Date().toISOString().split('T')[0];
            const records = await base(tables.MEALS)
                .select({ filterByFormula: `IS_SAME({Date}, '${targetDate}', 'day')` })
                .firstPage();

            if (records.length === 0) return `System Report: No meal data found for ${targetDate}.`;

            const record = records[0];
            const menu = record.get("Menu") as string;
            const day = record.get("Day of Week") as string;

            return `**${day || 'Menu'} (${targetDate})**\n\n${menu}`;
        } catch (error) {
            console.error("[aiTools] get_meals error:", error);
            return "System Error: Unable to retrieve meal data at this time.";
        }
    },

    /**
     * Retrieves a list of upcoming student birthdays.
     * @param {Object} params - Tool parameters.
     * @param {number} [params.limit=5] - Number of birthdays to return.
     * @returns {Promise<string>} List of upcoming birthdays or error message.
     */
    get_upcoming_birthdays: async ({ limit = 5 }: { limit?: number }): Promise<string> => {
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
                const parts = birthStr.split('-');
                if (parts.length < 3) return null;

                return {
                    name: (r.get("English_name") || r.get("Korean_Name") || "Unknown Student") as string,
                    month: parseInt(parts[1], 10),
                    day: parseInt(parts[2], 10),
                };
            }).filter((s): s is { name: string; month: number; day: number } => s !== null);

            students.sort((a, b) => {
                const aVal = a.month * 100 + a.day;
                const bVal = b.month * 100 + b.day;
                const todayVal = currentMonth * 100 + currentDay;

                const aRelative = aVal >= todayVal ? aVal : aVal + 1200;
                const bRelative = bVal >= todayVal ? bVal : bVal + 1200;

                return aRelative - bRelative;
            });

            const upcoming = students.slice(0, limit);
            if (upcoming.length === 0) return "System Report: No student birthdays found in the directory.";

            return upcoming.map(s => `- ${s.name}: ${s.month}/${s.day}`).join("\n");
        } catch (error) {
            console.error("[aiTools] get_upcoming_birthdays error:", error);
            return "System Error: Unable to fetch birthday data.";
        }
    },

    /**
     * Fetches basic student body statistics.
     * @param {Object} params - Tool parameters.
     * @param {string} [params.grade] - Filter by grade level.
     * @param {string} [params.country] - Filter by missionary country.
     * @returns {Promise<string>} Textual representation of the stats.
     */
    get_stats: async ({ grade, country }: { grade?: string; country?: string }): Promise<string> => {
        try {
            let formula = "TRUE()";
            if (grade) formula = `AND(${formula}, {Grade} = '${grade}')`;
            if (country) formula = `AND(${formula}, {Missionary_Country} = '${country}')`;

            const records = await base(tables.STUDENT_DIRECTORY)
                .select({ filterByFormula: formula })
                .all();
            return `System Statistics: Total matching students: ${records.length}`;
        } catch (error) {
            console.error("[aiTools] get_stats error:", error);
            return "System Error: Unable to calculate statistics.";
        }
    },

    /**
     * Retrieves the school schedule for a specific grade level.
     * @param {Object} params - Tool parameters.
     * @param {string} params.Grade - The target grade level.
     * @returns {Promise<string>} Formatted schedule list.
     */
    get_schedule: async ({ Grade }: { Grade: string }): Promise<string> => {
        try {
            const records = await base(tables.SCHEDULES)
                .select({
                    filterByFormula: `{Grade} = '${Grade}'`,
                    sort: [{ field: "Period", direction: "asc" }]
                })
                .all();

            if (records.length === 0) return `System Report: No schedule data available for grade ${Grade}.`;

            return records.map(r => {
                const subject = r.get("Subject");
                const period = r.get("Period");
                const time = r.get("Time");
                const teacher = r.get("Teacher");
                const day = r.get("Day of week");

                return `- [${day}] Period ${period}${time ? ` (${time})` : ""}: **${subject}**${teacher ? ` - ${teacher}` : ""}`;
            }).join("\n");
        } catch (error) {
            console.error("[aiTools] get_schedule error:", error);
            return "System Error: Failed to retrieve schedule.";
        }
    },

    /**
     * Fetches upcoming school events and holidays.
     * @returns {Promise<string>} List of upcoming events.
     */
    get_upcoming_events: async (): Promise<string> => {
        try {
            const formula = "OR(IS_AFTER({Start_Date}, TODAY()), IS_SAME({Start_Date}, TODAY()))";

            const records = await base(tables.EVENTS)
                .select({
                    filterByFormula: formula,
                    sort: [{ field: "Start_Date", direction: "asc" }],
                    maxRecords: 10,
                })
                .firstPage();

            if (records.length === 0) return "System Report: No upcoming school events or holidays found.";

            return records.map(r => {
                const name = r.get("Name");
                const type = r.get("Event_Type");
                const start = r.get("Start_Date");
                const end = r.get("End_Date");

                return `- [${type || 'Event'}] ${name}: ${start}${end ? ` to ${end}` : ""}`;
            }).join("\n");
        } catch (error) {
            console.error("[aiTools] get_upcoming_events error:", error);
            return "System Error: Unable to fetch school calendar events.";
        }
    },
};

