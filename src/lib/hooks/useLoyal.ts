'use client';
/**
 * useLoyal Hook
 * Custom hook for accessing loyalty functionality in components
 */

import { useEffect } from 'react';
import { useLoyaltyStore } from '@/stores/loyaltyStore';
import { LoyaltyService } from '@/lib/services/loyaltyService';
import { LoyaltyTier, TierBenefits } from '@/lib/types/loyalty';

interface UseLoyaltyReturn {
  // State
  pointsBalance: number;
  currentTier: LoyaltyTier;
  pointsToNextTier: number;
  tierProgress: number;
  isLoading: boolean;
  error: string | null;

  // Tier info
  tierBenefits: TierBenefits;
  discountPercentage: number;
  freeShippingThreshold: number;

  // Actions
  addPoints: (points: number, reason: string, orderId?: string | number) => Promise<void>;
  redeemPoints: (pointsToRedeem: number, redemptionOptionId: string) => Promise<{ success: boolean; message: string }>;
  refreshStatus: () => Promise<void>;
  clearError: () => void;
}

export const useLoyal = (): UseLoyaltyReturn => {
  const { userId, user, isLoading, error, addPoints, redeemPoints, clearError, fetchLoyaltyStatus, getPointsToNextTier } =
    useLoyaltyStore();

  // Auto-refresh if user ID changes
  useEffect(() => {
    if (userId && !user) {
      fetchLoyaltyStatus(userId);
    }
  }, [userId, user, fetchLoyaltyStatus]);

  const currentTier = (user?.currentTier || 'bronze') as LoyaltyTier;
  const tierBenefits = LoyaltyService.getTierBenefits(currentTier);

  return {
    // State
    pointsBalance: user?.pointsBalance || 0,
    currentTier,
    pointsToNextTier: user?.currentTier === 'platinum' ? 0 : getPointsToNextTier(),
    tierProgress: user?.tierProgressToNext || 0,
    isLoading,
    error,

    // Tier info
    tierBenefits,
    discountPercentage: LoyaltyService.getTierDiscount(currentTier),
    freeShippingThreshold: LoyaltyService.getFreeShippingThreshold(currentTier),

    // Actions
    addPoints,
    redeemPoints,
    refreshStatus: () => (userId ? fetchLoyaltyStatus(userId) : Promise.resolve()),
    clearError,
  };
};

/**
 * useLoyaltyDiscount Hook
 * Calculate discount amount based on loyalty tier
 */
export const useLoyaltyDiscount = (orderTotal: number): number => {
  const { discountPercentage } = useLoyal();
  return Math.round(orderTotal * (discountPercentage / 100));
};

/**
 * useLoyaltyShipping Hook
 * Determine free shipping status based on tier and amount
 */
export const useLoyaltyShipping = (orderTotal: number): { hasFreeShipping: boolean; threshold: number } => {
  const { freeShippingThreshold } = useLoyal();
  return {
    hasFreeShipping: orderTotal >= freeShippingThreshold,
    threshold: freeShippingThreshold,
  };
};

/**
 * useLoyaltyPoints Hook
 * Calculate points earned from purchase
 */
export const useLoyaltyPoints = (orderTotal: number): number => {
  const { currentTier } = useLoyal();
  return LoyaltyService.calculatePointsFromPurchase(orderTotal, currentTier);
};

