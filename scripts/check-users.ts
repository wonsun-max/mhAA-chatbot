import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUsers() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                nickname: true,
                name: true,
                koreanName: true,
                aiEnabled: true,
                passwordHash: true,
            }
        });

        console.log('\n📊 Total Users:', users.length);
        console.log('\n👥 User Details:\n');

        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.name || 'No Name'} (${user.email})`);
            console.log(`   Nickname: ${user.nickname || 'N/A'}`);
            console.log(`   Korean Name: ${user.koreanName || 'N/A'}`);
            console.log(`   AI Enabled: ${user.aiEnabled}`);
            console.log(`   Has Password: ${user.passwordHash ? 'Yes' : 'No'}`);
            console.log('');
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsers();
