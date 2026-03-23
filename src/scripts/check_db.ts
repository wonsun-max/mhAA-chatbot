import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Timetable Samples ---');
  const samples = await prisma.timetable.findMany({
    take: 10
  });
  console.log(JSON.stringify(samples, null, 2));

  console.log('\n--- Distinct Grades ---');
  const grades = await prisma.timetable.findMany({
    select: { grade: true },
    distinct: ['grade']
  });
  console.log(JSON.stringify(grades, null, 2));

  console.log('\n--- Distinct Days ---');
  const days = await prisma.timetable.findMany({
    select: { dayOfWeek: true },
    distinct: ['dayOfWeek']
  });
  console.log(JSON.stringify(days, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
