import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const schedules = await prisma.timetable.findMany({
        select: { subject: true },
        distinct: ['subject'],
    });
    
    const subjects = schedules.map(s => s.subject).sort();
    console.log(JSON.stringify(subjects, null, 2));
    console.log(`\nTotal: ${subjects.length} subjects`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
