import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { getCartImpl } from "@/lib/product-service";
import Link from "next/link";
import Image from "next/image";
import { Trash2 } from "lucide-react";

export default async function CartPage() {
  const cart = await getCartImpl();
  const items = cart?.items || [];

  const subtotal = items.reduce((acc, item) => {
    const price = item.product.discountedPrice || item.product.price || 0;
    return acc + (Number(price) * item.quantity);
  }, 0);

  return (
    <main className="min-h-screen bg-brand-black text-white">
      <Navbar />
      <div className="container-custom py-12">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-4">
                {items.length === 0 ? (
                    <div className="bg-brand-charcoal p-6 rounded-2xl text-center py-12">
                        <p className="text-gray-400 mb-4">Your cart is empty</p>
                        <Link href="/">
                            <Button variant="outline">Continue Shopping</Button>
                        </Link>
                    </div>
                ) : (

                    items.map((item) => (
                        <div key={item.id} className="bg-brand-charcoal p-4 rounded-xl flex gap-4">
                            <div className="relative w-24 h-24 bg-white rounded-lg overflow-hidden shrink-0">
                                <Image 
                                    src={item.product.imagePath} 
                                    alt={item.product.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-medium text-lg">{item.product.name || 'Product'}</h3>
                                    <p className="text-brand-orange font-bold">
                                        ₹{Number(item.product.discountedPrice || item.product.price).toFixed(2)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 mt-4">
                                    <div className="flex items-center gap-2 bg-brand-black/50 rounded-lg px-2 py-1">
                                        <button className="px-2 hover:text-brand-orange text-gray-400">-</button>
                                        <span className="text-sm w-4 text-center">{item.quantity}</span>
                                        <button className="px-2 hover:text-brand-orange text-gray-400">+</button>
                                    </div>
                                    <button className="text-gray-400 hover:text-red-500 ml-auto">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="bg-brand-charcoal p-6 rounded-2xl h-fit">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    <div className="border-t border-brand-dark-gray my-4 pt-4 flex justify-between font-bold text-white text-lg">
                        <span>Total</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                </div>
                <Button className="w-full mt-6" disabled={items.length === 0}>
                    Checkout
                </Button>
            </div>
        </div>
      </div>
    </main>
  );
}
