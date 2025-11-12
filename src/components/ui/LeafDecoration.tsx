'use client';

import { motion } from 'framer-motion';

interface LeafDecorationProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'middle-left' | 'middle-right';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number;
  className?: string;
  variant?: 'monstera' | 'single' | 'palm';
}

export default function LeafDecoration({ 
  position = 'top-right', 
  size = 'lg',
  opacity = 0.15,
  className = '',
  variant = 'monstera'
}: LeafDecorationProps) {
  
  const sizeClasses = {
    sm: 'w-32 h-24',
    md: 'w-48 h-36',
    lg: 'w-64 h-48',
    xl: 'w-96 h-72'
  };

  const positionClasses = {
    'top-left': '-top-16 -left-16',
    'top-right': '-top-16 -right-16',
    'bottom-left': '-bottom-16 -left-16',
    'bottom-right': '-bottom-16 -right-16',
    'middle-left': 'top-1/2 -translate-y-1/2 -left-16',
    'middle-right': 'top-1/2 -translate-y-1/2 -right-16'
  };

  const rotations = {
    'top-left': -25,
    'top-right': 25,
    'bottom-left': 25,
    'bottom-right': -25,
    'middle-left': -15,
    'middle-right': 15
  };

  const getSVG = () => {
    switch (variant) {
      case 'monstera':
        return (
          <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#2E7D32" strokeWidth="2" className="w-full h-full">
            <path d="M20 130 Q50 60 70 110 Q85 140 110 60 Q130 20 170 40 Q150 80 180 120" opacity={opacity} />
            <line x1="55" y1="110" x2="80" y2="40" opacity={opacity} />
            <line x1="95" y1="125" x2="110" y2="75" opacity={opacity} />
            <line x1="125" y1="130" x2="150" y2="70" opacity={opacity} />
          </svg>
        );
      case 'single':
        return (
          <svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#2E7D32" strokeWidth="2" className="w-full h-full">
            <ellipse cx="50" cy="65" rx="40" ry="60" opacity={opacity} />
            <line x1="50" y1="5" x2="50" y2="125" opacity={opacity} />
            <line x1="50" y1="65" x2="20" y2="30" opacity={opacity} />
            <line x1="50" y1="65" x2="80" y2="30" opacity={opacity} />
            <line x1="50" y1="90" x2="35" y2="120" opacity={opacity} />
            <line x1="50" y1="90" x2="65" y2="120" opacity={opacity} />
          </svg>
        );
      case 'palm':
        return (
          <svg viewBox="0 0 180 100" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#2E7D32" strokeWidth="1.8" className="w-full h-full">
            <path d="M10 100 L40 20 L70 80 L100 25 L130 85 L160 20" opacity={opacity} />
            <line x1="40" y1="20" x2="40" y2="100" opacity={opacity} />
            <line x1="70" y1="30" x2="70" y2="100" opacity={opacity} />
            <line x1="100" y1="25" x2="100" y2="100" opacity={opacity} />
            <line x1="130" y1="45" x2="130" y2="100" opacity={opacity} />
            <line x1="160" y1="20" x2="160" y2="100" opacity={opacity} />
          </svg>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className={`absolute ${positionClasses[position]} ${sizeClasses[size]} pointer-events-none ${className}`}
      style={{ 
        transform: `rotate(${rotations[position]}deg)`,
        zIndex: 0
      }}
    >
      {getSVG()}
    </motion.div>
  );
}

// Fern variation - Detailed multi-branched
export function FernDecoration({ 
  position = 'top-left', 
  size = 'lg',
  opacity = 0.12,
  className = ''
}: LeafDecorationProps) {
  
  const sizeClasses = {
    sm: 'w-28 h-40',
    md: 'w-36 h-52',
    lg: 'w-44 h-64',
    xl: 'w-52 h-80'
  };

  const positionClasses = {
    'top-left': '-top-20 -left-12',
    'top-right': '-top-20 -right-12',
    'bottom-left': '-bottom-20 -left-12',
    'bottom-right': '-bottom-20 -right-12',
    'middle-left': 'top-1/2 -translate-y-1/2 -left-12',
    'middle-right': 'top-1/2 -translate-y-1/2 -right-12'
  };

  const rotations = {
    'top-left': -35,
    'top-right': 35,
    'bottom-left': 35,
    'bottom-right': -35,
    'middle-left': -20,
    'middle-right': 20
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      className={`absolute ${positionClasses[position]} ${sizeClasses[size]} pointer-events-none ${className}`}
      style={{ 
        transform: `rotate(${rotations[position]}deg)`,
        zIndex: 0
      }}
    >
      <svg viewBox="0 0 140 200" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#66BB6A" strokeWidth="1.5" className="w-full h-full">
        <path d="M70 190 L70 10" opacity={opacity} />
        <path d="M70 180 L40 150 M70 180 L100 150" opacity={opacity} />
        <path d="M70 160 L30 120 M70 160 L110 120" opacity={opacity} />
        <path d="M70 140 L35 95 M70 140 L105 95" opacity={opacity} />
        <path d="M70 120 L50 70 M70 120 L90 70" opacity={opacity} />
      </svg>
    </motion.div>
  );
}
