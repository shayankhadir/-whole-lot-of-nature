/**
 * Loyalty Points Service
 * Handles all loyalty points operations
 */

import {
  LoyaltyPointsRecord,
  LoyaltyStatus,
  LoyaltyTier,
  LoyaltyTransaction,
  TIER_CONFIG,
  EARNING_RULES,
  REDEMPTION_RULES,
  TierBenefits,
  RedemptionOption,
  REDEMPTION_OPTIONS,
} from '@/lib/types/loyalty';

export class LoyaltyService {
  /**
   * Get or create user loyalty record
   */
  static async getUserLoyalty(userId: string | number, email?: string): Promise<LoyaltyPointsRecord | null> {
    try {
      // In production, fetch from database
      // For now, create a mock record
      const record: LoyaltyPointsRecord = {
        id: `loyalty_${userId}`,
        userId,
        email,
        pointsBalance: 0,
        pointsLifetime: 0,
        currentTier: 'bronze',
        tierStartDate: new Date(),
        tierProgressToNext: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return record;
    } catch (error) {
      console.error('Error getting user loyalty:', error);
      return null;
    }
  }

  /**
   * Add points to user account
   * Handles tier upgrades automatically
   */
  static async addPoints(
    userId: string | number,
    pointsToAdd: number,
    reason: string,
    orderId?: string | number
  ): Promise<{ success: boolean; points: number; newTier: LoyaltyTier; transaction: LoyaltyTransaction }> {
    try {
      if (pointsToAdd <= 0) {
        throw new Error('Points to add must be positive');
      }

      const user = await this.getUserLoyalty(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Calculate actual points (apply multiplier based on tier)
      const tierBenefits = TIER_CONFIG[user.currentTier];
      const actualPoints = Math.floor(pointsToAdd * tierBenefits.pointsMultiplier);

      // Update balance
      user.pointsBalance += actualPoints;
      user.pointsLifetime += actualPoints;
      user.updatedAt = new Date();

      // Check for tier upgrade
      const newTier = this.calculateTier(user.pointsLifetime);
      if (newTier !== user.currentTier) {
        user.currentTier = newTier;
        user.tierStartDate = new Date();

        // Record tier upgrade transaction
        await this.createTransaction(
          userId,
          0,
          'tier-upgrade',
          `Upgraded to ${newTier.toUpperCase()} tier`,
          orderId
        );
      }

      // Update tier progress
      user.tierProgressToNext = this.calculateTierProgress(user.pointsLifetime);

      // Create transaction
      const transaction = await this.createTransaction(
        userId,
        actualPoints,
        'earn',
        reason,
        orderId
      );

      return {
        success: true,
        points: user.pointsBalance,
        newTier: user.currentTier,
        transaction,
      };
    } catch (error) {
      console.error('Error adding points:', error);
      return {
        success: false,
        points: 0,
        newTier: 'bronze',
        transaction: {} as LoyaltyTransaction,
      };
    }
  }

  /**
   * Redeem points for rewards
   */
  static async redeemPoints(
    userId: string | number,
    pointsToRedeem: number,
    redemptionOptionId: string
  ): Promise<{ success: boolean; remainingPoints: number; redemptionValue: number; message: string }> {
    try {
      if (pointsToRedeem < REDEMPTION_RULES.MIN_POINTS_TO_REDEEM) {
        return {
          success: false,
          remainingPoints: 0,
          redemptionValue: 0,
          message: `Minimum ${REDEMPTION_RULES.MIN_POINTS_TO_REDEEM} points required to redeem`,
        };
      }

      const user = await this.getUserLoyalty(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (user.pointsBalance < pointsToRedeem) {
        return {
          success: false,
          remainingPoints: user.pointsBalance,
          redemptionValue: 0,
          message: 'Insufficient points',
        };
      }

      // Find redemption option
      const option = REDEMPTION_OPTIONS.find(o => o.id === redemptionOptionId);
      if (!option) {
        return {
          success: false,
          remainingPoints: user.pointsBalance,
          redemptionValue: 0,
          message: 'Invalid redemption option',
        };
      }

      // Verify correct points cost
      if (pointsToRedeem !== option.pointsCost) {
        return {
          success: false,
          remainingPoints: user.pointsBalance,
          redemptionValue: 0,
          message: `This option costs ${option.pointsCost} points`,
        };
      }

      // Deduct points
      user.pointsBalance -= pointsToRedeem;
      user.updatedAt = new Date();

      // Create redemption transaction
      await this.createTransaction(
        userId,
        -pointsToRedeem,
        'redeem',
        `Redeemed: ${option.name}`,
        undefined
      );

      return {
        success: true,
        remainingPoints: user.pointsBalance,
        redemptionValue: option.value,
        message: `Successfully redeemed ${option.name}. Save this coupon code for checkout.`,
      };
    } catch (error) {
      console.error('Error redeeming points:', error);
      return {
        success: false,
        remainingPoints: 0,
        redemptionValue: 0,
        message: 'Failed to redeem points',
      };
    }
  }

  /**
   * Calculate tier based on lifetime points
   */
  static calculateTier(lifetimePoints: number): LoyaltyTier {
    if (lifetimePoints >= 5000) return 'platinum';
    if (lifetimePoints >= 2000) return 'gold';
    if (lifetimePoints >= 500) return 'silver';
    return 'bronze';
  }

  /**
   * Calculate tier progress (0-100)
   */
  static calculateTierProgress(lifetimePoints: number): number {
    const currentTier = this.calculateTier(lifetimePoints);
    const tierConfig = TIER_CONFIG[currentTier];

    if (currentTier === 'platinum') return 100; // Max tier

    const nextTier = currentTier === 'bronze' ? 'silver' : currentTier === 'silver' ? 'gold' : 'platinum';
    const nextTierConfig = TIER_CONFIG[nextTier];

    const pointsInTier = lifetimePoints - tierConfig.minPoints;
    const pointsNeededForTier = nextTierConfig.minPoints - tierConfig.minPoints;

    return Math.min(100, Math.round((pointsInTier / pointsNeededForTier) * 100));
  }

  /**
   * Get complete loyalty status for user
   */
  static async getLoyaltyStatus(userId: string | number): Promise<LoyaltyStatus | null> {
    try {
      const user = await this.getUserLoyalty(userId);
      if (!user) {
        return null;
      }

      const tierBenefits = TIER_CONFIG[user.currentTier];

      // Get next tier benefits if not at max
      let nextTierBenefits: TierBenefits | undefined;
      if (user.currentTier !== 'platinum') {
        const nextTier = user.currentTier === 'bronze' ? 'silver' : user.currentTier === 'silver' ? 'gold' : 'platinum';
        nextTierBenefits = TIER_CONFIG[nextTier];
      }

      // Calculate points to next tier
      const pointsToNextTier =
        user.currentTier === 'platinum' ? 0 : (nextTierBenefits?.minPoints || 0) - user.pointsLifetime;

      // Get available redemptions
      const availableRedemptions = REDEMPTION_OPTIONS.filter(option => option.pointsCost <= user.pointsBalance);

      return {
        user,
        currentTierBenefits: tierBenefits,
        nextTierBenefits,
        pointsToNextTier: Math.max(0, pointsToNextTier),
        recentTransactions: [], // TODO: Fetch from DB
        availableRedemptions,
      };
    } catch (error) {
      console.error('Error getting loyalty status:', error);
      return null;
    }
  }

  /**
   * Create a loyalty transaction record
   */
  static async createTransaction(
    userId: string | number,
    points: number,
    type: 'earn' | 'redeem' | 'adjustment' | 'tier-upgrade' | 'expiry',
    reason: string,
    orderId?: string | number
  ): Promise<LoyaltyTransaction> {
    const transaction: LoyaltyTransaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type,
      points,
      reason,
      orderId,
      createdAt: new Date(),
    };

    // In production, save to database
    console.log('Transaction created:', transaction);

    return transaction;
  }

  /**
   * Calculate points earned from purchase
   */
  static calculatePointsFromPurchase(orderTotal: number, tier: LoyaltyTier = 'bronze'): number {
    const basePoints = Math.floor(orderTotal * EARNING_RULES.PURCHASE_POINTS_PER_RUPEE);
    const multiplier = TIER_CONFIG[tier].pointsMultiplier;
    return Math.floor(basePoints * multiplier);
  }

  /**
   * Get tier benefits
   */
  static getTierBenefits(tier: LoyaltyTier): TierBenefits {
    return TIER_CONFIG[tier];
  }

  /**
   * Get all redemption options
   */
  static getRedemptionOptions(): RedemptionOption[] {
    return REDEMPTION_OPTIONS;
  }

  /**
   * Get redemption option by ID
   */
  static getRedemptionOption(optionId: string): RedemptionOption | undefined {
    return REDEMPTION_OPTIONS.find(o => o.id === optionId);
  }

  /**
   * Calculate discount for tier
   */
  static getTierDiscount(tier: LoyaltyTier): number {
    return TIER_CONFIG[tier].discountPercentage;
  }

  /**
   * Calculate free shipping threshold for tier
   */
  static getFreeShippingThreshold(tier: LoyaltyTier): number {
    return TIER_CONFIG[tier].freeshippingAbove;
  }

  /**
   * Check if customer is eligible for special birthday discount
   */
  static checkBirthdayBonus(tier: LoyaltyTier): { eligible: boolean; bonusPercentage: number } {
    const benefits = TIER_CONFIG[tier];
    return {
      eligible: tier === 'platinum' || tier === 'gold',
      bonusPercentage: benefits.birthday_discount_percentage || 0,
    };
  }
}
