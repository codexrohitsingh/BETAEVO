
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking database state...');

  // 1. Check Categories
  const categories = await prisma.category.findMany();
  console.log('Categories:', categories);

  let accessoriesCategory = categories.find(c => c.slug === 'accessories' || c.name === 'Accessories');

  if (!accessoriesCategory) {
    console.log('Creating Accessories category...');
    accessoriesCategory = await prisma.category.create({
      data: {
        name: 'Accessories',
        slug: 'accessories',
      },
    });
    console.log('Created Accessories category:', accessoriesCategory);
  } else {
    console.log('Found Accessories category:', accessoriesCategory);
  }

  // 2. Check Products
  const products = await prisma.product.findMany();
  console.log(`Found ${products.length} products.`);

  // 3. Update Products
  for (const product of products) {
    console.log(`Checking product: ${product.name} (ID: ${product.id})`);
    
    const updates: any = {};
    let needsUpdate = false;

    // Check Category assignment
    if (product.categoryId !== accessoriesCategory.id) {
      console.log(`- Assigning to Accessories category`);
      updates.categoryId = accessoriesCategory.id;
      needsUpdate = true;
    }

    // Check Image Path
    // The user said "images that i give of strap only".
    // We expect paths like '/photos/product-1.webp'.
    // If it's just 'product-1.webp', we prepend '/photos/'.
    // If it's 'photos/product-1.webp', we prepend '/'.
    
    let currentImage = product.imagePath;
    let newImage = currentImage;

    if (!currentImage.startsWith('/')) {
        if (currentImage.startsWith('photos/')) {
            newImage = '/' + currentImage;
        } else {
            newImage = '/photos/' + currentImage;
        }
    }

    if (newImage !== currentImage) {
        console.log(`- Updating image path from '${currentImage}' to '${newImage}'`);
        updates.imagePath = newImage;
        needsUpdate = true;
    }

    // Ensure name is "ClassicCraft Leather Straps 22mm" as requested if it's generic
    if (product.name === 'Untitled Product' || product.name === 'Product' || !product.name) {
         console.log(`- Updating name to "ClassicCraft Leather Straps 22mm"`);
         updates.name = "ClassicCraft Leather Straps 22mm";
         needsUpdate = true;
    }

    if (needsUpdate) {
      const updated = await prisma.product.update({
        where: { id: product.id },
        data: updates,
      });
      console.log('  Updated product:', updated);
    } else {
      console.log('  Product is up to date.');
    }
  }
  
  // Verify final state
  const finalCategory = await prisma.category.findUnique({
      where: { id: accessoriesCategory.id },
      include: { products: true }
  });
  console.log(`Final state: Category '${finalCategory?.name}' has ${finalCategory?.products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
