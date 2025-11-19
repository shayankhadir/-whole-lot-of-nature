'use client';

import { useState } from 'react';

interface CouponCodeProps {
  onApplyCoupon: (code: string) => Promise<{ success: boolean; message: string; discount?: number }>;
  appliedCoupon?: string;
  discount?: number;
  className?: string;
}

export default function CouponCode({
  onApplyCoupon,
  appliedCoupon,
  discount = 0,
  className = '',
}: CouponCodeProps) {
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setMessage('Please enter a coupon code');
      setMessageType('error');
      return;
    }

    setIsApplying(true);
    setMessage('');

    try {
      const result = await onApplyCoupon(couponCode.toUpperCase());
      setMessage(result.message);
      setMessageType(result.success ? 'success' : 'error');
      
      if (result.success) {
        setCouponCode('');
      }
    } catch (error) {
      setMessage('Failed to apply coupon. Please try again.');
      setMessageType('error');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          disabled={!!appliedCoupon || isApplying}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7D32] disabled:bg-gray-100 disabled:cursor-not-allowed"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !appliedCoupon) {
              handleApplyCoupon();
            }
          }}
        />
        <button
          onClick={handleApplyCoupon}
          disabled={!!appliedCoupon || isApplying}
          className="px-6 py-2 bg-[#2E7D32] text-white rounded-lg font-semibold hover:bg-[#1B5E20] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isApplying ? 'Applying...' : 'Apply'}
        </button>
      </div>

      {/* Applied Coupon Display */}
      {appliedCoupon && (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-green-700 font-semibold">
              {appliedCoupon}
            </span>
            <span className="text-sm text-green-600">
              (-₹{discount.toFixed(2)})
            </span>
          </div>
          <button
            onClick={() => onApplyCoupon('')}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Remove
          </button>
        </div>
      )}

      {/* Message */}
      {message && (
        <p
          className={`text-sm ${
            messageType === 'success' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}

      {/* Popular Coupons Hint */}
      {!appliedCoupon && (
        <p className="text-xs text-gray-500">
          💡 Try: SAVE06 (6% OFF) | WELCOME10 (10% OFF on first order)
        </p>
      )}
    </div>
  );
}
