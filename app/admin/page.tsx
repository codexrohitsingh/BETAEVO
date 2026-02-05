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

  const totalUsers = await prisma.user.count();
  const windowMs = 5 * 60 * 1000;
  const since = new Date(Date.now() - windowMs);
  const activeRows = await prisma.$queryRaw<{ email: string | null; lastSeen: Date }[]>`
    SELECT u.email, up."lastSeen"
    FROM "UserPresence" up
    JOIN "User" u ON u.id = up."userId"
    WHERE up."lastSeen" >= ${since}
  `;
  const activeUsersCount = activeRows.length;
  const activeUsers = activeRows.map((r: { email: string | null; lastSeen: Date }) => ({
    email: r.email,
    lastSeen: r.lastSeen
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

      <div className="mb-8 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">User Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded shadow">
            <div className="text-sm text-gray-600">Total Users</div>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <div className="text-sm text-gray-600">Active Users (last 5 min)</div>
            <div className="text-2xl font-bold">{activeUsersCount}</div>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <div className="text-sm text-gray-600">Heartbeat</div>
            <div className="text-xs text-gray-500">Navbar pings presence every 60s</div>
          </div>
        </div>
        {activeUsers.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Currently Active</h3>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {activeUsers.map((u: { email: string | null; lastSeen: Date }, idx: number) => (
                <li key={(u.email ?? '') + '-' + u.lastSeen.toString()}>{u.email} — {new Date(u.lastSeen).toLocaleTimeString()}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <h2 className="text-2xl font-semibold mb-4">Products ({products.length})</h2>
      <AdminProductList products={adminProducts} />
    </div>
  );
}
