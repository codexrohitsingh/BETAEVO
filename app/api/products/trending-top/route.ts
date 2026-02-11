import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Product } from '@prisma/client';

export async function GET() {
  try {
    const trending = await prisma.product.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' }
    });
    const topRated = await prisma.product.findMany({
      take: 8,
      orderBy: { rating: 'desc' }
    });
    const serialize = (p: Product) => ({
      ...p,
      price: p.price ? Number(p.price) : null,
      discountedPrice: p.discountedPrice ? Number(p.discountedPrice) : null,
      originalPrice: p.originalPrice ? Number(p.originalPrice) : null
    });
    return NextResponse.json({
      trending: trending.map(serialize),
      topRated: topRated.map(serialize)
    });
  } catch {
    return NextResponse.json({ trending: [], topRated: [] }, { status: 200 });
  }
}
