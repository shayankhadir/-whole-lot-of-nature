'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/shop/ProductCard';
import { Product } from '@/types/product';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X } from 'lucide-react';

// Separate component to handle search params
function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategoriesByParent, setSubcategoriesByParent] = useState<Record<number, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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
        const allCategories = result.data;
        // Get only top-level categories
        const topLevel = allCategories.filter((cat: any) => cat.count > 0 && cat.parent === 0);
        // Get subcategories mapped by parent
        const subMap: Record<number, any[]> = {};
        allCategories
          .filter((cat: any) => cat.count > 0 && cat.parent !== 0)
          .forEach((child: any) => {
            if (!subMap[child.parent]) {
              subMap[child.parent] = [];
            }
            subMap[child.parent].push(child);
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

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => 
        p.categories.some(cat => cat.slug === selectedCategory)
      );

  return (
    <div className="min-h-screen bg-[#030a06] text-white">
      {/* Header Section */}
      <div className="relative bg-[#05150a] border-b border-white/5 py-16 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(102,187,106,0.2),transparent_50%)]" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 antialiased tracking-tight"
          >
            Our Collection
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/60 max-w-2xl mx-auto"
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
                  ✦ All Products
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
                          {subcategoriesByParent[cat.id].map((subcat: any) => (
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
                    <button onClick={() => setMobileFiltersOpen(false)} className="p-2 text-white/60 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`block w-full text-left px-4 py-3 rounded-lg text-sm transition-all ${
                          selectedCategory === cat.id
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
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm text-white/60">
                    Showing {filteredProducts.length} results
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
                    <p className="text-xl text-white/50 antialiased">No products found in this category.</p>
                    <button 
                      onClick={() => handleCategoryChange('all')}
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
