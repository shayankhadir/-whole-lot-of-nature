'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  tint?: 'emerald' | 'turquoise' | 'dark';
}

export default function GlassCard({ 
  children, 
  className = '',
  blur = 'md',
  tint = 'emerald'
}: GlassCardProps) {
  
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  };

  const tintClasses = {
    emerald: 'bg-[#2E7D32]/10 border-[#2E7D32]/30',
    turquoise: 'bg-[#66BB6A]/10 border-[#66BB6A]/30',
    dark: 'bg-black/20 border-white/10'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`
        ${blurClasses[blur]} 
        ${tintClasses[tint]}
        rounded-xl border shadow-lg
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

// Frosted glass variant with stronger effect
export function FrostedGlassCard({ 
  children, 
  className = '' 
}: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`
        backdrop-blur-xl bg-white/5 
        border border-white/20 
        rounded-xl shadow-2xl
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-xl pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
