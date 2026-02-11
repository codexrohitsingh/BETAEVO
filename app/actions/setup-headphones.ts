 'use server'
 
 import { prisma } from '@/lib/prisma';
 import { revalidatePath } from 'next/cache';
 import fs from 'fs';
 import path from 'path';
 
 export async function setupHeadphones() {
   try {
     const sourceDir = path.join(process.cwd(), '..', '..', 'photos');
     const destDir = path.join(process.cwd(), 'public', 'photos');
 
     const filesNeeded = [
       { src: 'headphone1_1.png', dest: 'headphones-1.png' },
       { src: 'headphone1_2.png', dest: 'headphones-2.png' },
       { src: 'headphone1_3.png', dest: 'headphones-3.png' },
       { src: 'headphone1_4.png', dest: 'headphones-4.png' },
     ];
 
     // Ensure destination directory exists
     if (!fs.existsSync(destDir)) {
       fs.mkdirSync(destDir, { recursive: true });
     }
 
     // Copy images from root photos to app public/photos
     for (const f of filesNeeded) {
       const srcPath = path.join(sourceDir, f.src);
       const destPath = path.join(destDir, f.dest);
       if (!fs.existsSync(srcPath)) {
         throw new Error(`Source image not found: ${srcPath}`);
       }
       if (!fs.existsSync(destPath)) {
         fs.copyFileSync(srcPath, destPath);
       }
     }
 
     // Ensure Smart Audio category exists
     let smartAudio = await prisma.category.findUnique({
       where: { slug: 'smart-audio' }
     });
     if (!smartAudio) {
       smartAudio = await prisma.category.create({
         data: { name: 'Smart Audio', slug: 'smart-audio' }
       });
     }
 
     // Create or update product
     const slug = 'headphones';
     const mainImage = '/photos/headphones-1.png';
 
     const existing = await prisma.product.findFirst({
       where: { slug }
     });
 
     let productId: string;
     if (!existing) {
       const created = await prisma.product.create({
         data: {
           name: 'Headphones',
           slug,
           imagePath: mainImage,
           categoryId: smartAudio.id,
           stock: 50,
           price: null,
           discountedPrice: null,
           discountPercentage: 0,
           rating: 4.5,
           reviewCount: 0,
           description: 'Premium over-ear headphones',
         }
       });
       productId = created.id;
     } else {
       const updated = await prisma.product.update({
         where: { id: existing.id },
         data: {
           name: 'Headphones',
           imagePath: mainImage,
           categoryId: smartAudio.id,
           description: existing.description ?? 'Premium over-ear headphones',
         }
       });
       productId = updated.id;
     }
 
     // Reset product images and add the four variants
     await prisma.productImage.deleteMany({ where: { productId } });
     const urls = [
       '/photos/headphones-1.png',
       '/photos/headphones-2.png',
       '/photos/headphones-3.png',
       '/photos/headphones-4.png',
     ];
     for (let i = 0; i < urls.length; i++) {
       await prisma.productImage.create({
         data: {
           productId,
           publicId: `headphones-${i + 1}`,
           url: urls[i],
           alt: `Headphones ${i + 1}`,
         }
       });
     }
 
     revalidatePath('/category/smart-audio');
     revalidatePath(`/product/${slug}`);
     return { success: true, message: 'Headphones added to Smart Audio with 4 images.' };
   } catch (error) {
     const message = error instanceof Error ? error.message : 'Setup Headphones failed';
     return { success: false, message };
   }
 }
