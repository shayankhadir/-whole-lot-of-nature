'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function BrandStorySection() {
  return (
  <section className="relative overflow-hidden py-20 bg-gradient-to-b from-primary-50/50 to-white">
      {/* Leaf SVG pattern background */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <svg width="100%" height="100%" className="w-full h-full">
          <defs>
            <pattern id="leafPattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M50 50 Q 70 30 80 50 Q 70 70 50 50" stroke="currentColor" fill="currentColor" className="text-primary-700"/>
              <path d="M140 100 Q 160 80 170 100 Q 160 120 140 100" stroke="currentColor" fill="currentColor" className="text-primary-700"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#leafPattern)" />
        </svg>
      </div>

      {/* Floating leaves */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-8 top-10 text-green-700/15"
        animate={{ y: [0, -10, 0], rotate: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
      >
        <LeafIcon className="w-10 h-10" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/4 top-1/3 text-green-700/10"
        animate={{ y: [0, 15, 0], rotate: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 14 }}
      >
        <LeafIcon className="w-16 h-16" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-24 text-green-700/15"
        animate={{ y: [0, 12, 0], rotate: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 12 }}
      >
        <LeafIcon className="w-12 h-12" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-1/4 top-1/2 text-green-700/12"
        animate={{ y: [0, -12, 0], rotate: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 15 }}
      >
        <LeafIcon className="w-14 h-14" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-8 top-8 text-green-700/15"
        animate={{ y: [0, -8, 0], rotate: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 9 }}
      >
        <LeafIcon className="w-8 h-8" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-12 bottom-32 text-green-700/10"
        animate={{ y: [0, 10, 0], rotate: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 11 }}
      >
        <LeafIcon className="w-11 h-11" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-10 bottom-20 text-green-700/12"
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
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-green-900 leading-tight">
              Stay Loyal to the Soil
            </h2>

            <div className="mt-6 space-y-4 text-base md:text-lg text-gray-700">
              <p>
                Whole Lot of Nature grew from a single spark — a deep love for plants that turned into a journey of reconnecting with the Earth. What started as a small collection of potted greens soon bloomed into a mission: to make nature accessible, beautiful, and sustainable for everyone.
              </p>
              <p>
                From organic soil mixes crafted with care, to eco-friendly fertilizers, living indoor plants, aquatic greens, and handmade herbal products, we blend nature’s purity with modern design and conscious living.
              </p>
              <p>
                Every product — whether it’s a premium potting mix, a succulent, or a bottle of our organic herbal hair oil — is made with the same belief: that healthy roots create healthy lives.
              </p>
              <p>
                We believe in sustainable gardening, mindful consumption, and staying loyal to the soil — because when you nurture nature, it gives back more than you imagine.
              </p>
              <p>
                Our goal isn’t just to sell — it’s to build a community of nature lovers, to help people grow their own green spaces, and to create a world where every home breathes life again.
              </p>
              <p className="font-medium text-green-900">
                Whole Lot of Nature — bringing soil, soul, and sustainability together.
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
              className="mt-8 w-full text-green-800/30"
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
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-sm ring-1 ring-green-900/10">
              <Image
                src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1400&q=80"
                alt="Hands holding rich soil and roots"
                fill
                className="object-cover"
                quality={90}
                priority={false}
              />
              {/* Soft green overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 via-transparent to-transparent" />
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