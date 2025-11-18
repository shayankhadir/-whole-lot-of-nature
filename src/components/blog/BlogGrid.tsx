'use client';

/**
 * BlogGrid Component
 * Displays blog posts in grid with category filtering
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import BlogPostCard, { BlogPost } from './BlogPostCard';
import BlogCategoryFilter, { BlogCategory } from './BlogCategoryFilter';

interface BlogGridProps {
  posts: BlogPost[];
  categories: BlogCategory[];
  isLoading?: boolean;
  columns?: 1 | 2 | 3;
  showSearch?: boolean;
  onPostClick?: (post: BlogPost) => void;
}

const BlogGrid: React.FC<BlogGridProps> = ({
  posts,
  categories,
  isLoading = false,
  columns = 3,
  showSearch = true,
  onPostClick,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [likedIds, setLikedIds] = useState<Set<string | number>>(new Set());

  // Filter posts
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Filter by category
    if (selectedCategory) {
      result = result.filter(post =>
        post.categories?.some(cat => cat.toLowerCase() === selectedCategory?.toLowerCase())
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        post =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return result;
  }, [posts, selectedCategory, searchQuery]);

  const handleLike = (id: string | number) => {
    const newLikedIds = new Set(likedIds);
    if (newLikedIds.has(id)) {
      newLikedIds.delete(id);
    } else {
      newLikedIds.add(id);
    }
    setLikedIds(newLikedIds);
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
          <div key={i} className="h-80 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Category Filter */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <BlogCategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          variant="cards"
        />
      </motion.div>

      {/* Search Bar */}
      {showSearch && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white border-2 border-black rounded-lg p-4">
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border-2 border-black rounded focus:outline-none focus:border-[#2E7D32] bg-white text-black placeholder-gray-500"
            />
          </div>
        </motion.div>
      )}

      {/* Results count */}
      {(selectedCategory || searchQuery) && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-100 font-medium mb-4"
        >
          Found {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
        </motion.p>
      )}

      {/* Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className={`grid ${gridColsClass[columns]} gap-6`}>
          {filteredPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onPostClick?.(post)}
            >
              <BlogPostCard
                post={post}
                onLike={handleLike}
                liked={likedIds.has(post.id)}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-white border-2 border-black rounded-lg"
        >
          <p className="text-black text-xl font-bold mb-2 antialiased">No posts found</p>
          <p className="text-gray-700">
            {selectedCategory ? 'Try selecting a different category' : 'No blog posts available yet'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default BlogGrid;
