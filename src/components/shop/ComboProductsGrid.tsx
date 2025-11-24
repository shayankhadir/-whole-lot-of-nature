'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ComboProductCard from './ComboProductCard';
import { ChevronDown } from 'lucide-react';

interface ComboProduct {
  id: string;
  name: string;
  description: string;
  items: {
    id: string;
    name: string;
    image: string;
    originalPrice: number;
    quantity: number;
  }[];
  comboPrice: number;
  originalTotalPrice: number;
  savings: number;
  image: string;
  category: string;
  inStock: boolean;
  popularCombo: boolean;
}

interface ComboProductsGridProps {
  combos: ComboProduct[];
  title?: string;
  subtitle?: string;
  onAddToCart?: (combo: ComboProduct) => void;
  onAddToWishlist?: (combo: ComboProduct) => void;
  onQuickView?: (combo: ComboProduct) => void;
}

const categories = [
  'All Combos',
  'Starter Packs',
  'Indoor Plant Sets',
  'Succulent Collections',
  'Aquatic Plant Bundles',
  'Care Bundles',
  'Seasonal Offers'
];

const sortOptions = [
  { label: 'Best Savings', value: 'savings' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Newest First', value: 'newest' }
];

export default function ComboProductsGrid({
  combos,
  title = "Plant Combo Deals",
  subtitle = "Save more with our curated plant bundles",
  onAddToCart,
  onAddToWishlist,
  onQuickView
}: ComboProductsGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('All Combos');
  const [sortBy, setSortBy] = useState('savings');
  const [showFilters, setShowFilters] = useState(false);

  // Filter combos by category
  const filteredCombos = combos.filter(combo => 
    selectedCategory === 'All Combos' || combo.category === selectedCategory
  );

  // Sort combos
  const sortedCombos = [...filteredCombos].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.comboPrice - b.comboPrice;
      case 'price_desc':
        return b.comboPrice - a.comboPrice;
      case 'savings':
        return b.savings - a.savings;
      case 'popular':
        return (b.popularCombo ? 1 : 0) - (a.popularCombo ? 1 : 0);
      default:
        return 0;
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white mb-4 antialiased"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-white/90 max-w-2xl mx-auto antialiased"
        >
          {subtitle}
        </motion.p>
      </div>

      {/* Filters and Sorting */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
            >
              <span className="text-sm text-gray-700">
                Sort by: {sortOptions.find(opt => opt.value === sortBy)?.label}
              </span>
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
              >
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setShowFilters(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      sortBy === option.value ? 'text-primary-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-white/80">
          Showing {sortedCombos.length} combo{sortedCombos.length !== 1 ? 's' : ''} 
          {selectedCategory !== 'All Combos' && ` in ${selectedCategory}`}
        </div>
      </div>

      {/* Products Grid */}
      {sortedCombos.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {sortedCombos.map((combo) => (
            <motion.div key={combo.id} variants={itemVariants}>
              <ComboProductCard
                combo={combo}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
                onQuickView={onQuickView}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4 antialiased">🌱</div>
          <h3 className="text-xl font-semibold text-white mb-2 antialiased">No combos found</h3>
          <p className="text-white/90">Try adjusting your filters or check back later for new combo deals.</p>
        </div>
      )}

      {/* Load More Button */}
      {sortedCombos.length > 0 && (
        <div className="text-center mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Load More Combos
          </motion.button>
        </div>
      )}
    </div>
  );
}
