'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const categories = [
  {
    id: 1,
    name: 'Soil & Mixes',
    image: '/images/categories/soil-mixes.jpg',
    description: 'Premium organic soil blends for thriving plants',
    slug: 'soil-mixes'
  },
  {
    id: 2,
    name: 'Aquatic Plants',
    image: '/images/categories/aquatic-plants.jpg',
    description: 'Beautiful water plants for your aquarium',
    slug: 'aquatic-plants'
  },
  {
    id: 3,
    name: 'Land Plants',
    image: '/images/categories/land-plants.jpg',
    description: 'Wide variety of indoor and outdoor plants',
    slug: 'land-plants'
  },
  {
    id: 4,
    name: 'Eco-Friendly Additives',
    image: '/images/categories/eco-additives.jpg',
    description: 'Natural supplements for plant health',
    slug: 'eco-additives'
  },
  {
    id: 5,
    name: 'Combo Packs',
    image: '/images/categories/combo-packs.jpg',
    description: 'Value bundles for plant enthusiasts',
    slug: 'combo-packs'
  },
  {
    id: 6,
    name: 'Gardening Tools',
    image: '/images/categories/gardening-tools.jpg',
    description: 'Essential tools for plant care',
    slug: 'gardening-tools'
  }
];

export default function FeaturedCategories() {
  return (
    <section className="relative py-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-50 via-white to-primary-100" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.08]"
        style={{ backgroundImage: "url('/hero-leaves.svg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif antialiased">
            Explore Our Categories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our curated selection of premium gardening essentials, designed to help you create and maintain your perfect green space.
          </p>
        </motion.div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/shop/${category.slug}`}>
                <motion.div
                  whileHover={{ y: -8, boxShadow: '0 12px 40px rgba(16,93,56,0.28)' }}
                  transition={{ duration: 0.3 }}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-xl ring-1 ring-green-900/10"
                >
                  <div className="aspect-w-4 aspect-h-3">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/30 via-transparent to-transparent group-hover:bg-[#2E7D32]/40 transition-all duration-300 backdrop-blur-md" />
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <h3 className="text-xl font-display font-semibold mb-2 drop-shadow-lg antialiased">{category.name}</h3>
                    <p className="text-sm text-gray-200 mb-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      {category.description}
                    </p>
                    <motion.span
                      whileHover={{ x: 4 }}
                      className="inline-flex items-center text-sm font-semibold"
                    >
                      Shop Category
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.span>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}