'use client';

import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { twMerge } from 'tailwind-merge';

interface CartIconProps {
  className?: string; // applies to icon svg
  buttonClassName?: string; // applies to clickable wrapper
  showBadge?: boolean;
}

export default function CartIcon({ className = "h-6 w-6 text-white", buttonClassName = "text-white hover:text-white/80", showBadge = true }: CartIconProps) {
  const { totalItems, openCart } = useCartStore();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={openCart}
      className={twMerge(
        'relative group p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
        buttonClassName
      )}
      aria-label="Open cart"
    >
      <ShoppingCart className={twMerge(className, 'transition-colors')} strokeWidth={2} />
      {showBadge && totalItems > 0 && (
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="absolute -top-1 -right-1 bg-[#2E7D32] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg"
        >
          {totalItems > 99 ? '99+' : totalItems}
        </motion.span>
      )}
    </motion.button>
  );
}
