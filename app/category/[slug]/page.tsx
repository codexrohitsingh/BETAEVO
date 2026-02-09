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
                {slug === 'smart-audio' ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { name: 'Air Clips — Black', image: '/products/air-clips-1.png', href: '/product/air-clips' },
                      { name: 'Air Clips — Grey', image: '/products/air-clips-v2-2.png', href: '/product/air-clips-v2' },
                      { name: 'Air Clips — Rose Gold', image: '/products/air-clips-v3-2.png', href: '/product/air-clips-v3' },
                    ].map((p) => (
                      <a key={p.href} href={p.href} className="group relative aspect-square rounded-2xl overflow-hidden bg-white border border-gray-100 flex items-center justify-center">
                        <Image src={p.image} alt={p.name} fill className="object-contain transition-transform duration-300 group-hover:scale-105" />
                        <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-3">
                          <div className="text-sm font-medium text-brand-black">{p.name}</div>
                          <div className="text-xs text-brand-orange">Learn more</div>
                        </div>
                      </a>
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
        
        {category.products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(slug === 'accessories' 
                  ? category.products.filter(p => !['air-clips','air-clips-v2','air-clips-v3'].includes(p.slug))
                  : category.products
                 ).map((product) => (
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
          slug === 'smart-audio' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Air Clips — Black', image: '/products/air-clips-1.png', href: '/product/air-clips' },
                { name: 'Air Clips — Grey', image: '/products/air-clips-v2-2.png', href: '/product/air-clips-v2' },
                { name: 'Air Clips — Rose Gold', image: '/products/air-clips-v3-2.png', href: '/product/air-clips-v3' },
              ].map((p) => (
                <a key={p.href} href={p.href} className="group relative aspect-square rounded-2xl overflow-hidden bg-white border border-gray-100 flex items-center justify-center">
                  <Image src={p.image} alt={p.name} fill className="object-contain transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-3">
                    <div className="text-sm font-medium text-brand-black">{p.name}</div>
                    <div className="text-xs text-brand-orange">Learn more</div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No products found.</p>
          )
        )}
      </div>
    </main>
  );
}
