'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}

export default function SpotlightCard({ 
  children, 
  className = '',
  spotlightColor = 'rgba(46, 125, 50, 0.15)'
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative overflow-hidden rounded-xl bg-[#1A1A1A] border border-[#2E7D32]/20 ${className}`}
    >
      {/* Spotlight effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${x}px ${y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      
      {/* Border glow */}
      <motion.div
        className="pointer-events-none absolute -inset-[1px] rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${x}px ${y}px, rgba(46, 125, 50, 0.4), transparent 40%)`,
          maskImage: 'linear-gradient(to bottom, transparent, black, transparent)',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Variant with more intense spotlight
export function IntenseSpotlightCard({ 
  children, 
  className = ''
}: { children: ReactNode; className?: string }) {
  return (
    <SpotlightCard 
      spotlightColor="rgba(102, 187, 106, 0.25)"
      className={className}
    >
      {children}
    </SpotlightCard>
  );
}
