const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Enabling registration...');
    
    const setting = await prisma.globalSettings.upsert({
      where: { key: 'registration_enabled' },
      update: { value: 'true' },
      create: { key: 'registration_enabled', value: 'true' },
    });

    console.log('Registration enabled:', setting);
  } catch (e) {
    console.error('Error enabling registration:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
