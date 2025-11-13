'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, Heart, User } from 'lucide-react';
import CartIcon from '../cart/CartIcon';
import { useWishlistStore } from '@/stores/wishlistStore';

const navigation = [
  { name: 'Shop', href: '/shop' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
];

/**
 * Desktop Header Component
 * - Transparent at top (scrollY === 0)
 * - Transitions to bg-[#202b22]/70 with backdrop-blur when scrollY > 24px
 * - Only shown on desktop (≥1024px)
 */
export default function DesktopHeader() {
  const [scrolled, setScrolled] = useState(false);
  const wishlistCount = useWishlistStore((s) => s.items.length);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    // Set initial state
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#202b22]/70 backdrop-blur-lg border-b border-[#2E7D32]/20 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <Image
              src="/Whole%20lot%20of%20nature%20logo.png"
              alt="Whole Lot of Nature"
              width={180}
              height={60}
              className="h-14 w-auto transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
              >
                <Link
                  href={item.href}
                  className="text-sm font-semibold tracking-wide uppercase text-white/90 hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-white/90 hover:text-white transition-colors"
              aria-label="Search"
            >
              <Search className="w-6 h-6" strokeWidth={2} />
            </motion.button>

            {/* Wishlist */}
            <Link href="/wishlist" className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-white/90 hover:text-white transition-colors"
              >
                <Heart className="w-6 h-6" strokeWidth={2} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#2E7D32] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </motion.div>
            </Link>

            {/* Cart */}
            <CartIcon />

            {/* Account */}
            <Link href="/account">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-white/90 hover:text-white transition-colors"
              >
                <User className="w-6 h-6" strokeWidth={2} />
              </motion.div>
            </Link>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
