'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Facebook } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
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

      {/* Top Navigation - Desktop Only */}
      <nav className="absolute top-0 left-0 w-full flex justify-between items-center p-6 md:p-10 z-30">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white font-montserrat text-xl md:text-2xl font-bold tracking-wider"
          >
            WHOLE LOT OF <span className="text-[#66BB6A]">NATURE</span>
          </motion.div>
        </Link>

        {/* Nav Links - Hidden on Mobile */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden md:flex gap-12 text-white text-base font-inter uppercase tracking-[0.15em] font-medium"
        >
          <Link href="/shop" className="hover:text-[#66BB6A] transition-colors duration-300">
            Shop
          </Link>
          <Link href="/about" className="hover:text-[#66BB6A] transition-colors duration-300">
            About
          </Link>
          <Link href="/blog" className="hover:text-[#66BB6A] transition-colors duration-300">
            Blog
          </Link>
          <Link href="/contact" className="hover:text-[#66BB6A] transition-colors duration-300">
            Contact
          </Link>
        </motion.div>
      </nav>

      {/* Main Headline - Premium Serif Typography */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 px-6 text-center"
      >
        <h1 
          className="font-serif text-white text-[clamp(4rem,18vw,14rem)] font-bold leading-[0.85] tracking-[0.08em] drop-shadow-[0_20px_80px_rgba(0,0,0,0.9)]"
          style={{
            fontFamily: "'Playfair Display', 'Georgia', serif",
            textShadow: '0 10px 40px rgba(0,0,0,0.8), 0 0 80px rgba(46,125,50,0.3)'
          }}
        >
          NATURE
        </h1>
        
        {/* Elegant Underline Accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-1 w-64 md:w-96 mx-auto mt-6 bg-gradient-to-r from-transparent via-[#66BB6A] to-transparent"
        />

        {/* Subtle Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mt-8 text-white/80 text-[clamp(1rem,2.5vw,1.5rem)] font-light tracking-[0.2em] uppercase font-inter"
        >
          Where Life Grows
        </motion.p>
      </motion.div>

      {/* Bottom Scroll Hint - Optional Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.8 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
      >
        <Link href="#categories">
          <div className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/10 hover:border-[#66BB6A]/50 transition-all duration-500 cursor-pointer">
            <p className="text-white text-sm uppercase tracking-[0.2em] font-inter">
              Explore Collection
            </p>
          </div>
        </Link>
      </motion.div>

      {/* Social Icons - Bottom Left */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 2 }}
        className="absolute bottom-10 left-10 hidden md:flex flex-col gap-5 z-20"
      >
        <Link 
          href="https://instagram.com/wholelotofnature" 
          target="_blank"
          className="text-white hover:text-[#66BB6A] transition-colors duration-300"
          aria-label="Instagram"
        >
          <Instagram className="w-6 h-6" strokeWidth={1.5} />
        </Link>
        <Link 
          href="https://facebook.com/wholelotofnature" 
          target="_blank"
          className="text-white hover:text-[#66BB6A] transition-colors duration-300"
          aria-label="Facebook"
        >
          <Facebook className="w-6 h-6" strokeWidth={1.5} />
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
