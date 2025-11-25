'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function BrandStorySection() {
  return (
  <section className="relative overflow-hidden py-20 bg-[var(--surface-onyx)]">
      {/* Leaf SVG pattern background */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <svg width="100%" height="100%" className="w-full h-full">
          <defs>
            <pattern id="leafPattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M50 50 Q 70 30 80 50 Q 70 70 50 50" stroke="currentColor" fill="currentColor" className="text-emerald-600"/>
              <path d="M140 100 Q 160 80 170 100 Q 160 120 140 100" stroke="currentColor" fill="currentColor" className="text-emerald-600"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#leafPattern)" />
        </svg>
      </div>

      {/* Floating leaves */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-8 top-10 text-emerald-700/15"
        animate={{ y: [0, -10, 0], rotate: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
      >
        <LeafIcon className="w-10 h-10" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/4 top-1/3 text-emerald-700/10"
        animate={{ y: [0, 15, 0], rotate: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 14 }}
      >
        <LeafIcon className="w-16 h-16" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-24 text-emerald-700/15"
        animate={{ y: [0, 12, 0], rotate: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 12 }}
      >
        <LeafIcon className="w-12 h-12" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-1/4 top-1/2 text-emerald-700/12"
        animate={{ y: [0, -12, 0], rotate: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 15 }}
      >
        <LeafIcon className="w-14 h-14" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-8 top-8 text-emerald-700/15"
        animate={{ y: [0, -8, 0], rotate: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 9 }}
      >
        <LeafIcon className="w-8 h-8" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-12 bottom-32 text-emerald-700/10"
        animate={{ y: [0, 10, 0], rotate: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 11 }}
      >
        <LeafIcon className="w-11 h-11" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-10 bottom-20 text-emerald-700/12"
        animate={{ y: [0, -6, 0], rotate: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 13 }}
      >
        <LeafIcon className="w-9 h-9" />
      </motion.div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Text column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <h2 className="font-display text-[clamp(2rem,5vw,2.5rem)] text-emerald-400 leading-tight antialiased">
              Stay Loyal to the Soil
            </h2>

            <div className="mt-6 space-y-4 text-[clamp(0.9375rem,2vw,1.125rem)] text-white/90 antialiased">
              <p>
                At Whole Lot of Nature, we believe that every plant has a story, and every garden is a sanctuary. We're on a mission to connect people with nature through thoughtfully curated plants, premium growing essentials, and sustainable practices.
              </p>
              <p>
                Our carefully selected collection includes vibrant indoor and outdoor plants, premium organic soil mixes, eco-friendly fertilizers, aquatic ecosystems, and handcrafted herbal products. Each item is chosen with care to ensure it meets our high standards for quality and sustainability.
              </p>
              <p>
                We're committed to making plant parenthood accessible, enjoyable, and rewarding for everyone – whether you're starting your first green space or tending an entire garden. Our expert team is always here to guide you on your botanical journey.
              </p>
              <p>
                When you shop with us, you're not just getting plants and products – you're joining a community dedicated to greener living, mindful consumption, and nurturing the Earth.
              </p>
              <p className="font-medium text-[#66BB6A]">
                Welcome to Whole Lot of Nature – where every root matters.
              </p>

              {/* Visually-hidden SEO helper */}
              <span className="sr-only">
                organic soil mix, eco-friendly fertilizers, indoor plants, succulents, aquatic plants, herbal products, sustainable gardening, plant care, nature-inspired living, green lifestyle, organic compost, potting soil, eco-conscious brand
              </span>
            </div>

            {/* Roots line animation */}
            <motion.svg
              aria-hidden
              viewBox="0 0 400 80"
              className="mt-8 w-full text-[#2E7D32]/30"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2.2, ease: 'easeInOut' }}
            >
              <motion.path
                d="M0 40 C 50 20, 100 60, 150 40 S 250 20, 300 40 S 350 60, 400 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.2, ease: 'easeInOut' }}
              />
            </motion.svg>
          </motion.div>

          {/* Media column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-[#2E7D32]/30">
              <Image
                src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1400&q=80"
                alt="Hands holding rich soil and roots"
                fill
                className="object-cover"
                quality={90}
                priority={false}
              />
              {/* Soft green overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B0F]/60 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function LeafIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C7 6 4 9 4 13a8 8 0 0016 0c0-4-3-7-8-11z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
      />
    </svg>
  );
}
