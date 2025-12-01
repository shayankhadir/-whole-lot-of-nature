'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Truck, CheckCircle } from 'lucide-react';

interface FreeShippingProgressProps {
  /**
   * Current cart total in INR
   */
  cartTotal: number;
  /**
   * Free shipping threshold in INR
   * @default 500
   */
  threshold?: number;
  /**
   * Component variant
   */
  variant?: 'default' | 'minimal' | 'prominent';
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Free Shipping Progress Component
 * 
 * Displays progress toward free shipping threshold to encourage higher order values.
 * Proven to increase AOV by 30-40%.
 * 
 * @example
 * ```tsx
 * <FreeShippingProgress cartTotal={350} threshold={500} />
 * ```
 */
export default function FreeShippingProgress({
  cartTotal,
  threshold = 500,
  variant = 'default',
  className = ''
}: FreeShippingProgressProps) {
  const { remaining, percentage, hasUnlockedFreeShipping } = useMemo(() => {
    const remaining = Math.max(0, threshold - cartTotal);
    const percentage = Math.min((cartTotal / threshold) * 100, 100);
    const hasUnlockedFreeShipping = cartTotal >= threshold;
    
    return { remaining, percentage, hasUnlockedFreeShipping };
  }, [cartTotal, threshold]);

  if (variant === 'minimal') {
    return (
      <div className={`text-xs ${className}`}>
        {hasUnlockedFreeShipping ? (
          <p className="text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Free shipping unlocked!
          </p>
        ) : (
          <p className="text-gray-600">
            Add ₹{remaining.toFixed(0)} more for free shipping
          </p>
        )}
      </div>
    );
  }

  if (variant === 'prominent') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r from-emerald-50 to-teal-50 border-2 ${
          hasUnlockedFreeShipping ? 'border-emerald-500' : 'border-emerald-200'
        } rounded-2xl p-6 ${className}`}
      >
        {hasUnlockedFreeShipping ? (
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center"
            >
              <CheckCircle className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <p className="text-xl font-bold text-emerald-900 mb-1">
                🎉 Free Shipping Unlocked!
              </p>
              <p className="text-sm text-emerald-700">
                Your order qualifies for free delivery across India
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <Truck className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-emerald-900 mb-1">
                  Almost there! Add ₹{remaining.toFixed(0)} more
                </p>
                <p className="text-sm text-emerald-700">
                  Get FREE delivery on orders above ₹{threshold}
                </p>
              </div>
            </div>
            <div className="relative w-full h-3 bg-emerald-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-emerald-700">
              <span>₹{cartTotal.toFixed(0)}</span>
              <span>₹{threshold}</span>
            </div>
          </>
        )}
      </motion.div>
    );
  }

  // Default variant
  return (
    <div className={`bg-emerald-50 rounded-xl p-4 border border-emerald-100 ${className}`}>
      {hasUnlockedFreeShipping ? (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-3"
        >
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-900">
              🎉 You've unlocked FREE shipping!
            </p>
            <p className="text-xs text-emerald-700">
              Your order will be delivered at no extra cost
            </p>
          </div>
        </motion.div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-3">
            <Truck className="w-5 h-5 text-emerald-600" />
            <p className="text-sm font-medium text-emerald-900">
              Spend ₹{remaining.toFixed(0)} more for FREE shipping!
            </p>
          </div>
          <div className="relative w-full h-2 bg-emerald-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute inset-y-0 left-0 bg-emerald-600 rounded-full"
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-emerald-700">
            <span>₹{cartTotal.toFixed(0)}</span>
            <span className="font-medium">₹{threshold}</span>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Compact version for cart icon/header
 */
export function FreeShippingBadge({ 
  cartTotal, 
  threshold = 500,
  className = ''
}: FreeShippingProgressProps) {
  const remaining = Math.max(0, threshold - cartTotal);
  const hasUnlocked = cartTotal >= threshold;

  if (hasUnlocked) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold ${className}`}>
        <CheckCircle className="w-3 h-3" />
        Free Shipping
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium ${className}`}>
      <Truck className="w-3 h-3" />
      +₹{remaining.toFixed(0)} for free shipping
    </span>
  );
}
