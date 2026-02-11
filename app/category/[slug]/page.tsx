import { Navbar } from "@/components/layout/navbar";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/product-card";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Image from "next/image";
import fs from "fs";
import path from "path";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Find category by slug
  const category = await prisma.category.findUnique({
    where: { slug: slug },
    include: {
      products: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  // Always try to fetch Air Clips products by slug (so Smart Audio can show them even if categorized elsewhere)
  const airClipsSlugs = ['air-clips', 'air-clips-v2', 'air-clips-v3'];
  const airClipsProductsRaw = await prisma.product.findMany({
    where: { slug: { in: airClipsSlugs } },
    orderBy: { createdAt: 'desc' }
  });
  const serializeProduct = <T extends { price?: unknown; discountedPrice?: unknown; originalPrice?: unknown }>(p: T) => ({
    ...p,
    price: p.price ? Number(p.price) : null,
    discountedPrice: p.discountedPrice ? Number(p.discountedPrice) : null,
    originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
  });
  const airClipsProducts = airClipsProductsRaw.map(serializeProduct);
  type CardProduct = {
    id: string;
    name: string | null;
    imagePath: string;
    description: string | null;
    price: number | null;
    discountedPrice: number | null;
    discountPercentage: number;
    stock: number;
    rating: number;
    reviewCount: number;
    originalPrice?: number | null;
    slug?: string;
  };
  const airClipsForCards: CardProduct[] = airClipsProducts.map((p) => {
    const base = p as unknown as {
      id: string;
      name?: string | null;
      imagePath: string;
      description?: string | null;
      price?: number | null;
      discountedPrice?: number | null;
      discountPercentage?: number;
      stock?: number;
      rating?: number;
      reviewCount?: number;
      originalPrice?: number | null;
      slug?: string;
    };
    return {
      id: base.id,
      name: base.name ?? null,
      imagePath: base.imagePath,
      description: base.description ?? null,
      price: base.price ?? null,
      discountedPrice: base.discountedPrice ?? null,
      discountPercentage: base.discountPercentage ?? 0,
      stock: base.stock ?? 0,
      rating: base.rating ?? 0,
      reviewCount: base.reviewCount ?? 0,
      originalPrice: base.originalPrice ?? null,
      slug: base.slug
    };
  });
  // Include Headphones if present even if categorized elsewhere, similar to Air Clips
  if (slug === 'smart-audio') {
    const existingHeadphones = await prisma.product.findUnique({ where: { slug: 'headphones' } });
    if (!existingHeadphones) {
      const sourceDir = path.join(process.cwd(), '..', '..', 'photos');
      const destDir = path.join(process.cwd(), 'public', 'photos');
      const files = [
        { src: 'headphone1_1.png', dest: 'headphones-1.png' },
        { src: 'headphone1_2.png', dest: 'headphones-2.png' },
        { src: 'headphone1_3.png', dest: 'headphones-3.png' },
        { src: 'headphone1_4.png', dest: 'headphones-4.png' },
      ];
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      let copied = 0;
      for (const f of files) {
        const srcPath = path.join(sourceDir, f.src);
        const destPath = path.join(destDir, f.dest);
        if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
          fs.copyFileSync(srcPath, destPath);
          copied++;
        }
      }
      const mainImage = '/photos/headphones-1.png';
      const haveMain = fs.existsSync(path.join(destDir, 'headphones-1.png'));
      if (haveMain) {
        const created = await prisma.product.create({
          data: {
            name: 'Headphones',
            slug: 'headphones',
            imagePath: mainImage,
            categoryId: category?.id,
            stock: 50,
            price: null,
            discountedPrice: null,
            discountPercentage: 0,
            rating: 4.5,
            reviewCount: 0,
            description: 'Premium over-ear headphones'
          }
        });
        const urls = [
          '/photos/headphones-1.png',
          '/photos/headphones-2.png',
          '/photos/headphones-3.png',
          '/photos/headphones-4.png',
        ];
        for (let i = 0; i < urls.length; i++) {
          const fileExists = fs.existsSync(path.join(destDir, `headphones-${i + 1}.png`));
          if (!fileExists) continue;
          await prisma.productImage.create({
            data: {
              productId: created.id,
              publicId: `headphones-${i + 1}`,
              url: urls[i],
              alt: `Headphones ${i + 1}`
            }
          });
        }
      }
    }
  }
  const headphonesRaw = await prisma.product.findUnique({ where: { slug: 'headphones' } });
  const headphonesForCards: CardProduct[] = headphonesRaw ? [{
    id: headphonesRaw.id,
    name: headphonesRaw.name ?? null,
    imagePath: headphonesRaw.imagePath,
    description: headphonesRaw.description ?? null,
    price: headphonesRaw.price ? Number(headphonesRaw.price) : null,
    discountedPrice: headphonesRaw.discountedPrice ? Number(headphonesRaw.discountedPrice) : null,
    discountPercentage: headphonesRaw.discountPercentage ?? 0,
    stock: headphonesRaw.stock ?? 0,
    rating: headphonesRaw.rating ?? 0,
    reviewCount: headphonesRaw.reviewCount ?? 0,
    originalPrice: headphonesRaw.originalPrice ? Number(headphonesRaw.originalPrice) : null,
    slug: headphonesRaw.slug
  }] : [];

  if (!category) {
    // If category not found in DB, check if it's one of the hardcoded ones and just show empty or "Coming Soon"
    // But for "accessories", we expect it to be in DB now.
    if (['smartwatches', 'smart-audio', 'smart-glasses', 'accessories'].includes(slug)) {
       const categoryName = slug.replace('-', ' ');
       // Fallback for empty categories that might not be in DB yet
       return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <div className="container-custom py-12">
                <Breadcrumb 
                  items={[
                    { label: 'Home', href: '/' },
                    { label: categoryName.charAt(0).toUpperCase() + categoryName.slice(1) }
                  ]} 
                />
                <h1 className="text-4xl font-bold mb-8 capitalize text-brand-black">{categoryName}</h1>
                {slug === 'smart-audio' && airClipsForCards.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {airClipsForCards.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No products found in this category yet.</p>
                )}
            </div>
        </main>
       );
    }
    notFound();
  }
  
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="container-custom py-12">
        <Breadcrumb 
          items={[
            { label: 'Home', href: '/' },
            { label: category.name }
          ]} 
        />
        <h1 className="text-4xl font-bold mb-8 capitalize text-brand-black">{category.name}</h1>
        <p className="text-gray-500 mb-8">Showing all products in {category.name}</p>
        
        {category.products.length > 0 || (slug === 'smart-audio' && airClipsForCards.length > 0) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(() => {
                  // Base products for this category
                  let base = category.products;
                  // Accessories: filter out Air Clips (we don't want them shown there)
                  if (slug === 'accessories') {
                    base = base.filter(p => !airClipsSlugs.includes(p.slug));
                  }
                  // Smart Audio: ensure Air Clips and Headphones are included even if categorized elsewhere
                  if (slug === 'smart-audio') {
                    const existingIds = new Set(base.map(p => p.id));
                    const extras = [
                      ...airClipsForCards,
                      ...headphonesForCards
                    ].filter(p => !existingIds.has(p.id));
                    return [...base, ...extras];
                  }
                  return base;
                })().map((product) => (
                    <ProductCard 
                        key={product.id} 
                        product={{
                            ...product,
                            price: product.price ? Number(product.price) : null,
                            discountedPrice: product.discountedPrice ? Number(product.discountedPrice) : null,
                            originalPrice: product.originalPrice ? Number(product.originalPrice) : null
                        }} 
                    />
                ))}
            </div>
        ) : (
            <p className="text-gray-500">No products found.</p>
        )}
      </div>
    </main>
  );
}
