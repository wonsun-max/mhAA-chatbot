const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkLogs() {
    console.log("--- Fetching Latest Chat Logs ---");
    const logs = await prisma.chatLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    logs.forEach((log, i) => {
        console.log(`\n[Log ${i + 1}]`);
        console.log(`Query: ${log.query}`);
        console.log(`Response: ${log.response}`);
        console.log(`Tools Called: ${log.toolsCalled}`);
        console.log(`Time: ${log.createdAt}`);
    });
}

checkLogs()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
