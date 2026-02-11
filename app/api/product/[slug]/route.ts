import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true, images: true }
    });
    if (!product) {
      return NextResponse.json({ product: null }, { status: 200 });
    }
    const serializedProduct = {
      ...product,
      price: product.price ? Number(product.price) : null,
      discountedPrice: product.discountedPrice ? Number(product.discountedPrice) : null,
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
      category: product.category ? {
        name: product.category.name,
        slug: product.category.slug
      } : null,
      images: product.images.map(img => ({
        url: img.url,
        alt: img.alt
      }))
    };
    return NextResponse.json({ product: serializedProduct });
  } catch (e) {
    return NextResponse.json({ product: null }, { status: 200 });
  }
}
