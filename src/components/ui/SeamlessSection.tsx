'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import LeafDecoration, { FernDecoration } from '@/components/ui/LeafDecoration';

interface SeamlessSectionProps {
  children: ReactNode;
  bgColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  paddingY?: 'sm' | 'md' | 'lg' | 'xl';
  leftDecoration?: 'monstera' | 'single' | 'palm' | 'fern' | 'none';
  rightDecoration?: 'monstera' | 'single' | 'palm' | 'fern' | 'none';
  className?: string;
}

export default function SeamlessSection({
  children,
  bgColor = 'bg-[#0A0A0A]',
  gradientFrom,
  gradientTo,
  paddingY = 'lg',
  leftDecoration = 'none',
  rightDecoration = 'none',
  className = ''
}: SeamlessSectionProps) {
  
  const paddingClasses = {
    sm: 'py-16 md:py-24',
    md: 'py-24 md:py-32',
    lg: 'py-32 md:py-40',
    xl: 'py-40 md:py-48'
  };

  const backgroundStyle = gradientFrom && gradientTo
    ? `bg-gradient-to-b from-[${gradientFrom}] via-[${bgColor.replace('bg-[', '').replace(']', '')}] to-[${gradientTo}]`
    : bgColor;

  return (
    <section className={`relative w-full ${backgroundStyle} ${paddingClasses[paddingY]} overflow-hidden ${className}`}>
      {/* Subtle gradient overlay for depth */}
      {gradientFrom && gradientTo && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-transparent pointer-events-none" />
      )}

      {/* Left Decoration */}
      {leftDecoration === 'monstera' && (
        <LeafDecoration position="middle-left" size="xl" opacity={0.08} variant="monstera" />
      )}
      {leftDecoration === 'single' && (
        <LeafDecoration position="middle-left" size="lg" opacity={0.12} variant="single" />
      )}
      {leftDecoration === 'palm' && (
        <LeafDecoration position="middle-left" size="xl" opacity={0.10} variant="palm" />
      )}
      {leftDecoration === 'fern' && (
        <FernDecoration position="middle-left" size="lg" opacity={0.12} />
      )}

      {/* Right Decoration */}
      {rightDecoration === 'monstera' && (
        <LeafDecoration position="middle-right" size="xl" opacity={0.08} variant="monstera" />
      )}
      {rightDecoration === 'single' && (
        <LeafDecoration position="middle-right" size="lg" opacity={0.12} variant="single" />
      )}
      {rightDecoration === 'palm' && (
        <LeafDecoration position="middle-right" size="xl" opacity={0.10} variant="palm" />
      )}
      {rightDecoration === 'fern' && (
        <FernDecoration position="middle-right" size="lg" opacity={0.12} />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}

// Section Divider with Leaf SVG
export function LeafDivider({ 
  color = '#2E7D32',
  opacity = 0.15
}: { 
  color?: string; 
  opacity?: number; 
}) {
  return (
    <div className="relative w-full h-24 flex items-center justify-center overflow-hidden">
      {/* Horizontal line */}
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      {/* Central leaf ornament */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10 bg-[#0A0A0A] px-6"
      >
        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ color }}
        >
          <g opacity={opacity * 4}>
            {/* Center leaf */}
            <path
              d="M30 10 C35 10, 40 15, 42 22 C44 29, 44 38, 42 44 C40 50, 35 54, 30 54 C25 54, 20 50, 18 44 C16 38, 16 29, 18 22 C20 15, 25 10, 30 10 Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <line x1="30" y1="10" x2="30" y2="54" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            
            {/* Side leaves */}
            <ellipse cx="18" cy="30" rx="6" ry="10" fill="currentColor" opacity="0.7" />
            <ellipse cx="42" cy="30" rx="6" ry="10" fill="currentColor" opacity="0.7" />
          </g>
        </svg>
      </motion.div>
    </div>
  );
}
