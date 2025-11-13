'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Full-Bleed Leaf Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://admin.wholelotofnature.com/wp-content/uploads/2025/11/bgleaf1.png"
          alt="Lush green foliage background"
          fill
          className="object-cover object-center brightness-[0.35]"
          priority
          quality={95}
        />
        {/* Luxury Gradient Overlay - Emerald to Deep Charcoal */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D3B1F]/60 via-[#1A1A1A]/50 to-[#000000]/70" />
      </div>

      {/* Main Headline - Premium Serif Typography */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 px-6 text-center"
      >
        {/* Welcome Text */}
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-white/70 text-[clamp(0.75rem,1.5vw,0.875rem)] font-light tracking-[0.3em] uppercase font-inter mb-4"
        >
          Welcome to
        </motion.p>

        {/* Main Brand Heading */}
        <h1 
          className="font-montserrat text-white text-[clamp(1.5rem,5vw,2.5rem)] font-bold leading-tight tracking-wider drop-shadow-[0_10px_40px_rgba(0,0,0,0.9)] mb-6"
        >
          WHOLE LOT OF <span className="text-[#66BB6A]">NATURE</span>
        </h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-white/80 text-[clamp(0.875rem,1.5vw,1rem)] font-light leading-relaxed max-w-2xl mx-auto font-inter"
        >
          Your ultimate destination for premium plants, handcrafted soil mixes, aquatic life, and sustainable gardening essentials
        </motion.p>
      </motion.div>

      {/* Bottom Scroll Hint - Glowing Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
      >
        <Link href="#categories">
          <div className="px-8 py-4 bg-[#2E7D32]/20 backdrop-blur-md border border-[#66BB6A]/50 rounded-full hover:bg-[#2E7D32]/30 hover:border-[#66BB6A] transition-all duration-500 cursor-pointer shadow-[0_0_30px_rgba(102,187,106,0.6)] hover:shadow-[0_0_50px_rgba(102,187,106,0.9)]">
            <p className="text-white text-sm uppercase tracking-[0.2em] font-inter">
              Explore Collection
            </p>
          </div>
        </Link>
      </motion.div>

      {/* Decorative Corner Accent - Top Right */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
        className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-[#66BB6A]/20 to-transparent blur-3xl pointer-events-none"
      />

      {/* Decorative Corner Accent - Bottom Left */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 1.5, delay: 1.2 }}
        className="absolute bottom-0 left-0 w-[32rem] h-[32rem] bg-gradient-radial from-[#2E7D32]/20 to-transparent blur-3xl pointer-events-none"
      />
    </section>
  );
}
