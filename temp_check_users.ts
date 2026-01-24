import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUsers() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                koreanName: true,
                role: true,
                status: true,
                aiEnabled: true,
                passwordHash: true,
            }
        });

        console.log('\n📊 Total Users:', users.length);
        console.log('\n👥 User Details:\n');

        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.name || 'No Name'} (${user.email})`);
            console.log(`   Username: ${user.username || 'N/A'}`);
            console.log(`   Korean Name: ${user.koreanName || 'N/A'}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Status: ${user.status}`);
            console.log(`   AI Enabled: ${user.aiEnabled}`);
            console.log(`   Has Password: ${user.passwordHash ? 'Yes' : 'No'}`);
            console.log('');
        });

        const statusCounts = users.reduce((acc, user) => {
            acc[user.status] = (acc[user.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        console.log('📈 Status Breakdown:');
        Object.entries(statusCounts).forEach(([status, count]) => {
            console.log(`   ${status}: ${count}`);
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsers();
