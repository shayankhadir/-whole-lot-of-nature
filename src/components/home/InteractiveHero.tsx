'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
      className="relative w-full min-h-[calc(100svh-7rem)] sm:min-h-[95vh] flex items-center justify-center overflow-hidden pt-16 pb-28"
    >
      {/* Parallax Background */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/images/backgrounds/bgleaf1.webp"
          alt="Tropical leaves background"
          fill
          className="object-cover object-center"
          priority
          quality={95}
        />
        {/* Interactive gradient overlay */}
        <div className=" absolute inset-0 bg-gradient-to-br from-[#010a05]/98 via-[#041107]/95 to-[#010a05]/98" />
        
        {/* Animated light rays */}
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-radial from-emerald-400/20 via-transparent to-transparent"
        />
        
        {/* Seamless transition gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-[#0D1B0F] via-[#0d3512]/60 to-transparent z-10" />
      </motion.div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-300/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
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
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
        >
          <span className="text-emerald-100/90 text-sm font-semibold tracking-[0.14em] uppercase">
            Welcome to
          </span>
        </motion.div>

        {/* Main Heading with Gradient */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-montserrat text-[clamp(2.4rem,6vw,4.25rem)] font-bold leading-[1.05] mb-6 antialiased"
        >
          <span className="bg-gradient-to-r from-emerald-200 via-green-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(16,185,129,0.3)] whitespace-normal sm:whitespace-nowrap">
            WHOLE&nbsp;LOT&nbsp;OF&nbsp;NATURE
          </span>
        </motion.h1>

        {/* Subheading - Light green for visibility */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-[clamp(1rem,2vw,1.25rem)] font-light leading-relaxed max-w-3xl mx-auto mb-10 drop-shadow-lg text-[#86efac]"
        >
          Your ultimate destination for premium plants, handcrafted soil mixes, aquatic life, and sustainable gardening essentials
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-sm uppercase tracking-[0.18em] text-emerald-200/80 mb-8"
        >
          Stay loyal to the soil
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="#categories">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(16,185,129,0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-full overflow-hidden shadow-xl"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Collection
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </Link>
          
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-[#14532d] to-[#0f3c24] border border-emerald-800/60 text-white font-semibold rounded-full backdrop-blur-md hover:brightness-110 transition-all"
            >
              View All Products
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator - REMOVED */}
      {/* Seamless transition is now handled via gradient overlap */}

      {/* Corner Glow Effects */}
      <motion.div
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/30 rounded-full blur-[120px] pointer-events-none"
      />
      
      <motion.div
        animate={{
          opacity: [0.15, 0.3, 0.15],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-0 left-0 w-[32rem] h-[32rem] bg-[#2E7D32]/20 rounded-full blur-[120px] pointer-events-none backdrop-blur-md"
      />
    </section>
  );
}
