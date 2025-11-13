'use client';

import { motion } from 'framer-motion';

export default function TropicalBackground() {
  // Animation variants for different leaves
  const floatVariants = {
    float1: {
      y: [0, -30, 0],
      x: [0, 15, 0],
      rotate: [0, 10, 0],
      transition: {
        duration: 8,
        repeat: Infinity as number,
        ease: "easeInOut" as const
      }
    },
    float2: {
      y: [0, -40, 0],
      x: [0, -20, 0],
      rotate: [0, -15, 0],
      transition: {
        duration: 10,
        repeat: Infinity as number,
        ease: "easeInOut" as const,
        delay: 1
      }
    },
    float3: {
      y: [0, -25, 0],
      x: [0, 10, 0],
      rotate: [0, 12, 0],
      transition: {
        duration: 9,
        repeat: Infinity as number,
        ease: "easeInOut" as const,
        delay: 2
      }
    },
    float4: {
      y: [0, -35, 0],
      x: [0, -15, 0],
      rotate: [0, -8, 0],
      transition: {
        duration: 11,
        repeat: Infinity as number,
        ease: "easeInOut" as const,
        delay: 0.5
      }
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Top left leaf */}
      <motion.div
        variants={floatVariants}
        animate="float1"
        className="absolute -top-20 -left-20 opacity-10"
      >
        <svg width="300" height="300" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 20C100 20 140 40 160 80C180 120 180 160 160 180C140 200 100 200 100 200C100 200 100 160 100 120C100 80 100 20 100 20Z" fill="#059669" fillOpacity="0.3"/>
          <path d="M100 20C100 20 60 40 40 80C20 120 20 160 40 180C60 200 100 200 100 200C100 200 100 160 100 120C100 80 100 20 100 20Z" fill="#10b981" fillOpacity="0.3"/>
          <path d="M100 20 L100 200 M100 60 L140 100 M100 80 L150 120 M100 100 L160 140 M100 120 L165 160 M100 60 L60 100 M100 80 L50 120 M100 100 L40 140 M100 120 L35 160" stroke="#2E7D32" strokeWidth="1" opacity="0.3"/>
        </svg>
      </motion.div>

      {/* Top right monstera leaf */}
      <motion.div
        variants={floatVariants}
        animate="float2"
        className="absolute -top-10 right-10 opacity-10"
      >
        <svg width="250" height="250" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 10C100 10 150 30 170 70C190 110 180 150 160 170C140 190 100 190 100 190L100 10Z" fill="#059669" fillOpacity="0.4"/>
          <path d="M100 10C100 10 50 30 30 70C10 110 20 150 40 170C60 190 100 190 100 190L100 10Z" fill="#10b981" fillOpacity="0.4"/>
          <ellipse cx="130" cy="80" rx="15" ry="25" fill="white" fillOpacity="0.3"/>
          <ellipse cx="70" cy="80" rx="15" ry="25" fill="white" fillOpacity="0.3"/>
          <ellipse cx="130" cy="130" rx="15" ry="25" fill="white" fillOpacity="0.3"/>
          <ellipse cx="70" cy="130" rx="15" ry="25" fill="white" fillOpacity="0.3"/>
          <path d="M100 10 L100 190 M100 50 L140 80 M100 70 L150 100 M100 90 L155 120 M100 110 L160 140 M100 50 L60 80 M100 70 L50 100 M100 90 L45 120 M100 110 L40 140" stroke="#2E7D32" strokeWidth="1" opacity="0.4"/>
        </svg>
      </motion.div>

      {/* Bottom left palm leaf */}
      <motion.div
        variants={floatVariants}
        animate="float3"
        className="absolute bottom-20 -left-10 opacity-10"
      >
        <svg width="280" height="280" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 180 Q80 150 70 120 Q60 90 50 60 Q40 30 30 10" stroke="#059669" strokeWidth="3" fill="none" opacity="0.4"/>
          <path d="M100 180 Q100 150 100 120 Q100 90 100 60 Q100 30 100 10" stroke="#10b981" strokeWidth="3" fill="none" opacity="0.4"/>
          <path d="M100 180 Q120 150 130 120 Q140 90 150 60 Q160 30 170 10" stroke="#059669" strokeWidth="3" fill="none" opacity="0.4"/>
          <ellipse cx="40" cy="30" rx="35" ry="15" fill="#10b981" fillOpacity="0.3" transform="rotate(-45 40 30)"/>
          <ellipse cx="100" cy="20" rx="35" ry="15" fill="#10b981" fillOpacity="0.3"/>
          <ellipse cx="160" cy="30" rx="35" ry="15" fill="#10b981" fillOpacity="0.3" transform="rotate(45 160 30)"/>
        </svg>
      </motion.div>

      {/* Bottom right tropical leaf */}
      <motion.div
        variants={floatVariants}
        animate="float4"
        className="absolute bottom-10 right-20 opacity-10"
      >
        <svg width="260" height="260" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 190C100 190 70 170 50 130C30 90 30 50 50 30C70 10 100 10 100 10C100 10 100 50 100 90C100 130 100 190 100 190Z" fill="#059669" fillOpacity="0.35"/>
          <path d="M100 190C100 190 130 170 150 130C170 90 170 50 150 30C130 10 100 10 100 10C100 10 100 50 100 90C100 130 100 190 100 190Z" fill="#10b981" fillOpacity="0.35"/>
          <path d="M100 190 L100 10 M100 150 L70 110 M100 130 L60 90 M100 110 L50 70 M100 90 L45 50 M100 150 L130 110 M100 130 L140 90 M100 110 L150 70 M100 90 L155 50" stroke="#2E7D32" strokeWidth="1" opacity="0.4"/>
        </svg>
      </motion.div>

      {/* Center top small leaf */}
      <motion.div
        variants={floatVariants}
        animate="float1"
        className="absolute top-40 left-1/4 opacity-8"
      >
        <svg width="150" height="150" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 10C50 10 65 20 70 35C75 50 75 65 70 75C65 85 50 85 50 85C50 85 50 65 50 50C50 35 50 10 50 10Z" fill="#10b981" fillOpacity="0.25"/>
          <path d="M50 10C50 10 35 20 30 35C25 50 25 65 30 75C35 85 50 85 50 85C50 85 50 65 50 50C50 35 50 10 50 10Z" fill="#059669" fillOpacity="0.25"/>
          <path d="M50 10 L50 85 M50 30 L60 45 M50 45 L65 55 M50 30 L40 45 M50 45 L35 55" stroke="#2E7D32" strokeWidth="0.5" opacity="0.3"/>
        </svg>
      </motion.div>

      {/* Center right small leaf */}
      <motion.div
        variants={floatVariants}
        animate="float3"
        className="absolute top-1/3 right-1/4 opacity-8"
      >
        <svg width="150" height="150" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 10C50 10 65 20 70 35C75 50 75 65 70 75C65 85 50 85 50 85C50 85 50 65 50 50C50 35 50 10 50 10Z" fill="#059669" fillOpacity="0.25"/>
          <path d="M50 10C50 10 35 20 30 35C25 50 25 65 30 75C35 85 50 85 50 85C50 85 50 65 50 50C50 35 50 10 50 10Z" fill="#10b981" fillOpacity="0.25"/>
          <path d="M50 10 L50 85 M50 30 L60 45 M50 45 L65 55 M50 30 L40 45 M50 45 L35 55" stroke="#2E7D32" strokeWidth="0.5" opacity="0.3"/>
        </svg>
      </motion.div>

      {/* Additional floating leaves */}
      <motion.div
        variants={floatVariants}
        animate="float2"
        className="absolute bottom-1/3 left-1/3 opacity-8"
      >
        <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="50" rx="30" ry="15" fill="#10b981" fillOpacity="0.2" transform="rotate(-20 50 50)"/>
          <ellipse cx="50" cy="50" rx="30" ry="15" fill="#059669" fillOpacity="0.2" transform="rotate(20 50 50)"/>
          <path d="M50 35 L50 65 M35 45 L65 55 M35 55 L65 45" stroke="#2E7D32" strokeWidth="0.5" opacity="0.25"/>
        </svg>
      </motion.div>
    </div>
  );
}