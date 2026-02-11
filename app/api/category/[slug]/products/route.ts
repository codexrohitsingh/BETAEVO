import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Product } from '@prisma/client';

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const category = await prisma.category.findUnique({
      where: { slug },
      include: { products: true }
    });
    if (!category) {
      return NextResponse.json({ products: [] }, { status: 200 });
    }
    const serialize = (p: Product) => ({
      ...p,
      price: p.price ? Number(p.price) : null,
      discountedPrice: p.discountedPrice ? Number(p.discountedPrice) : null,
      originalPrice: p.originalPrice ? Number(p.originalPrice) : null
    });
    return NextResponse.json({ products: category.products.map(serialize) });
  } catch {
    return NextResponse.json({ products: [] }, { status: 200 });
  }
}
