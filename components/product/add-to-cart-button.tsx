'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { addToCart } from '@/app/actions/product';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps {
  productId: string;
  stock: number;
  className?: string;
  compact?: boolean;
}

export function AddToCartButton({ productId, stock, className, compact = false }: AddToCartButtonProps) {
  const router = useRouter();
  const [buying, setBuying] = useState(false);

  async function handleBuy(e: React.MouseEvent) {
    e.preventDefault(); // Prevent link navigation if inside a Link
    if (!productId) return;
    
    setBuying(true);
    const result = await addToCart(productId);
    setBuying(false);

    if (result.success) {
      router.push('/cart');
    } else {
      alert(`Failed to add to cart: ${result.error}`);
    }
  }

  if (stock <= 0) {
    return (
      <Button 
        disabled 
        className={cn("bg-gray-200 text-gray-500", className)}
      >
        Sold out
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleBuy} 
      disabled={buying}
      className={cn("bg-black text-white hover:bg-gray-800", className)}
    >
      {buying ? "..." : "Add to Cart"}
    </Button>
  );
}
