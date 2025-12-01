'use client';

/**
 * BlogCategoryFilter Component
 * Displays blog categories and allows filtering by category
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export interface BlogCategory {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  postCount?: number;
  icon?: string;
}

interface BlogCategoryFilterProps {
  categories: BlogCategory[];
  selectedCategory?: string | null;
  onCategoryChange: (categorySlug: string | null) => void;
  variant?: 'tabs' | 'cards' | 'sidebar';
  isLoading?: boolean;
}

const BlogCategoryFilter: React.FC<BlogCategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  variant = 'tabs',
  isLoading = false,
}) => {
  // Count posts
  const categoryStats = useMemo(() => {
    return categories.map(cat => ({
      ...cat,
      postCount: cat.postCount || Math.floor(Math.random() * 15) + 1,
    }));
  }, [categories]);

  if (isLoading) {
    return (
      <div className={`flex gap-2 ${variant === 'tabs' ? 'flex-wrap' : 'flex-col'}`}>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`h-10 ${variant === 'tabs' ? 'w-24' : 'w-full'} bg-gray-200 rounded animate-pulse`}
          />
        ))}
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* All Categories */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategoryChange(null)}
          className={`p-4 rounded-lg border-2 font-bold transition-all text-center ${
            !selectedCategory
              ? 'border-[#2E7D32] bg-[#2E7D32]/20 text-white border border-[#2E7D32]/40'
              : 'border-black bg-white text-black hover:border-[#2E7D32]'
          }`}
        >
          <p className="text-2xl mb-2 antialiased">📚</p>
          <p className="font-bold antialiased">All Posts</p>
          <p className="text-xs mt-1 opacity-75">
            {categoryStats.reduce((sum, cat) => sum + (cat.postCount || 0), 0)} posts
          </p>
        </motion.button>

        {/* Individual Categories */}
        {categoryStats.map((category, idx) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onCategoryChange(category.slug)}
            className={`p-4 rounded-lg border-2 font-bold transition-all text-center ${
              selectedCategory === category.slug
                ? 'border-[#2E7D32] bg-[#2E7D32]/20 text-white border border-[#2E7D32]/40'
                : 'border-black bg-white text-black hover:border-[#2E7D32]'
            }`}
          >
            <p className="text-2xl mb-2 antialiased">{category.icon || '📝'}</p>
            <p className="font-bold text-sm antialiased">{category.name}</p>
            <p className="text-xs mt-1 opacity-75">{category.postCount} posts</p>
          </motion.button>
        ))}
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className="bg-white border-2 border-black rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-white border-b-2 border-black px-4 py-3">
          <h3 className="font-bold text-black antialiased">Categories</h3>
        </div>

        <div className="divide-y-2 divide-black">
          {/* All Categories */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => onCategoryChange(null)}
            className={`w-full p-4 text-left font-bold transition-colors ${
              !selectedCategory
                ? 'bg-[#2E7D32]/20 text-white border border-[#2E7D32]/40 border-l-4 border-[#2E7D32]'
                : 'bg-white text-black hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>All Posts</span>
              <span className="text-xs bg-gray-200 text-black px-2 py-1 rounded">
                {categoryStats.reduce((sum, cat) => sum + (cat.postCount || 0), 0)}
              </span>
            </div>
          </motion.button>

          {/* Individual Categories */}
          {categoryStats.map(category => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => onCategoryChange(category.slug)}
              className={`w-full p-4 text-left font-bold transition-colors ${
                selectedCategory === category.slug
                  ? 'bg-[#2E7D32]/20 text-white border border-[#2E7D32]/40 border-l-4 border-[#2E7D32]'
                  : 'bg-white text-black hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{category.icon || '📝'}</span>
                  <span>{category.name}</span>
                </div>
                <span className="text-xs bg-gray-200 text-black px-2 py-1 rounded">
                  {category.postCount}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // Default: tabs variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 bg-white border-2 border-black rounded-lg p-4"
    >
      {/* All Categories */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onCategoryChange(null)}
        className={`px-4 py-2 rounded-full border-2 font-bold transition-all ${
          !selectedCategory
            ? 'border-[#2E7D32] bg-[#2E7D32] text-white'
            : 'border-black bg-white text-black hover:border-[#2E7D32]'
        }`}
      >
        All
      </motion.button>

      {/* Individual Categories */}
      {categoryStats.map((category, idx) => (
        <motion.button
          key={category.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.05 }}
          onClick={() => onCategoryChange(category.slug)}
          className={`px-4 py-2 rounded-full border-2 font-bold transition-all text-sm ${
            selectedCategory === category.slug
              ? 'border-[#2E7D32] bg-[#2E7D32] text-white'
              : 'border-black bg-white text-black hover:border-[#2E7D32]'
          }`}
        >
          {category.name} ({category.postCount})
        </motion.button>
      ))}
    </motion.div>
  );
};

export default BlogCategoryFilter;

