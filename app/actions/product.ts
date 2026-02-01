'use server'

import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.email.toLowerCase() !== 'rs21rohit@gmail.com') {
    throw new Error('Unauthorized');
  }
}

export async function scanPhotos() {
  await checkAdmin();
  try {
    const photosDir = path.join(process.cwd(), 'public', 'photos');
    
    if (!fs.existsSync(photosDir)) {
      return { success: false, message: 'Photos directory not found' };
    }

    const files = fs.readdirSync(photosDir).filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
    let createdCount = 0;

    for (const file of files) {
      const imagePath = `/photos/${file}`;
      
      const existingProduct = await prisma.product.findFirst({
        where: { imagePath } as any
      });

      if (!existingProduct) {
        await prisma.product.create({
          data: {
            imagePath,
            stock: 50,
            name: `Product ${file.split('.')[0]}`,
            slug: `product-${Date.now()}-${Math.floor(Math.random() * 1000)}`
          } as any
        });
        createdCount++;
      }
    }

    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true, message: `Scanned ${files.length} photos. Created ${createdCount} new products.` };
  } catch (error) {
    console.error('Error scanning photos:', error);
    return { success: false, message: 'Failed to scan photos' };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  await checkAdmin();
  
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const priceStr = formData.get('price') as string;
    const discountStr = formData.get('discountPercentage') as string;
    const stockStr = formData.get('stock') as string;

    const price = priceStr ? parseFloat(priceStr) : null;
    const discountPercentage = discountStr ? parseInt(discountStr) : 0;
    const stock = stockStr ? parseInt(stockStr) : 0;

    let discountedPrice: number | null = null;
    if (price !== null) {
      discountedPrice = price - (price * discountPercentage / 100);
    }

    await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        discountPercentage,
        discountedPrice,
        stock
      } as any
    });
    
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath(`/product/${id}`);
    return { success: true };
  } catch (error) {
    console.error('Update failed:', error);
    return { success: false, error: 'Update failed' };
  }
}

export async function purchaseProduct(id: string) {
  try {
    // Start a transaction to ensure stock is checked and updated atomically
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id }
      });

      if (!product) {
        throw new Error('Product not found');
      }

      if (product.stock <= 0) {
        throw new Error('Out of stock');
      }

      const updatedProduct = await tx.product.update({
        where: { id },
        data: {
          stock: {
            decrement: 1
          }
        }
      });

      return updatedProduct;
    });

    revalidatePath('/');
    revalidatePath(`/product/${id}`);
    
    return { success: true, newStock: result.stock };
  } catch (error: any) {
    console.error('Purchase failed:', error);
    return { success: false, error: error.message || 'Purchase failed' };
  }
}
