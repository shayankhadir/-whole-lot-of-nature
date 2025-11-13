'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Leaf, TreeDeciduous } from 'lucide-react';
import { useRef } from 'react';

export default function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

  return (
    <section ref={ref} className="relative flex flex-col justify-center items-center min-h-screen w-full overflow-hidden">
      {/* Parallax Background with Forest Leaves */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <Image
          src="https://admin.wholelotofnature.com/wp-content/uploads/2025/11/bgleaf1.png"
          alt="Dense forest leaves background"
          fill
          className="object-cover object-center"
          style={{ filter: 'brightness(0.3)' }}
          priority
          quality={90}
        />
        {/* Deep gradient overlay - emerald to charcoal */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D3B1F]/80 via-[#1A1A1A]/70 to-[#000000]/90" />
      </motion.div>

      {/* Animated Forest Decorations - Extending Beyond Edges */}
      <motion.div
        initial={{ opacity: 0, x: -100, scale: 0.8 }}
        animate={{ opacity: 0.08, x: 0, scale: 1.2 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute -top-20 -left-32 w-[400px] h-[600px] text-[#2E7D32] pointer-events-none hidden lg:block"
        style={{ transform: 'rotate(-15deg)' }}
      >
        <TreeDeciduous className="w-full h-full" strokeWidth={0.3} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 100, scale: 0.8 }}
        animate={{ opacity: 0.08, x: 0, scale: 1.2 }}
        transition={{ duration: 2, delay: 0.3, ease: 'easeOut' }}
        className="absolute -bottom-32 -right-32 w-[500px] h-[700px] text-[#66BB6A] pointer-events-none hidden lg:block"
        style={{ transform: 'rotate(20deg)' }}
      >
        <TreeDeciduous className="w-full h-full" strokeWidth={0.3} />
      </motion.div>

      {/* Floating Leaf Decorations */}
      <motion.div
        animate={{ 
          y: [0, -30, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute top-1/4 right-1/4 w-24 h-24 text-[#66BB6A]/20 pointer-events-none hidden md:block"
      >
        <Leaf className="w-full h-full" strokeWidth={0.5} />
      </motion.div>

      <motion.div
        animate={{ 
          y: [0, 30, 0],
          rotate: [0, -5, 5, 0]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1
        }}
        className="absolute bottom-1/3 left-1/4 w-32 h-32 text-[#2E7D32]/15 pointer-events-none hidden md:block"
      >
        <Leaf className="w-full h-full" strokeWidth={0.5} />
      </motion.div>

      {/* Hero Content */}
      <motion.div style={{ opacity }} className="relative z-10 flex flex-col items-center justify-center px-6 md:px-12 text-center max-w-[1400px] mx-auto py-20">
        {/* Main Headline - STAY LOYAL TO THE SOIL with Golden Ratio Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="font-montserrat text-[clamp(2.625rem,10vw,6.875rem)] md:text-[clamp(4.25rem,12vw,6.875rem)] lg:text-[6.875rem] font-bold uppercase text-white leading-[0.95] drop-shadow-[0_12px_48px_rgba(0,0,0,0.8)] antialiased"
          style={{ letterSpacing: '0.05em' }}
        >
          STAY
          <br />
          LOYAL TO
          <br />
          <span className="text-[#66BB6A] drop-shadow-[0_0_40px_rgba(102,187,106,0.6)]">THE SOIL</span>
        </motion.h1>

        {/* Subheadline - Refined messaging */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="mt-8 md:mt-10 font-inter text-[clamp(1.125rem,2.5vw,1.5rem)] text-white/90 max-w-2xl leading-relaxed tracking-wide"
        >
          Handpicked nature, organic plants, and sustainable growth — for a greener Earth.
        </motion.p>

        {/* Glassmorphic CTA Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1, ease: [0.4, 0, 0.2, 1] }}
          className="mt-12 md:mt-16 max-w-2xl glass rounded-lg px-8 md:px-12 py-8 md:py-10 shadow-[0_12px_48px_rgba(46,125,50,0.3)] hover:shadow-[0_16px_64px_rgba(46,125,50,0.4)] transition-all duration-500 border border-[#2E7D32]/30"
        >
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 32px rgba(46,125,50,0.6)' }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-3 px-10 py-5 bg-[#2E7D32] text-white font-montserrat font-bold text-lg uppercase tracking-widest forest-card-lg emerald-glow hover:bg-[#66BB6A] transition-all duration-300 antialiased"
              >
                Explore Shop
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </Link>

            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-3 px-10 py-5 bg-white/10 text-white font-montserrat font-semibold text-lg uppercase tracking-widest forest-card-lg border-2 border-white/30 hover:bg-white/20 hover:border-[#66BB6A] transition-all duration-300 antialiased backdrop-blur-md"
              >
                Our Story
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-white/60"
          >
            <span className="text-xs uppercase tracking-widest font-montserrat">Scroll</span>
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1.5 h-1.5 bg-[#66BB6A] rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
