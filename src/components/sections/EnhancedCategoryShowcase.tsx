'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Leaf,
  Cloud,
  Heart,
  Sun,
  Droplet,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: React.ReactNode;
  image?: string;
  plantCount: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const categories: Category[] = [
  {
    id: '1',
    name: 'Indoor Plants',
    slug: 'indoor-plants',
    description: 'Perfect for brightening your home with natural greenery',
    icon: <Cloud className="w-8 h-8" />,
    plantCount: 48,
    difficulty: 'Easy',
  },
  {
    id: '2',
    name: 'Low-Light Plants',
    slug: 'low-light-plants',
    description: 'Thriving plants that need minimal natural light',
    icon: <Sun className="w-8 h-8" />,
    plantCount: 32,
    difficulty: 'Easy',
  },
  {
    id: '3',
    name: 'Pet-Friendly Plants',
    slug: 'pet-friendly-plants',
    description: 'Safe and beautiful plants for homes with pets',
    icon: <Heart className="w-8 h-8" />,
    plantCount: 28,
    difficulty: 'Easy',
  },
  {
    id: '4',
    name: 'Air-Purifying Plants',
    slug: 'air-purifying-plants',
    description: 'Plants that naturally clean and refresh your air',
    icon: <Sparkles className="w-8 h-8" />,
    plantCount: 35,
    difficulty: 'Medium',
  },
  {
    id: '5',
    name: 'Outdoor Plants',
    slug: 'outdoor-plants',
    description: 'Hardy plants for gardens and outdoor spaces',
    icon: <Leaf className="w-8 h-8" />,
    plantCount: 52,
    difficulty: 'Medium',
  },
  {
    id: '6',
    name: 'Aquatic Plants',
    slug: 'aquatic-plants',
    description: 'Beautiful plants for aquariums and water features',
    icon: <Droplet className="w-8 h-8" />,
    plantCount: 24,
    difficulty: 'Hard',
  },
];

export default function EnhancedCategoryShowcase() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const difficultyColors = {
    Easy: 'bg-[#2E7D32] text-[#2E7D32]',
    Medium: 'bg-amber-100 text-amber-800',
    Hard: 'bg-red-100 text-red-800',
  };

  return (
    <section className="relative py-20 bg-gradient-to-b from-white via-green-50/30 to-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#2E7D32] rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#2E7D32] rounded-full blur-3xl opacity-20" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-black mb-4 antialiased">
            Explore Our Collections
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto antialiased">
            Discover plants tailored to your lifestyle, space, and expertise level.
            From beginner-friendly to expert selections.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <Link href={`/shop?category=${category.slug}`}>
                {/* Card Container with gradient background */}
                <div className="relative h-full overflow-hidden rounded-3xl border border-white/50 bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  {/* Animated gradient background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Content */}
                  <div className="relative p-8 h-full flex flex-col justify-between">
                    {/* Top Section: Icon + Title */}
                    <div>
                      {/* Icon with animated background */}
                      <motion.div
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 text-white mb-4 shadow-md"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                      >
                        {category.icon}
                      </motion.div>

                      <h3 className="text-2xl font-bold text-black mb-2 group-hover:text-[#2E7D32] transition-colors antialiased">
                        {category.name}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {category.description}
                      </p>
                    </div>

                    {/* Bottom Section: Stats + Difficulty */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Leaf className="w-4 h-4 text-[#2E7D32]" />
                          <span className="text-sm font-medium text-gray-700">
                            {category.plantCount} plants
                          </span>
                        </div>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            difficultyColors[category.difficulty]
                          }`}
                        >
                          {category.difficulty}
                        </span>
                      </div>

                      {/* CTA Arrow - animates on hover */}
                      <motion.div
                        className="flex items-center gap-2 text-[#2E7D32] font-semibold text-sm group-hover:text-[#2E7D32] transition-colors"
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                      >
                        Explore Collection
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Animated gradient border on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    initial={{ background: 'linear-gradient(45deg, transparent, transparent)' }}
                    whileHover={{
                      background: 'linear-gradient(45deg, rgba(34, 197, 94, 0.2), transparent)',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              View All Products
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
