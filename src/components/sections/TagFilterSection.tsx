'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Tag, TrendingUp, Sparkles, ArrowRight, ShoppingCart } from 'lucide-react';
import { Product } from '@/types/product';
import { DEMO_TAGS, DEMO_TAG_PRODUCTS } from '@/data/demoCatalog';

interface ProductTag {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export default function TagFilterSection() {
  const [tags, setTags] = useState<ProductTag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Trendy tags to prioritize/filter
  const TRENDY_TAGS = ['vastu', 'bedroom', 'office', 'lucky', 'air-purifying', 'low-maintenance', 'indoor', 'beginner-friendly', 'outdoor'];

  // Fetch tags on mount
  useEffect(() => {
    fetch('/api/tags')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length) {
          // Filter to include only trendy tags and top tags
          const allTags: ProductTag[] = data.data;
          const trendyTags = allTags.filter(tag => 
            TRENDY_TAGS.some(trendy => tag.slug.toLowerCase().includes(trendy.toLowerCase()) || tag.name.toLowerCase().includes(trendy.toLowerCase()))
          );
          
          // If we have trendy tags, use them; otherwise use top 8
          const tagsToUse = trendyTags.length > 0 ? trendyTags.slice(0, 8) : allTags.slice(0, 8);
          
          setTags(tagsToUse);
          if (tagsToUse.length > 0) {
            setSelectedTag(tagsToUse[0].slug);
          }
        } else {
          // Fallback to demo tags
          const filteredDemo = DEMO_TAGS.filter(tag => 
            TRENDY_TAGS.some(trendy => tag.slug.toLowerCase().includes(trendy.toLowerCase()) || tag.name.toLowerCase().includes(trendy.toLowerCase()))
          );
          setTags(filteredDemo.length > 0 ? filteredDemo : DEMO_TAGS);
          setSelectedTag((filteredDemo.length > 0 ? filteredDemo : DEMO_TAGS)[0]?.slug ?? null);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch tags:', err);
        const filteredDemo = DEMO_TAGS.filter(tag => 
          TRENDY_TAGS.some(trendy => tag.slug.toLowerCase().includes(trendy.toLowerCase()) || tag.name.toLowerCase().includes(trendy.toLowerCase()))
        );
        setTags(filteredDemo.length > 0 ? filteredDemo : DEMO_TAGS);
        setSelectedTag((filteredDemo.length > 0 ? filteredDemo : DEMO_TAGS)[0]?.slug ?? null);
        setLoading(false);
      });
  }, []);

  // Fetch products when tag changes
  useEffect(() => {
    if (!selectedTag) return;
    
    setLoading(true);
    fetch(`/api/products?tag=${selectedTag}&limit=8`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length) {
          setProducts(data.data);
        } else {
          setProducts(DEMO_TAG_PRODUCTS[selectedTag] || []);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
        setProducts(DEMO_TAG_PRODUCTS[selectedTag] || []);
        setLoading(false);
      });
  }, [selectedTag]);

  return (
    <section className="relative py-24 px-4 overflow-hidden bg-[var(--surface-onyx)]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/backgrounds/bgleaf3.png"
          alt="Tropical palm leaves background"
          fill
          className="object-cover opacity-12"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#010a05]/98 via-[#041107]/94 to-[#010a05]/98" />
      </div>

      {/* Leaf Background Decorations */}
      <div className="absolute top-20 right-10 w-72 h-72 text-[var(--emerald-700)]/5 pointer-events-none z-0">
        <Tag className="w-full h-full rotate-45" strokeWidth={0.3} />
      </div>
      <div className="absolute bottom-10 left-10 w-56 h-56 text-[var(--emerald-500)]/5 pointer-events-none z-0">
        <Sparkles className="w-full h-full" strokeWidth={0.3} />
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
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--emerald-700)]/20 border border-[var(--emerald-700)]/30 rounded-full text-emerald-400 text-sm font-medium tracking-wider uppercase mb-4 backdrop-blur-md antialiased"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Popular Collections</span>
          </motion.div>
          
          <h2 className="font-montserrat text-[clamp(2rem,5vw,2.5rem)] font-bold text-cream-50 mb-4 antialiased">
            Shop by <span className="text-emerald-400">Tags</span>
          </h2>
          
          <p className="text-[clamp(0.9375rem,2vw,1.125rem)] text-white/90 max-w-2xl mx-auto antialiased">
            Discover products by our most popular tags and themes
          </p>
        </motion.div>

        {/* Tag Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {tags.map((tag, index) => (
            <motion.button
              key={tag.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTag(tag.slug)}
              className={`group px-6 py-3 rounded-full font-medium transition-all duration-300 antialiased ${
                selectedTag === tag.slug
                  ? 'bg-emerald-500 text-white shadow-[var(--shadow-card)]'
                  : 'bg-[var(--ink-700)]/40 text-emerald-300 border border-[var(--emerald-700)]/30 hover:bg-[var(--emerald-700)]/20 hover:border-emerald-400/40'
              }`}
            >
              <span className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                {tag.name}
                <span className="text-xs opacity-70">({tag.count})</span>
              </span>
            </motion.button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-emerald-900/20 rounded-2xl mb-4" />
                <div className="h-4 bg-emerald-900/20 rounded mb-2" />
                <div className="h-3 bg-emerald-900/20 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Link href={`/shop/${product.slug}`}>
                    <motion.div
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="group relative h-full rounded-2xl bg-gradient-to-br from-[#1e3a28] to-[#0F1E11] overflow-hidden border border-[#2E7D32]/30 hover:border-[#2E7D32]/60 transition-all duration-300 hover:shadow-2xl hover:shadow-[#2E7D32]/20"
                    >
                      {/* Image */}
                      <div className="relative h-56 overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0].src}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#0d3512]">
                            <Sparkles className="w-12 h-12 text-[#66BB6A]/30" />
                          </div>
                        )}
                        
                        {/* Darker Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B0F]/80 via-transparent to-transparent"></div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-lg font-semibold font-montserrat text-white mb-2 line-clamp-2 group-hover:text-[#66BB6A] transition-colors antialiased">
                          {product.name}
                        </h3>
                        
                        {/* Price */}
                        <div className="flex items-center justify-between pt-4 border-t border-[#2E7D32]/20">
                          <div>
                            <span className="text-2xl font-bold text-[#66BB6A] antialiased">
                              ₹{product.price}
                            </span>
                            {product.regular_price && product.regular_price !== product.price && (
                              <span className="block text-sm text-white/70 line-through antialiased">
                                ₹{product.regular_price}
                              </span>
                            )}
                          </div>

                          {/* Quick add button */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-3 bg-[#2E7D32] text-white rounded-full hover:bg-[#66BB6A] transition-all"
                          >
                            <ShoppingCart className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* View More Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Link href={`/shop?tag=${selectedTag}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 bg-[var(--emerald-500)] text-white font-semibold rounded-full shadow-[var(--shadow-card)] hover:bg-[var(--emerald-700)] transition-all antialiased"
                >
                  <span className="flex items-center gap-2">
                    View All "{tags.find(t => t.slug === selectedTag)?.name}" Products
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </span>
                </motion.button>
              </Link>
            </motion.div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-emerald-300 text-lg antialiased">No products found for this tag</p>
          </div>
        )}
      </div>
    </section>
  );
}
