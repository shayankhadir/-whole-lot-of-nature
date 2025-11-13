'use client';

/**
 * BlogPostCard Component
 * Displays a single blog post in card format
 */

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export interface BlogPost {
  id: string | number;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  featured_image?: string;
  author?: string;
  categories?: string[];
  tags?: string[];
  date: Date;
  readTime?: number; // minutes
  likes?: number;
}

interface BlogPostCardProps {
  post: BlogPost;
  variant?: 'card' | 'compact' | 'featured';
  onLike?: (id: string | number) => void;
  liked?: boolean;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, variant = 'card', onLike, liked = false }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white border-2 border-black rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
      >
        <div className="flex gap-4">
          {post.featured_image && (
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-20 h-20 object-cover rounded border border-black flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-black line-clamp-2 mb-1 antialiased">{post.title}</h3>
            <p className="text-xs text-gray-600">{formatDate(post.date)}</p>
            {post.readTime && <p className="text-xs text-[#2E7D32] font-bold antialiased">📖 {post.readTime} min read</p>}
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border-2 border-black rounded-lg overflow-hidden"
      >
        {/* Image */}
        {post.featured_image && (
          <div className="relative h-64 overflow-hidden bg-gray-200 border-b-2 border-black">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex gap-2 mb-3">
              {post.categories.slice(0, 2).map(cat => (
                <span key={cat} className="text-xs bg-[#2E7D32] text-[#2E7D32] px-3 py-1 rounded-full font-bold antialiased">
                  {cat}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h2 className="text-2xl font-bold text-black mb-3 antialiased">{post.title}</h2>

          {/* Excerpt */}
          <p className="text-gray-700 text-sm mb-4 line-clamp-3">{post.excerpt}</p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 font-medium mb-4">
            {post.author && <span>By {post.author}</span>}
            <span>{formatDate(post.date)}</span>
            {post.readTime && <span>📖 {post.readTime} min read</span>}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-xs bg-gray-100 text-black px-2 py-1 rounded border border-black">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Like button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onLike?.(post.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded border-2 font-bold transition-all ${
              liked ? 'border-[#2E7D32] bg-[#2E7D32] text-[#2E7D32]' : 'border-black text-black hover:border-[#2E7D32]'
            }`}
          >
            <span>❤️</span>
            <span>{post.likes || 0}</span>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Default: card variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ borderColor: '#2E7D32' }}
      className="bg-white border-2 border-black rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
    >
      {/* Image */}
      {post.featured_image && (
        <div className="relative h-48 overflow-hidden bg-gray-200 border-b-2 border-black">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="mb-2">
            <span className="inline-block text-xs bg-[#2E7D32] text-[#2E7D32] px-2 py-1 rounded-full font-bold antialiased">
              {post.categories[0]}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold text-black mb-2 line-clamp-2 group-hover:text-[#2E7D32] transition-colors antialiased">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{post.excerpt}</p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-gray-600 font-medium mb-3 border-t border-gray-200 pt-3">
          <span>{formatDate(post.date)}</span>
          {post.readTime && <span>📖 {post.readTime} min</span>}
        </div>

        {/* Like button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.preventDefault();
            onLike?.(post.id);
          }}
          className={`flex items-center gap-2 px-3 py-2 rounded border-2 text-sm font-bold transition-all ${
            liked ? 'border-[#2E7D32] bg-[#2E7D32] text-[#2E7D32]' : 'border-black text-black hover:border-[#2E7D32]'
          }`}
        >
          <span>❤️</span>
          <span>{post.likes || 0}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default BlogPostCard;
