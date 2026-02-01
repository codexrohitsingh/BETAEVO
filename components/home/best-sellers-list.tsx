
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { AddToCartButton } from '@/components/product/add-to-cart-button';

interface Product {
  id: string;
  name: string | null;
  imagePath: string;
  price: number | null;
  discountedPrice: number | null;
  discountPercentage: number;
  originalPrice: number | null;
  rating: number;
  reviewCount: number;
  description: string | null;
  stock: number;
}

interface BestSellersListProps {
  trending: Product[];
  topRated: Product[];
}

export function BestSellersList({ trending, topRated }: BestSellersListProps) {
  const [activeTab, setActiveTab] = useState<'trending' | 'topRated'>('trending');
  
  const products = activeTab === 'trending' ? trending : topRated;

  return (
    <div className="container-custom py-16 bg-white">
      {/* Header & Tabs */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-8">
          <span className="text-brand-black">Best</span>
          <span className="text-brand-orange">Sellers</span>
        </h1>
        
        <div className="flex gap-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('trending')}
            className={cn(
              "pb-4 text-lg font-medium transition-colors relative",
              activeTab === 'trending' 
                ? "text-brand-black" 
                : "text-gray-400 hover:text-gray-600"
            )}
          >
            Trending Now
            {activeTab === 'trending' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-black"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('topRated')}
            className={cn(
              "pb-4 text-lg font-medium transition-colors relative",
              activeTab === 'topRated' 
                ? "text-brand-black" 
                : "text-gray-400 hover:text-gray-600"
            )}
          >
            Top Rated
            {activeTab === 'topRated' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-black"></span>
            )}
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            {/* Image Container */}
            <Link href={`/product/${product.id}`} className="block">
              <div className="aspect-square bg-white rounded-xl mb-4 relative overflow-hidden flex items-center justify-center p-6">
                <Image
                  src={product.imagePath}
                  alt={product.name || 'Product'}
                  fill
                  className="object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>

            {/* Content */}
            <div className="space-y-2">
              <Link href={`/product/${product.id}`} className="block">
                <h3 className="font-bold text-lg text-brand-black group-hover:text-brand-orange transition-colors">
                  {product.name || 'Untitled Product'}
                </h3>
              </Link>
              <p className="text-xs text-gray-500 font-medium truncate">
                {product.description || 'Coming soon'}
              </p>
              
              {/* Rating */}
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-bold text-brand-black">{product.rating}</span>
                <span className="text-xs text-gray-400">({product.reviewCount})</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 pt-1">
                {product.price ? (
                    <>
                        <span className="text-lg font-bold text-brand-black">₹{Number(product.discountedPrice || product.price).toLocaleString()}</span>
                        {product.discountPercentage > 0 && (
                            <>
                                <span className="text-sm text-gray-400 line-through">₹{Number(product.price).toLocaleString()}</span>
                                <span className="text-xs font-bold text-white bg-brand-orange px-1.5 py-0.5 rounded">
                                {product.discountPercentage}% off
                                </span>
                            </>
                        )}
                    </>
                ) : (
                    <span className="text-sm text-gray-500">Coming Soon</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <AddToCartButton 
                    productId={product.id} 
                    stock={product.stock}
                    className="w-auto h-10 px-6 text-sm font-medium"
                />
                
                <Link href={`/product/${product.id}`} className="text-sm font-medium text-brand-orange hover:underline">
                    Learn more
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
