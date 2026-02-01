import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs';
import path from 'path';

// If DATABASE_URL is not set, try to read from .env manually (simple parser)
if (!process.env.DATABASE_URL) {
  try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envFile = fs.readFileSync(envPath, 'utf-8');
        for (const line of envFile.split('\n')) {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            process.env[match[1].trim()] = match[2].trim();
        }
        }
    }
  } catch (e) {
    console.warn('.env file not found or could not be read');
  }
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is not defined');
  process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
  const photosDir = path.join(process.cwd(), 'public', 'photos');
  
  if (!fs.existsSync(photosDir)) {
    console.log('Photos directory not found.');
    return;
  }

  const files = fs.readdirSync(photosDir).filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));

  console.log(`Found ${files.length} images in /photos`);

  for (const file of files) {
    const imagePath = `/photos/${file}`;
    
    // Check if product exists with this image path
    const existingProduct = await prisma.product.findFirst({
      where: { imagePath }
    });

    if (!existingProduct) {
      await prisma.product.create({
        data: {
          imagePath,
          stock: 50,
          description: null,
          price: null,
          name: `Product ${file.split('.')[0]}`, 
          slug: `product-${Date.now()}-${Math.floor(Math.random() * 1000)}` 
        }
      });
      console.log(`Created product for ${file}`);
    } else {
      console.log(`Product already exists for ${file}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
