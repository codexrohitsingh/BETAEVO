import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  return (
    <main className="min-h-screen bg-brand-black text-white">
      <Navbar />
      <div className="container-custom py-12">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-4">
                <div className="bg-brand-charcoal p-6 rounded-2xl text-center py-12">
                    <p className="text-gray-400 mb-4">Your cart is empty</p>
                    <Button variant="outline">Continue Shopping</Button>
                </div>
            </div>
            
            <div className="bg-brand-charcoal p-6 rounded-2xl h-fit">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹0</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    <div className="border-t border-brand-dark-gray my-4 pt-4 flex justify-between font-bold text-white text-lg">
                        <span>Total</span>
                        <span>₹0</span>
                    </div>
                </div>
                <Button className="w-full mt-6" disabled>Checkout</Button>
            </div>
        </div>
      </div>
    </main>
  );
}
