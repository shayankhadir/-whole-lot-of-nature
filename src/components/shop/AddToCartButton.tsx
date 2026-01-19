'use client';

import { useState } from 'react';
import { ShoppingCart, Check, Minus, Plus } from 'lucide-react';
import { Product } from '@/types/product';
import { useCartStore } from '@/stores/cartStore';
import { motion, AnimatePresence } from 'framer-motion';

interface AddToCartButtonProps {
  product: Product;
  variant?: 'default' | 'compact' | 'full-width';
}

export default function AddToCartButton({ product, variant = 'default' }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  // Check if product is actually out of stock
  const isOutOfStock = product?.in_stock === false;
  const maxQty = product.stock_quantity || 99;

  const handleAddToCart = async () => {
    if (isOutOfStock || adding) return;

    setAdding(true);
    try {
      await addItem({
        id: product.id.toString(),
        name: product.name,
        price: parseFloat(product.price || product.sale_price || '0'),
        originalPrice: parseFloat(product.regular_price || product.price || '0'),
        image: product.images?.[0]?.src || '',
        quantity: quantity,
        type: 'product',
        inStock: true,
        maxQuantity: maxQty,
        category: product.categories?.[0]?.name,
      });
      
      setAdded(true);
      openCart();
      
      // Reset added state after animation
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAdding(false);
    }
  };

  // Out of stock state
  if (isOutOfStock) {
    return (
      <button
        disabled
        aria-disabled="true"
        className="w-full min-h-[52px] px-6 py-4 bg-gray-700/50 text-gray-400 rounded-xl font-semibold cursor-not-allowed border border-gray-600/30"
      >
        Out of Stock
      </button>
    );
  }

  return (
    <div className={`flex ${variant === 'full-width' ? 'flex-col' : 'flex-row'} gap-3 items-stretch`}>
      {/* Quantity Selector */}
      <div className="flex items-center border border-emerald-500/30 rounded-xl overflow-hidden bg-emerald-900/20 backdrop-blur-sm">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
          aria-label="Decrease quantity"
          className="min-w-[48px] min-h-[48px] p-3 text-white/80 hover:text-white hover:bg-emerald-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-inset"
        >
          <Minus className="w-5 h-5 mx-auto" />
        </button>
        <span 
          className="px-5 py-3 bg-emerald-900/30 text-white font-bold min-w-[56px] text-center text-lg tabular-nums"
          aria-live="polite"
          aria-label={`Quantity: ${quantity}`}
        >
          {quantity}
        </span>
        <button
          onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
          disabled={quantity >= maxQty}
          aria-label="Increase quantity"
          className="min-w-[48px] min-h-[48px] p-3 text-white/80 hover:text-white hover:bg-emerald-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-inset"
        >
          <Plus className="w-5 h-5 mx-auto" />
        </button>
      </div>

      {/* Add to Cart Button */}
      <motion.button
        onClick={handleAddToCart}
        disabled={adding || added}
        whileTap={{ scale: 0.98 }}
        className={`
          flex-1 min-h-[52px] px-8 py-4 rounded-xl font-bold text-base
          flex items-center justify-center gap-3
          transition-all duration-300 ease-out
          focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-900
          ${added 
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40' 
            : 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/50 hover:from-emerald-500 hover:to-emerald-400'
          }
          disabled:cursor-wait
        `}
        aria-label={added ? 'Added to cart' : `Add ${product.name} to cart`}
      >
        <AnimatePresence mode="wait">
          {adding ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Adding...</span>
            </motion.div>
          ) : added ? (
            <motion.div
              key="added"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              <span>Added!</span>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
