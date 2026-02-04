import { Navbar } from "@/components/layout/navbar";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/product-card";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";

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
                <p className="text-gray-500">No products found in this category yet.</p>
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
                {category.products.map((product) => (
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
