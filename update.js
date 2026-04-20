const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.property.updateMany({ data: { isApproved: true } })
  .then(res => console.log('Updated:', res))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
