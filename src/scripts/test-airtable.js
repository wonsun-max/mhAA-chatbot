const Airtable = require("airtable");
require("dotenv").config();

async function testAirtable() {
    console.log("--- Airtable Connection Diagnostic ---");
    console.log("Base ID:", process.env.AIRTABLE_BASE_ID);

    if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
        console.error("❌ Missing Airtable credentials in .env");
        return;
    }

    const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });
    const base = airtable.base(process.env.AIRTABLE_BASE_ID);

    const tables = [
        { name: "Student_Directory", fields: ["Email", "Student_Ref_ID", "Display_Name"] },
        { name: "Meals", fields: ["Date", "Menu"] },
        { name: "Schedules", fields: ["Grade", "Subject", "Period"] },
        { name: "Events", fields: ["Name", "Start_Date"] }
    ];

    for (const table of tables) {
        try {
            console.log(`\n🔍 Checking table: [${table.name}]...`);
            const records = await base(table.name).select({ maxRecords: 1 }).firstPage();

            if (records.length === 0) {
                console.log(`⚠️  Table exists but is EMPTY. Please add at least one row.`);
            } else {
                console.log(`✅ Table is accessible. Found ${records.length} record(s).`);
                const record = records[0];
                // Check if key fields exist
                table.fields.forEach(field => {
                    if (record.get(field) === undefined) {
                        console.error(`❌ Missing Column: [${field}] in table [${table.name}]`);
                    } else {
                        console.log(`   - Field [${field}]: OK`);
                    }
                });
            }
        } catch (error) {
            console.error(`❌ Failed to access table [${table.name}]:`, error.message);
            if (error.message.includes("NOT_FOUND")) {
                console.error(`   👉 Check if the Table Name is exactly "${table.name}" (case-sensitive)`);
            }
        }
    }
    console.log("\n--- Diagnostic Complete ---");
}

testAirtable();
