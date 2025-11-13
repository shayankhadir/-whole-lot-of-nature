'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Leaf, Droplet, Home, Trees, Package, TestTube, Flower2, Fish } from 'lucide-react';

const categories = [
  {
    name: 'Plants',
    icon: Leaf,
    href: '/shop?category=plants',
    color: '#2E7D32',
    description: 'Indoor, outdoor & aquatic plants',
    subcategories: ['Indoor Plants', 'Outdoor Plants']
  },
  {
    name: 'Aquatic Life & Ecosystem',
    icon: Fish,
    href: '/shop?category=aquatic-life-ecosystem',
    color: '#66BB6A',
    description: 'Aquatic plants & pond companions',
    subcategories: ['Aquatic Snails', 'Aquatic Plants']
  },
  {
    name: 'Soil & Growing Media',
    icon: Droplet,
    href: '/shop?category=soil-growing-media',
    color: '#2E7D32',
    description: 'Premium soils, mixes & amendments',
    subcategories: ['Soil Mixes', 'Organic Fertilizers']
  },
  {
    name: 'Herbal Products',
    icon: TestTube,
    href: '/shop?category=herbal-products',
    color: '#66BB6A',
    description: 'Natural hair oil & herbal tablets',
  },
  {
    name: 'Miniature Plant Decor',
    icon: Package,
    href: '/shop?category=miniature-plant-decor',
    color: '#2E7D32',
    description: 'Handmade miniatures & decor',
  },
];

export default function CategoryGrid() {
  return (
    <section className="relative py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-montserrat text-[clamp(2rem,5vw,2.5rem)] font-bold text-[#66BB6A] mb-4 antialiased">
            Shop by Category
          </h2>
          <p className="text-[clamp(0.9375rem,2vw,1.125rem)] text-white/70 max-w-2xl mx-auto antialiased">
            Explore our curated collections for your green sanctuary
          </p>
        </motion.div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={category.href}
                className="group relative block h-full"
              >
                <div className="relative bg-gradient-to-br from-[#1e3a28] to-[#0F1E11] rounded-2xl p-8 border border-[#2E7D32]/30 hover:border-[#2E7D32]/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#2E7D32]/20 h-full flex flex-col">
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div 
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{ 
                        backgroundColor: `${category.color}20`,
                        border: `2px solid ${category.color}40`
                      }}
                    >
                      <category.icon 
                        className="w-8 h-8 md:w-10 md:h-10 transition-colors duration-300"
                        style={{ color: category.color }}
                      />
                    </div>
                  </div>

                  {/* Category Name */}
                  <h3 className="text-center font-montserrat text-[clamp(1.125rem,2.5vw,1.375rem)] font-semibold text-white group-hover:text-[#66BB6A] transition-colors duration-300 antialiased mb-2">
                    {category.name}
                  </h3>

                  {/* Description */}
                  <p className="text-center text-[clamp(0.8125rem,1.5vw,0.9375rem)] text-white/60 mb-4 antialiased">
                    {category.description}
                  </p>

                  {/* Subcategories */}
                  {category.subcategories && (
                    <div className="flex flex-wrap gap-2 justify-center mt-auto">
                      {category.subcategories.map((sub) => (
                        <span 
                          key={sub}
                          className="text-xs px-2 py-1 rounded-full bg-[#2E7D32]/20 text-[#66BB6A] border border-[#2E7D32]/30"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Decorative corner accent */}
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#66BB6A] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-10"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[#66BB6A] hover:text-[#2E7D32] font-semibold text-[clamp(0.9375rem,2vw,1.125rem)] transition-colors duration-300 group"
          >
            View All Products
            <svg 
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
