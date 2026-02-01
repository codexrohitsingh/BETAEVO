
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

  // Convert Decimals to numbers for client component
  const serializeProduct = (p: any) => ({
    ...p,
    price: p.price ? Number(p.price) : null,
    discountedPrice: p.discountedPrice ? Number(p.discountedPrice) : null,
    originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
  });

  return (
    <BestSellersList 
      trending={trending.map(serializeProduct)} 
      topRated={topRated.map(serializeProduct)} 
    />
  );
}
