'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Leaf, Droplet, Sparkles, Sprout, Gem, Package } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface WooCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
  description: string;
  image: any;
}

// Map category names to icons
const getCategoryIcon = (name: string): LucideIcon => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('soil') || lowerName.includes('growing')) return Sprout;
  if (lowerName.includes('plant') || lowerName.includes('indoor') || lowerName.includes('outdoor')) return Leaf;
  if (lowerName.includes('aquatic') || lowerName.includes('water')) return Droplet;
  if (lowerName.includes('wellness') || lowerName.includes('herbal')) return Sparkles;
  if (lowerName.includes('decor') || lowerName.includes('miniature')) return Gem;
  return Package;
};

export default function ModernCategories() {
  const [categories, setCategories] = useState<WooCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          // Filter out categories with no products and limit to top 6
          const filteredCategories = data.data
            .filter((cat: WooCategory) => cat.count > 0)
            .slice(0, 6);
          setCategories(filteredCategories);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch categories:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section id="categories" className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-emerald-900/20 rounded-2xl" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="categories" className="relative py-20 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-emerald-950/30 to-slate-950" />
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(16,185,129,0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-300 text-sm font-medium tracking-wider uppercase mb-4"
          >
            Explore Our Collections
          </motion.span>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-200 via-green-300 to-emerald-400 bg-clip-text text-transparent mb-4">
            Shop by Category
          </h2>
          
          <p className="text-emerald-100/80 text-lg max-w-2xl mx-auto">
            Discover curated collections for every gardening need
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category, index) => {
            const Icon = getCategoryIcon(category.name);
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/shop?category=${category.slug}`}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group relative h-full p-8 rounded-2xl bg-gradient-to-br from-emerald-900/40 via-slate-900/50 to-emerald-950/40 border border-emerald-500/20 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-emerald-400/40 hover:shadow-[0_20px_60px_rgba(16,185,129,0.2)]"
                  >
                    {/* Hover Glow Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-green-500/0 to-emerald-600/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                    />

                    {/* Icon */}
                    <div className="relative mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-600/20 border border-emerald-400/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <Icon className="w-8 h-8 text-emerald-300" strokeWidth={1.5} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative">
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">
                        {category.name}
                      </h3>
                      
                      <p className="text-emerald-100/70 text-sm leading-relaxed mb-6 line-clamp-2">
                        {category.description || `Explore our ${category.name.toLowerCase()} collection`}
                      </p>

                      {/* Product Count Badge */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-200/80 group-hover:bg-emerald-500/20 group-hover:border-emerald-400/40 transition-all">
                          {category.count} {category.count === 1 ? 'Product' : 'Products'}
                        </span>

                        {/* Arrow */}
                        <div className="flex items-center gap-2 text-emerald-300 font-medium text-sm">
                          <span>Explore</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View All Categories Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-full shadow-lg hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all"
            >
              <span className="flex items-center gap-2">
                View All Categories
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
