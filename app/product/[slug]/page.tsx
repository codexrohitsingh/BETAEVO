import { Navbar } from "@/components/layout/navbar";
import { ProductView } from "@/components/product/product-view";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const product = await prisma.product.findUnique({
    where: { slug: slug },
    include: { 
      category: true,
      images: true
    }
  });

  if (!product) {
    notFound();
  }

  // Convert Decimals to numbers for client component
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

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <ProductView product={serializedProduct} key={serializedProduct.id} />
      
      {/* Footer Placeholder */}
      <footer className="py-12 border-t border-gray-100 text-center text-gray-500 bg-white mt-12">
        <p>© 2026 BetaEvo. All rights reserved.</p>
      </footer>
    </main>
  );
}
