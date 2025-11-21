'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { Product } from '@/types/product';
import { getDisplayPrice } from '@/lib/utils/pricing';

interface StickyAddToCartProps {
  isVisible: boolean;
  product: Product;
  onAddToCart: (quantity: number) => void;
}

export function StickyAddToCart({ isVisible, product, onAddToCart }: StickyAddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const displayPrice = getDisplayPrice(product);

  const handleAddToCart = () => {
    onAddToCart(quantity);
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 shadow-2xl"
        >
          <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              {/* Product Info */}
              <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                {product.images && product.images[0] && (
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 border border-neutral-200">
                    <Image
                      src={product.images[0].src}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-sm sm:text-base text-neutral-900 truncate antialiased">{product.name}</p>
                  <p className="text-emerald-700 font-bold text-base sm:text-lg antialiased">{displayPrice}</p>
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                {/* Quantity Selector - Compact on mobile */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    type="button"
                    disabled={quantity <= 1}
                    onClick={decrementQuantity}
                    className="w-11 h-11 sm:w-9 sm:h-9 rounded-full border-2 border-neutral-300 flex items-center justify-center text-neutral-700 hover:border-emerald-600 hover:text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-95 touch-manipulation"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 sm:w-12 text-center font-semibold text-base sm:text-lg antialiased">{quantity}</span>
                  <button
                    type="button"
                    onClick={incrementQuantity}
                    className="w-11 h-11 sm:w-9 sm:h-9 rounded-full border-2 border-neutral-300 flex items-center justify-center text-neutral-700 hover:border-emerald-600 hover:text-emerald-700 transition active:scale-95 touch-manipulation"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart Button - Touch optimized */}
                <button
                  type="button"
                  disabled={!product.in_stock}
                  onClick={handleAddToCart}
                  className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full px-4 sm:px-6 py-3 sm:py-3 text-sm font-semibold text-white shadow-lg transition-all active:scale-95 touch-manipulation min-h-[44px] ${
                    product.in_stock
                      ? 'bg-emerald-700 hover:bg-emerald-800 hover:shadow-emerald-200 hover:scale-105'
                      : 'bg-neutral-300 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="hidden xs:inline sm:inline">Add</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
