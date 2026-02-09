import { Navbar } from "@/components/layout/navbar";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/product-card";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Image from "next/image";

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
                  // Smart Audio: ensure Air Clips are included even if categorized elsewhere
                  if (slug === 'smart-audio' && airClipsForCards.length > 0) {
                    const existingIds = new Set(base.map(p => p.id));
                    const merged = [
                      ...base,
                      ...airClipsForCards.filter(p => !existingIds.has(p.id))
                    ];
                    return merged;
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
