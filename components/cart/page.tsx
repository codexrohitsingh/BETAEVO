"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { div } from "framer-motion/client";

type CartDrawerProps = {
  items: any[];
};

export function CartDrawer({ items }: CartDrawerProps) {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  const subtotal = items.reduce((acc, item) => {
    const price = item.product.discountedPrice || item.product.price || 0;
    return acc + Number(price) * item.quantity;
  }, 0);
<div>

</div>
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col rounded-l-[30px] overflow-hidden  ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b bg-white">
          <h2 className="text-xl font-semibold tracking-tight">
            Your Cart
            <span className="text-gray-500 text-base ml-2">
              ({items.length})
            </span>
          </h2>

          <button
            onClick={() => {
              setOpen(false);
              router.push("/");
            }}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-600"/>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm mt-1">
                Looks like you haven’t added anything yet.
              </p>
              <Button
                onClick={() => router.push("/")}
                className="mt-4 bg-black text-white hover:bg-gray-800"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 group"
              >
                {/* Product Image */}
                <div className="relative w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={item.product.imagePath}
                    alt={item.product.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="text-sm font-medium line-clamp-2">
                    {item.product.name}
                  </h3>

                  <p className="text-base font-semibold mt-1">
                    ₹
                    {Number(
                      item.product.discountedPrice || item.product.price
                    ).toFixed(2)}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity */}
                    <div className="flex items-center border rounded-lg overflow-hidden text-sm">
                      <button className="px-3 py-1 hover:bg-gray-100 transition">
                        −
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button className="px-3 py-1 hover:bg-gray-100 transition">
                        +
                      </button>
                    </div>

                    {/* Remove */}
                    <button className="opacity-0 group-hover:opacity-100 transition">
                      <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500 transition" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t px-6 py-5 bg-white space-y-4 shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <Button className="w-full bg-black text-white hover:bg-gray-800 h-11 text-base">
              Checkout
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
