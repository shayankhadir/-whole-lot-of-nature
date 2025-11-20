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
  const [subcategoriesByParent, setSubcategoriesByParent] = useState<Record<number, WooCategory[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const allCategories: WooCategory[] = data.data;
          const topLevelCategories = allCategories.filter((cat) => cat.count > 0 && cat.parent === 0);
          const childMap: Record<number, WooCategory[]> = {};

          allCategories
            .filter((cat) => cat.count > 0 && cat.parent !== 0)
            .forEach((child) => {
              if (!childMap[child.parent]) {
                childMap[child.parent] = [];
              }
              childMap[child.parent].push(child);
            });

          setCategories(topLevelCategories);
          setSubcategoriesByParent(childMap);
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
            {[...Array(12)].map((_, i) => (
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
    <section id="categories" className="relative py-20 px-4 overflow-hidden bg-[var(--surface-onyx)]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/backgrounds/bgleaf2.png"
          alt="Tropical monstera leaves background"
          fill
          className="object-cover opacity-15"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#010a05]/98 via-[#041107]/94 to-[#010a05]/98" />
      </div>

      {/* Leaf Background Decorations */}
      <div className="absolute top-10 left-0 w-64 h-64 text-[var(--emerald-700)]/5 pointer-events-none z-0">
        <Leaf className="w-full h-full rotate-12" strokeWidth={0.5} />
      </div>
      <div className="absolute bottom-20 right-0 w-96 h-96 text-[var(--emerald-500)]/5 pointer-events-none z-0">
        <Leaf className="w-full h-full -rotate-12" strokeWidth={0.5} />
      </div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#010904]/80 via-[#020f07]/70 to-[#010904]/85 pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[var(--emerald-700)]/20 border border-[var(--emerald-700)]/30 rounded-full px-4 py-2 mb-4 backdrop-blur-md">
            <Package className="w-4 h-4 text-emerald-400" />
            <span className="text-[clamp(0.75rem,1.5vw,0.875rem)] text-emerald-400 font-semibold uppercase tracking-wider antialiased">
              Explore Our Collections
            </span>
          </div>
          
          <h2 className="font-montserrat text-[clamp(2rem,5vw,2.5rem)] font-bold text-cream-50 mb-4 antialiased">
            Shop by <span className="text-emerald-400">Category</span>
          </h2>
          
          <p className="text-[clamp(0.9375rem,2vw,1.125rem)] text-cream-100 max-w-2xl mx-auto antialiased">
            Discover curated collections for every gardening need
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category, index) => {
            const Icon = getCategoryIcon(category.name);
            const childCategories = subcategoriesByParent[category.id] || [];
            
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
                    className="group relative h-full p-8 rounded-[var(--radius-lg)] bg-[var(--ink-700)]/40 backdrop-blur-md border border-[var(--emerald-700)]/20 overflow-hidden transition-all duration-300 hover:border-[var(--emerald-500)]/40 hover:shadow-[var(--shadow-card)]"
                  >
                    {/* Hover Glow Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-[var(--emerald-500)]/0 via-[var(--emerald-700)]/0 to-[var(--emerald-900)]/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                    />

                    {/* Icon */}
                    <div className="relative mb-6">
                      <div className="w-16 h-16 rounded-[var(--radius-md)] bg-[var(--emerald-700)]/20 border border-[var(--emerald-500)]/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <Icon className="w-8 h-8 text-emerald-400" strokeWidth={1.5} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative">
                      <h3 className="text-2xl font-bold text-cream-50 mb-3 group-hover:text-emerald-400 transition-colors antialiased">
                        {category.name}
                      </h3>
                      
                      <p className="text-cream-100 text-sm leading-relaxed mb-6 line-clamp-2 antialiased">
                        {category.description || `Explore our ${category.name.toLowerCase()} collection`}
                      </p>

                      {childCategories.length > 0 && (
                        <div className="mb-6">
                          <p className="text-xs uppercase tracking-wide text-emerald-300 mb-2 antialiased">Subcategories</p>
                          <div className="flex flex-wrap gap-2">
                            {childCategories.slice(0, 4).map((subcat) => (
                              <span
                                key={subcat.id}
                                className="px-3 py-1 rounded-full bg-[var(--emerald-900)]/40 border border-[var(--emerald-700)]/30 text-emerald-200 text-xs antialiased"
                              >
                                {subcat.name}
                              </span>
                            ))}
                            {childCategories.length > 4 && (
                              <span className="px-3 py-1 rounded-full bg-[var(--emerald-900)]/40 border border-[var(--emerald-700)]/30 text-emerald-200 text-xs antialiased">
                                +{childCategories.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Product Count Badge */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-3 py-1.5 bg-[var(--emerald-700)]/20 border border-[var(--emerald-700)]/30 rounded-full text-emerald-300 group-hover:bg-[var(--emerald-500)]/20 group-hover:border-[var(--emerald-500)]/40 transition-all antialiased">
                          {category.count} {category.count === 1 ? 'Product' : 'Products'}
                        </span>

                        {/* Arrow */}
                        <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm antialiased">
                          <span>Explore</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-[var(--emerald-500)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
              className="group px-8 py-4 bg-[var(--emerald-500)] text-white font-semibold rounded-full shadow-[var(--shadow-card)] hover:bg-[var(--emerald-700)] transition-all antialiased"
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
