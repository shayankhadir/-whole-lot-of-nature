'use client';

import { useEffect, useState, Fragment, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, Heart, User, ChevronDown, Loader2 } from 'lucide-react';
import { Transition } from '@headlessui/react';
import CartIcon from '../cart/CartIcon';
import { useWishlistStore } from '@/stores/wishlistStore';
import { navigation } from './navigationData';
import { useSearchStore } from '@/stores/searchStore';
import { useProductCategories } from '@/hooks/useProductCategories';
import type { WooCommerceCategory } from '@/lib/services/woocommerceService';
import { DEMO_CATEGORIES } from '@/data/demoCatalog';

type CategoryNode = WooCommerceCategory & { children: CategoryNode[] };
const REQUIRED_CATEGORY_SLUGS = ['seeds', 'ebooks'];

/**
 * Desktop Header Component
 * - Transparent at top (scrollY === 0)
 * - Transitions to bg-[#202b22]/70 with backdrop-blur when scrollY > 24px
 * - Only shown on desktop (≥1024px)
 */
export default function DesktopHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const openSearch = useSearchStore((state) => state.open);
  const { categories, isLoading: categoriesLoading } = useProductCategories();

  const normalizedCategories = useMemo(() => filterAndAugmentCategories(categories), [categories]);
  const categoryTree = useMemo<CategoryNode[]>(() => buildCategoryTree(normalizedCategories), [normalizedCategories]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    // Set initial state
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!shopDropdownOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShopDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShopDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shopDropdownOpen]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setShopDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShopDropdownOpen(false);
    }, 200);
  };

  const headerGradient = scrolled
    ? 'linear-gradient(135deg, rgba(27,64,36,0.96), rgba(21,50,28,0.98))'
    : 'linear-gradient(135deg, rgba(27,64,36,0.85), rgba(21,50,28,0.92))';

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{ background: headerGradient }}
      className={`sticky top-0 left-0 w-full z-40 border-b transition-all duration-300 ${
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
              item.name.toLowerCase() === 'shop' ? (
                <div
                  key={item.name}
                  className="relative"
                  onMouseLeave={handleMouseLeave}
                  onMouseEnter={handleMouseEnter}
                  ref={dropdownRef}
                >
                  <motion.button
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1 text-sm font-semibold tracking-wide uppercase text-white/85 hover:text-white"
                    aria-haspopup="true"
                    aria-expanded={shopDropdownOpen}
                    onClick={() => setShopDropdownOpen((prev) => !prev)}
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
                      className="fixed left-0 right-0 top-20 z-50 border-t border-white/10 bg-[#030a06]/95 shadow-[0_30px_90px_rgba(2,8,5,0.85)] backdrop-blur-xl max-h-[calc(100vh-6rem)] overflow-y-auto"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="mx-auto w-full max-w-7xl p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {categoriesLoading && (
                            <div className="col-span-full flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6 text-white/90">
                              <Loader2 className="h-5 w-5 animate-spin text-[#66BB6A]" />
                              <span className="ml-3">Loading categories...</span>
                            </div>
                          )}

                          {!categoriesLoading && categoryTree.length === 0 && (
                            <div className="col-span-full rounded-2xl border border-dashed border-white/15 bg-white/5 p-6 text-white/90">
                              Live WooCommerce categories will appear here once they are published.
                            </div>
                          )}

                          {categoryTree.map((parent) => (
                            <article
                              key={parent.id}
                              className="group flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(2,8,5,0.65)] hover:border-[#66BB6A]/40 backdrop-blur-md"
                            >
                              <Link
                                href={`/shop?category=${encodeURIComponent(parent.slug)}`}
                                className="flex flex-col gap-2"
                                onClick={() => setShopDropdownOpen(false)}
                              >
                                <h3 className="text-[17px] font-semibold text-white group-hover:text-[#66BB6A] transition-colors antialiased">
                                  {parent.name}
                                </h3>
                                <p className="text-sm text-white/80">
                                  {getCategoryDescription(parent)}
                                </p>
                              </Link>
                              <div className="space-y-2">
                                {parent.children.length > 0 ? (
                                  parent.children.map((child) => (
                                    <Link
                                      key={child.id}
                                      href={`/shop?category=${encodeURIComponent(child.slug)}`}
                                      onClick={() => setShopDropdownOpen(false)}
                                      className="flex items-center gap-2 text-sm text-white/80 hover:text-white"
                                    >
                                      <span className="h-px w-6 bg-white/30" aria-hidden />
                                      <span>{child.name}</span>
                                    </Link>
                                  ))
                                ) : (
                                  <p className="text-xs uppercase tracking-wide text-white/40">All items</p>
                                )}
                              </div>
                            </article>
                          ))}
                        </div>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-white/20 bg-white/5 p-4 text-sm text-white/80 shadow-inner backdrop-blur-md">
                          <span>Need curated bundles or gift sets?</span>
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
              src="/logo.png"
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
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={openSearch}
              className="p-2 text-white hover:text-white/80 transition-colors"
              aria-label="Open search"
            >
              <Search className="w-6 h-6" strokeWidth={2} />
            </motion.button>

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

const filterAndAugmentCategories = (categoryList: WooCommerceCategory[] = []): WooCommerceCategory[] => {
  const filtered = categoryList.filter((category) => category.slug !== 'uncategorized');
  const missing = REQUIRED_CATEGORY_SLUGS.filter((slug) => !filtered.some((category) => category.slug === slug));

  if (!missing.length) {
    return filtered;
  }

  const additions = DEMO_CATEGORIES.filter((category) => missing.includes(category.slug)).map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    parent: category.parent,
    description: category.description,
    image: category.image || undefined,
  }));

  return [...filtered, ...additions];
};

const buildCategoryTree = (categories: WooCommerceCategory[] = []): CategoryNode[] => {
  const map = new Map<number, CategoryNode>();
  categories.forEach((category) => {
    map.set(category.id, { ...category, children: [] });
  });

  const roots: CategoryNode[] = [];
  const sortByName = (a: CategoryNode, b: CategoryNode) => a.name.localeCompare(b.name);

  map.forEach((node) => {
    if (node.parent && node.parent !== 0 && map.has(node.parent)) {
      map.get(node.parent)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  map.forEach((node) => node.children.sort(sortByName));
  roots.sort(sortByName);

  return roots;
};

const getCategoryDescription = (category: WooCommerceCategory): string => {
  if (!category.description) {
    return 'Explore thoughtfully sourced botanicals.';
  }

  const stripped = category.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  if (!stripped) {
    return 'Explore thoughtfully sourced botanicals.';
  }

  return stripped.length > 120 ? `${stripped.slice(0, 117)}...` : stripped;
};
