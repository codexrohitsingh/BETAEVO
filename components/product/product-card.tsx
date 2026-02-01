
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';
import Link from 'next/link';
import { AddToCartButton } from '@/components/product/add-to-cart-button';

interface Product {
  id: string;
  name: string | null;
  imagePath: string;
  description: string | null;
  price: number | null;
  discountedPrice: number | null;
  discountPercentage: number;
  stock: number;
  rating: number;
  reviewCount: number;
  originalPrice?: number | null;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group block bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square w-full bg-white p-6 flex items-center justify-center">
          {product.discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-brand-orange text-white text-xs font-bold px-2 py-1 rounded-full z-10">
              {product.discountPercentage}% off
            </div>
          )}
          <div className="relative w-full h-full">
            <Image
              src={product.imagePath}
              alt={product.name || 'Product'}
              fill
              className="object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>
      </Link>
      
      <div className="p-4 space-y-2">
         <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-bold text-brand-black text-lg hover:text-brand-orange transition-colors">{product.name || 'Untitled Product'}</h3>
         </Link>
         <p className="text-xs text-gray-500 truncate">{product.description || 'No description'}</p>
         
         <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold text-brand-black">{product.rating}</span>
            <span className="text-xs text-gray-500">({product.reviewCount})</span>
         </div>

         <div className="flex items-baseline gap-2 pt-2">
            {product.price ? (
                <>
                    <span className="text-lg font-bold text-brand-black">₹{Number(product.discountedPrice || product.price).toLocaleString()}</span>
                    {product.discountPercentage > 0 && (
                        <span className="text-xs text-gray-400 line-through">₹{Number(product.price).toLocaleString()}</span>
                    )}
                </>
            ) : (
                <span className="text-sm text-gray-500">Coming Soon</span>
            )}
         </div>

         <div className="flex items-center justify-between pt-2">
            <AddToCartButton 
                productId={product.id} 
                stock={product.stock}
                className="w-auto text-xs h-9 px-6"
            />
            <Link href={`/product/${product.id}`} className="text-xs text-brand-orange underline underline-offset-2">Learn more</Link>
         </div>
      </div>
    </div>
  );
}
