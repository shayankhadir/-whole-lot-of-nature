/**
 * Loyalty Points Store
 * Zustand store for managing loyalty state client-side
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LoyaltyPointsRecord, LoyaltyStatus, LoyaltyTier, LoyaltyTransaction } from '@/lib/types/loyalty';
import { LoyaltyService } from '@/lib/services/loyaltyService';

interface LoyaltyStore {
  // State
  user: LoyaltyPointsRecord | null;
  status: LoyaltyStatus | null;
  isLoading: boolean;
  lastUpdated: Date | null;
  error: string | null;

  // User info
  userId: string | number | null;
  userEmail: string | null;

  // Actions
  setUserId: (userId: string | number, email?: string) => void;
  fetchLoyaltyStatus: (userId: string | number) => Promise<void>;
  addPoints: (points: number, reason: string, orderId?: string | number) => Promise<void>;
  redeemPoints: (pointsToRedeem: number, redemptionOptionId: string) => Promise<{
    success: boolean;
    message: string;
  }>;
  clearError: () => void;
  reset: () => void;

  // Computed
  getPointsBalance: () => number;
  getCurrentTier: () => LoyaltyTier;
  getPointsToNextTier: () => number;
  getTierProgress: () => number;
  canRedeem: (pointsCost: number) => boolean;
}

export const useLoyaltyStore = create<LoyaltyStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      status: null,
      isLoading: false,
      lastUpdated: null,
      error: null,
      userId: null,
      userEmail: null,

      // Set user ID and fetch initial data
      setUserId: async (userId: string | number, email?: string) => {
        set({ userId, userEmail: email });

        // Fetch loyalty status
        try {
          set({ isLoading: true });
          const status = await LoyaltyService.getLoyaltyStatus(userId);

          if (status) {
            set({
              user: status.user,
              status,
              lastUpdated: new Date(),
              isLoading: false,
              error: null,
            });
          } else {
            set({
              error: 'Failed to load loyalty status',
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false,
          });
        }
      },

      // Fetch loyalty status
      fetchLoyaltyStatus: async (userId: string | number) => {
        try {
          set({ isLoading: true, error: null });

          const status = await LoyaltyService.getLoyaltyStatus(userId);

          if (status) {
            set({
              user: status.user,
              status,
              lastUpdated: new Date(),
              isLoading: false,
            });
          } else {
            set({
              error: 'Failed to load loyalty status',
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false,
          });
        }
      },

      // Add points
      addPoints: async (points: number, reason: string, orderId?: string | number) => {
        const { userId } = get();
        if (!userId) {
          set({ error: 'User ID not set' });
          return;
        }

        try {
          set({ isLoading: true, error: null });

          const result = await LoyaltyService.addPoints(userId, points, reason, orderId);

          if (result.success) {
            // Update local state
            const state = get();
            if (state.user) {
              state.user.pointsBalance = result.points;
              state.user.currentTier = result.newTier;
              set({
                user: { ...state.user },
                lastUpdated: new Date(),
                isLoading: false,
              });
            }
          } else {
            set({
              error: 'Failed to add points',
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false,
          });
        }
      },

      // Redeem points
      redeemPoints: async (pointsToRedeem: number, redemptionOptionId: string) => {
        const { userId } = get();
        if (!userId) {
          return {
            success: false,
            message: 'User ID not set',
          };
        }

        try {
          set({ isLoading: true, error: null });

          const result = await LoyaltyService.redeemPoints(userId, pointsToRedeem, redemptionOptionId);

          if (result.success) {
            // Update local state
            const state = get();
            if (state.user) {
              state.user.pointsBalance = result.remainingPoints;
              set({
                user: { ...state.user },
                lastUpdated: new Date(),
                isLoading: false,
              });
            }
          }

          return {
            success: result.success,
            message: result.message,
          };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          set({
            error: message,
            isLoading: false,
          });
          return {
            success: false,
            message,
          };
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Reset store
      reset: () => {
        set({
          user: null,
          status: null,
          isLoading: false,
          lastUpdated: null,
          error: null,
          userId: null,
          userEmail: null,
        });
      },

      // Computed values
      getPointsBalance: () => {
        return get().user?.pointsBalance || 0;
      },

      getCurrentTier: () => {
        return get().user?.currentTier || 'bronze';
      },

      getPointsToNextTier: () => {
        return get().status?.pointsToNextTier || 0;
      },

      getTierProgress: () => {
        return get().user?.tierProgressToNext || 0;
      },

      canRedeem: (pointsCost: number) => {
        return get().getPointsBalance() >= pointsCost;
      },
    }),
    {
      name: 'loyalty-store',
      partialize: (state) => ({
        user: state.user,
        userId: state.userId,
        userEmail: state.userEmail,
      }),
    }
  )
);
