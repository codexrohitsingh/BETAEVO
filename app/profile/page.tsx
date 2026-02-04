import { Navbar } from "@/components/layout/navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/auth/logout-button";
import Image from "next/image";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <main className="min-h-screen bg-white text-brand-black">
      <Navbar />
      <div className="container-custom py-12">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <LogoutButton />
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
                {session.user?.image ? (
                    <Image 
                      src={session.user.image} 
                      alt={session.user.name || "User"} 
                      width={64} 
                      height={64} 
                      className="rounded-full" 
                      priority
                    />
                ) : (
                    <div className="w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center text-2xl font-bold text-white">
                        {session.user?.name?.[0] || "U"}
                    </div>
                )}
                <div>
                    <h2 className="text-xl font-bold">{session.user?.name}</h2>
                    <p className="text-gray-500">{session.user?.email}</p>
                </div>
            </div>
            
            <div className="border-t border-gray-200 pt-8">
                <h3 className="text-xl font-bold mb-4">Order History</h3>
                <p className="text-gray-500">No orders found.</p>
            </div>
        </div>
      </div>
    </main>
  );
}
