'use client';

import { motion } from 'framer-motion';

export default function LeafBackground() {
  const leaves = [
    { id: 1, x: '10%', y: '15%', rotate: 15, scale: 1, delay: 0 },
    { id: 2, x: '85%', y: '25%', rotate: -20, scale: 0.8, delay: 0.2 },
    { id: 3, x: '15%', y: '60%', rotate: 45, scale: 1.2, delay: 0.4 },
    { id: 4, x: '90%', y: '70%', rotate: -15, scale: 0.9, delay: 0.6 },
    { id: 5, x: '50%', y: '85%', rotate: 30, scale: 1.1, delay: 0.8 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.08, scale: leaf.scale }}
          transition={{ duration: 1, delay: leaf.delay }}
          style={{
            position: 'absolute',
            left: leaf.x,
            top: leaf.y,
            transform: `rotate(${leaf.rotate}deg)`,
          }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50 10 Q30 30 30 50 Q30 70 50 90 Q70 70 70 50 Q70 30 50 10 Z"
              stroke="#047857"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M50 10 L50 90"
              stroke="#047857"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <path
              d="M50 30 Q60 40 65 45"
              stroke="#047857"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
            <path
              d="M50 50 Q60 58 65 62"
              stroke="#047857"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
            <path
              d="M50 70 Q60 76 65 80"
              stroke="#047857"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
