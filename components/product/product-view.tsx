'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { addToCart } from '@/app/actions/product';
import { cn } from '@/lib/utils';
import { Breadcrumb } from '@/components/ui/breadcrumb';

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
  category?: {
    name: string;
    slug: string;
  } | null;
  images?: {
    url: string;
    alt: string | null;
  }[];
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

const AIR_CLIPS_VARIANTS = [
  { name: 'Black', slug: 'air-clips-v3', class: 'bg-black', image: '/products/air-clips-v3-2.png' },
  { name: 'Grey', slug: 'air-clips-v2', class: 'bg-gray-500', image: '/products/air-clips-v2-2.png' },
  { name: 'Light Pink', slug: 'air-clips', class: 'bg-pink-300', image: '/products/air-clips-2.png' },
];

export function ProductView({ product }: ProductViewProps) {
  const router = useRouter();
  const [buying, setBuying] = useState(false);
  
  // Combine main image with additional images
  const allImages = [
    product.imagePath,
    ...(product.images?.map(img => img.url) || [])
  ].filter(Boolean); // Remove duplicates if necessary, but simple concatenation is usually fine

  const [selectedColor, setSelectedColor] = useState(() => {
    // Only use color selection for accessories/straps or if explicitly needed
    
    // For Air Clips (Smart Audio), try to match the current product slug
    if (product.category?.slug === 'smart-audio') {
        // 1. Try exact slug match (Highest priority)
        const exactMatch = AIR_CLIPS_VARIANTS.find(v => v.slug === product.slug);
        if (exactMatch) return exactMatch.name;

        // 2. Try exact ID match (if ID is used as slug)
        const exactIdMatch = AIR_CLIPS_VARIANTS.find(v => v.slug === product.id);
        if (exactIdMatch) return exactIdMatch.name;

        // 3. Fallback: fuzzy match (be careful with substrings)
        // We only check name inclusion as a last resort, avoiding substring slug/id matching
        const fuzzyMatch = AIR_CLIPS_VARIANTS.find(v => 
            product.name?.toLowerCase().includes(v.name.toLowerCase())
        );
        return fuzzyMatch ? fuzzyMatch.name : AIR_CLIPS_VARIANTS[0].name;
    }
    
    const matchingColor = COLORS.find(c => c.image === product.imagePath);
    return matchingColor ? matchingColor.name : COLORS[0].name;
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // If we have multiple images (like Air Clips), use the carousel logic
  // If we are in "color mode" (Straps), we override the image based on color
  const [overrideImage, setOverrideImage] = useState<string | null>(() => {
    if (product.category?.slug === 'smart-audio') {
        // 1. Exact Slug Match
        const exactMatch = AIR_CLIPS_VARIANTS.find(v => v.slug === product.slug);
        if (exactMatch) return exactMatch.image;

        // 2. Exact ID Match
        const exactIdMatch = AIR_CLIPS_VARIANTS.find(v => v.slug === product.id);
        if (exactIdMatch) return exactIdMatch.image;

        // 3. Name match
        const nameMatch = AIR_CLIPS_VARIANTS.find(v => 
            product.name?.toLowerCase().includes(v.name.toLowerCase())
        );
        return nameMatch ? nameMatch.image : null;
    }
    return null;
  });

  const currentImage = overrideImage || allImages[currentImageIndex];

  const handleNextImage = () => {
    setOverrideImage(null); // Reset override when navigating gallery
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevImage = () => {
    setOverrideImage(null); // Reset override when navigating gallery
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  async function handleBuy() {
    if (!product.id) return;
    setBuying(true);
    const result = await addToCart(product.id);
    setBuying(false);

    if (result.success) {
      router.push('/cart');
    } else {
      alert(`Failed to add to cart: ${result.error}`);
    }
  }

  return (
    <div className="container-custom py-8 text-brand-black">
      {/* Breadcrumbs */}
      <Breadcrumb 
        items={[
          { label: 'Home', href: '/' },
          ...(product.category ? [{ label: product.category.name, href: `/category/${product.category.slug}` }] : []),
          { label: product.name || 'Product' }
        ]} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Left Column - Image Gallery */}
        <div className="relative">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-gray-100 flex items-center justify-center">
            {/* Navigation Arrows */}
            {allImages.length > 1 && (
              <>
                <button 
                  onClick={handlePrevImage}
                  className="absolute left-4 z-10 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-sm flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
                <button 
                  onClick={handleNextImage}
                  className="absolute right-4 z-10 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-sm flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                >
                  <ChevronRight className="w-6 h-6 text-gray-600" />
                </button>
              </>
            )}

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
            <h1 className="text-3xl md:text-5xl font-bold text-brand-black tracking-tight leading-tight">
              {product.name || 'ClassicCraft Leather Straps 22mm'}
            </h1>
            
            {/* Price */}
            <div className="flex items-baseline gap-4">
              {product.price ? (
                  <>
                      <span className="text-2xl md:text-3xl font-bold text-brand-black">₹{Number(product.discountedPrice || product.price).toLocaleString()}</span>
                      {product.discountPercentage > 0 && (
                          <span className="text-lg md:text-xl text-gray-400 line-through">₹{Number(product.price).toLocaleString()}</span>
                      )}
                  </>
              ) : (
                  <span className="text-2xl md:text-3xl font-bold text-gray-400">Coming Soon</span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{product.rating}</span>
              <span className="text-gray-400">({product.reviewCount} reviews)</span>
            </div>
            
            <p className="text-gray-500 text-lg leading-relaxed">
              {product.category?.slug === 'smart-audio' ? "Coming Soon" : (product.description || "Coming Soon")}
            </p>

            {product.category?.slug === 'smart-audio' && (
                <div className="space-y-2">
                    <h3 className="font-medium text-brand-black">Product Details</h3>
                    <p className="text-gray-500">Coming Soon</p>
                </div>
            )}
          </div>

          {/* Color Selection - For Air Clips (Smart Audio) */}
          {product.category?.slug === 'smart-audio' && (
            <div className="space-y-4">
              <span className="text-lg font-medium text-brand-black">Color</span>
              <div className="flex items-center gap-4">
                {AIR_CLIPS_VARIANTS.map((variant) => (
                  <button
                    key={variant.name}
                    onClick={() => {
                        // Update selected color immediately for visual feedback
                        setSelectedColor(variant.name);
                        setOverrideImage(variant.image);
                        
                        // Navigate to the variant product page if not already there
                        const currentSlug = product.slug || product.id;
                        if (variant.slug !== currentSlug) {
                            router.push(`/product/${variant.slug}`);
                        }
                    }}
                    className={cn(
                      "w-12 h-12 rounded-full border-2 transition-all duration-200 relative",
                      selectedColor === variant.name 
                        ? "border-brand-black ring-1 ring-brand-black ring-offset-2" 
                        : "border-transparent hover:border-gray-300"
                    )}
                    aria-label={`Select ${variant.name}`}
                  >
                    <span className={cn("absolute inset-1 rounded-full", variant.class)} />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500">Selected: {selectedColor}</p>
            </div>
          )}

          {/* Color Selection - For Straps/Accessories (NOT Smart Audio) */}
          {product.category?.slug === 'accessories' && (
            <div className="space-y-4">
              <span className="text-lg font-medium text-brand-black">Color</span>
              <div className="flex items-center gap-4">
                {COLORS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => {
                      setSelectedColor(color.name);
                      setOverrideImage(color.image);
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
          )}
          
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
