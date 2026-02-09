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

export async function deleteProductImpl(id: string) {
  await checkAdmin();
  try {
    await prisma.$transaction(async (tx) => {
      await tx.cartItem.deleteMany({ where: { productId: id } });
      await tx.orderItem.deleteMany({ where: { productId: id } });
      await tx.review.deleteMany({ where: { productId: id } });
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.product.delete({ where: { id } });
    });
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Delete failed:', error);
    return { success: false, error: 'Delete failed' };
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
    const data: Prisma.ProductUpdateInput = {};
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price');
    const stock = formData.get('stock');
    const discountPercentage = formData.get('discountPercentage');

    let newPrice: number | undefined;
    let newDiscount: number | undefined;

    if (name) data.name = name;
    if (description) data.description = description;
    if (price) {
      newPrice = parseFloat(price.toString());
      data.price = newPrice;
    }
    if (stock) data.stock = parseInt(stock.toString());
    if (discountPercentage) {
        newDiscount = parseInt(discountPercentage.toString());
        data.discountPercentage = newDiscount;
        if (newPrice !== undefined) {
            data.discountedPrice = newPrice * (1 - newDiscount / 100);
        } else {
            const current = await prisma.product.findUnique({ where: { id }});
            if (current?.price != null) {
              const p = Number(current.price);
              data.discountedPrice = p * (1 - newDiscount / 100);
            }
        }
    }

    // If price changed but not discount, recalculate discountedPrice
    if (price && !discountPercentage) {
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

export async function addToCartImpl(productId: string) {
  const session = await getServerSession(authOptions);
  
  // For anonymous users, we would ideally use a cookie-based cart ID.
  // For now, let's require login or just check if user exists.
  // If no user, we can't persist to DB unless we have an anonymous cart system.
  // Let's assume we want to support logged in users for now.
  
  if (!session?.user?.email) {
      return { success: false, error: "Please sign in to add items to cart" };
  }

  try {
    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (!user) {
        return { success: false, error: "User account not found" };
    }

    // 1. Get or create Cart
    let cart = await prisma.cart.findUnique({
        where: { userId: user.id }
    });

    if (!cart) {
        cart = await prisma.cart.create({
            data: { userId: user.id }
        });
    }

    // 2. Check Product Stock
    const product = await prisma.product.findUnique({
        where: { id: productId }
    });

    if (!product) return { success: false, error: "Product not found" };
    if (product.stock < 1) return { success: false, error: "Out of stock" };

    // 3. Add/Update CartItem
    const existingItem = await prisma.cartItem.findFirst({
        where: {
            cartId: cart.id,
            productId: productId
        }
    });

    if (existingItem) {
        await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + 1 }
        });
    } else {
        await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId: productId,
                productName: product.name ?? 'Product',
                quantity: 1
            }
        });
    }

    revalidatePath('/cart');
    return { success: true };
  } catch (error) {
    console.error("Add to cart error:", error);
    return { success: false, error: "Failed to add to cart" };
  }
}

export async function getCartImpl() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });
    if (!user) return null;

    const cart = await prisma.cart.findUnique({
        where: { userId: user.id },
        include: {
            items: {
                include: {
                    product: true
                },
                orderBy: { createdAt: 'desc' }
            }
        }
    });
    
    return cart;
}

export async function purchaseProductImpl(id: string) {
  // This function was originally just decrementing stock.
  // We should probably deprecate it or rename it to "buyNow" if that's the intent.
  // For now, keeping it as is but we will switch the UI to use addToCartImpl.
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
  } catch (error) {
    console.error('Purchase failed:', error);
    const message = error instanceof Error ? error.message : 'Purchase failed';
    return { success: false, error: message };
  }
}
