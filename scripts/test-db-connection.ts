
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

async function main() {
    console.log('🔄 Testing database connection...');
    console.log('   (Timeout set to 5 seconds)');

    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection timed out after 5s')), 5000)
    );

    try {
        const connectionPromise = prisma.$connect();

        await Promise.race([connectionPromise, timeoutPromise]);
        console.log('✅ Successfully connected to the database!');

        // Try a simple query
        const count = await prisma.user.count();
        console.log(`📊 Found ${count} users in the database.`);

    } catch (e: any) {
        console.error('❌ Database connection failed:');
        console.error(`   ${e.message}`);

        if (e.message.includes('timed out')) {
            console.error('\n⚠️  TIMEOUT HINT: This usually means:');
            console.error('   1. The database host is unreachable from this network.');
            console.error('   2. A firewall is blocking the connection.');
            console.error('   3. The connection string is incorrect.');
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
