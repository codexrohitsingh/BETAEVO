
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting sync...');

  // 1. Get or Create Category
  let category = await prisma.category.findUnique({
    where: { slug: 'accessories' }
  });

  if (!category) {
    console.log('Creating Accessories category...');
    category = await prisma.category.create({
      data: {
        name: 'Accessories',
        slug: 'accessories',
        image: '/photos/product-1.webp' // Default image
      }
    });
  }

  // 2. Scan public/photos
  const photosDir = path.join(process.cwd(), 'public', 'photos');
  const files = fs.readdirSync(photosDir).filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));

  for (const file of files) {
    const imagePath = `/photos/${file}`;
    console.log(`Processing ${imagePath}...`);

    // Check if exists by image path OR slug
    const slug = `product-${path.parse(file).name}`;
    const existing = await prisma.product.findFirst({
      where: { 
        OR: [
            { imagePath },
            { slug }
        ]
      }
    });

    if (!existing) {
        console.log(`Creating product for ${file}`);
        await prisma.product.create({
            data: {
                name: "ClassicCraft Leather Straps 22mm",
                imagePath,
                price: 2999, // Default price
                discountPercentage: 0,
                stock: 50,
                slug,
                categoryId: category.id
            }
        });
    } else {
        // Update existing to ensure correct name, category AND image path
        console.log(`Updating product ${existing.id}`);
        await prisma.product.update({
            where: { id: existing.id },
            data: {
                name: "ClassicCraft Leather Straps 22mm",
                categoryId: category.id,
                imagePath // Update image path in case it changed (e.g. png -> webp)
            }
        });
    }
  }

  console.log('Sync complete.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
