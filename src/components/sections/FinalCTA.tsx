'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function FinalCTA() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/backgrounds/ai-generated-lush-tropical-green-leaves-background-photo.jpg"
          alt="Tropical leaves background"
          fill
          className="object-cover"
          quality={75}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-black/60" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white/95 backdrop-blur-sm ring-1 ring-white/20 shadow-2xl p-8 sm:p-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-serif font-bold text-black antialiased"
          >
            Grow Something Beautiful Today
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-lg text-black/80 max-w-2xl mx-auto antialiased"
          >
            Explore our premium soil mixes, plants, and eco-friendly care essentials. 100% organic, sustainably sourced.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/shop" className="inline-flex items-center px-8 py-3 rounded-xl bg-[#1a4d2e] text-white font-semibold hover:bg-[#0f3620] shadow-lg transition-all hover:shadow-xl">
              Shop All Products
            </Link>
            <Link href="/about" className="inline-flex items-center px-8 py-3 rounded-xl bg-white text-black font-semibold border-2 border-[#1a4d2e] hover:bg-[#2E7D32] shadow-lg transition-all hover:shadow-xl">
              Our Story
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
