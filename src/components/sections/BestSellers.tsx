'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

const BEST_SELLERS = [
  {
    id: 1,
    name: 'Monstera Deliciosa',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&h=400&fit=crop',
    rating: 5,
    sales: '500+ sold',
    category: 'Plants'
  },
  {
    id: 2,
    name: 'Snake Plant',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1593482892290-63946a57515f?w=400&h=400&fit=crop',
    rating: 5,
    sales: '750+ sold',
    category: 'Plants'
  },
  {
    id: 3,
    name: 'Fiddle Leaf Fig',
    price: 65.99,
    image: 'https://images.unsplash.com/photo-1614594895304-fe7116ac3b58?w=400&h=400&fit=crop',
    rating: 5,
    sales: '350+ sold',
    category: 'Plants'
  },
  {
    id: 4,
    name: 'Pothos Golden',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1596145849602-d3f6f5f0bce2?w=400&h=400&fit=crop',
    rating: 5,
    sales: '600+ sold',
    category: 'Plants'
  },
];

export default function BestSellers() {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <section className="py-24 bg-[var(--surface-onyx)] relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--surface-onyx)] via-[var(--emerald-900)]/5 to-[var(--surface-onyx)] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-cream-50 mb-3 antialiased">
            Best Sellers
          </h2>
          <p className="text-base text-white/80 max-w-xl mx-auto antialiased">
            Our most loved plants, chosen by enthusiasts worldwide
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {BEST_SELLERS.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <Link href="/shop" className="block">
                <div className="relative bg-[var(--ink-700)]/40 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-[var(--emerald-700)]/30 hover:border-emerald-400/50 backdrop-blur-md">
                  {/* Image Container */}
                  <div className="relative h-48 bg-[var(--ink-700)] overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      {product.sales}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-cream-50 mb-1.5 group-hover:text-emerald-400 transition-colors antialiased">
                      {product.name}
                    </h3>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(product.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-emerald-400 text-emerald-400"
                        />
                      ))}
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[#66BB6A] antialiased">
                        ${product.price}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          addItem({
                            id: String(product.id),
                            name: product.name,
                            price: product.price,
                            image: product.image,
                            quantity: 1,
                            type: 'product',
                            inStock: true,
                            category: product.category
                          });
                        }}
                        className="px-6 py-3 bg-[#2E7D32] text-white rounded-xl font-semibold hover:bg-[#2E7D32] transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <Link
            href="/shop"
            className="inline-block px-12 py-5 bg-white text-primary-700 font-bold text-lg rounded-2xl border border-primary-200 hover:bg-primary-700 hover:text-white hover:shadow-xl transition-all hover:scale-[1.02] antialiased"
          >
            View All Products
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
