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

export default function CartIcon({ className = "h-6 w-6", buttonClassName, showBadge = true }: CartIconProps) {
  const { totalItems, openCart } = useCartStore();

  return (
    <button
      onClick={openCart}
      className={twMerge(
        'relative group p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-700',
        buttonClassName
      )}
      aria-label="Open cart"
    >
  <ShoppingCart className={twMerge(className, 'transition-colors')} strokeWidth={1.5} />
      {showBadge && totalItems > 0 && (
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="absolute -top-1 -right-1 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold shadow-lg min-w-[20px] h-5 flex items-center justify-center antialiased"
        >
          {totalItems > 99 ? '99+' : totalItems}
        </motion.span>
      )}
    </button>
  );
}
