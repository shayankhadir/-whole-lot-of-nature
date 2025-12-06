'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';
import { Home, ShoppingBag, Leaf, User, Heart, Search } from 'lucide-react';

interface DockItem {
  title: string;
  icon: React.ReactNode;
  href: string;
}

const dockItems: DockItem[] = [
  { title: 'Home', icon: <Home className="w-5 h-5" />, href: '/' },
  { title: 'Shop', icon: <ShoppingBag className="w-5 h-5" />, href: '/shop' },
  { title: 'About', icon: <Leaf className="w-5 h-5" />, href: '/about' },
  { title: 'Wishlist', icon: <Heart className="w-5 h-5" />, href: '/wishlist' },
  { title: 'Account', icon: <User className="w-5 h-5" />, href: '/account' },
];

export default function FloatingDock() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="flex items-end gap-4 px-6 py-4 rounded-2xl backdrop-blur-xl bg-[#0D1B0F]/90 border border-[#2E7D32]/30 shadow-2xl">
        {dockItems.map((item, i) => (
          <DockIcon
            key={item.href}
            mouseX={mouseX}
            item={item}
            isHovered={hoveredIndex === i}
            onHover={() => setHoveredIndex(i)}
            onLeave={() => setHoveredIndex(null)}
          />
        ))}
      </div>
    </motion.div>
  );
}

function DockIcon({
  mouseX,
  item,
  isHovered,
  onHover,
  onLeave,
}: {
  mouseX: MotionValue<number>;
  item: DockItem;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [48, 80, 48]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <Link
      ref={ref}
      href={item.href}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="relative flex items-center justify-center"
    >
      <motion.div
        style={{ width }}
        className="flex aspect-square items-center justify-center rounded-full bg-[#2E7D32] text-white transition-colors hover:bg-[#66BB6A]"
      >
        {item.icon}
      </motion.div>

      {/* Tooltip */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#2E7D32] text-white text-xs font-semibold rounded-lg whitespace-nowrap"
        >
          {item.title}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#2E7D32] rotate-45" />
        </motion.div>
      )}
    </Link>
  );
}

// Floating action button variant
export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-16 h-16 rounded-full bg-[#2E7D32] text-white shadow-2xl flex items-center justify-center hover:bg-[#66BB6A] transition-colors"
      >
        <Search className="w-6 h-6" />
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="absolute bottom-20 right-0 w-64 p-4 rounded-xl backdrop-blur-xl bg-[#0D1B0F]/95 border border-[#2E7D32]/30 shadow-2xl"
        >
          <input
            type="text"
            placeholder="Search plants..."
            className="w-full px-4 py-2 bg-[#0F1E11] text-white rounded-lg border border-[#2E7D32]/30 focus:border-[#2E7D32] focus:outline-none"
          />
        </motion.div>
      )}
    </div>
  );
}
