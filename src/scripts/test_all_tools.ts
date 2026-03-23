import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function normalizeDate(dateStr?: string): string | undefined {
    if (!dateStr) return undefined;
    return dateStr.split('T')[0];
}

async function testMealQuery(isoDate: string) {
    const d = normalizeDate(isoDate);
    console.log(`Querying meals for: ${d} (from ${isoDate})`);
    
    const results = await prisma.schoolMeal.findMany({
        where: { date: d }
    });
    
    console.log(`Found ${results.length} meals.`);
}

async function testEventQuery(isoStart: string, isoEnd: string) {
    const s = normalizeDate(isoStart);
    const e = normalizeDate(isoEnd);
    console.log(`Querying events between: ${s} and ${e}`);
    
    // Overlap logic: (startDate <= queryEnd) AND (endDate >= queryStart)
    const results = await prisma.schoolCalendar.findMany({
        where: {
            OR: [
                {
                    AND: [
                        { startDate: { lte: e } },
                        { endDate: { gte: s } }
                    ]
                }
            ]
        }
    });
    
    console.log(`Found ${results.length} events.`);
}

async function main() {
    // Current date for simulation
    const todayISO = "2026-03-23T11:41:16.000Z";
    await testMealQuery(todayISO);
    await testEventQuery("2026-03-01T00:00:00Z", "2026-03-31T23:59:59Z");
}

main().finally(() => prisma.$disconnect());
