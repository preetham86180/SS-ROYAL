import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generatePropertyNumber() {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `SS-${num}`;
}

async function main() {
  const properties = await prisma.property.findMany({
    where: { propertyNumber: null }
  });

  console.log(`Found ${properties.length} properties to backfill...`);

  for (const property of properties) {
    let uniqueNumber = generatePropertyNumber();
    let isUnique = false;
    
    // Ensure uniqueness
    while (!isUnique) {
      const existing = await prisma.property.findUnique({ where: { propertyNumber: uniqueNumber }});
      if (existing) {
        uniqueNumber = generatePropertyNumber();
      } else {
        isUnique = true;
      }
    }

    await prisma.property.update({
      where: { id: property.id },
      data: { propertyNumber: uniqueNumber }
    });
    console.log(`Updated property ${property.title} with number ${uniqueNumber}`);
  }

  console.log('Backfill complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
