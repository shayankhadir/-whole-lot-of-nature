'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  productCount?: number;
  description?: string;
}

interface FeaturedCategoriesProps {
  categories?: Category[];
  title?: string;
  subtitle?: string;
}

const defaultCategories: Category[] = [
  {
    id: 1,
    name: 'Indoor Plants',
    slug: 'indoor-plants',
    image: '/images/categories/indoor-plants.jpg',
    productCount: 45,
    description: 'Transform your home into a green oasis'
  },
  {
    id: 2,
    name: 'Outdoor Plants',
    slug: 'outdoor-plants',
    image: '/images/categories/outdoor-plants.jpg',
    productCount: 32,
    description: 'Perfect for gardens and balconies'
  },
  {
    id: 3,
    name: 'Soil & Fertilizers',
    slug: 'soil-fertilizers',
    image: '/images/categories/soil-mix.jpg',
    productCount: 18,
    description: 'Premium organic growing media'
  },
  {
    id: 4,
    name: 'Pots & Planters',
    slug: 'pots-planters',
    image: '/images/categories/pots.jpg',
    productCount: 24,
    description: 'Beautiful homes for your plants'
  }
];

export default function FeaturedCategories({
  categories = defaultCategories,
  title = "Shop by Category",
  subtitle = "Find the perfect plants for every corner of your space"
}: FeaturedCategoriesProps) {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-[#061208] to-[#0a1f0e]">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
          <p className="text-lg text-emerald-100/60 max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/shop/category/${category.slug}`}
                className="group block relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all duration-500"
              >
                {/* Background Image */}
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <motion.div
                    initial={false}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-white/60 mb-3 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      {category.productCount !== undefined && (
                        <span className="text-xs text-emerald-400 font-medium">
                          {category.productCount} products
                        </span>
                      )}
                      <div className="flex items-center gap-1 text-white/60 group-hover:text-emerald-400 transition-colors">
                        <span className="text-sm">Shop</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-emerald-500/10" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-white transition-colors font-medium"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
