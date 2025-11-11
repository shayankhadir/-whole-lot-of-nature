"use client";

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Button from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import { useProducts, useProductCategories } from '@/lib/hooks/useProducts';
import ProductGrid from '@/components/shop/ProductGrid';
import ProductListJsonLd from '@/components/seo/ProductListJsonLd';
import FilterControls from '@/components/shop/FilterControls';
import CategoryHeader from '@/components/shop/CategoryHeader';
import MobileFilterDrawer from '@/components/shop/MobileFilterDrawer';
import ProductGridSkeleton from '@/components/skeletons/ProductGridSkeleton';
import FilterSkeleton from '@/components/skeletons/FilterSkeleton';
import { useLoading } from '@/context/LoadingContext';

export default function ShopPageContent() {
  const [search, setSearch] = useState('');
  const { data: products = [], isLoading, refetch } = useProducts({ search });
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { startLoading, stopLoading } = useLoading();
  
  // Debounce search to avoid rapid refetches
  useEffect(() => {
    const t = setTimeout(() => {
      refetch();
    }, 300);
    return () => clearTimeout(t);
  }, [search, refetch]);

  // Show/hide loading screen during product fetch
  useEffect(() => {
    if (isLoading) {
      startLoading('Finding plants for you...');
    } else {
      stopLoading();
    }
  }, [isLoading, startLoading, stopLoading]);
  
  const { data: categories = [] } = useProductCategories();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [availability, setAvailability] = useState<{ in: boolean; out: boolean }>({ in: true, out: true });
  const [minRating, setMinRating] = useState<number>(0);

  // On first load or when URL changes, hydrate state from query params
  useEffect(() => {
    const params = searchParams;
    if (!params) return;

    const q = params.get('q') || '';
    if (q !== search) setSearch(q);

    const sort = params.get('sort') || 'featured';
    if (sort !== sortBy) setSortBy(sort);

    const min = params.get('min');
    const max = params.get('max');
    if (min || max) {
      const minNum = Math.max(0, Number(min || 0));
      const maxNum = Math.max(minNum, Number(max || 5000));
      if (minNum !== priceRange[0] || maxNum !== priceRange[1]) setPriceRange([minNum, maxNum]);
    }

    const inParam = params.get('in');
    const outParam = params.get('out');
    if (inParam !== null || outParam !== null) {
      const next = {
        in: inParam !== '0',
        out: outParam !== '0',
      };
      if (next.in !== availability.in || next.out !== availability.out) setAvailability(next);
    }

    const rating = Number(params.get('rating') || 0);
    if (!Number.isNaN(rating) && rating !== minRating) setMinRating(rating);

    // Map ?category=slugOrId -> category id
    const slugOrId = params.get('category');
    if (slugOrId && Array.isArray(categories) && categories.length > 0) {
      const match = (categories as any[]).find((c) => c.slug === slugOrId || String(c.id) === slugOrId);
      if (match && match.id !== selectedCategory) setSelectedCategory(match.id);
    }
  }, [searchParams, categories]);

  // Sync state to URL (shallow) when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (selectedCategory) {
      const cat = (categories as any[]).find((c) => c.id === selectedCategory);
      if (cat) params.set('category', cat.slug || String(cat.id));
    }
    if (sortBy && sortBy !== 'featured') params.set('sort', sortBy);
    if (priceRange[0] !== 0) params.set('min', String(priceRange[0]));
    if (priceRange[1] !== 5000) params.set('max', String(priceRange[1]));
    if (!availability.in) params.set('in', '0');
    if (!availability.out) params.set('out', '0');
    if (minRating > 0) params.set('rating', String(minRating));

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    router.replace(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedCategory, sortBy, priceRange, availability, minRating, pathname]);

  // Helper to safely parse price strings like "₹299" to number 299
  const parsePrice = (value?: string) => {
    if (!value) return 0;
    const cleaned = value.toString().replace(/[^\d.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const stripHtml = (html?: string) => (html || '').replace(/<[^>]*>/g, ' ');

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter(product => 
        product.categories.some(cat => cat.id === selectedCategory)
      );
    }

    // Availability filter
    filtered = filtered.filter(product => {
      if (availability.in && availability.out) return true;
      if (availability.in) return product.in_stock;
      if (availability.out) return !product.in_stock;
      return true;
    });

    // Rating filter
    filtered = filtered.filter(product => {
      const r = product.average_rating ?? 0;
      return r >= minRating;
    });

    // Price range filter
    filtered = filtered.filter(product => {
      const price = parsePrice(product.sale_price || product.regular_price || product.price || '0');
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Client-side search over name, descriptions and tags
    if (search && search.trim().length > 0) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p => {
        const hay = [
          p.name,
          stripHtml(p.short_description),
          stripHtml(p.description),
          ...(p.tags?.map(t => t.name) || [])
        ].join(' ').toLowerCase();
        return hay.includes(q);
      });
    }

    return [...filtered].sort((a, b) => {
      const priceA = parsePrice(a.sale_price || a.regular_price || a.price || '0');
      const priceB = parsePrice(b.sale_price || b.regular_price || b.price || '0');

      switch (sortBy) {
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        case 'price-low-high':
          return priceA - priceB;
        case 'price-high-low':
          return priceB - priceA;
        case 'name-az':
          return a.name.localeCompare(b.name);
        case 'name-za':
          return b.name.localeCompare(a.name);
        case 'newest':
          return new Date(b.date_created || 0).getTime() - new Date(a.date_created || 0).getTime();
        case 'best-rating':
          return (b.average_rating || 0) - (a.average_rating || 0);
        default:
          return 0;
      }
    });
  }, [products, selectedCategory, priceRange, sortBy, availability, minRating, search]);

  const currentCategory = useMemo(() => {
    if (!selectedCategory) return null;
    return categories.find((cat: any) => cat.id === selectedCategory) || null;
  }, [categories, selectedCategory]);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-10">
        {/* JSON-LD: Product List / ItemList */}
        <ProductListJsonLd
          url={(process.env.NEXT_PUBLIC_SITE_URL || 'https://wholelotofnature.com') + '/shop'}
          items={filteredProducts.slice(0, 30).map((p) => ({
            name: p.name,
            url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://wholelotofnature.com') + `/shop/${p.slug}`,
          }))}
        />
        <div className="mb-6 flex flex-col gap-4">
          <CategoryHeader 
            category={currentCategory} 
            productCount={filteredProducts.length} 
          />
          {/* Top bar: Sort on the right */}
          <div className="flex items-center justify-between">
            <div />
            <div className="flex items-center gap-3">
              <label htmlFor="sort" className="text-sm text-gray-600">Sort By</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="featured">Featured</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name-az">Name: A-Z</option>
                <option value="name-za">Name: Z-A</option>
                <option value="newest">Newest First</option>
                <option value="best-rating">Best Rating</option>
              </select>
            </div>
          </div>
        </div>

        <div className="lg:hidden mb-6">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-50 border border-primary-300 text-primary-800 rounded-xl hover:bg-primary-100 transition-all"
            onClick={() => setIsMobileFiltersOpen(true)}
          >
            <SlidersHorizontal className="h-5 w-5" />
            <span className="font-semibold">Filters</span>
          </button>
        </div>

        <MobileFilterDrawer
          isOpen={isMobileFiltersOpen}
          onClose={() => setIsMobileFiltersOpen(false)}
        >
          <FilterControls
            products={products}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={(category) => {
              setSelectedCategory(category);
              setIsMobileFiltersOpen(false);
            }}
            onPriceRangeChange={setPriceRange}
            search={search}
            onSearchChange={setSearch}
            availability={availability}
            onAvailabilityChange={setAvailability}
            minRating={minRating}
            onRatingChange={setMinRating}
            onClearAll={() => {
              setSelectedCategory(null);
              setSearch('');
              setAvailability({ in: true, out: true });
              setMinRating(0);
              setSortBy('featured');
            }}
          />
        </MobileFilterDrawer>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block w-72 flex-none">
            <div className="sticky top-24">
              {isLoading ? (
                <FilterSkeleton />
              ) : (
                <FilterControls
                  products={products}
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  onPriceRangeChange={setPriceRange}
                  search={search}
                  onSearchChange={setSearch}
                  availability={availability}
                  onAvailabilityChange={setAvailability}
                  minRating={minRating}
                  onRatingChange={setMinRating}
                  onClearAll={() => {
                    setSelectedCategory(null);
                    setSearch('');
                    setAvailability({ in: true, out: true });
                    setMinRating(0);
                    setSortBy('featured');
                  }}
                />
              )}
            </div>
          </div>

          <motion.div
            className="flex-1"
            layout
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ProductGridSkeleton count={8} />
                </motion.div>
              ) : filteredProducts.length === 0 ? (
                <motion.div
                  key="no-products"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-20 bg-primary-50 rounded-2xl border border-primary-200"
                >
                  <p className="text-gray-900 text-xl mb-2">No products found</p>
                  <p className="text-gray-600">Try adjusting your filters</p>
                  {selectedCategory && (
                    <Button onClick={() => setSelectedCategory(null)} className="mt-4">
                      Clear Filters
                    </Button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="products"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ProductGrid products={filteredProducts} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
