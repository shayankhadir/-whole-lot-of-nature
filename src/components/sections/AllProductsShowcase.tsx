'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingCart, Heart, Eye } from 'lucide-react';
import { Product } from '@/types/product';
import { DEMO_PRODUCTS } from '@/data/demoCatalog';
import { getDisplayPrice, getOriginalPrice, isOnSale } from '@/lib/utils/pricing';

const FALLBACK_PRODUCTS = DEMO_PRODUCTS;

export default function AllProductsShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products?limit=12')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length) {
          setProducts(data.data);
        } else {
          setProducts(FALLBACK_PRODUCTS);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
        setProducts(FALLBACK_PRODUCTS);
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
                <div className="aspect-square bg-[#12501a]/40 rounded-2xl mb-4 backdrop-blur-md" />
                <div className="h-4 bg-[#12501a]/40 rounded mb-2 backdrop-blur-md" />
                <div className="h-3 bg-[#12501a]/40 rounded w-2/3 backdrop-blur-md" />
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#010a05]/98 via-[#041107]/94 to-[#010a05]/98" />
      </div>

      {/* Leaf Background Decorations */}
      <div className="absolute top-10 left-0 w-64 h-64 text-[var(--emerald-700)]/5 pointer-events-none z-0">
        <ShoppingCart className="w-full h-full rotate-12" strokeWidth={0.3} />
      </div>
      <div className="absolute bottom-20 right-0 w-80 h-80 text-[var(--emerald-500)]/5 pointer-events-none z-0">
        <Eye className="w-full h-full -rotate-12" strokeWidth={0.3} />
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
          
          <p className="text-[clamp(0.9375rem,2vw,1.125rem)] text-white/90 max-w-2xl mx-auto antialiased">
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
              <Link href={`/shop/${product.slug}`}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative rounded-2xl bg-gradient-to-br from-[#1e3a28] to-[#0F1E11] overflow-hidden border border-[#2E7D32]/30 hover:border-[#2E7D32]/60 transition-all duration-300 hover:shadow-2xl hover:shadow-[#2E7D32]/20"
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
                        <span className="text-[#66BB6A]/30">No Image</span>
                      </div>
                    )}
                    
                    {/* Darker Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B0F]/80 via-transparent to-transparent"></div>

                    {/* Badge */}
                    {isOnSale(product) && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-[#2E7D32] text-white text-xs font-semibold rounded-full">
                        SALE
                      </div>
                    )}
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
                          {getDisplayPrice(product)}
                        </span>
                        {getOriginalPrice(product) && (
                          <span className="block text-sm text-white/70 line-through antialiased">
                            {getOriginalPrice(product)}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
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
