
'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';

import { ProductCard } from '@/components/product/product-card';

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
  slug?: string;
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
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
