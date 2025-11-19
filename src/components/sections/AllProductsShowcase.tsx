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
      <section className="py-20 px-4 bg-emerald-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-emerald-900/30 rounded-2xl mb-4" />
                <div className="h-4 bg-emerald-900/30 rounded mb-2" />
                <div className="h-3 bg-emerald-900/30 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

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
      <div className="absolute top-10 left-0 w-64 h-64 text-emerald-900/20 pointer-events-none z-0">
        <ShoppingCart className="w-full h-full rotate-12" strokeWidth={0.3} />
      </div>
      <div className="absolute bottom-20 right-0 w-80 h-80 text-emerald-800/10 pointer-events-none z-0">
        <Eye className="w-full h-full -rotate-12" strokeWidth={0.3} />
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
          <span className="section-eyebrow mb-4">Our Collection</span>
          
          <h2 className="font-serif text-[clamp(2rem,5vw,3rem)] font-bold text-cream-50 mb-4">
            All <span className="text-gold-gradient">Products</span>
          </h2>
          
          <p className="text-[clamp(1rem,2vw,1.125rem)] text-cream-200/80 max-w-2xl mx-auto font-sans">
            Browse our complete selection of premium plants and gardening essentials
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
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
                        <span className="text-emerald-300/50">No Image</span>
                      </div>
                    )}
                    
                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 bg-emerald-900/80 backdrop-blur-md rounded-full border border-gold-500/30 hover:bg-emerald-800 hover:border-gold-500 transition-all"
                      >
                        <Eye className="w-5 h-5 text-gold-400" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 bg-emerald-900/80 backdrop-blur-md rounded-full border border-gold-500/30 hover:bg-emerald-800 hover:border-gold-500 transition-all"
                      >
                        <Heart className="w-5 h-5 text-gold-400" />
                      </motion.button>
                    </div>

                    {/* Badge */}
                    {product.onSale && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-gold-500 text-emerald-950 text-xs font-bold rounded-full uppercase tracking-wider">
                        SALE
                      </div>
                    )}
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

                    {/* Add to Cart Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 bg-emerald-800/50 border border-emerald-700/50 text-cream-50 font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-gold-500 hover:border-gold-500 hover:text-white transition-all font-sans"
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
              className="btn-gold group"
            >
              <span className="flex items-center gap-3">
                View All Products
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
