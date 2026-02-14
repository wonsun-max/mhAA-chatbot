import Airtable from "airtable";

const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });
export const base = airtable.base(process.env.AIRTABLE_BASE_ID || "");

export const tables = {
    STUDENT_DIRECTORY: "Student_Directory",
    EVENTS: "Events",
    MEALS: "Meals",
    SCHEDULES: "Schedules",
};

export async function getRecords(tableName: string, options: { filterByFormula?: string; sort?: { field: string; direction: 'asc' | 'desc' }[] } = {}) {
    try {
        const records = await base(tableName)
            .select({
                filterByFormula: options.filterByFormula,
                sort: options.sort,
            })
            .all();
        return records.map((record) => ({
            id: record.id,
            ...record.fields,
        }));
    } catch (error) {
        console.error(`Error fetching records from ${tableName}:`, error);
        throw error;
    }
}
