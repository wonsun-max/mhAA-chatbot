import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- SchoolCalendar Samples ---');
  const calendar = await prisma.schoolCalendar.findMany({ take: 5 });
  console.log(JSON.stringify(calendar, null, 2));

  console.log('\n--- SchoolMeal Samples ---');
  const meals = await prisma.schoolMeal.findMany({ take: 5 });
  console.log(JSON.stringify(meals, null, 2));
}

main().finally(() => prisma.$disconnect());
