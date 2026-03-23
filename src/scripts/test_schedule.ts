import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testGetSchedules(grade?: string, dayOfWeek?: string) {
    const where: any = {};
    if (grade) where.grade = grade;

    if (dayOfWeek) {
        const dayMap: Record<string, string> = {
            "월요일": "MON", "화요일": "TUE", "수요일": "WED", "목요일": "THU", "금요일": "FRI", "토요일": "SAT", "일요일": "SUN",
            "월": "MON", "화": "TUE", "수": "WED", "목": "THU", "금": "FRI", "토": "SAT", "일": "SUN",
            "MONDAY": "MON", "TUESDAY": "TUE", "WEDNESDAY": "WED", "THURSDAY": "THU", "FRIDAY": "FRI", "SATURDAY": "SAT", "SUNDAY": "SUN"
        };
        const upperDay = dayOfWeek.toUpperCase();
        const normalizedDay = dayMap[upperDay] || dayMap[dayOfWeek] || (upperDay.length > 3 ? upperDay.substring(0, 3) : upperDay);
        where.dayOfWeek = normalizedDay;
        console.log(`Input: ${dayOfWeek} -> Normalized: ${normalizedDay}`);
    }

    const results = await prisma.timetable.findMany({
        where,
        orderBy: [{ period: 'asc' }]
    });

    console.log(`Found ${results.length} results for ${grade} on ${where.dayOfWeek}`);
    if (results.length > 0) {
        console.log('First result:', results[0]);
    }
}

async function main() {
    await testGetSchedules("12-1", "Monday");
    await testGetSchedules("12-1", "월요일");
    await testGetSchedules("12-1", "Mon");
}

main().finally(() => prisma.$disconnect());
