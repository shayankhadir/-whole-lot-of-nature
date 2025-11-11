'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppliedCoupon {
  code: string;
  discountAmount: number;
  discountPercentage?: number;
}

interface CouponStore {
  appliedCoupon: AppliedCoupon | null;
  setCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  clear: () => void;
}

export const useCouponStore = create<CouponStore>()(
  persist(
    (set) => ({
      appliedCoupon: null,
      setCoupon: (coupon: AppliedCoupon) => set({ appliedCoupon: coupon }),
      removeCoupon: () => set({ appliedCoupon: null }),
      clear: () => set({ appliedCoupon: null }),
    }),
    {
      name: 'coupon-store',
    }
  )
);
