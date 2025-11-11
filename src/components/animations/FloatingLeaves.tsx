'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const LeafSVG = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M50.0001 7.96875C31.3001 7.96875 16.1251 23.1437 16.1251 41.8438C16.1251 47.9688 17.8126 53.6563 20.6251 58.5938C20.8126 58.9688 21.0001 59.3438 21.2501 59.7188L48.4376 91.4063C48.8126 91.7813 49.3751 92.0313 50.0001 92.0313C50.6251 92.0313 51.1876 91.7813 51.5626 91.4063L78.7501 59.7188C79.0001 59.3438 79.1876 58.9688 79.3751 58.5938C82.1876 53.6563 83.8751 47.9688 83.8751 41.8438C83.8751 23.1437 68.7001 7.96875 50.0001 7.96875ZM50.0001 54.0938C43.3126 54.0938 37.8751 48.6563 37.8751 41.9688C37.8751 35.2813 43.3126 29.8438 50.0001 29.8438C56.6876 29.8438 62.1251 35.2813 62.1251 41.9688C62.1251 48.6563 56.6876 54.0938 50.0001 54.0938Z" />
  </svg>
);

const generateRandomPosition = () => ({
  x: Math.random() * window.innerWidth,
  y: -100, // Start above the viewport
  rotate: Math.random() * 360,
});

interface LeafProps {
  delay: number;
  size: number;
  color: string;
}

const Leaf = ({ delay, size, color }: LeafProps) => {
  const [position, setPosition] = useState(generateRandomPosition());

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(generateRandomPosition());
    }, 8000); // Reset position every 8 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={position}
      animate={{
        y: window.innerHeight + 100, // Move to below viewport
        x: position.x + (Math.random() - 0.5) * 200, // Add some horizontal movement
        rotate: position.rotate + Math.random() * 720, // 0-2 full rotations
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        position: "absolute",
        width: size,
        height: size,
        color,
      }}
    >
      <LeafSVG />
    </motion.div>
  );
};

export default function FloatingLeaves() {
  const leaves = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    delay: Math.random() * 4,
    size: 20 + Math.random() * 30,
    color: `rgba(${40 + Math.random() * 40}, ${140 + Math.random() * 40}, ${
      40 + Math.random() * 40
    }, ${0.1 + Math.random() * 0.3})`,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {leaves.map((leaf) => (
        <Leaf key={leaf.id} {...leaf} />
      ))}
    </div>
  );
}