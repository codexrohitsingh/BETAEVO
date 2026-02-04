import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminProductList from "./product-list";
import ScanButton from "./scan-button";
import SetupButton from "./setup-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.email.toLowerCase() !== 'rs21rohit@gmail.com') {
    redirect("/");
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const adminProducts = products.map(p => ({
    ...p,
    price: p.price ? Number(p.price) : null,
    originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
    discountedPrice: p.discountedPrice ? Number(p.discountedPrice) : null,
  }));

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
      
      <div className="mb-8 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Actions</h2>
        <p className="text-sm text-gray-600 mb-4">Scan the /public/photos folder to add new products to the database.</p>
        <div className="flex gap-4">
          <ScanButton />
          <SetupButton />
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Products ({products.length})</h2>
      <AdminProductList products={adminProducts} />
    </div>
  );
}
