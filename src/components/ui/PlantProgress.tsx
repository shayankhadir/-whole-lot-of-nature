'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface PlantProgressProps {
  progress: number; // 0-100
  isLoading: boolean;
}

export default function PlantProgress({ progress, isLoading }: PlantProgressProps) {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    // Smooth progress animation
    const timer = setTimeout(() => {
      setDisplayProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  // Plant grows taller as progress increases
  const plantHeight = Math.max(20, (displayProgress / 100) * 200);
  const leafOpacity = Math.min(1, displayProgress / 50);
  const rootOpacity = Math.min(1, displayProgress / 30);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Plant SVG Container */}
      <div className="relative w-32 h-64 flex items-end justify-center">
        <svg
          viewBox="0 0 100 300"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Soil */}
          <rect x="30" y="240" width="40" height="20" fill="#8B7355" rx="2" />

          {/* Roots - appear early */}
          <g opacity={rootOpacity} strokeLinecap="round" strokeWidth="1.5">
            <path
              d="M 50 240 Q 40 260 35 280"
              stroke="#A0826D"
              fill="none"
            />
            <path
              d="M 50 240 Q 60 260 65 280"
              stroke="#A0826D"
              fill="none"
            />
            <path
              d="M 50 240 Q 45 265 42 290"
              stroke="#A0826D"
              fill="none"
            />
          </g>

          {/* Main Stem */}
          <motion.line
            x1="50"
            y1="240"
            x2="50"
            y2={240 - plantHeight}
            stroke="#2d5016"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ y2: 240 }}
            animate={{ y2: 240 - plantHeight }}
            transition={{ type: 'spring', stiffness: 50, damping: 15 }}
          />

          {/* Left Leaves */}
          <g opacity={leafOpacity}>
            <motion.path
              d={`M 50 ${240 - plantHeight * 0.3} Q 35 ${240 - plantHeight * 0.35} 30 ${240 - plantHeight * 0.25}`}
              stroke="#22c55e"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: displayProgress / 100 }}
              transition={{ duration: 0.5 }}
            />
            <motion.ellipse
              cx={Math.max(25, 30 - (displayProgress / 100) * 8)}
              cy={240 - plantHeight * 0.25}
              rx="5"
              ry="8"
              fill="#22c55e"
              initial={{ opacity: 0 }}
              animate={{ opacity: displayProgress > 25 ? leafOpacity : 0 }}
              transition={{ duration: 0.3 }}
            />
          </g>

          {/* Right Leaves */}
          <g opacity={leafOpacity}>
            <motion.path
              d={`M 50 ${240 - plantHeight * 0.5} Q 65 ${240 - plantHeight * 0.55} 70 ${240 - plantHeight * 0.45}`}
              stroke="#22c55e"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: displayProgress / 100 }}
              transition={{ duration: 0.5 }}
            />
            <motion.ellipse
              cx={Math.min(75, 70 + (displayProgress / 100) * 8)}
              cy={240 - plantHeight * 0.45}
              rx="5"
              ry="8"
              fill="#22c55e"
              initial={{ opacity: 0 }}
              animate={{ opacity: displayProgress > 45 ? leafOpacity : 0 }}
              transition={{ duration: 0.3 }}
            />
          </g>

          {/* Top Leaves */}
          <g opacity={Math.max(0, leafOpacity - 0.3)}>
            <motion.path
              d={`M 50 ${240 - plantHeight * 0.7} Q 40 ${240 - plantHeight * 0.75} 38 ${240 - plantHeight * 0.65}`}
              stroke="#16a34a"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: displayProgress / 100 }}
              transition={{ duration: 0.5 }}
            />
            <motion.path
              d={`M 50 ${240 - plantHeight * 0.75} Q 60 ${240 - plantHeight * 0.8} 62 ${240 - plantHeight * 0.7}`}
              stroke="#16a34a"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: displayProgress / 100 }}
              transition={{ duration: 0.5 }}
            />
          </g>

          {/* Flower bud - appears at high progress */}
          <motion.circle
            cx="50"
            cy={240 - plantHeight - 10}
            r="4"
            fill="#fbbf24"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: displayProgress > 80 ? 1 : 0,
              scale: displayProgress > 80 ? 1 : 0,
            }}
            transition={{ duration: 0.4 }}
          />

          {/* Progress text */}
          <text
            x="50"
            y="280"
            textAnchor="middle"
            className="text-xs font-semibold"
            fill="#022c22"
            fontSize="14"
          >
            {Math.round(displayProgress)}%
          </text>
        </svg>
      </div>

      {/* Loading text */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-sm font-medium text-primary-700">Growing your garden...</p>
          <p className="text-xs text-primary-600 mt-1">Loading content</p>
        </motion.div>
      )}

      {/* Progress bar */}
      <div className="w-48 h-1 bg-primary-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-700"
          initial={{ width: '0%' }}
          animate={{ width: `${displayProgress}%` }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        />
      </div>
    </div>
  );
}
