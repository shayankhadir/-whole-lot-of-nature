'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight, Leaf } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  slug: string;
  date: string;
  category: string;
}

// Fallback blog posts
const defaultPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Complete Guide to Indoor Plant Care',
    excerpt: 'Learn the essential tips for keeping your indoor plants healthy and thriving year-round.',
    image: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?auto=format&fit=crop&w=800&q=80',
    slug: 'indoor-plant-care-guide',
    date: 'November 10, 2025',
    category: 'Plant Care',
  },
  {
    id: 2,
    title: 'Best Soil Mixes for Succulents',
    excerpt: 'Discover the perfect soil composition to help your succulents grow strong and beautiful.',
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=800&q=80',
    slug: 'best-soil-for-succulents',
    date: 'November 8, 2025',
    category: 'Soil & Nutrients',
  },
  {
    id: 3,
    title: 'Top 10 Air-Purifying Plants',
    excerpt: 'Transform your home into a clean air sanctuary with these natural air purifiers.',
    image: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=800&q=80',
    slug: 'air-purifying-plants',
    date: 'November 5, 2025',
    category: 'Plant Benefits',
  },
  {
    id: 4,
    title: 'Organic Fertilizers: A Complete Guide',
    excerpt: 'Everything you need to know about natural fertilizers and sustainable gardening practices.',
    image: 'https://images.unsplash.com/photo-1585571142672-bb022f70a6ac?auto=format&fit=crop&w=800&q=80',
    slug: 'organic-fertilizers-guide',
    date: 'November 1, 2025',
    category: 'Gardening Tips',
  },
];

export default function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>(defaultPosts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Try to fetch blog posts from API
    setLoading(true);
    fetch('/api/blog?limit=4')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.posts && data.posts.length > 0) {
          setPosts(data.posts);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-[var(--emerald-700)]/20 border border-[var(--emerald-700)]/30 rounded-full px-4 py-2 mb-4 backdrop-blur-md">
            <Leaf className="w-4 h-4 text-[var(--emerald-500)]" />
            <span className="text-[clamp(0.75rem,1.5vw,0.875rem)] text-[var(--emerald-500)] font-semibold uppercase tracking-wider antialiased">
              Learn & Grow
            </span>
          </div>
          <h2 className="font-montserrat text-[clamp(2rem,5vw,2.5rem)] font-bold text-[var(--emerald-500)] mb-4 antialiased">
            Latest from Our Blog
          </h2>
          <p className="text-[clamp(0.9375rem,2vw,1.125rem)] text-[var(--mint-100)] max-w-2xl mx-auto antialiased">
            Expert tips, plant care guides, and sustainable gardening insights
          </p>
        </motion.div>

        {/* Blog Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#2E7D32] border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block h-full"
                >
                  <div className="relative bg-gradient-to-br from-[#1e3a28] to-[#0F1E11] rounded-2xl overflow-hidden border border-[#2E7D32]/30 hover:border-[#2E7D32]/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#2E7D32]/20 h-full flex flex-col">
                    {/* Post Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B0F] via-transparent to-transparent opacity-60"></div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 bg-[#2E7D32] text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {post.category}
                      </div>
                    </div>

                    {/* Post Info */}
                    <div className="p-5 flex-1 flex flex-col">
                      {/* Date */}
                      <div className="flex items-center gap-2 text-white/50 text-[clamp(0.75rem,1.5vw,0.875rem)] mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-montserrat text-[clamp(1rem,2.5vw,1.125rem)] font-bold text-white mb-3 group-hover:text-[#66BB6A] transition-colors duration-300 line-clamp-2 antialiased">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-[clamp(0.875rem,1.5vw,0.9375rem)] text-white/85 mb-4 line-clamp-3 flex-1 antialiased">
                        {post.excerpt}
                      </p>

                      {/* Read More Link */}
                      <div className="flex items-center gap-1 text-[#66BB6A] text-sm font-semibold group-hover:gap-2 transition-all duration-300 pt-4 border-t border-[#2E7D32]/20">
                        <span>Read More</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#66BB6A] hover:text-[#2E7D32] font-semibold text-[clamp(0.9375rem,2vw,1.125rem)] transition-colors duration-300 group"
          >
            View All Articles
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
