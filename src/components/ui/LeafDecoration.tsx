'use client';

import { motion } from 'framer-motion';

interface LeafDecorationProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'middle-left' | 'middle-right';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number;
  className?: string;
}

export default function LeafDecoration({ 
  position = 'top-right', 
  size = 'lg',
  opacity = 0.1,
  className = ''
}: LeafDecorationProps) {
  
  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
    xl: 'w-96 h-96'
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className={`absolute ${positionClasses[position]} ${sizeClasses[size]} pointer-events-none overflow-hidden ${className}`}
      style={{ 
        transform: `rotate(${rotations[position]}deg)`,
        zIndex: 0
      }}
    >
      {/* Monstera Leaf SVG */}
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-[#2E7D32]"
      >
        <g opacity={opacity}>
          {/* Main leaf shape */}
          <path
            d="M100 10 C120 10, 140 20, 155 40 C170 60, 180 85, 180 110 C180 135, 170 160, 155 175 C140 190, 120 195, 100 195 C80 195, 60 190, 45 175 C30 160, 20 135, 20 110 C20 85, 30 60, 45 40 C60 20, 80 10, 100 10 Z"
            fill="currentColor"
            fillOpacity="0.15"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.25"
          />
          
          {/* Leaf veins */}
          <line x1="100" y1="10" x2="100" y2="195" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
          <line x1="100" y1="50" x2="70" y2="80" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.15" />
          <line x1="100" y1="50" x2="130" y2="80" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.15" />
          <line x1="100" y1="100" x2="60" y2="120" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.15" />
          <line x1="100" y1="100" x2="140" y2="120" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.15" />
          <line x1="100" y1="150" x2="70" y2="165" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.15" />
          <line x1="100" y1="150" x2="130" y2="165" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.15" />
          
          {/* Monstera holes */}
          <ellipse cx="70" cy="100" rx="8" ry="15" fill="#0A0A0A" opacity="0.3" />
          <ellipse cx="130" cy="100" rx="8" ry="15" fill="#0A0A0A" opacity="0.3" />
          <ellipse cx="80" cy="140" rx="6" ry="12" fill="#0A0A0A" opacity="0.3" />
          <ellipse cx="120" cy="140" rx="6" ry="12" fill="#0A0A0A" opacity="0.3" />
        </g>
      </svg>
    </motion.div>
  );
}

// Fern variation
export function FernDecoration({ 
  position = 'top-left', 
  size = 'lg',
  opacity = 0.1,
  className = ''
}: LeafDecorationProps) {
  
  const sizeClasses = {
    sm: 'w-24 h-48',
    md: 'w-32 h-64',
    lg: 'w-40 h-80',
    xl: 'w-48 h-96'
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
      whileInView={{ opacity, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      className={`absolute ${positionClasses[position]} ${sizeClasses[size]} pointer-events-none overflow-hidden ${className}`}
      style={{ 
        transform: `rotate(${rotations[position]}deg)`,
        zIndex: 0
      }}
    >
      {/* Fern Frond SVG */}
      <svg
        viewBox="0 0 100 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-[#66BB6A]"
      >
        <g opacity={opacity}>
          {/* Central stem */}
          <line x1="50" y1="0" x2="50" y2="300" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
          
          {/* Fern leaflets - alternating sides */}
          {[...Array(12)].map((_, i) => {
            const y = 20 + i * 24;
            const side = i % 2 === 0 ? 1 : -1;
            const width = 30 - (i * 1.5);
            return (
              <ellipse
                key={i}
                cx={50 + (side * width)}
                cy={y}
                rx={width}
                ry="10"
                fill="currentColor"
                fillOpacity="0.2"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeOpacity="0.25"
              />
            );
          })}
        </g>
      </svg>
    </motion.div>
  );
}
