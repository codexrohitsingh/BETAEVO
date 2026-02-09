
'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function setupAccessories() {
  try {
    console.log('Starting Accessories setup...');

    // 1. Create or Get "Accessories" Category
    let accessories = await prisma.category.findUnique({
      where: { slug: 'accessories' }
    });

    if (!accessories) {
      console.log('Creating Accessories category...');
      accessories = await prisma.category.create({
        data: {
          name: 'Accessories',
          slug: 'accessories',
          image: '/photos/product-1.webp' // Default image
        }
      });
    }

    console.log('Accessories Category ID:', accessories.id);

    // 1b. Create or Get "Smart Audio" Category
    let smartAudio = await prisma.category.findUnique({
      where: { slug: 'smart-audio' }
    });
    if (!smartAudio) {
      console.log('Creating Smart Audio category...');
      smartAudio = await prisma.category.create({
        data: {
          name: 'Smart Audio',
          slug: 'smart-audio'
        }
      });
    }
    console.log('Smart Audio Category ID:', smartAudio.id);

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
        // Move Air Clips variants to Smart Audio
        const isAirClips = ['air-clips','air-clips-v2','air-clips-v3'].includes(p.slug);
        if (isAirClips) {
            if (p.categoryId !== smartAudio.id) {
                updates.categoryId = smartAudio.id;
                needsUpdate = true;
            }
        } else {
            // Otherwise, ensure Accessories for strap products or uncategorized
            if (p.categoryId !== accessories.id) {
                updates.categoryId = accessories.id;
                needsUpdate = true;
            }
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
    revalidatePath('/category/smart-audio');
    
    return { success: true, message: `Setup complete. Updated ${updatedCount} products.` };
  } catch (error) {
    console.error('Setup failed:', error);
    const message = error instanceof Error ? error.message : 'Setup failed';
    return { success: false, message };
  }
}
