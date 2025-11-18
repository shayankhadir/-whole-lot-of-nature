'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import BotanicalCategoryBento from '@/components/BotanicalCategoryBento';

const shopCategories = [
  {
    name: 'Indoor Plants',
    icon: '🌱',
    description: 'Trending green companions',
    href: '/shop?category=indoor-plants'
  },
  {
    name: 'Rare Plants',
    icon: '✨',
    description: 'Exclusive collections',
    href: '/shop?category=rare-plants'
  },
  {
    name: 'Plant Care',
    icon: '🪴',
    description: 'Care essentials',
    href: '/shop?category=plant-care'
  },
  {
    name: 'Soil & Amendments',
    icon: '🌍',
    description: 'Premium mediums',
    href: '/shop?category=soil'
  }
];

export default function ShopDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div ref={dropdownRef} className="relative group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-white/80 hover:text-[#66BB6A] transition-colors duration-300 font-medium"
      >
        Shop
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="absolute left-0 mt-2 w-screen max-w-md bg-gradient-to-b from-[#0F1E11] to-[#0D1B0F] border border-[#2E7D32]/30 rounded-lg shadow-2xl z-50 p-4 sm:p-6 backdrop-blur-sm"
        >
          {/* Featured Quick Links */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Link
                href="/shop"
                className="px-3 py-2 rounded-lg bg-[#66BB6A]/10 border border-[#66BB6A]/30 text-[#66BB6A] hover:bg-[#66BB6A]/20 transition-colors text-sm font-medium backdrop-blur-md"
              >
                All Products
              </Link>
              <Link
                href="/combos"
                className="px-3 py-2 rounded-lg bg-[#66BB6A]/10 border border-[#66BB6A]/30 text-[#66BB6A] hover:bg-[#66BB6A]/20 transition-colors text-sm font-medium backdrop-blur-md"
              >
                Combo Deals
              </Link>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="mb-4">
            <p className="text-xs text-white/50 uppercase tracking-wider mb-3">Categories</p>
            <BotanicalCategoryBento
              categories={shopCategories}
              textAutoHide={true}
              enableStars={false}
              enableSpotlight={false}
              enableBorderGlow={true}
              disableAnimations={false}
              enableTilt={false}
              enableMagnetism={false}
              clickEffect={false}
              columns={2}
            />
          </div>

          {/* Bottom CTA */}
          <Link
            href="/shop"
            className="block w-full mt-4 px-4 py-2 rounded-lg bg-[#66BB6A] text-[#0D1B0F] hover:bg-[#5aa85f] transition-colors text-center font-semibold text-sm"
          >
            Browse All
          </Link>
        </div>
      )}
    </div>
  );
}
