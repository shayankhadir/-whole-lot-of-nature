'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Link from 'next/link';

export default function BestSellers() {
  const bestSellers = [
    {
      id: 1,
      name: 'Monstera Deliciosa',
      price: 45.99,
      image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&h=400&fit=crop',
      rating: 5,
      sales: '500+ sold',
    },
    {
      id: 2,
      name: 'Snake Plant',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1593482892290-63946a57515f?w=400&h=400&fit=crop',
      rating: 5,
      sales: '750+ sold',
    },
    {
      id: 3,
      name: 'Fiddle Leaf Fig',
      price: 65.99,
      image: 'https://images.unsplash.com/photo-1614594895304-fe7116ac3b58?w=400&h=400&fit=crop',
      rating: 5,
      sales: '350+ sold',
    },
    {
      id: 4,
      name: 'Pothos Golden',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1596145849602-d3f6f5f0bce2?w=400&h=400&fit=crop',
      rating: 5,
      sales: '600+ sold',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white via-green-50 to-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Best Sellers
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our most loved plants, chosen by plant enthusiasts worldwide
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestSellers.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <Link href="/shop" className="block">
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-green-100 hover:border-green-300">
                  {/* Image Container */}
                  <div className="relative h-80 bg-gradient-to-br from-green-50 to-white overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-green-700 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      {product.sales}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                      {product.name}
                    </h3>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(product.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-green-600 text-green-600"
                        />
                      ))}
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-green-700">
                        ${product.price}
                      </span>
                      <button className="px-6 py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition-colors">
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
            className="inline-block px-12 py-5 bg-white text-primary-700 font-bold text-lg rounded-2xl border border-primary-200 hover:bg-primary-700 hover:text-white hover:shadow-xl transition-all hover:scale-[1.02]"
          >
            View All Products
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
