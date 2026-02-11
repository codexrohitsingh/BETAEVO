
import { prisma } from '@/lib/prisma';
import { BestSellersList } from './best-sellers-list';

export async function BestSellers() {
  const trending = await prisma.product.findMany({
    take: 8,
    orderBy: { createdAt: 'desc' }
  });

  const topRated = await prisma.product.findMany({
    take: 8,
    orderBy: { rating: 'desc' }
  });
  
  const headphones = await prisma.product.findUnique({
    where: { slug: 'headphones' }
  });

  // Convert Decimals to numbers for client component
  const serializeProduct = <T extends { price?: unknown; discountedPrice?: unknown; originalPrice?: unknown }>(p: T) => ({
    ...p,
    price: p.price ? Number(p.price) : null,
    discountedPrice: p.discountedPrice ? Number(p.discountedPrice) : null,
    originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
  });

  function mergeHeadphones(list: typeof trending) {
    if (!headphones) return list;
    const exists = list.some(p => p.id === headphones.id);
    const merged = exists ? list : [headphones, ...list];
    const deduped = merged.filter((p, idx, arr) => arr.findIndex(x => x.id === p.id) === idx);
    return deduped.slice(0, 8);
  }

  return (
    <BestSellersList 
      trending={mergeHeadphones(trending).map(serializeProduct)} 
      topRated={mergeHeadphones(topRated).map(serializeProduct)} 
    />
  );
}
