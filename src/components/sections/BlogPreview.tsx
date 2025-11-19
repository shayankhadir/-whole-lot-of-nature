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
    <section className="relative py-24 overflow-hidden bg-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-900/30 border border-emerald-800/50 rounded-full px-4 py-2 mb-4 backdrop-blur-md">
            <Leaf className="w-4 h-4 text-gold-400" />
            <span className="text-sm text-gold-400 font-semibold uppercase tracking-wider font-sans">
              Learn & Grow
            </span>
          </div>
          <h2 className="font-serif text-[clamp(2rem,5vw,3rem)] font-bold text-cream-50 mb-4">
            Latest from <span className="text-gold-gradient">Our Blog</span>
          </h2>
          <p className="text-[clamp(1rem,2vw,1.125rem)] text-cream-200/80 max-w-2xl mx-auto font-sans">
            Expert tips, plant care guides, and sustainable gardening insights
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group h-full"
            >
              <Link href={`/blog/${post.slug}`} className="block h-full">
                <article className="h-full flex flex-col bg-emerald-900/20 rounded-[2rem] overflow-hidden border border-emerald-800/30 hover:border-gold-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-black/20">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 to-transparent opacity-60" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-emerald-950/80 backdrop-blur-md text-gold-400 text-xs font-bold uppercase tracking-wider rounded-full border border-gold-500/20">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col">
                    <div className="flex items-center gap-2 text-cream-200/60 text-sm mb-3 font-sans">
                      <Calendar className="w-4 h-4" />
                      <time>{post.date}</time>
                    </div>
                    
                    <h3 className="text-xl font-serif font-bold text-cream-50 mb-3 line-clamp-2 group-hover:text-gold-400 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-cream-200/70 text-sm line-clamp-3 mb-6 font-sans flex-1">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center text-gold-400 font-medium text-sm group/link mt-auto font-sans">
                      Read Article
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
