'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { AddToCartButton } from '@/components/product/add-to-cart-button';
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

interface FreshDropsListProps {
  newReleases: Product[];
  mostLoved: Product[];
}

export function FreshDropsList({ newReleases, mostLoved }: FreshDropsListProps) {
  const [activeTab, setActiveTab] = useState<'new' | 'loved'>('new');
  
  const products = activeTab === 'new' ? newReleases : mostLoved;

  return (
    <div className="container-custom py-12">
      {/* Header & Tabs */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-8">
          <span className="text-brand-black">Fresh</span>
          <span className="text-brand-orange">Drops</span>
        </h1>
        
        <div className="flex gap-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('new')}
            className={cn(
              "pb-4 text-lg font-medium transition-colors relative",
              activeTab === 'new' 
                ? "text-brand-black" 
                : "text-gray-400 hover:text-gray-600"
            )}
          >
            New Releases
            {activeTab === 'new' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-black"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('loved')}
            className={cn(
              "pb-4 text-lg font-medium transition-colors relative",
              activeTab === 'loved' 
                ? "text-brand-black" 
                : "text-gray-400 hover:text-gray-600"
            )}
          >
            Most Loved
            {activeTab === 'loved' && (
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
