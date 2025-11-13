'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CouponService, CouponValidationResult } from '@/lib/services/couponService';
import { formatPrice } from '@/lib/utils/priceUtils';

interface CouponInputProps {
  onCouponApplied?: (couponCode: string, discountAmount: number) => void;
  cartTotal: number;
  appliedCoupon?: string;
  onRemoveCoupon?: () => void;
}

export default function CouponInput({
  onCouponApplied,
  cartTotal,
  appliedCoupon,
  onRemoveCoupon,
}: CouponInputProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CouponValidationResult | null>(null);
  const [showInput, setShowInput] = useState(!appliedCoupon);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validation = await CouponService.validateCoupon(code);

      if (!validation.valid || !validation.coupon) {
        setResult(validation);
        return;
      }

      // Apply coupon
      const application = await CouponService.applyCoupon(code, cartTotal);

      if (application.applied) {
        setResult({
          valid: true,
          coupon: application.coupon,
          message: application.message,
        });
        setCode('');
        setShowInput(false);

        // Notify parent
        if (onCouponApplied) {
          onCouponApplied(code, application.discountAmount);
        }
      } else {
        setResult({
          valid: false,
          coupon: null,
          error: application.error,
          message: application.message,
        });
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      setResult({
        valid: false,
        coupon: null,
        error: 'ERROR',
        message: 'An error occurred while applying the coupon',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setResult(null);
    setCode('');
    setShowInput(true);
    if (onRemoveCoupon) {
      onRemoveCoupon();
    }
  };

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {showInput && (
          <motion.form
            key="coupon-form"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            className="space-y-2"
          >
            <label className="block text-sm font-medium text-black">
              Have a coupon code?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                disabled={loading}
                className="flex-1 px-3 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-primary-50 text-black placeholder-primary-400"
              />
              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-primary-300 transition-colors font-medium"
              >
                {loading ? 'Checking...' : 'Apply'}
              </button>
            </div>
          </motion.form>
        )}

        {/* Applied Coupon Success */}
        {result?.valid && result.coupon && (
          <motion.div
            key="coupon-success"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#2E7D32] border-2 border-[#2E7D32] rounded-lg p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#2E7D32]">
                  ✅ {result.message}
                </p>
                <p className="text-xs text-[#2E7D32] mt-1">
                  Code: <span className="font-mono font-bold antialiased">{result.coupon.code}</span>
                </p>
                {result.coupon.description && (
                  <p className="text-xs text-[#2E7D32] mt-1">
                    {result.coupon.description}
                  </p>
                )}
              </div>
              <button
                onClick={handleRemove}
                className="text-[#2E7D32] hover:text-[#2E7D32] text-xl antialiased"
                title="Remove coupon"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {result?.valid === false && (
          <motion.div
            key="coupon-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border-2 border-red-200 rounded-lg p-3"
          >
            <p className="text-sm font-semibold text-red-700">
              ❌ {result.message}
            </p>
            <button
              onClick={() => {
                setResult(null);
                setShowInput(true);
              }}
              className="text-xs text-red-600 hover:text-red-700 mt-2 underline"
            >
              Try another code
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
