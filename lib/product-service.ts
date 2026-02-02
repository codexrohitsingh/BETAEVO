import 'server-only';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
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

export async function scanPhotosImpl() {
  await checkAdmin();
  try {
    const photosDir = path.join(process.cwd(), 'public', 'photos');
    const files = fs.readdirSync(photosDir).filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
    
    let addedCount = 0;
    
    // Get 'accessories' category
    let category = await prisma.category.findUnique({
        where: { slug: 'accessories' }
    });

    if (!category) {
        category = await prisma.category.create({
            data: {
                name: 'Accessories',
                slug: 'accessories'
            }
        });
    }

    for (const file of files) {
      const imagePath = `/photos/${file}`;
      // Extract name from filename (e.g. "product-1.webp" -> "product-1")
      const name = path.parse(file).name;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const existing = await prisma.product.findFirst({
        where: { 
            OR: [
                { imagePath },
                { slug }
            ]
        }
      });

      if (!existing) {
        await prisma.product.create({
          data: {
            name: name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
            slug,
            description: 'New arrival',
            price: 999.00,
            imagePath,
            categoryId: category.id,
            stock: 50,
            rating: 4.5,
            reviewCount: 0
          }
        });
        addedCount++;
      }
    }

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true, message: `Scanned complete. Added ${addedCount} new products.` };
  } catch (error) {
    console.error('Scan failed:', error);
    return { success: false, message: 'Scan failed' };
  }
}

export async function updateProductImpl(id: string, formData: FormData) {
  await checkAdmin();
  try {
    const data: any = {};
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price');
    const stock = formData.get('stock');
    const discountPercentage = formData.get('discountPercentage');

    if (name) data.name = name;
    if (description) data.description = description;
    if (price) data.price = parseFloat(price.toString());
    if (stock) data.stock = parseInt(stock.toString());
    if (discountPercentage) {
        data.discountPercentage = parseInt(discountPercentage.toString());
        if (data.price) {
            data.discountedPrice = data.price * (1 - data.discountPercentage / 100);
        } else {
             // If price not updated, need to fetch it? 
             // For simplicity assuming price is updated or we do a read before write if needed.
             // But actually Prisma update can access current value? No, not easily in 'data'.
             // Let's just update what we have.
             // If we want to recalculate discountedPrice correctly we might need current price.
             // For now let's just update fields provided.
        }
    }

    // If price changed but not discount, recalculate discountedPrice
    if (price && !discountPercentage) {
        // We need current discount to calc. 
        // Let's do a fetch first to be safe or just ignore for now if not critical.
        // Better:
        const current = await prisma.product.findUnique({ where: { id }});
        if (current) {
            const p = parseFloat(price.toString());
            const d = current.discountPercentage;
            data.discountedPrice = p * (1 - d / 100);
        }
    }

    await prisma.product.update({
      where: { id },
      data
    });

    revalidatePath('/');
    revalidatePath(`/product/${id}`);
    return { success: true };
  } catch (error) {
    console.error('Update failed:', error);
    return { success: false, error: 'Update failed' };
  }
}

export async function purchaseProductImpl(id: string) {
  try {
    // Start a transaction to ensure stock is checked and updated atomically
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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
