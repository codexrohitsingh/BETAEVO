
import { Navbar } from "@/components/layout/navbar";
import { FreshDropsList } from "@/components/fresh-drops/fresh-drops-list";
import { prisma } from "@/lib/prisma";

export default async function FreshDropsPage() {
  const newReleases = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: 12
  });

  const mostLoved = await prisma.product.findMany({
    orderBy: { rating: 'desc' },
    take: 12
  });

  // Convert Decimals to numbers for client component
  const serializeProduct = <T extends { price?: unknown; discountedPrice?: unknown; originalPrice?: unknown }>(p: T) => ({
    ...p,
    price: p.price ? Number(p.price) : null,
    discountedPrice: p.discountedPrice ? Number(p.discountedPrice) : null,
    originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
  });

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <FreshDropsList 
        newReleases={newReleases.map(serializeProduct)}
        mostLoved={mostLoved.map(serializeProduct)}
      />
      
      {/* Footer Placeholder */}
      <footer className="py-12 border-t border-gray-100 text-center text-gray-500 bg-white">
        <p>© 2026 BetaEvo. All rights reserved.</p>
      </footer>
    </main>
  );
}
