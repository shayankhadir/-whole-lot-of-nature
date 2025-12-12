'use client';

/**
 * Price calculation utilities for e-commerce operations
 * Handles discounts, coupons, and currency formatting
 */

export interface PriceDetails {
  originalPrice: number;
  salePrice: number;
  discountAmount: number;
  discountPercentage: number;
  isSale: boolean;
}

/**
 * Calculate discount details from original and sale prices
 */
export function calculateDiscount(
  regularPrice: string | number | undefined,
  salePrice: string | number | undefined
): PriceDetails {
  const original = parseFloat(String(regularPrice || 0));
  const sale = parseFloat(String(salePrice || 0));

  if (!original || !sale || sale >= original) {
    return {
      originalPrice: original,
      salePrice: sale,
      discountAmount: 0,
      discountPercentage: 0,
      isSale: false,
    };
  }

  const discountAmount = original - sale;
  const discountPercentage = Math.round((discountAmount / original) * 100);

  return {
    originalPrice: original,
    salePrice: sale,
    discountAmount,
    discountPercentage,
    isSale: true,
  };
}

/**
 * Format price in Indian Rupees
 */
export function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numPrice);
}

/**
 * Calculate shipping threshold remaining amount
 */
export function calculateShippingThreshold(
  cartTotal: number,
  threshold: number = 150
): {
  remaining: number;
  percentage: number;
  isFreeShipping: boolean;
  message: string;
} {
  const remaining = Math.max(0, threshold - cartTotal);
  const percentage = Math.min(100, (cartTotal / threshold) * 100);
  const isFreeShipping = cartTotal >= threshold;

  let message = '';
  if (isFreeShipping) {
    message = 'You qualify for FREE shipping.';
  } else if (remaining === 0) {
    message = 'Free shipping unlocked.';
  } else {
    message = `Add ${formatPrice(remaining)} more for FREE shipping`;
  }

  return {
    remaining,
    percentage,
    isFreeShipping,
    message,
  };
}

/**
 * Apply coupon discount to cart total
 */
export function applyCouponDiscount(
  cartTotal: number,
  couponDetails: {
    discountType: 'percentage' | 'fixed'; // 'percent' or 'fixed_cart'
    discountValue: number;
  }
): {
  discountAmount: number;
  finalTotal: number;
  savingsMessage: string;
} {
  let discountAmount = 0;

  if (couponDetails.discountType === 'percentage') {
    discountAmount = (cartTotal * couponDetails.discountValue) / 100;
  } else if (couponDetails.discountType === 'fixed') {
    discountAmount = couponDetails.discountValue;
  }

  const finalTotal = Math.max(0, cartTotal - discountAmount);

  return {
    discountAmount: Math.round(discountAmount * 100) / 100,
    finalTotal: Math.round(finalTotal * 100) / 100,
    savingsMessage: `You save ${formatPrice(discountAmount)}`,
  };
}

/**
 * Get discount badge text for product cards
 */
export function getDiscountBadgeText(discountPercentage: number): string {
  if (discountPercentage === 0) return '';
  return `-${discountPercentage}%`;
}

/**
 * Calculate total cart value with all discounts
 */
export function calculateCartTotal(items: Array<{ price: number; quantity: number }>, couponDiscount: number = 0, shippingCost: number = 0): {
  subtotal: number;
  totalDiscount: number;
  shippingCost: number;
  finalTotal: number;
} {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const afterCoupon = subtotal - couponDiscount;
  const finalTotal = afterCoupon + shippingCost;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    totalDiscount: couponDiscount,
    shippingCost: shippingCost,
    finalTotal: Math.round(finalTotal * 100) / 100,
  };
}
