 'use server'
 
 import { prisma } from '@/lib/prisma';
 import { revalidatePath } from 'next/cache';
 import path from 'path';
 import fs from 'fs';
 
 export async function setupSmartAudio() {
   try {
     // Ensure Smart Audio category exists
     let smartAudio = await prisma.category.findUnique({
       where: { slug: 'smart-audio' }
     });
     if (!smartAudio) {
       smartAudio = await prisma.category.create({
         data: { name: 'Smart Audio', slug: 'smart-audio' }
       });
     }
 
     // Look for Air Clips images in /public/products
     const productsDir = path.join(process.cwd(), 'public', 'products');
     const files = fs.existsSync(productsDir) 
       ? fs.readdirSync(productsDir) 
       : [];
 
     const variants = [
       { slug: 'air-clips-v3', name: 'Air Clips — Black', image: '/products/air-clips-v3-2.png' },
       { slug: 'air-clips-v2', name: 'Air Clips — Grey', image: '/products/air-clips-v2-2.png' },
       { slug: 'air-clips-v3', name: 'Air Clips — Rose Gold', image: '/products/air-clips-v3-2.png' },
     ];
 
     let createdOrUpdated = 0;
     for (const v of variants) {
       // Only create if image exists
       const imageFile = v.image.replace('/products/', '');
       if (!files.includes(imageFile)) continue;
 
       const existing = await prisma.product.findFirst({
         where: { OR: [{ slug: v.slug }, { imagePath: v.image }] }
       });
 
       if (!existing) {
         await prisma.product.create({
           data: {
             name: v.name,
             slug: v.slug,
             imagePath: v.image,
             categoryId: smartAudio.id,
             stock: 50,
             price: null,
             discountedPrice: null,
             discountPercentage: 0,
             rating: 4.5,
             reviewCount: 0,
             description: 'Coming Soon'
           }
         });
         createdOrUpdated++;
       } else {
         await prisma.product.update({
           where: { id: existing.id },
           data: {
             name: v.name,
             slug: v.slug,
             imagePath: v.image,
             categoryId: smartAudio.id,
           }
         });
         createdOrUpdated++;
       }
     }
 
     revalidatePath('/category/smart-audio');
     return { success: true, message: `Smart Audio setup complete. Updated ${createdOrUpdated} products.` };
   } catch (error) {
     const message = error instanceof Error ? error.message : 'Setup Smart Audio failed';
     return { success: false, message };
   }
 }
