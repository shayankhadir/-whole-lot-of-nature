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
    <section className="relative py-24 px-4 overflow-hidden bg-emerald-950">
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
      <div className="absolute top-20 right-10 w-72 h-72 text-emerald-900/20 pointer-events-none z-0">
        <Tag className="w-full h-full rotate-45" strokeWidth={0.3} />
      </div>
      <div className="absolute bottom-10 left-10 w-56 h-56 text-emerald-800/10 pointer-events-none z-0">
        <Sparkles className="w-full h-full" strokeWidth={0.3} />
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
          <span className="section-eyebrow mb-4">Popular Collections</span>
          
          <h2 className="font-serif text-[clamp(2rem,5vw,3rem)] font-bold text-cream-50 mb-4">
            Shop by <span className="text-gold-gradient">Tags</span>
          </h2>
          
          <p className="text-[clamp(1rem,2vw,1.125rem)] text-cream-200/80 max-w-2xl mx-auto font-sans">
            Discover products by our most popular tags and themes
          </p>
        </motion.div>

        {/* Tag Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
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
              className={`group px-6 py-3 rounded-full font-medium transition-all duration-300 font-sans ${
                selectedTag === tag.slug
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-lg border border-transparent'
                  : 'bg-emerald-900/40 text-emerald-200 border border-emerald-700/30 hover:bg-emerald-800/60 hover:border-gold-500/40 hover:text-gold-300'
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-emerald-900/30 rounded-2xl mb-4" />
                <div className="h-4 bg-emerald-900/30 rounded mb-2" />
                <div className="h-3 bg-emerald-900/30 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
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
                      className="group relative rounded-[2rem] bg-emerald-900/20 backdrop-blur-md border border-emerald-800/50 overflow-hidden transition-all duration-300 hover:border-gold-500/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
                    >
                      {/* Image */}
                      <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-emerald-900/10 to-emerald-950/50">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0].src}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-emerald-900/20">
                            <Sparkles className="w-12 h-12 text-emerald-300/50" />
                          </div>
                        )}
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="font-serif text-lg font-medium text-cream-50 mb-2 line-clamp-2 group-hover:text-gold-200 transition-colors">
                          {product.name}
                        </h3>
                        
                        {/* Price */}
                        <div className="flex items-center gap-2 mb-6">
                          <span className="text-xl font-bold text-emerald-400 font-sans">
                            ₹{product.price}
                          </span>
                          {product.regularPrice && product.regularPrice !== product.price && (
                            <span className="text-sm text-cream-200/40 line-through font-sans">
                              ₹{product.regularPrice}
                            </span>
                          )}
                        </div>

                        {/* Quick add button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-3 bg-emerald-800/50 border border-emerald-700/50 text-cream-50 font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-gold-500 hover:border-gold-500 hover:text-white transition-all font-sans"
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
                  className="btn-gold group"
                >
                  <span className="flex items-center gap-2">
                    View All "{tags.find(t => t.slug === selectedTag)?.name}" Products
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              </Link>
            </motion.div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-emerald-300 text-lg font-sans">No products found for this tag</p>
          </div>
        )}
      </div>
    </section>
  );
}
