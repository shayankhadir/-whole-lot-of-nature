'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingCart, Heart, Eye } from 'lucide-react';
import { Product } from '@/types/product';

export default function AllProductsShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products?limit=12')
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
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-4 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-emerald-900/20 rounded-2xl mb-4" />
                <div className="h-4 bg-emerald-900/20 rounded mb-2" />
                <div className="h-3 bg-emerald-900/20 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-emerald-950/20 to-slate-950" />

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
            Our Collection
          </motion.span>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-200 via-green-300 to-emerald-400 bg-clip-text text-transparent mb-4">
            All Products
          </h2>
          
          <p className="text-emerald-100/80 text-lg max-w-2xl mx-auto">
            Browse our complete selection of premium plants and gardening essentials
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
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
                        <span className="text-emerald-300/50">No Image</span>
                      </div>
                    )}
                    
                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-emerald-500/30 transition-all"
                      >
                        <Eye className="w-5 h-5 text-white" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-emerald-500/30 transition-all"
                      >
                        <Heart className="w-5 h-5 text-white" />
                      </motion.button>
                    </div>

                    {/* Badge */}
                    {product.onSale && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                        SALE
                      </div>
                    )}
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

                    {/* Add to Cart Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-10 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] transition-all"
            >
              <span className="flex items-center gap-3">
                View All Products
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
