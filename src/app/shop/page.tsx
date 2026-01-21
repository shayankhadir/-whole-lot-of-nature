'use client';

import Image from 'next/image';
import Script from 'next/script';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/shop/ProductCard';
import { Product, ProductCategory } from '@/types/product';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Search } from 'lucide-react';

import type { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Buy Premium Plants Online | Whole Lot of Nature',
  description: 'Shop premium indoor and outdoor plants online. Expert plant care, fast delivery across Bangalore. Soil mixes, pots, and gardening supplies available.',
  openGraph: {
    title: 'Buy Premium Plants Online | Whole Lot of Nature',
    description: 'Shop premium indoor and outdoor plants online. Expert plant care, fast delivery across Bangalore. Soil mixes, pots, and gardening supplies available.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
    url: 'https://wholelotofnature.com/shop',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy Premium Plants Online | Whole Lot of Nature',
    description: 'Shop premium indoor and outdoor plants online. Expert plant care, fast delivery across Bangalore. Soil mixes, pots, and gardening supplies available.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://wholelotofnature.com/shop',
  },
};



// Separate component to handle search params
function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [subcategoriesByParent, setSubcategoriesByParent] = useState<Record<number, ProductCategory[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name'); // 'name', 'price-asc', 'price-desc', 'newest'
  const siteUrl = 'https://wholelotofnature.com';

  // Sync state with URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('all');
    }
  }, [searchParams]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const result = await response.json();
      
      if (result.success && result.data) {
        const allCategories = result.data as ProductCategory[];
        // Get only top-level categories
        const topLevel = allCategories.filter((cat) => cat.count > 0 && cat.parent === 0);
        // Get subcategories mapped by parent
        const subMap: Record<number, ProductCategory[]> = {};
        allCategories
          .filter((cat) => cat.count > 0 && cat.parent !== 0)
          .forEach((child) => {
            const parentId = child.parent || 0;
            if (!subMap[parentId]) {
              subMap[parentId] = [];
            }
            subMap[parentId].push(child);
          });
        
        setCategories(topLevel);
        setSubcategoriesByParent(subMap);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=50');
      const result = await response.json();
      
      if (result.success && result.data) {
        setProducts(result.data);
      } else {
        console.error('Failed to fetch products:', result.error);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    if (slug === 'all') {
      router.push('/shop', { scroll: false });
    } else {
      router.push(`/shop?category=${slug}`, { scroll: false });
    }
    setMobileFiltersOpen(false);
  };

  const toggleCategoryExpand = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Filter and sort products
  let filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => 
        p.categories.some(cat => cat.slug === selectedCategory)
      );

  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.short_description?.toLowerCase().includes(query)
    );
  }

  // Apply sorting
  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
      case 'price-desc':
        return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
      case 'newest':
        return new Date(b.date_created || 0).getTime() - new Date(a.date_created || 0).getTime();
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const shopSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Shop Plants & Gardening Essentials',
    description: 'Shop premium indoor and outdoor plants, soil mixes, planters, and gardening essentials delivered across India.',
    url: `${siteUrl}/shop`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: products.slice(0, 12).map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: product.name,
        url: `${siteUrl}/shop/${product.slug}`
      }))
    }
  };

  return (
    <div className="min-h-screen bg-[var(--brand-bg1)] text-white">
      <Script
        id="ld-shop"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(shopSchema) }}
      />
      {/* Header Section */}
      <div className="relative border-b border-white/5 py-12 sm:py-16 px-4 sm:px-6 overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.0))]">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(102,187,106,0.2),transparent_50%)]" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[clamp(2rem,6vw,3rem)] font-bold text-white mb-3 antialiased tracking-tight"
          >
            Our Collection
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[clamp(0.95rem,2.2vw,1.125rem)] text-white/70 max-w-2xl mx-auto"
          >
            Curated plants, sustainable essentials, and handcrafted goods for your green sanctuary.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-72 flex-shrink-0 space-y-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400 mb-6">Categories</h3>
              <div className="space-y-1">
                {/* All Products Button */}
                <button
                  onClick={() => handleCategoryChange('all')}
                  className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all font-medium ${
                    selectedCategory === 'all'
                      ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/40'
                      : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  All Products
                </button>

                {/* Categories with Subcategories */}
                {categories.map(cat => (
                  <div key={cat.id}>
                    <div className="flex items-center">
                      <button
                        onClick={() => handleCategoryChange(cat.slug)}
                        className={`flex-1 text-left px-4 py-2.5 rounded-lg text-sm transition-all ${
                          selectedCategory === cat.slug
                            ? 'bg-emerald-500/30 text-emerald-200 font-medium border border-emerald-500/40'
                            : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        {cat.name}
                      </button>
                      {subcategoriesByParent[cat.id] && subcategoriesByParent[cat.id].length > 0 && (
                        <button
                          onClick={() => toggleCategoryExpand(cat.id)}
                          className="px-2 py-2.5 text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          <span className={`transition-transform inline-block ${expandedCategories.has(cat.id) ? 'rotate-180' : ''}`}>
                            ▼
                          </span>
                        </button>
                      )}
                    </div>

                    {/* Subcategories */}
                    {expandedCategories.has(cat.id) && subcategoriesByParent[cat.id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 mt-2 pl-4 border-l-2 border-emerald-500/20">
                          {subcategoriesByParent[cat.id].map((subcat) => (
                            <button
                              key={subcat.id}
                              onClick={() => handleCategoryChange(subcat.slug)}
                              className={`block w-full text-left px-3 py-2 rounded text-xs transition-all ${
                                selectedCategory === subcat.slug
                                  ? 'bg-emerald-400/20 text-emerald-200 font-medium'
                                  : 'text-white/50 hover:text-white/70 hover:bg-white/3'
                              }`}
                            >
                              → {subcat.name}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-sm font-medium text-white"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {mobileFiltersOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileFiltersOpen(false)}
                  className="fixed inset-0 bg-black/80 z-50 lg:hidden backdrop-blur-sm"
                />
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  className="fixed inset-y-0 right-0 w-80 bg-[#0a1f12] z-50 lg:hidden p-6 shadow-2xl border-l border-white/10"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-semibold text-white">Filters</h3>
                    <button 
                      onClick={() => setMobileFiltersOpen(false)} 
                      title="Close filters"
                      className="p-2 text-white/60 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.slug)}
                        className={`block w-full text-left px-4 py-3 rounded-lg text-sm transition-all ${
                          selectedCategory === cat.slug
                            ? 'bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30'
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] rounded-2xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                {/* Search and Sort Bar */}
                <div className="mb-8 flex flex-col sm:flex-row gap-4">
                  {/* Search Input */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/15 transition-all"
                    />
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <label htmlFor="sort-select" className="sr-only">Sort products</label>
                    <select
                      id="sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/15 transition-all cursor-pointer [&>option]:bg-[#1a2e1a] [&>option]:text-white"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm text-white/60">
                    Showing {filteredProducts.length} results{searchQuery && ` for "${searchQuery}"`}
                  </p>
                </div>
                
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 rounded-2xl border border-dashed border-white/10 bg-white/5">
                    <p className="text-xl text-white/50 antialiased">
                      {searchQuery ? `No products match "${searchQuery}".` : 'No products found in this category.'}
                    </p>
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        handleCategoryChange('all');
                      }}
                      className="mt-4 text-emerald-400 hover:text-emerald-300 text-sm font-medium"
                    >
                      View all products
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030a06]" />}>
      <ShopContent />
    </Suspense>
  );
}
