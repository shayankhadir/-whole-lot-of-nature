'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Leaf, Heart, Sprout } from 'lucide-react';

export default function BrandStorySection() {
  return (
    <section className="relative overflow-hidden py-24 bg-gradient-to-b from-[#0D1B0F] to-[#0F1E11]">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <svg width="100%" height="100%" className="w-full h-full">
          <defs>
            <pattern id="leafPattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M50 50 Q 70 30 80 50 Q 70 70 50 50" stroke="currentColor" fill="currentColor" className="text-[#2E7D32]"/>
              <path d="M140 100 Q 160 80 170 100 Q 160 120 140 100" stroke="currentColor" fill="currentColor" className="text-[#2E7D32]"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#leafPattern)" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-[#2E7D32]/20 border border-[#2E7D32]/30 rounded-full px-4 py-2 mb-6"
            >
              <Leaf className="w-4 h-4 text-[#66BB6A]" />
              <span className="text-sm font-semibold text-[#66BB6A] uppercase tracking-wider antialiased">
                Our Story
              </span>
            </motion.div>

            {/* Main heading */}
            <h2 className="font-display text-[clamp(2.25rem,5vw,3rem)] font-bold text-white leading-tight mb-6 antialiased">
              Bringing Nature Back to{' '}
              <span className="text-[#66BB6A]">Every Home</span>
            </h2>

            {/* Description */}
            <p className="text-[clamp(1rem,2vw,1.125rem)] text-white/70 leading-relaxed mb-8 antialiased">
              From a passion for plants to a mission for sustainable living. We craft premium organic soils, 
              nurture beautiful plants, and create eco-friendly products that help you grow your own green sanctuary.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-3 mb-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2"
              >
                <Sprout className="w-4 h-4 text-[#66BB6A]" />
                <span className="text-sm text-white/80 antialiased">100% Organic</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2"
              >
                <Heart className="w-4 h-4 text-[#66BB6A]" />
                <span className="text-sm text-white/80 antialiased">Sustainably Sourced</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2"
              >
                <Leaf className="w-4 h-4 text-[#66BB6A]" />
                <span className="text-sm text-white/80 antialiased">Expert Care</span>
              </motion.div>
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-[#2E7D32] hover:bg-[#66BB6A] text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 group shadow-lg hover:shadow-[#2E7D32]/50 hover:scale-105"
              >
                <span>Learn Our Story</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>

            {/* Visually-hidden SEO helper */}
            <span className="sr-only">
              organic soil mix, eco-friendly fertilizers, indoor plants, succulents, aquatic plants, herbal products, sustainable gardening, plant care, nature-inspired living, green lifestyle, organic compost, potting soil, eco-conscious brand
            </span>
          </motion.div>

          {/* Media column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
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
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B0F]/70 via-[#0D1B0F]/20 to-transparent" />
              
              {/* Floating stats card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4"
              >
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white antialiased">500+</div>
                    <div className="text-xs text-white/70 antialiased">Products</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white antialiased">5K+</div>
                    <div className="text-xs text-white/70 antialiased">Happy Customers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white antialiased">100%</div>
                    <div className="text-xs text-white/70 antialiased">Organic</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative element */}
            <motion.div
              animate={{ rotate: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 w-24 h-24 bg-[#66BB6A]/20 rounded-full blur-2xl"
              aria-hidden
            />
            <motion.div
              animate={{ rotate: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#2E7D32]/20 rounded-full blur-2xl"
              aria-hidden
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
