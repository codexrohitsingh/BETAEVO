
'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function setupAccessories() {
  try {
    console.log('Starting Accessories setup...');

    // 1. Create or Get "Accessories" Category
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

    console.log('Category ID:', category.id);

    // 2. Fetch all products to process them individually
    // We need to check names and image paths for each one.
    const products = await prisma.product.findMany();
    
    let updatedCount = 0;

    type ProductUpdates = {
      categoryId?: string;
      imagePath?: string;
      name?: string;
    };

    for (const p of products) {
        const updates: ProductUpdates = {};
        let needsUpdate = false;

        // Assign Category
        if (p.categoryId !== category.id) {
            updates.categoryId = category.id;
            needsUpdate = true;
        }

        // Fix Image Path
        const currentImage = p.imagePath;
        let newImage = currentImage;

        // Ensure it starts with /photos/
        if (!currentImage.startsWith('/')) {
            if (currentImage.startsWith('photos/')) {
                newImage = '/' + currentImage;
            } else {
                newImage = '/photos/' + currentImage;
            }
        } else if (currentImage.startsWith('/product-')) {
             // Handle case where it might be just /product-1.webp
             newImage = '/photos' + currentImage;
        }

        if (newImage !== currentImage) {
            updates.imagePath = newImage;
            needsUpdate = true;
        }

        // Update Name if generic or default
        if (p.name === 'Untitled Product' || p.name === 'Product' || !p.name || p.name.startsWith('Product ')) {
             updates.name = "ClassicCraft Leather Straps 22mm";
             needsUpdate = true;
        }

        if (needsUpdate) {
            await prisma.product.update({
                where: { id: p.id },
                data: updates
            });
            updatedCount++;
            console.log(`Updated product ${p.id}:`, updates);
        }
    }

    revalidatePath('/');
    revalidatePath('/category/accessories');
    
    return { success: true, message: `Setup complete. Updated ${updatedCount} products.` };
  } catch (error) {
    console.error('Setup failed:', error);
    const message = error instanceof Error ? error.message : 'Setup failed';
    return { success: false, message };
  }
}
