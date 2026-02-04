'use client';

import Link from 'next/link';
import { ShoppingBag, User, Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';

export function Navbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAdmin = session?.user?.email?.toLowerCase() === 'rs21rohit@gmail.com';

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container-custom flex h-16 md:h-20 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 z-50">
           <span className="text-xl md:text-2xl font-bold tracking-tighter text-brand-black italic">BetaEvo</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
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
        <div className="flex items-center gap-2 md:gap-4 z-50">
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
          <Link href="/profile" className="hidden md:block">
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
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {isMobileMenuOpen &&
        createPortal(
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] bg-white md:hidden overflow-y-auto"
          >
            <div className="container-custom flex h-16 items-center justify-between border-b border-gray-100">
               <Link href="/" className="flex items-center gap-1" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="text-xl font-bold tracking-tighter text-brand-black italic">BetaEvo</span>
               </Link>
               <Button 
                 variant="ghost" 
                 size="sm" 
                 onClick={() => setIsMobileMenuOpen(false)}
                 className="text-brand-black hover:bg-gray-100"
               >
                 <X className="h-5 w-5" />
               </Button>
            </div>
            <div className="container-custom py-6 flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <Link href="/category/smartwatches" className="text-lg font-medium text-gray-800 border-b border-gray-100 pb-2" onClick={() => setIsMobileMenuOpen(false)}>Smartwatches</Link>
                <Link href="/category/smart-audio" className="text-lg font-medium text-gray-800 border-b border-gray-100 pb-2" onClick={() => setIsMobileMenuOpen(false)}>Smart Audio</Link>
                <Link href="/category/smart-glasses" className="text-lg font-medium text-gray-800 border-b border-gray-100 pb-2" onClick={() => setIsMobileMenuOpen(false)}>Smart Glasses</Link>
                <Link href="/category/accessories" className="text-lg font-medium text-gray-800 border-b border-gray-100 pb-2" onClick={() => setIsMobileMenuOpen(false)}>Accessories</Link>
                {isAdmin && (
                  <Link href="/admin" className="text-lg font-bold text-red-600 border-b border-gray-100 pb-2" onClick={() => setIsMobileMenuOpen(false)}>Admin Panel 🛠️</Link>
                )}
                <Link href="/deals" className="text-lg font-bold text-brand-orange border-b border-gray-100 pb-2" onClick={() => setIsMobileMenuOpen(false)}>Deals 🔥</Link>
                <Link href="/gifting" className="text-lg font-bold text-brand-copper border-b border-gray-100 pb-2" onClick={() => setIsMobileMenuOpen(false)}>Gifting 🎁</Link>
              </div>
              <div className="flex flex-col gap-4 mt-4">
                <Link href="/profile" className="flex items-center gap-3 text-lg font-medium text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
                  <User className="h-5 w-5" />
                  My Account
                </Link>
                <div className="flex items-center gap-3 text-lg font-medium text-gray-800">
                  <Search className="h-5 w-5" />
                  Search
                </div>
              </div>
            </div>
          </motion.div>,
          document.body
        )
      }
    </nav>
  );
}
