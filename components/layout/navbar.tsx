'use client';

import Link from 'next/link';
import { ShoppingBag, User, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export function Navbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAdmin = session?.user?.email?.toLowerCase() === 'rs21rohit@gmail.com';

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container-custom flex h-20 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
           <span className="text-2xl font-bold tracking-tighter text-brand-black italic">BetaEvo</span>
           <span className="h-5 w-1 bg-brand-orange rotate-12 mx-0.5"></span>
           <span className="text-2xl font-bold tracking-tighter text-brand-black">ELECTRONICS</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/category/smartwatches" className="text-sm font-medium text-gray-600 hover:text-brand-black transition-colors">
            Smartwatches
          </Link>
          <Link href="/category/smart-audio" className="text-sm font-medium text-gray-600 hover:text-brand-black transition-colors">
            Smart Audio
          </Link>
          <Link href="/category/smart-glasses" className="text-sm font-medium text-gray-600 hover:text-brand-black transition-colors">
            Smart Glasses
          </Link>
          <Link href="/category/accessories" className="text-sm font-medium text-gray-600 hover:text-brand-black transition-colors">
            Accessories
          </Link>
          {isAdmin && (
             <Link href="/admin" className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors">
               Admin Panel 🛠️
             </Link>
          )}
          <Link href="/deals" className="text-sm font-bold text-brand-orange hover:text-orange-600 transition-colors">
            Deals 🔥
          </Link>
          <Link href="/gifting" className="text-sm font-bold text-brand-copper hover:text-amber-700 transition-colors">
            Gifting 🎁
          </Link>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="hidden md:flex text-brand-black hover:bg-gray-100">
            <Search className="h-5 w-5" />
          </Button>
          <Link href="/cart">
            <Button variant="ghost" size="sm" className="relative text-brand-black hover:bg-gray-100">
              <ShoppingBag className="h-5 w-5" />
              {/* Cart Badge - Static for now */}
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-orange text-[10px] font-bold text-white">
                0
              </span>
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" size="sm" className="text-brand-black hover:bg-gray-100">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          
          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden text-brand-black hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu (Simple implementation) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white p-4 shadow-lg">
          <div className="flex flex-col gap-4">
            <Link href="/category/smartwatches" className="text-sm font-medium text-gray-600">Smartwatches</Link>
            <Link href="/category/smart-audio" className="text-sm font-medium text-gray-600">Smart Audio</Link>
            <Link href="/category/smart-glasses" className="text-sm font-medium text-gray-600">Smart Glasses</Link>
            <Link href="/category/accessories" className="text-sm font-medium text-gray-600">Accessories</Link>
            {isAdmin && (
              <Link href="/admin" className="text-sm font-bold text-red-600">Admin Panel 🛠️</Link>
            )}
            <Link href="/deals" className="text-sm font-bold text-brand-orange">Deals 🔥</Link>
            <Link href="/gifting" className="text-sm font-bold text-brand-copper">Gifting 🎁</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
