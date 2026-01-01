import Airtable from "airtable";

const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });
export const base = airtable.base(process.env.AIRTABLE_BASE_ID || "");

export const tables = {
    STUDENT_DIRECTORY: "Student_Directory",
    MEALS: "Meals",
    SCHEDULES: "Schedules",
    EVENTS: "Events",
};

/**
 * Maps a user's email to a Student_Ref_ID from Airtable
 */
export async function getStudentRefIdByEmail(email: string) {
    const records = await base(tables.STUDENT_DIRECTORY)
        .select({
            filterByFormula: `{Email} = '${email}'`,
            maxRecords: 1,
        })
        .firstPage();

    return records.length > 0 ? records[0].get("Student_Ref_ID") as string : null;
}

/**
 * Gets student context by Ref ID
 */
export async function getStudentContext(refId: string) {
    const records = await base(tables.STUDENT_DIRECTORY)
        .select({
            filterByFormula: `{Student_Ref_ID} = '${refId}'`,
            maxRecords: 1,
        })
        .firstPage();

    if (records.length === 0) return null;

    const record = records[0];
    return {
        displayName: record.get("Display_Name") as string,
        grade: record.get("Grade") as string,
        country: record.get("Missionary_Country") as string,
    };
}
