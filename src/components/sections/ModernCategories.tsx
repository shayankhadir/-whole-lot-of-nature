'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Leaf, Droplet, Sparkles, Sprout, Gem, Package, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { DEMO_CATEGORIES, DEMO_CHILD_CATEGORIES } from '@/data/demoCatalog';
import { cleanProductDescription, cn } from '@/lib/utils';

interface WooCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  count: number;
  description: string;
  image: { src: string } | null;
}

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
        if (data.success && data.data?.length) {
          const allCategories: WooCategory[] = data.data;
          const topLevelCategories = allCategories.filter((cat) => (cat.count > 0 || cat.slug === 'ebooks') && cat.parent === 0 && cat.name !== 'Uncategorized');
          const childMap: Record<number, WooCategory[]> = {};

          allCategories
            .filter((cat) => cat.count > 0 && cat.parent !== 0 && cat.name !== 'Uncategorized')
            .forEach((child) => {
              if (!childMap[child.parent]) {
                childMap[child.parent] = [];
              }
              childMap[child.parent].push(child);
            });

          setCategories(topLevelCategories);
          setSubcategoriesByParent(childMap);
        } else {
          setCategories(DEMO_CATEGORIES as unknown as WooCategory[]);
          setSubcategoriesByParent(DEMO_CHILD_CATEGORIES as unknown as Record<number, WooCategory[]>);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch categories:', err);
        setCategories(DEMO_CATEGORIES as unknown as WooCategory[]);
        setSubcategoriesByParent(DEMO_CHILD_CATEGORIES as unknown as Record<number, WooCategory[]>);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="relative py-24 px-4 overflow-hidden bg-[#051F10]">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/backgrounds/ai-generated-lush-tropical-green-leaves-background-photo.jpg"
            alt="Leaf backdrop"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#010904]/85 via-[#051F10]/85 to-[#010904]/90" />
          <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-white/5 rounded-3xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-32 px-4 overflow-hidden bg-[#051F10]">
      {/* Ambient Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/backgrounds/ai-generated-lush-tropical-green-leaves-background-photo.jpg"
          alt="Leaf backdrop"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-800/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#010904]/80 via-[#051F10]/85 to-[#010904]/90" />
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <span className="inline-block text-emerald-400 font-medium tracking-wider text-sm uppercase mb-4">
              Curated Collections
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight mb-6">
              Essentials for Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                Green Sanctuary
              </span>
            </h2>
            <p className="text-emerald-100/60 text-lg leading-relaxed max-w-lg">
              Explore our handpicked categories designed to help you cultivate the perfect indoor and outdoor garden spaces.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link 
              href="/shop"
              className="group flex items-center gap-2 text-white font-medium hover:text-emerald-400 transition-colors"
            >
              View All Categories
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = getCategoryIcon(category.name);
            const childCategories = subcategoriesByParent[category.id] || [];
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "group relative rounded-[2rem] overflow-hidden border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500",
                  // Optional: make first item span 2 cols if we have enough items
                  // index === 0 ? "md:col-span-2 lg:col-span-2" : "" 
                )}
              >
                <Link href={`/shop?category=${category.slug}`} className="block h-full p-8 md:p-10">
                  {/* Hover Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10 h-full flex flex-col">
                    {/* Icon Header */}
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-emerald-500/20">
                        <Icon className="w-7 h-7 text-emerald-400" />
                      </div>
                      <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-300">
                        <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-white -rotate-45 group-hover:rotate-0 transition-all duration-300" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mt-auto">
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-emerald-100/50 text-sm leading-relaxed mb-6 line-clamp-2">
                        {cleanProductDescription(category.description) || `Explore our premium collection of ${category.name.toLowerCase()}.`}
                      </p>

                      {/* Subcategories Pills */}
                      {childCategories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {childCategories.slice(0, 3).map((sub) => (
                            <span 
                              key={sub.id}
                              className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-emerald-100/70 group-hover:border-emerald-500/30 transition-colors"
                            >
                              {sub.name}
                            </span>
                          ))}
                          {childCategories.length > 3 && (
                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-emerald-100/70">
                              +{childCategories.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
