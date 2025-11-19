'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Tag, TrendingUp, Sparkles, ArrowRight, ShoppingCart } from 'lucide-react';
import { Product } from '@/types/product';

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

  // Fetch tags on mount
  useEffect(() => {
    fetch('/api/tags')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          // Get top 8 most popular tags
          const topTags = data.data.slice(0, 8);
          setTags(topTags);
          // Auto-select first tag
          if (topTags.length > 0) {
            setSelectedTag(topTags[0].slug);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch tags:', err);
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
        if (data.success && data.data) {
          setProducts(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
        setLoading(false);
      });
  }, [selectedTag]);

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-slate-950 to-emerald-950/20" />
      
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(16,185,129,0.4) 2px, transparent 0)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

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
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-300 text-sm font-medium tracking-wider uppercase mb-4"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Popular Collections</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-200 via-green-300 to-emerald-400 bg-clip-text text-transparent mb-4">
            Shop by Tags
          </h2>
          
          <p className="text-emerald-100/80 text-lg max-w-2xl mx-auto">
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
              className={`group px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedTag === tag.slug
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-emerald-900/30 text-emerald-200 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-400/50'
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
                  <Link href={`/products/${product.slug}`}>
                    <motion.div
                      whileHover={{ y: -8 }}
                      className="group relative rounded-2xl bg-gradient-to-br from-emerald-900/30 via-slate-900/40 to-emerald-950/30 border border-emerald-500/20 overflow-hidden transition-all duration-300 hover:border-emerald-400/40 hover:shadow-[0_20px_60px_rgba(16,185,129,0.2)]"
                    >
                      {/* Image */}
                      <div className="relative aspect-square overflow-hidden bg-slate-900/50">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0].src}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-emerald-900/20">
                            <Sparkles className="w-12 h-12 text-emerald-300/50" />
                          </div>
                        )}
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-emerald-300 transition-colors">
                          {product.name}
                        </h3>
                        
                        {/* Price */}
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-2xl font-bold text-emerald-300">
                            ₹{product.price}
                          </span>
                          {product.regularPrice && product.regularPrice !== product.price && (
                            <span className="text-sm text-emerald-100/50 line-through">
                              ₹{product.regularPrice}
                            </span>
                          )}
                        </div>

                        {/* Quick add button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Quick Add
                        </motion.button>
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
                  className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-full shadow-lg hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all"
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
            <p className="text-emerald-300 text-lg">No products found for this tag</p>
          </div>
        )}
      </div>
    </section>
  );
}
