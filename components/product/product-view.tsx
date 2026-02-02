'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { purchaseProduct } from '@/app/actions/product';
import { cn } from '@/lib/utils';

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

interface ProductViewProps {
  product: Product;
}

const COLORS = [
  { name: 'Blue', class: 'bg-[#1a365d]', image:'/photos/product-2.webp' },
  { name: 'Grey', class: 'bg-[#718096]', image:  '/photos/product-3.webp'},
  { name: 'Brown', class: 'bg-[#5D4037]', image: '/photos/product-1.webp' },
  { name: 'Light Blue', class: 'bg-[#90cdf4]', image: '/photos/product-5.webp' },
  { name: 'Black', class: 'bg-[#000000]', image:  '/photos/product-4.webp'},
];

export function ProductView({ product }: ProductViewProps) {
  const [buying, setBuying] = useState(false);
  
  const [selectedColor, setSelectedColor] = useState(() => {
    const matchingColor = COLORS.find(c => c.image === product.imagePath);
    return matchingColor ? matchingColor.name : COLORS[0].name;
  });

  const [currentImage, setCurrentImage] = useState(product.imagePath);

  async function handleBuy() {
    if (!product.id) return;
    setBuying(true);
    const result = await purchaseProduct(product.id);
    setBuying(false);

    if (result.success) {
      alert(`Added to cart! Stock remaining: ${result.newStock}`);
    } else {
      alert(`Failed to add to cart: ${result.error}`);
    }
  }

  return (
    <div className="container-custom py-8 text-brand-black">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <span className="hover:text-brand-black cursor-pointer">Home</span>
        <span>&rsaquo;</span>
        <span className="hover:text-brand-black cursor-pointer">Accessories</span>
        <span>&rsaquo;</span>
        <span className="font-medium text-brand-black">{product.name || 'ClassicCraft Leather Straps 22mm'}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Left Column - Image Gallery */}
        <div className="relative">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-gray-100 flex items-center justify-center">
            {/* Navigation Arrows */}
            <button className="absolute left-4 z-10 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-sm flex items-center justify-center transition-all opacity-50 cursor-not-allowed">
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button className="absolute right-4 z-10 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-sm flex items-center justify-center transition-all opacity-50 cursor-not-allowed">
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>

            {/* Main Image */}
            <div className="relative w-full h-full p-8">
              <Image
                src={currentImage}
                alt={product.name || 'Product'}
                fill
                className="object-contain hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-black tracking-tight leading-tight">
              {product.name || 'ClassicCraft Leather Straps 22mm'}
            </h1>
            
            {/* Price */}
            <div className="flex items-baseline gap-4">
              {product.price ? (
                  <>
                      <span className="text-3xl font-bold text-brand-black">₹{Number(product.discountedPrice || product.price).toLocaleString()}</span>
                      {product.discountPercentage > 0 && (
                          <span className="text-xl text-gray-400 line-through">₹{Number(product.price).toLocaleString()}</span>
                      )}
                  </>
              ) : (
                  <span className="text-3xl font-bold text-gray-400">Coming Soon</span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{product.rating}</span>
              <span className="text-gray-400">({product.reviewCount} reviews)</span>
            </div>
            
            <p className="text-gray-500 text-lg leading-relaxed">
              {product.description || "Coming soon"}
            </p>
          </div>

          {/* Color Selection */}
          <div className="space-y-4">
            <span className="text-lg font-medium text-brand-black">Color</span>
            <div className="flex items-center gap-4">
              {COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => {
                    setSelectedColor(color.name);
                    setCurrentImage(color.image);
                  }}
                  className={cn(
                    "w-12 h-12 rounded-full border-2 transition-all duration-200 relative",
                    selectedColor === color.name 
                      ? "border-brand-black ring-1 ring-brand-black ring-offset-2" 
                      : "border-transparent hover:border-gray-300"
                  )}
                  aria-label={`Select ${color.name}`}
                >
                  <span className={cn("absolute inset-1 rounded-full", color.class)} />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500">Selected: {selectedColor}</p>
          </div>
          
          {/* Action Buttons */}
          <div className="pt-4">
             {product.stock > 0 ? (
                <Button 
                    onClick={handleBuy} 
                    disabled={buying}
                    className="w-full bg-black text-white hover:bg-gray-800 h-14 text-lg rounded-xl font-medium transition-transform active:scale-[0.99]"
                >
                    {buying ? "Adding to Cart..." : "Add to Cart"}
                </Button>
             ) : (
                <Button disabled className="w-full bg-gray-200 text-gray-500 h-14 text-lg rounded-xl font-medium cursor-not-allowed">
                    Out of Stock
                </Button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
