'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Full-Bleed Leaf Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/backgrounds/seamless-tropical-canopy.svg"
          alt="Seamless tropical canopy"
          fill
          className="object-cover object-center brightness-[0.65]"
          priority
        />
        {/* Luxury Gradient Overlay - Emerald to Deep Charcoal */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--emerald-900)]/60 via-[var(--ink-900)]/50 to-[var(--surface-onyx)]/70" />
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
          className="text-white/85 text-[clamp(0.75rem,1.5vw,0.875rem)] font-light tracking-[0.3em] uppercase font-inter mb-4"
        >
          Welcome to
        </motion.p>

        {/* Main Brand Heading */}
        <h1 
          className="font-montserrat text-white text-[clamp(1.5rem,5vw,2.5rem)] font-bold leading-tight tracking-wider drop-shadow-[0_10px_40px_rgba(0,0,0,0.9)] mb-6 antialiased"
        >
          WHOLE LOT OF <span className="text-[var(--emerald-500)]">NATURE</span>
        </h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-[var(--mint-100)] text-[clamp(0.875rem,1.5vw,1rem)] font-light leading-relaxed max-w-2xl mx-auto font-inter"
        >
          Your ultimate destination for premium plants, handcrafted soil mixes, aquatic life, and sustainable gardening essentials
        </motion.p>
      </motion.div>

      {/* Bottom Scroll Hint - HoverBorderGradient Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
      >
        <Link href="#categories">
          <HoverBorderGradient
            containerClassName="rounded-full"
            className="text-white text-sm uppercase tracking-[0.2em] font-inter px-6 py-3"
            glowColor="var(--emerald-500)"
          >
            Explore Collection
          </HoverBorderGradient>
        </Link>
      </motion.div>

      {/* Decorative Corner Accent - Top Right */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
        className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-[var(--emerald-500)]/20 to-transparent blur-3xl pointer-events-none"
      />

      {/* Decorative Corner Accent - Bottom Left */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 1.5, delay: 1.2 }}
        className="absolute bottom-0 left-0 w-[32rem] h-[32rem] bg-gradient-radial from-[var(--emerald-700)]/20 to-transparent blur-3xl pointer-events-none"
      />
    </section>
  );
}
