'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';

interface PremiumProductSectionProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  background?: 'charcoal' | 'dark-green';
  showHeader?: boolean;
}

export default function PremiumProductSection({
  title = 'Our Top Selling',
  subtitle = 'Handpicked nature essentials, loved by our community',
  children,
  background = 'charcoal',
  showHeader = true,
}: PremiumProductSectionProps) {
  const bgColor = background === 'dark-green' ? '#0D3B1F' : '#1A1A1A';

  return (
    <section
      className="relative py-16 md:py-24 px-4 md:px-6 overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* Subtle Geometric Leaf SVG Accents in Corners */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ duration: 1.5 }}
        className="absolute top-0 left-0 w-64 h-64 pointer-events-none"
      >
        <svg
          viewBox="0 0 200 200"
          fill="none"
          className="w-full h-full text-[#2E7D32]"
        >
          <path
            d="M100 20 L180 100 L100 180 L20 100 Z"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            opacity="0.5"
          />
          <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
          <path
            d="M100 40 Q140 100 100 160 Q60 100 100 40"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            opacity="0.4"
          />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none transform rotate-180"
      >
        <svg
          viewBox="0 0 200 200"
          fill="none"
          className="w-full h-full text-[#66BB6A]"
        >
          <path
            d="M100 20 L180 100 L100 180 L20 100 Z"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            opacity="0.5"
          />
          <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
          <path
            d="M100 40 Q140 100 100 160 Q60 100 100 40"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            opacity="0.4"
          />
        </svg>
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10 max-w-[1400px] mx-auto">
        {showHeader && <SectionHeader title={title} subtitle={subtitle} />}
        
        {/* Products Grid */}
        <div className="mt-12">
          {children}
        </div>
      </div>

      {/* Subtle Gradient Overlay for Depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at top center, rgba(46, 125, 50, 0.02) 0%, transparent 60%)`,
        }}
      />
    </section>
  );
}
