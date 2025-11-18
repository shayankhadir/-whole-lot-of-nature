'use client';

import { FocusCards } from '@/components/ui/focus-cards';
import Link from 'next/link';

export default function CategoryGridFocus() {
  const categories = [
    {
      title: 'Plants',
      src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop',
      href: '/shop?category=plants',
      description: 'Indoor, outdoor & aquatic plants'
    },
    {
      title: 'Aquatic Life & Ecosystem',
      src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop',
      href: '/shop?category=aquatic-life-ecosystem',
      description: 'Aquatic plants & pond companions'
    },
    {
      title: 'Soil & Growing Media',
      src: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=2070&auto=format&fit=crop',
      href: '/shop?category=soil-growing-media',
      description: 'Premium soils, mixes & amendments'
    },
    {
      title: 'Herbal Products',
      src: 'https://images.unsplash.com/photo-1587884294758-8c579e90a49b?q=80&w=2070&auto=format&fit=crop',
      href: '/shop?category=herbal-products',
      description: 'Natural hair oil & herbal tablets'
    },
    {
      title: 'Miniature Plant Decor',
      src: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?q=80&w=2070&auto=format&fit=crop',
      href: '/shop?category=miniature-plant-decor',
      description: 'Handmade miniatures & decor'
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-montserrat text-[clamp(1.5rem,4vw,2.5rem)] font-bold text-[#66BB6A] mb-4 antialiased">
            Shop by Category
          </h2>
          <p className="text-[clamp(0.875rem,2vw,1.125rem)] text-white/85 max-w-2xl mx-auto antialiased">
            Explore our curated collections for your green sanctuary
          </p>
        </div>

        {/* Focus Cards */}
        <FocusCards cards={categories} />

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[#66BB6A] hover:text-[#2E7D32] font-semibold text-[clamp(0.9375rem,2vw,1.125rem)] transition-colors duration-300 group"
          >
            View All Products
            <svg 
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
