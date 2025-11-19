'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useRef } from 'react';

export default function InteractiveHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Parallax Background */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/images/backgrounds/seamless-tropical-canopy.svg"
          alt="Seamless tropical canopy"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Interactive gradient overlay - Deep & Sophisticated */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/90 via-emerald-900/85 to-emerald-950/80" />
        
        {/* Animated light rays - Subtle Gold */}
        <motion.div
          animate={{
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-radial from-gold-300/10 via-transparent to-transparent"
        />
      </motion.div>

      {/* Floating particles - Gold & Emerald */}
      <div className="absolute inset-0 z-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${i % 2 === 0 ? 'bg-gold-300/30' : 'bg-emerald-300/20'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 px-6 text-center max-w-5xl mx-auto"
      >
        {/* Welcome Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-900/40 border border-gold-500/30 backdrop-blur-md mb-8"
        >
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span className="text-gold-100 text-sm font-medium tracking-[0.2em] uppercase">
            Welcome to
          </span>
        </motion.div>

        {/* Main Heading with Gradient */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-serif text-[clamp(3rem,9vw,6rem)] font-bold leading-[1.1] mb-8"
        >
          <span className="text-cream-50 drop-shadow-lg">
            WHOLE LOT OF
          </span>
          <br />
          <span className="text-gold-gradient drop-shadow-[0_0_30px_rgba(196,155,34,0.2)]">
            NATURE
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-cream-100 text-[clamp(1.1rem,2vw,1.35rem)] font-light leading-relaxed max-w-3xl mx-auto mb-12 drop-shadow-md font-sans"
        >
          Your ultimate destination for premium plants, handcrafted soil mixes, aquatic life, and sustainable gardening essentials
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-wrap items-center justify-center gap-6"
        >
          <Link href="#categories">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(196,155,34,0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-10 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold rounded-full overflow-hidden shadow-lg border border-gold-400/20"
            >
              <span className="relative z-10 flex items-center gap-2 tracking-wide">
                Explore Collection
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gold-600 to-gold-700"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </Link>
          
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-4 border border-cream-100/30 text-cream-50 font-medium rounded-full backdrop-blur-md hover:bg-cream-50/10 hover:border-cream-100/50 transition-all tracking-wide"
            >
              View All Products
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ 
          opacity: { delay: 1.5, duration: 0.5 },
          y: { duration: 2, repeat: Infinity }
        }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
      >
        <span className="text-cream-200/80 text-xs tracking-[0.2em] uppercase">Scroll to explore</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-gold-400/0 via-gold-400/50 to-gold-400/0" />
      </motion.div>

      {/* Corner Glow Effects */}
      <motion.div
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none"
      />
      
      <motion.div
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-0 left-0 w-[32rem] h-[32rem] bg-gold-500/5 rounded-full blur-[100px] pointer-events-none"
      />
    </section>
  );
}
