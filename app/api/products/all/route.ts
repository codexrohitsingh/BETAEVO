import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Product } from '@prisma/client';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    const serialize = (p: Product) => ({
      ...p,
      price: p.price ? Number(p.price) : null,
      discountedPrice: p.discountedPrice ? Number(p.discountedPrice) : null,
      originalPrice: p.originalPrice ? Number(p.originalPrice) : null
    });
    return NextResponse.json({ products: products.map(serialize) });
  } catch {
    return NextResponse.json({ products: [] }, { status: 200 });
  }
}
