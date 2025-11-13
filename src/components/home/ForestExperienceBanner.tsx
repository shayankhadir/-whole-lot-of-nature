'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import DarkVeil from '@/components/ui/DarkVeil';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';

export default function ForestExperienceBanner() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['20%', '-20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 0.6]);

  return (
    <section ref={ref} className="relative h-[30vh] sm:h-[40vh] overflow-hidden my-20">
      {/* DarkVeil Shader Background */}
      <div className="absolute inset-0 z-0">
        <DarkVeil 
          hueShift={120}
          noiseIntensity={0.08}
          scanlineIntensity={0}
          speed={0.3}
          scanlineFrequency={0}
          warpAmount={0.2}
          resolutionScale={0.8}
        />
      </div>

      {/* Overlay for content visibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0D1B0F]/60 via-[#1A1A1A]/40 to-[#0D1B0F]/60 z-5" />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center"
      >
        {/* Icon */}
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="mb-6"
        >
          <Sparkles className="w-16 h-16 text-[#66BB6A]" strokeWidth={1.5} />
        </motion.div>

        {/* Text - Golden Ratio H4 (68px) */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-montserrat text-[clamp(2.5rem,6vw,2.5rem)] font-bold text-white uppercase tracking-wide mb-4 antialiased"
        >
          Explore the <span className="text-[#66BB6A]">Virtual Forest</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-inter text-lg text-white/80 max-w-2xl mb-8 antialiased"
        >
          Discover our interactive plant catalog and learn about sustainable organic gardening
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="/shop">
            <HoverBorderGradient
              containerClassName="rounded-full"
              className="px-8 py-3 text-white font-montserrat font-bold text-base uppercase tracking-wider"
              glowColor="#66BB6A"
            >
              Start Exploring
            </HoverBorderGradient>
          </Link>
        </motion.div>
      </motion.div>

      {/* Animated Particles/Leaves Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#66BB6A] rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </section>
  );
}
