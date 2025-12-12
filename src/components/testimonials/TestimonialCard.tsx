'use client';

/**
 * TestimonialCard Component
 * Displays a single customer testimonial with rating
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export interface Testimonial {
  id: string;
  authorName: string;
  authorEmail?: string;
  authorImage?: string;
  content: string;
  rating: number; // 1-5 stars
  productName?: string;
  productId?: string | number;
  verifiedPurchase?: boolean;
  likes?: number;
  createdAt?: Date;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  variant?: 'card' | 'compact' | 'featured';
  onLike?: (id: string) => void;
  liked?: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  variant = 'card',
  onLike,
  liked = false,
}) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={star <= rating ? 'text-[#66BB6A]' : 'text-white/40'}
            size={18}
            fill={star <= rating ? 'currentColor' : 'none'}
          />
        ))}
      </div>
    );
  };

  const formatDate = (date?: Date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white border-2 border-black rounded-lg p-4 hover:shadow-md transition-all"
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-bold text-black antialiased">{testimonial.authorName}</p>
            {testimonial.productName && <p className="text-sm text-gray-600">{testimonial.productName}</p>}
          </div>
          {testimonial.verifiedPurchase && <span className="text-xs bg-[#66BB6A]/10 text-[#66BB6A] px-2 py-1 rounded font-bold antialiased">Verified</span>}
        </div>
        <p className="text-black text-sm mb-3 line-clamp-2">{testimonial.content}</p>
        <div className="flex items-center justify-between">
          {renderStars(testimonial.rating)}
          <span className="text-xs text-gray-500">{formatDate(testimonial.createdAt)}</span>
        </div>
      </motion.div>
    );
  }

  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-green-50 to-white border-2 border-black rounded-lg p-6 md:p-8"
      >
        {/* Quote icon */}
        <div className="text-4xl text-[#66BB6A] mb-4 opacity-50 antialiased">&ldquo;</div>

        {/* Stars */}
        <div className="mb-4">{renderStars(testimonial.rating)}</div>

        {/* Content */}
        <p className="text-black text-lg font-medium mb-6 leading-relaxed antialiased">{testimonial.content}</p>

        {/* Author info */}
        <div className="flex items-center justify-between border-t-2 border-black pt-4">
          <div>
            <p className="font-bold text-black antialiased">{testimonial.authorName}</p>
            {testimonial.productName && <p className="text-sm text-gray-600">{testimonial.productName}</p>}
          </div>
          <div className="text-right">
            {testimonial.verifiedPurchase && (
              <p className="text-xs text-[#2E7D32] font-bold mb-1 antialiased">Verified Purchase</p>
            )}
            <p className="text-xs text-gray-500">{formatDate(testimonial.createdAt)}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default card variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ borderColor: '#2E7D32' }}
      className="bg-white border-2 border-black rounded-lg p-5 transition-all hover:shadow-lg"
    >
      {/* Header with stars and verified badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {renderStars(testimonial.rating)}
            {testimonial.verifiedPurchase && (
              <span className="text-xs bg-[#2E7D32] text-white px-2 py-0.5 rounded font-bold antialiased">Verified</span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <p className="text-black text-sm leading-relaxed mb-4">{testimonial.content}</p>

      {/* Author */}
      <div className="border-t-2 border-black pt-4 mb-4">
        <p className="font-bold text-black antialiased">{testimonial.authorName}</p>
        {testimonial.productName && <p className="text-xs text-gray-600">{testimonial.productName}</p>}
        {testimonial.createdAt && <p className="text-xs text-gray-500 mt-1">{formatDate(testimonial.createdAt)}</p>}
      </div>

      {/* Like button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onLike?.(testimonial.id)}
        className={`flex items-center gap-2 px-3 py-2 rounded border-2 font-bold transition-all ${
          liked ? 'border-[#66BB6A] bg-[#66BB6A]/10 text-[#66BB6A]' : 'border-black text-black hover:border-[#66BB6A]'
        }`}
      >
        <span>{testimonial.likes || 0} Helpful</span>
      </motion.button>
    </motion.div>
  );
};

export default TestimonialCard;
