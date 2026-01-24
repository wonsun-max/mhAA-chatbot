import Airtable from "airtable";

const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });
export const base = airtable.base(process.env.AIRTABLE_BASE_ID || "");

export const tables = {
    STUDENT_DIRECTORY: "Student_Directory",
    MEALS: "Meals",
    SCHEDULES: "Schedules",
    EVENTS: "Events",
};
