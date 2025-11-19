'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Leaf, Droplet, Sparkles, Sprout, Gem, Package } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface WooCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
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
          // Filter out categories with no products, only show top-level categories (parent === 0), and limit to top 6
          const filteredCategories = data.data
            .filter((cat: WooCategory) => cat.count > 0 && cat.parent === 0)
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
      <section id="categories" className="relative py-24 px-4 bg-emerald-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-emerald-900/30 rounded-2xl" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="categories" className="relative py-24 px-4 overflow-hidden bg-emerald-950">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/backgrounds/seamless-tropical-canopy.svg"
          alt="Seamless tropical canopy"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/95 via-emerald-950/80 to-emerald-950/95" />
      </div>

      {/* Leaf Background Decorations */}
      <div className="absolute top-10 left-0 w-64 h-64 text-emerald-900/20 pointer-events-none z-0">
        <Leaf className="w-full h-full rotate-12" strokeWidth={0.5} />
      </div>
      <div className="absolute bottom-20 right-0 w-96 h-96 text-emerald-800/10 pointer-events-none z-0">
        <Leaf className="w-full h-full -rotate-12" strokeWidth={0.5} />
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
          <span className="section-eyebrow mb-4">Explore Our Collections</span>
          
          <h2 className="font-serif text-[clamp(2rem,5vw,3rem)] font-bold text-cream-50 mb-4">
            Shop by <span className="text-gold-gradient">Category</span>
          </h2>
          
          <p className="text-[clamp(1rem,2vw,1.125rem)] text-cream-200/80 max-w-2xl mx-auto font-sans">
            Discover curated collections for every gardening need
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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
                    className="group relative h-full p-8 rounded-[2rem] bg-emerald-900/20 backdrop-blur-md border border-emerald-800/50 overflow-hidden transition-all duration-300 hover:border-gold-500/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
                  >
                    {/* Hover Glow Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-gold-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />

                    {/* Icon */}
                    <div className="relative mb-8">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-900/40 border border-gold-500/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 group-hover:border-gold-500/40 transition-all duration-300 shadow-lg">
                        <Icon className="w-8 h-8 text-gold-400 group-hover:text-gold-300" strokeWidth={1.5} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative">
                      <h3 className="font-serif text-2xl font-bold text-cream-50 mb-3 group-hover:text-gold-200 transition-colors">
                        {category.name}
                      </h3>
                      
                      <p className="text-cream-200/60 text-sm leading-relaxed mb-8 line-clamp-2 font-sans">
                        {category.description || `Explore our ${category.name.toLowerCase()} collection`}
                      </p>

                      {/* Product Count Badge */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <span className="text-xs px-3 py-1.5 bg-emerald-900/40 border border-emerald-700/30 rounded-full text-emerald-300 group-hover:bg-gold-500/10 group-hover:border-gold-500/30 group-hover:text-gold-300 transition-all">
                          {category.count} {category.count === 1 ? 'Product' : 'Products'}
                        </span>

                        {/* Arrow */}
                        <div className="flex items-center gap-2 text-gold-400 font-medium text-sm group-hover:text-gold-300 transition-colors">
                          <span>Explore</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </div>
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
              className="btn-gold group"
            >
              <span className="flex items-center gap-2">
                View All Categories
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
