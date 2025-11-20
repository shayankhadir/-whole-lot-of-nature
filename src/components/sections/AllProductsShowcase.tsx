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
      <section className="py-20 px-4 bg-[#0d3512]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-[#12501a]/40 rounded-2xl mb-4" />
                <div className="h-4 bg-[#12501a]/40 rounded mb-2" />
                <div className="h-3 bg-[#12501a]/40 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-24 px-4 overflow-hidden bg-[#0d3512]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/backgrounds/bgleaf1.png"
          alt="Tropical palm leaves background"
          fill
          className="object-cover opacity-15"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d3512]/95 via-[#12501a]/80 to-[#0d3512]/95" />
      </div>

      {/* Leaf Background Decorations */}
      <div className="absolute top-10 left-0 w-64 h-64 text-[var(--emerald-700)]/5 pointer-events-none z-0">
        <ShoppingCart className="w-full h-full rotate-12" strokeWidth={0.3} />
      </div>
      <div className="absolute bottom-20 right-0 w-80 h-80 text-[var(--emerald-500)]/5 pointer-events-none z-0">
        <Eye className="w-full h-full -rotate-12" strokeWidth={0.3} />
      </div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--emerald-900)]/5 to-transparent pointer-events-none z-0" />

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
            className="inline-block px-4 py-2 bg-[var(--emerald-700)]/20 border border-[var(--emerald-700)]/30 rounded-full text-emerald-400 text-sm font-medium tracking-wider uppercase mb-4 backdrop-blur-md antialiased"
          >
            Our Collection
          </motion.span>
          
          <h2 className="font-montserrat text-[clamp(2rem,5vw,2.5rem)] font-bold text-cream-50 mb-4 antialiased">
            All <span className="text-emerald-400">Products</span>
          </h2>
          
          <p className="text-[clamp(0.9375rem,2vw,1.125rem)] text-cream-100 max-w-2xl mx-auto antialiased">
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
                  className="group relative rounded-[var(--radius-lg)] bg-[var(--ink-700)]/40 backdrop-blur-md border border-[var(--emerald-700)]/20 overflow-hidden transition-all duration-300 hover:border-[var(--emerald-500)]/40 hover:shadow-[var(--shadow-card)]"
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink-900)]/90 via-[var(--emerald-900)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 bg-[var(--ink-700)]/80 backdrop-blur-md rounded-full border border-[var(--emerald-500)]/30 hover:bg-[var(--emerald-700)]/40 transition-all"
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
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-[var(--emerald-500)] transition-colors antialiased">
                      {product.name}
                    </h3>
                    
                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl font-bold text-[var(--emerald-500)] antialiased">
                        ₹{product.price}
                      </span>
                      {product.regularPrice && product.regularPrice !== product.price && (
                        <span className="text-sm text-[var(--mint-100)]/50 line-through antialiased">
                          ₹{product.regularPrice}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 bg-[var(--emerald-500)] text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--emerald-700)] transition-all antialiased"
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
              className="group px-10 py-4 bg-[var(--emerald-500)] text-white font-bold text-lg rounded-full shadow-[var(--shadow-card)] hover:bg-[var(--emerald-700)] transition-all antialiased"
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
