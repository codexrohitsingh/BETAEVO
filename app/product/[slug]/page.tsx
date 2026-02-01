import { Navbar } from "@/components/layout/navbar";
import { ProductView } from "@/components/product/product-view";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id: slug }
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
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <ProductView product={serializedProduct} />
      
      {/* Footer Placeholder */}
      <footer className="py-12 border-t border-gray-100 text-center text-gray-500 bg-white mt-12">
        <p>© 2026 BetaEvo Electronics. All rights reserved.</p>
      </footer>
    </main>
  );
}
