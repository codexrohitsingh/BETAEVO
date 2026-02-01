
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  console.log('--- Categories ---');
  const categories = await prisma.category.findMany();
  console.log(categories);

  console.log('\n--- Products ---');
  const products = await prisma.product.findMany({
    include: { category: true }
  });
  console.log(JSON.stringify(products, null, 2));
}

checkData()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
