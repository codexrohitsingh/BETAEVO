import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/home/hero";
import { TrustMetrics } from "@/components/home/trust-metrics";
import { ShopByCategory } from "@/components/home/shop-by-category";
import { BestSellers } from "@/components/home/best-sellers";
import { FreshDropsList } from "@/components/fresh-drops/fresh-drops-list";
import { PromotionalBanner } from "@/components/home/promotional-banner";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
import Image from "next/image";

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
  const serializeProduct = <T extends { price?: unknown; discountedPrice?: unknown; originalPrice?: unknown }>(p: T) => ({
    ...p,
    price: p.price ? Number(p.price) : null,
    discountedPrice: p.discountedPrice ? Number(p.discountedPrice) : null,
    originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
  });

  // Read latest 3 photos from /public/photos for Smart Audio showcase
  const photosDir = path.join(process.cwd(), "public", "photos");
  let smartAudioPhotos: string[] = [];
  try {
    const files = fs.readdirSync(photosDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
    smartAudioPhotos = files
      .map(f => ({ f, mtime: fs.statSync(path.join(photosDir, f)).mtime.getTime() }))
      .sort((a, b) => b.mtime - a.mtime)
      .slice(0, 3)
      .map(({ f }) => `/photos/${f}`);
  } catch {
    smartAudioPhotos = [];
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <TrustMetrics />
      <ShopByCategory />
      
      {/* Smart Audio Showcase - latest 3 images from /photos */}
      {/* {smartAudioPhotos.length > 0 && (
        <section className="container-custom py-12">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-3xl font-bold text-brand-black">Smart</h2>
            <h2 className="text-3xl font-bold text-brand-orange">Audio</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {smartAudioPhotos.map((src, idx) => (
              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-gray-100">
                <Image src={src} alt="Smart Audio" fill className="object-contain" />
              </div>
            ))}
          </div>
        </section>
      )} */}

      <BestSellers />
      <PromotionalBanner />
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
