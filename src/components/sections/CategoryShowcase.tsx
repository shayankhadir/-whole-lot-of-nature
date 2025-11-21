'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sprout, Leaf, Droplet, Sparkles, Gem, BookOpen } from 'lucide-react';

const categoryCollections = [
  {
    title: 'Soil & Growing Media',
    summary: 'Signature blends, substrates, and organic amendments for healthy roots.',
    icon: Sprout,
    accent: 'from-primary-600 to-primary-400',
    href: '/shop?category=soil-and-growing-media',
    highlights: ['Soil Mixes', 'Soil-Less Substrates', 'Amendments & Additives'],
  },
  {
    title: 'Land Plants',
    summary: 'Curated indoor, outdoor, and sculptural greens for elevated spaces.',
    icon: Leaf,
    accent: 'from-primary-500 to-primary-300',
    href: '/shop?category=land-plants',
    highlights: ['Indoor Plants', 'Outdoor Plants', 'Succulents & Cacti'],
  },
  {
    title: 'Aquatic Life & Ecosystem',
    summary: 'Aquascape-ready flora, oxygenating plants, and pond companions.',
    icon: Droplet,
    accent: 'from-primary-700 to-primary-500',
    href: '/shop?category=aquatic-life-ecosystem',
    highlights: ['Aquatic Plants', 'Snails & Pond Life', 'Aquascape Essentials'],
  },
  {
    title: 'Wellness & Herbal',
    summary: 'Ayurvedic remedies and botanical rituals crafted for modern wellness.',
    icon: Sparkles,
    accent: 'from-primary-400 to-primary-600',
    href: '/shop?category=wellness-herbal-products',
    highlights: ['Herbal Supplements', 'Hair & Body Rituals', 'Powders & Extracts'],
  },
  {
    title: 'Miniature Plant Decor',
    summary: 'Handmade miniature terrariums and bespoke clay objets for gifting.',
    icon: Gem,
    accent: 'from-primary-600 to-primary-400',
    href: '/shop?category=miniature-plant-decor',
    highlights: ['Clay Home Models', 'Giftable Sets', 'Limited Editions'],
  },
  {
    title: 'Decor & Digital',
    summary: 'Guides, e-books, and upcoming kits to nurture your green practice.',
    icon: BookOpen,
    accent: 'from-primary-500 to-primary-700',
    href: '/shop?category=decor-and-digital',
    highlights: ['E-Books & Guides', 'Seeds & Future Drops', 'Workshops & Courses'],
  },
];

export default function CategoryShowcase() {
  return (
    <section className="relative py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/40 via-white to-primary-100/20" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-flex items-center rounded-full border border-primary-200 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary-600 backdrop-blur-md">
            Shop by Category
          </span>
          <h2 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 antialiased">
            A Luxury Edit for Every Green Vision
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base md:text-lg text-gray-600 antialiased">
            Explore a curated taxonomy of nature-first collections designed to harmonise wellbeing, interior aesthetics, and sustainable growing rituals.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categoryCollections.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Link href={category.href} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/50 bg-white/80 p-6 shadow-lg shadow-primary-100/20 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary-100 hover:shadow-2xl">
                <div className={`relative flex items-center justify-between rounded-2xl bg-gradient-to-br ${category.accent} px-5 py-4 text-white`}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/20 backdrop-blur-md">
                    <category.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/85">Signature Edit</span>
                  <div className="absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-white/20 blur-3xl backdrop-blur-md" />
                </div>
                <div className="mt-5">
                  <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-primary-700 transition-colors antialiased">
                    {category.title}
                  </h3>
                  <p className="mt-3 text-sm text-gray-600">
                    {category.summary}
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {category.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 group-hover:border-primary-200 group-hover:text-primary-600"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
                <div className="mt-8 flex items-center justify-between text-sm font-medium text-primary-600">
                  <span>Enter Collection</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 rounded-3xl border border-primary-100 bg-white/70 p-8 text-center shadow-lg backdrop-blur-md"
        >
          <p className="text-sm text-gray-100">
            Curious about rare specimens or limited seasonal drops?
          </p>
          <Link
            href="/shop?tag=rare-plants"
            className="mt-4 inline-flex items-center rounded-full bg-white px-8 py-3 text-sm font-medium text-primary-700 border border-primary-200 transition-colors hover:bg-primary-50"
          >
            Browse Rare & Collectors’ Picks
          </Link>
        </motion.div>
      </div>
    </section>
  );
}