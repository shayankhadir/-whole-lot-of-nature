'use client';

import { useMemo } from 'react';

interface FreeShippingProgressProps {
  cartTotal: number;
  freeShippingThreshold?: number;
  className?: string;
}

export default function FreeShippingProgress({
  cartTotal,
  freeShippingThreshold = 150,
  className = '',
}: FreeShippingProgressProps) {
  const progress = useMemo(() => {
    return Math.min((cartTotal / freeShippingThreshold) * 100, 100);
  }, [cartTotal, freeShippingThreshold]);

  const amountRemaining = useMemo(() => {
    return Math.max(freeShippingThreshold - cartTotal, 0);
  }, [cartTotal, freeShippingThreshold]);

  const isEligible = cartTotal >= freeShippingThreshold;

  return (
    <div className={`w-full ${className}`}>
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
        <div
          className="h-full bg-[#2E7D32] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Message */}
      <div className="text-sm text-center">
        {isEligible ? (
          <span className="text-[#2E7D32] font-semibold">
            You&apos;ve qualified for FREE shipping.
          </span>
        ) : (
          <span className="text-gray-600">
            Spend <span className="font-semibold text-[#2E7D32]">₹{amountRemaining.toFixed(2)}</span> more for FREE shipping.
          </span>
        )}
      </div>
    </div>
  );
}
