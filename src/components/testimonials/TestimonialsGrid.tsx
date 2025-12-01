'use client';

/**
 * TestimonialsGrid Component
 * Displays multiple testimonials in a grid layout with filtering and sorting
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import TestimonialCard, { Testimonial } from './TestimonialCard';

interface TestimonialsGridProps {
  testimonials: Testimonial[];
  isLoading?: boolean;
  columns?: 1 | 2 | 3;
  showFilters?: boolean;
  showFeatured?: boolean;
  onLike?: (id: string) => void;
}

const TestimonialsGrid: React.FC<TestimonialsGridProps> = ({
  testimonials,
  isLoading = false,
  columns = 3,
  showFilters = true,
  showFeatured = true,
  onLike,
}) => {
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'helpful'>('recent');
  const [filterRating, setFilterRating] = useState<number | 'all'>(0);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  // Sort and filter testimonials
  const sortedTestimonials = useMemo(() => {
    let result = [...testimonials];

    // Filter by rating
    if (filterRating !== 'all' && filterRating > 0) {
      result = result.filter(t => t.rating === filterRating);
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'helpful':
        result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case 'recent':
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        break;
    }

    return result;
  }, [testimonials, sortBy, filterRating]);

  // Featured testimonial (highest rated recent one)
  const featured = showFeatured
    ? sortedTestimonials.find(t => t.rating === 5) || sortedTestimonials[0]
    : null;

  const displayTestimonials = featured
    ? [featured, ...sortedTestimonials.filter(t => t.id !== featured.id)]
    : sortedTestimonials;

  const handleLike = (id: string) => {
    const newLikedIds = new Set(likedIds);
    if (newLikedIds.has(id)) {
      newLikedIds.delete(id);
    } else {
      newLikedIds.add(id);
    }
    setLikedIds(newLikedIds);
    onLike?.(id);
  };

  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };

  if (isLoading) {
    return (
      <div className={`grid ${gridColsClass[columns]} gap-6`}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Featured Testimonial */}
      {featured && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-sm font-bold text-[#66BB6A] mb-3 antialiased">⭐ FEATURED TESTIMONIAL</p>
          <TestimonialCard
            testimonial={featured}
            variant="featured"
            onLike={handleLike}
            liked={likedIds.has(featured.id)}
          />
        </motion.div>
      )}

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 border-black rounded-lg p-4 mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Sort */}
            <div>
              <label className="block text-xs font-bold text-black mb-2 antialiased">Sort By:</label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="px-3 py-2 border-2 border-black rounded bg-white text-black font-bold focus:outline-none focus:border-[#2E7D32] antialiased"
                aria-label="Sort testimonials by"
              >
                <option value="recent">Most Recent</option>
                <option value="rating">Highest Rated</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>

            {/* Filter by rating */}
            <div>
              <label className="block text-xs font-bold text-black mb-2 antialiased">Rating:</label>
              <select
                value={filterRating}
                onChange={e => setFilterRating(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                className="px-3 py-2 border-2 border-black rounded bg-white text-black font-bold focus:outline-none focus:border-[#2E7D32] antialiased"
                aria-label="Filter by rating"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>

          {/* Count */}
          <p className="text-sm text-gray-600 font-bold antialiased">
            Showing {displayTestimonials.length} testimonial{displayTestimonials.length !== 1 ? 's' : ''}
          </p>
        </motion.div>
      )}

      {/* Testimonials Grid */}
      {displayTestimonials.length > 0 ? (
        <div className={`grid ${gridColsClass[columns]} gap-6`}>
          {displayTestimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (featured ? idx : idx) * 0.05 }}
            >
              <TestimonialCard
                testimonial={testimonial}
                variant={idx === 0 && featured ? 'card' : 'card'}
                onLike={handleLike}
                liked={likedIds.has(testimonial.id)}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-black text-xl font-bold mb-2 antialiased">No testimonials yet</p>
          <p className="text-gray-700">Be the first to share your experience!</p>
        </div>
      )}
    </div>
  );
};

export default TestimonialsGrid;
