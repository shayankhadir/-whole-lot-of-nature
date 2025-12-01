'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Product } from '@/types/product';
import { getCategoryIcon } from '@/lib/categoryIcons';
import { Search, X, Check, Star } from 'lucide-react';

interface FilterControlsProps {
  products: Product[];
  categories: { id: number; name: string; count: number; slug?: string }[];
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
  search: string;
  onSearchChange: (q: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  availability: { in: boolean; out: boolean };
  onAvailabilityChange: (state: { in: boolean; out: boolean }) => void;
  minRating: number; // 0 means any
  onRatingChange: (value: number) => void;
  onClearAll: () => void;
}

export default function FilterControls({
  products,
  categories,
  selectedCategory,
  onCategoryChange,
  search,
  onSearchChange,
  onPriceRangeChange,
  availability,
  onAvailabilityChange,
  minRating,
  onRatingChange,
  onClearAll,
}: FilterControlsProps) {
  const [localSearch, setLocalSearch] = useState(search);
  useEffect(() => setLocalSearch(search), [search]);
  useEffect(() => onSearchChange(localSearch), [localSearch, onSearchChange]);

  const prices = useMemo(
    () =>
      products
        .map((product) => parseFloat(product.sale_price || product.regular_price || product.price || '0'))
        .filter((price) => price > 0),
    [products]
  );
  const minPrice = prices.length > 0 ? Math.floor(Math.min(...prices)) : 0;
  const maxPrice = prices.length > 0 ? Math.ceil(Math.max(...prices)) : 1000;
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  useEffect(() => setPriceRange([minPrice, maxPrice]), [minPrice, maxPrice]);

  const handlePriceChange = (range: [number, number]) => {
    setPriceRange(range);
    onPriceRangeChange(range);
  };

  const clearAll = () => {
    onCategoryChange(null);
    setLocalSearch('');
    const full: [number, number] = [minPrice, maxPrice];
    setPriceRange(full);
    onPriceRangeChange(full);
    onAvailabilityChange({ in: true, out: true });
    onRatingChange(0);
    onClearAll();
  };

  return (
    <div className="space-y-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      {/* Search */}
      <div>
        <label className="text-sm font-semibold text-gray-900 mb-2 block">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-600" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-9 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {localSearch && (
            <button
              type="button"
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100"
              onClick={() => setLocalSearch('')}
            >
              <X className="h-4 w-4 text-primary-600" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 antialiased">Categories</h2>
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={`block w-full text-left px-4 py-2 rounded-lg transition-all border ${
              selectedCategory === null
                ? 'bg-primary-50 border-primary-200 text-primary-800'
                : 'bg-white text-gray-800 border-gray-200 hover:border-primary-200 hover:bg-primary-50/50'
            }`}
          >
            All Products
          </button>
          {categories?.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`block w-full text-left px-4 py-2 rounded-lg transition-all border ${
                selectedCategory === category.id
                  ? 'bg-primary-50 border-primary-200 text-primary-800'
                  : 'bg-white text-gray-800 border-gray-200 hover:border-primary-200 hover:bg-primary-50/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {(() => {
                const Icon = getCategoryIcon(category.slug || category.name);
                return (
                  <span className="inline-flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary-600" />
                    {category.name}
                  </span>
                );
              })()}
              <span className="ml-1 text-gray-500">({category.count})</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 antialiased">Availability</h2>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-gray-800">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
              checked={availability.in}
              onChange={(e) => onAvailabilityChange({ ...availability, in: e.target.checked })}
            />
            In Stock
          </label>
          <label className="flex items-center gap-2 text-gray-800">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
              checked={availability.out}
              onChange={(e) => onAvailabilityChange({ ...availability, out: e.target.checked })}
            />
            Out of Stock
          </label>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 antialiased">Price Range</h2>
        <div className="px-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1">
              <label htmlFor="price-min" className="block text-xs text-gray-600 mb-1">Min</label>
              <input
                id="price-min"
                type="number"
                min={minPrice}
                max={priceRange[1]}
                value={priceRange[0]}
                onChange={(e) => handlePriceChange([parseInt(e.target.value || '0', 10), priceRange[1]])}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="price-max" className="block text-xs text-gray-600 mb-1">Max</label>
              <input
                id="price-max"
                type="number"
                min={priceRange[0]}
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value || '0', 10)])}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={priceRange[0]}
            onChange={(e) => handlePriceChange([parseInt(e.target.value), priceRange[1]])}
            className="w-full accent-primary-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            aria-label="Minimum price range"
          />
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={priceRange[1]}
            onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value)])}
            className="w-full mt-2 accent-primary-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            aria-label="Maximum price range"
          />
          <div className="flex justify-between mt-2 text-gray-600 text-sm">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 antialiased">Rating</h2>
        <div className="space-y-2">
          {[5, 4, 3, 0].map((r) => (
            <button
              key={r}
              onClick={() => onRatingChange(r)}
              className={`w-full flex items-center justify-between px-4 py-2 rounded-lg border transition ${
                minRating === r
                  ? 'border-primary-300 bg-primary-50 text-primary-800'
                  : 'border-gray-200 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                {r === 0 ? (
                  'Any rating'
                ) : (
                  <span className="inline-flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < r ? 'fill-primary-600 text-primary-600' : 'text-primary-300'}`}
                      />
                    ))}
                    <span className="ml-2">{r}★+</span>
                  </span>
                )}
              </span>
              {minRating === r && <Check className="h-4 w-4 text-primary-700" />}
            </button>
          ))}
        </div>
      </div>

      {/* Clear All */}
      <div className="pt-2">
        <button
          onClick={clearAll}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}