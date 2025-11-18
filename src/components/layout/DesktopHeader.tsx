'use client';

import { useEffect, useState, Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, Heart, User, ChevronDown } from 'lucide-react';
import { Transition } from '@headlessui/react';
import CartIcon from '../cart/CartIcon';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useRouter } from 'next/navigation';
import { navigation } from './navigationData';

/**
 * Desktop Header Component
 * - Transparent at top (scrollY === 0)
 * - Transitions to bg-[#202b22]/70 with backdrop-blur when scrollY > 24px
 * - Only shown on desktop (≥1024px)
 */
export default function DesktopHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    // Set initial state
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const headerGradient = scrolled
    ? 'linear-gradient(135deg, rgba(3,10,6,0.96), rgba(9,31,19,0.98))'
    : 'linear-gradient(135deg, rgba(3,10,6,0.78), rgba(9,31,19,0.9))';

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{ background: headerGradient }}
      className={`sticky top-0 left-0 w-full z-40 overflow-hidden border-b transition-all duration-300 ${
        scrolled
          ? 'border-white/10 backdrop-blur-xl shadow-[0_25px_70px_rgba(2,8,5,0.65)]'
          : 'border-transparent backdrop-blur-md shadow-none'
      }`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden>
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(circle at top, rgba(102,187,106,0.15), transparent 55%)' }}
        />
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs>
            <pattern id="header-leaf-grid" width="160" height="160" patternUnits="userSpaceOnUse">
              <path
                d="M0 80 Q40 0 80 80 T160 80"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="0.6"
                fill="none"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#header-leaf-grid)" />
        </svg>
      </div>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-20">
          {/* Left: Navigation Links */}
          <div className="flex items-center gap-8">
            {navigation.map((item, index) =>
              item.dropdown ? (
                <div
                  key={item.name}
                  className="relative"
                  onMouseLeave={() => setShopDropdownOpen(false)}
                >
                  <motion.button
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1 text-sm font-semibold tracking-wide uppercase text-white/85 hover:text-white"
                    onMouseEnter={() => setShopDropdownOpen(true)}
                    onClick={() => setShopDropdownOpen((open) => !open)}
                  >
                    {item.name}
                    <motion.div
                      animate={{ rotate: shopDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4" strokeWidth={1.5} />
                    </motion.div>
                  </motion.button>

                  <Transition
                    show={shopDropdownOpen}
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 -translate-y-2"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 -translate-y-2"
                  >
                    <div
                      className="fixed left-0 right-0 top-20 z-50 border-t border-white/10 bg-[#030a06]/95 shadow-[0_30px_90px_rgba(2,8,5,0.85)] backdrop-blur-xl"
                      onMouseEnter={() => setShopDropdownOpen(true)}
                    >
                      <div className="mx-auto w-full max-w-7xl p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
                          {item.dropdown.map((collection) => (
                            <Link
                              key={collection.title}
                              href={collection.href}
                              onClick={() => setShopDropdownOpen(false)}
                              className="group flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(2,8,5,0.65)] hover:border-[#66BB6A]/40 backdrop-blur-md"
                            >
                              <div className="relative overflow-hidden rounded-full bg-[#66BB6A]/15 p-4 ring-1 ring-[#66BB6A]/30 w-14 h-14 flex items-center justify-center backdrop-blur-md">
                                <collection.icon
                                  className="h-7 w-7 text-[#66BB6A]"
                                  aria-hidden="true"
                                  strokeWidth={1.75}
                                />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-white group-hover:text-[#66BB6A] transition-colors antialiased">
                                  {collection.title}
                                </h3>
                                <p className="mt-2 text-sm text-white/85">
                                  {collection.description}
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {collection.items.map((sub) => (
                                  <Link
                                    key={sub.name}
                                    href={sub.href}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShopDropdownOpen(false);
                                    }}
                                    className="inline-flex items-center rounded-md border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-white hover:border-[#66BB6A]/40 hover:text-[#66BB6A] backdrop-blur-md"
                                  >
                                    {sub.name}
                                  </Link>
                                ))}
                              </div>
                            </Link>
                          ))}
                        </div>
                        <div className="mt-4 flex items-center justify-between rounded-2xl border border-dashed border-white/20 bg-white/5 p-4 text-sm text-white/80 shadow-inner backdrop-blur-md">
                          <span>Looking for bundles or limited editions?</span>
                          <Link
                            href="/shop?tag=gift-bundles"
                            className="font-medium text-[#66BB6A] hover:text-white"
                            onClick={() => setShopDropdownOpen(false)}
                          >
                            Explore curated sets →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Transition>
                </div>
              ) : (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className="text-sm font-semibold tracking-wide uppercase text-white/85 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              )
            )}
          </div>

          {/* Center: Logo */}
          <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 flex-shrink-0 group">
            <Image
              src="/Whole%20lot%20of%20nature%20logo.png"
              alt="Whole Lot of Nature"
              width={180}
              height={60}
              className="h-14 w-auto transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </Link>

          {/* Right: Action Icons */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              {searchOpen ? (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  onSubmit={handleSearch}
                  className="flex items-center"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-48 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent backdrop-blur-sm"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="ml-2 p-2 text-white hover:text-white/80 transition-colors"
                  >
                    ✕
                  </button>
                </motion.form>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-white hover:text-white/80 transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-6 h-6" strokeWidth={2} />
                </motion.button>
              )}
            </div>

            {/* Wishlist */}
            <Link href="/wishlist" className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-white hover:text-white/80 transition-colors"
              >
                <Heart className="w-6 h-6" strokeWidth={2} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#2E7D32] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center antialiased">
                    {wishlistCount}
                  </span>
                )}
              </motion.div>
            </Link>

            {/* Account */}
            <Link href="/account">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-white hover:text-white/80 transition-colors"
              >
                <User className="w-6 h-6" strokeWidth={2} />
              </motion.div>
            </Link>

            {/* Cart - Rightmost */}
            <div className="ml-2">
              <CartIcon />
            </div>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
