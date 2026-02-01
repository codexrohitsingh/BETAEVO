import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/home/hero";
import { TrustMetrics } from "@/components/home/trust-metrics";
import { ShopByCategory } from "@/components/home/shop-by-category";
import { BestSellers } from "@/components/home/best-sellers";
import { FreshDropsList } from "@/components/fresh-drops/fresh-drops-list";
import { PromotionalBanner } from "@/components/home/promotional-banner";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const newReleases = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: 4
  });

  const mostLoved = await prisma.product.findMany({
    orderBy: { rating: 'desc' },
    take: 4
  });

  // Convert Decimals to numbers for client component
  const serializeProduct = (p: any) => ({
    ...p,
    price: p.price ? Number(p.price) : null,
    discountedPrice: p.discountedPrice ? Number(p.discountedPrice) : null,
    originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
  });

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <TrustMetrics />
      <ShopByCategory />
      <BestSellers />
      <PromotionalBanner />
      <FreshDropsList 
        newReleases={newReleases.map(serializeProduct)} 
        mostLoved={mostLoved.map(serializeProduct)} 
      />
      
      {/* Footer Placeholder */}
      <footer className="py-12 border-t border-gray-100 text-center text-gray-500 bg-white">
        <p>© 2026 BetaEvo Electronics. All rights reserved.</p>
      </footer>
    </main>
  );
}
