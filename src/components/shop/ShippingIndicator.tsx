'use client';

import { motion } from 'framer-motion';
import { calculateShippingThreshold, formatPrice } from '@/lib/utils/priceUtils';

interface ShippingIndicatorProps {
  cartTotal: number;
  threshold?: number;
  showText?: boolean;
  compact?: boolean;
}

export default function ShippingIndicator({
  cartTotal,
  threshold = 150,
  showText = true,
  compact = false,
}: ShippingIndicatorProps) {
  const { remaining, percentage, isFreeShipping, message } =
    calculateShippingThreshold(cartTotal, threshold);

  if (compact) {
    return (
      <div className="py-2 px-3 bg-primary-50 border border-primary-200 rounded-lg">
        <p className="text-xs font-medium text-primary-700">{message}</p>
        <div className="mt-2 w-full h-1.5 bg-primary-100 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${
              isFreeShipping ? 'bg-green-500' : 'bg-primary-500'
            }`}
            initial={{ width: '0%' }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-gradient-to-r from-primary-50 to-primary-100 border-2 border-primary-200 rounded-xl p-4 mb-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-primary-900">
            {isFreeShipping ? '🎉 Free Shipping Unlocked!' : '📦 Free Shipping'}
          </p>
          <p className="text-xs text-primary-600 mt-1">
            {isFreeShipping
              ? 'Your order qualifies for FREE delivery'
              : `Spend ${formatPrice(threshold)} for free delivery`}
          </p>
        </div>
        {isFreeShipping && (
          <div className="text-2xl">✅</div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="w-full h-2.5 bg-primary-200 rounded-full overflow-hidden">
          <motion.div
            className={`h-full transition-all duration-500 ${
              isFreeShipping
                ? 'bg-gradient-to-r from-primary-600 to-green-500'
                : 'bg-gradient-to-r from-primary-500 to-primary-600'
            }`}
            initial={{ width: '0%' }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>

        {/* Progress Text */}
        {showText && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-primary-700 font-medium">
              {formatPrice(cartTotal)} of {formatPrice(threshold)}
            </p>
            <p className="text-xs text-primary-600">
              {Math.round(percentage)}%
            </p>
          </div>
        )}
      </div>

      {/* Message */}
      {!isFreeShipping && (
        <p className="mt-3 text-sm font-medium text-primary-700">
          {message}
        </p>
      )}

      {/* Incentive Message */}
      {isFreeShipping && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-3 p-2 bg-white rounded-lg border border-green-200"
        >
          <p className="text-xs text-green-700 font-medium">
            🌿 Enjoy your order with free delivery to your doorstep!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
