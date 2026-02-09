'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';


const categories = [
  {
    name: "Smartwatches",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop",
    link: "/category/smartwatches"
  },
  {
    name: "Smart Audio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
    link: "/category/smart-audio"
  },
  {
    name: "Smart Glasses",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=2080&auto=format&fit=crop",
    link: "/category/smart-glasses"
  },
  {
    name: "Accessories",
    image: "/products/product-4.webp",
    link: "/category/accessories"
  }
];

// Container variant to stagger children
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// Card fade-up variant
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
} as const;

export function ShopByCategory() {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="flex items-center gap-2 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-black">Shop By</h2>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-orange">Categories</h2>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >

          {categories.map((category, index) => (
            <motion.div
              key={index}
              variants={cardVariants} 
              whileHover={{ y: -8, scale: 1.03 }}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 shadow-sm cursor-pointer"
            >
              <Link href={category.link} className="block w-full h-full">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                    <Button className="bg-white text-brand-black hover:bg-gray-200 min-w-[160px] shadow-lg pointer-events-none">
                      {category.name}
                    </Button>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
