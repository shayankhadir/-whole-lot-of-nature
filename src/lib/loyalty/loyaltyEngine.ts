/**
 * Loyalty Engine
 * Core service for managing customer loyalty points, tiers, and rewards
 */

import { prisma } from '@/lib/prisma';
import type { 
  LoyaltyAccount, 
  LoyaltyTransaction, 
  LoyaltyTier,
  LoyaltyReward,
  LoyaltyRedemption,
  TransactionType,
  Prisma
} from '@prisma/client';
import { logAgentAction } from '@/lib/services/agentLogger';
import { nanoid } from 'nanoid';

// Types
export interface EarnPointsInput {
  customerId?: string;
  email: string;
  type: TransactionType;
  orderId?: string;
  orderTotal?: number;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface RedeemRewardInput {
  accountId: string;
  rewardId: string;
}

export interface LoyaltyAccountWithTier extends LoyaltyAccount {
  tier: LoyaltyTier | null;
}

export interface PointsResult {
  success: boolean;
  points?: number;
  transactionId?: string;
  error?: string;
}

export interface RedemptionResult {
  success: boolean;
  redemptionId?: string;
  couponCode?: string;
  expiresAt?: Date;
  error?: string;
}

// Generate unique referral code
function generateReferralCode(): string {
  return nanoid(8).toUpperCase();
}

class LoyaltyEngine {
  /**
   * Get or create loyalty account for a customer
   */
  async getOrCreateAccount(
    email: string, 
    customerId?: string,
    firstName?: string,
    lastName?: string
  ): Promise<LoyaltyAccountWithTier> {
    // Try to find existing account
    let account = await prisma.loyaltyAccount.findFirst({
      where: {
        OR: [
          { email },
          ...(customerId ? [{ customerId }] : [])
        ]
      },
      include: { tier: true }
    });

    if (account) {
      // Update customerId if provided and not set
      if (customerId && account.customerId !== customerId) {
        account = await prisma.loyaltyAccount.update({
          where: { id: account.id },
          data: { customerId },
          include: { tier: true }
        });
      }
      return account;
    }

    // Get default tier (lowest)
    const defaultTier = await prisma.loyaltyTier.findFirst({
      orderBy: { minPoints: 'asc' }
    });

    // Create new account
    account = await prisma.loyaltyAccount.create({
      data: {
        email,
        customerId: customerId || email,
        firstName,
        lastName,
        referralCode: generateReferralCode(),
        tierId: defaultTier?.id
      },
      include: { tier: true }
    });

    // Award signup bonus
    await this.awardSignupBonus(account.id);

    await logAgentAction({
      agent: 'loyalty',
      action: 'item_created',
      status: 'SUCCESS',
      message: `Loyalty account created for ${email}`,
      metadata: { accountId: account.id }
    });

    return account;
  }

  /**
   * Get account by ID
   */
  async getAccount(accountId: string): Promise<LoyaltyAccountWithTier | null> {
    return prisma.loyaltyAccount.findUnique({
      where: { id: accountId },
      include: { tier: true }
    });
  }

  /**
   * Get account by email
   */
  async getAccountByEmail(email: string): Promise<LoyaltyAccountWithTier | null> {
    return prisma.loyaltyAccount.findUnique({
      where: { email },
      include: { tier: true }
    });
  }

  /**
   * Get loyalty settings
   */
  async getSettings() {
    let settings = await prisma.loyaltySettings.findUnique({
      where: { id: 'default' }
    });

    if (!settings) {
      // Create default settings
      settings = await prisma.loyaltySettings.create({
        data: { id: 'default' }
      });
    }

    return settings;
  }

  /**
   * Award signup bonus
   */
  private async awardSignupBonus(accountId: string): Promise<void> {
    const settings = await this.getSettings();
    
    if (settings.signupBonus <= 0) return;

    await this.addTransaction({
      accountId,
      type: 'SIGNUP',
      points: settings.signupBonus,
      description: 'Welcome bonus for joining our loyalty program!'
    });
  }

  /**
   * Earn points from a purchase
   */
  async earnPointsFromPurchase(input: EarnPointsInput): Promise<PointsResult> {
    try {
      if (!input.orderTotal || input.orderTotal <= 0) {
        return { success: false, error: 'Invalid order total' };
      }

      // Get or create account
      const account = await this.getOrCreateAccount(input.email, input.customerId);
      const settings = await this.getSettings();

      // Calculate base points
      let points = Math.floor(input.orderTotal * settings.pointsPerDollar);

      // Apply tier multiplier
      if (account.tier && account.tier.pointsMultiplier > 1) {
        points = Math.floor(points * account.tier.pointsMultiplier);
      }

      // Add transaction
      const transaction = await this.addTransaction({
        accountId: account.id,
        type: 'PURCHASE',
        points,
        orderId: input.orderId,
        description: input.description || `Points earned from order ${input.orderId || ''}`.trim(),
        metadata: input.metadata
      });

      // Update lifetime spent
      await prisma.loyaltyAccount.update({
        where: { id: account.id },
        data: {
          lifetimeSpent: { increment: input.orderTotal }
        }
      });

      // Check for tier upgrade
      await this.checkTierUpgrade(account.id);

      return { 
        success: true, 
        points, 
        transactionId: transaction.id 
      };
    } catch (error) {
      console.error('[Loyalty] Error earning points:', error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * Award points for various actions
   */
  async awardPoints(
    accountId: string, 
    type: TransactionType, 
    customPoints?: number,
    description?: string,
    metadata?: Record<string, unknown>
  ): Promise<PointsResult> {
    try {
      const settings = await this.getSettings();
      let points = customPoints || 0;

      // Determine points based on type
      switch (type) {
        case 'REVIEW':
          points = customPoints || settings.reviewBonus;
          break;
        case 'BIRTHDAY':
          const account = await this.getAccount(accountId);
          const tierBonus = account?.tier?.birthdayBonus || 0;
          points = customPoints || (settings.birthdayBonus + tierBonus);
          break;
        case 'REFERRAL_MADE':
          points = customPoints || settings.referralBonusReferrer;
          break;
        case 'REFERRAL_BONUS':
          points = customPoints || settings.referralBonusReferred;
          break;
        case 'BONUS':
        case 'ADJUSTMENT':
        case 'TIER_BONUS':
          points = customPoints || 0;
          break;
        default:
          points = customPoints || 0;
      }

      if (points === 0) {
        return { success: false, error: 'No points to award' };
      }

      const transaction = await this.addTransaction({
        accountId,
        type,
        points,
        description: description || this.getDefaultDescription(type),
        metadata
      });

      // Check for tier upgrade if positive points
      if (points > 0) {
        await this.checkTierUpgrade(accountId);
      }

      return { 
        success: true, 
        points, 
        transactionId: transaction.id 
      };
    } catch (error) {
      console.error('[Loyalty] Error awarding points:', error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * Process referral signup
   */
  async processReferral(
    newAccountId: string, 
    referralCode: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Find referrer account
      const referrer = await prisma.loyaltyAccount.findUnique({
        where: { referralCode }
      });

      if (!referrer) {
        return { success: false, error: 'Invalid referral code' };
      }

      // Update new account with referrer info
      await prisma.loyaltyAccount.update({
        where: { id: newAccountId },
        data: { referredBy: referralCode }
      });

      // Award points to referrer
      await this.awardPoints(
        referrer.id, 
        'REFERRAL_MADE',
        undefined,
        `Referral bonus for inviting a friend`
      );

      // Award points to new member
      await this.awardPoints(
        newAccountId, 
        'REFERRAL_BONUS',
        undefined,
        `Welcome bonus from referral`
      );

      // Update referrer's referral count
      await prisma.loyaltyAccount.update({
        where: { id: referrer.id },
        data: { referralCount: { increment: 1 } }
      });

      await logAgentAction({
        agent: 'loyalty',
        action: 'run_completed',
        status: 'SUCCESS',
        message: `Referral processed: ${referrer.email} referred new member`,
        metadata: { referrerId: referrer.id, newAccountId }
      });

      return { success: true };
    } catch (error) {
      console.error('[Loyalty] Error processing referral:', error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * Redeem a reward
   */
  async redeemReward(input: RedeemRewardInput): Promise<RedemptionResult> {
    try {
      const account = await this.getAccount(input.accountId);
      if (!account) {
        return { success: false, error: 'Account not found' };
      }

      const reward = await prisma.loyaltyReward.findUnique({
        where: { id: input.rewardId }
      });

      if (!reward) {
        return { success: false, error: 'Reward not found' };
      }

      if (!reward.isActive) {
        return { success: false, error: 'Reward is no longer available' };
      }

      if (reward.maxUses && reward.usedCount >= reward.maxUses) {
        return { success: false, error: 'Reward is sold out' };
      }

      if (account.pointsBalance < reward.pointsCost) {
        return { success: false, error: `Insufficient points. You have ${account.pointsBalance}, need ${reward.pointsCost}` };
      }

      // Generate unique coupon code
      const couponCode = `LOYALTY-${nanoid(8).toUpperCase()}`;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + reward.validDays);

      // Create redemption record
      const redemption = await prisma.loyaltyRedemption.create({
        data: {
          accountId: input.accountId,
          rewardId: input.rewardId,
          pointsSpent: reward.pointsCost,
          couponCode,
          expiresAt,
          status: 'PENDING'
        }
      });

      // Deduct points
      await this.addTransaction({
        accountId: input.accountId,
        type: 'REDEMPTION',
        points: -reward.pointsCost,
        description: `Redeemed: ${reward.name}`
      });

      // Update reward usage count
      await prisma.loyaltyReward.update({
        where: { id: input.rewardId },
        data: { usedCount: { increment: 1 } }
      });

      await logAgentAction({
        agent: 'loyalty',
        action: 'run_completed',
        status: 'SUCCESS',
        message: `Reward redeemed: ${reward.name} for ${reward.pointsCost} points`,
        metadata: { redemptionId: redemption.id, couponCode }
      });

      return {
        success: true,
        redemptionId: redemption.id,
        couponCode,
        expiresAt
      };
    } catch (error) {
      console.error('[Loyalty] Error redeeming reward:', error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * Get available rewards for an account
   */
  async getAvailableRewards(accountId?: string): Promise<LoyaltyReward[]> {
    const rewards = await prisma.loyaltyReward.findMany({
      where: {
        isActive: true,
        OR: [
          { maxUses: null },
          { usedCount: { lt: prisma.loyaltyReward.fields.maxUses } }
        ]
      },
      orderBy: { pointsCost: 'asc' }
    });

    return rewards;
  }

  /**
   * Get transaction history for an account
   */
  async getTransactionHistory(
    accountId: string,
    limit = 20,
    offset = 0
  ): Promise<LoyaltyTransaction[]> {
    return prisma.loyaltyTransaction.findMany({
      where: { accountId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });
  }

  /**
   * Get redemption history for an account
   */
  async getRedemptionHistory(
    accountId: string,
    limit = 20
  ): Promise<(LoyaltyRedemption & { reward: LoyaltyReward })[]> {
    return prisma.loyaltyRedemption.findMany({
      where: { accountId },
      include: { reward: true },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  /**
   * Get all tiers
   */
  async getTiers(): Promise<LoyaltyTier[]> {
    return prisma.loyaltyTier.findMany({
      orderBy: { minPoints: 'asc' }
    });
  }

  /**
   * Check and upgrade tier if eligible
   */
  async checkTierUpgrade(accountId: string): Promise<LoyaltyTier | null> {
    const account = await prisma.loyaltyAccount.findUnique({
      where: { id: accountId },
      include: { tier: true }
    });

    if (!account) return null;

    // Find the highest tier the customer qualifies for
    const eligibleTier = await prisma.loyaltyTier.findFirst({
      where: { minPoints: { lte: account.lifetimePoints } },
      orderBy: { minPoints: 'desc' }
    });

    if (!eligibleTier) return account.tier;

    // Check if this is an upgrade
    if (!account.tier || eligibleTier.minPoints > account.tier.minPoints) {
      await prisma.loyaltyAccount.update({
        where: { id: accountId },
        data: { tierId: eligibleTier.id }
      });

      // Award tier bonus if upgrading
      if (account.tier) {
        await this.addTransaction({
          accountId,
          type: 'TIER_BONUS',
          points: 50, // Fixed tier upgrade bonus
          description: `Congratulations! You've reached ${eligibleTier.name} status!`
        });

        await logAgentAction({
          agent: 'loyalty',
          action: 'run_completed',
          status: 'SUCCESS',
          message: `Customer upgraded to ${eligibleTier.name} tier`,
          metadata: { accountId, newTier: eligibleTier.name }
        });
      }

      return eligibleTier;
    }

    return account.tier;
  }

  /**
   * Expire old points
   */
  async expirePoints(): Promise<number> {
    const settings = await this.getSettings();
    
    if (settings.pointsExpireMonths <= 0) return 0;

    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() - settings.pointsExpireMonths);

    // Find transactions to expire
    const expiredTransactions = await prisma.loyaltyTransaction.findMany({
      where: {
        expiresAt: { lte: new Date() },
        type: { notIn: ['EXPIRED', 'REDEMPTION'] },
        points: { gt: 0 }
      }
    });

    let totalExpired = 0;

    for (const tx of expiredTransactions) {
      // Create expiration transaction
      await this.addTransaction({
        accountId: tx.accountId,
        type: 'EXPIRED',
        points: -tx.points,
        description: `Points expired from ${tx.description}`
      });

      totalExpired += tx.points;
    }

    if (totalExpired > 0) {
      await logAgentAction({
        agent: 'loyalty',
        action: 'run_completed',
        status: 'SUCCESS',
        message: `Expired ${totalExpired} points from ${expiredTransactions.length} transactions`,
        metadata: { totalExpired, transactionCount: expiredTransactions.length }
      });
    }

    return totalExpired;
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(limit = 10): Promise<LoyaltyAccountWithTier[]> {
    return prisma.loyaltyAccount.findMany({
      include: { tier: true },
      orderBy: { lifetimePoints: 'desc' },
      take: limit
    });
  }

  /**
   * Get program statistics
   */
  async getStats() {
    const [
      totalAccounts,
      totalPointsIssued,
      totalPointsRedeemed,
      totalRedemptions,
      accountsByTier
    ] = await Promise.all([
      prisma.loyaltyAccount.count(),
      prisma.loyaltyTransaction.aggregate({
        where: { points: { gt: 0 } },
        _sum: { points: true }
      }),
      prisma.loyaltyTransaction.aggregate({
        where: { type: 'REDEMPTION' },
        _sum: { points: true }
      }),
      prisma.loyaltyRedemption.count(),
      prisma.loyaltyAccount.groupBy({
        by: ['tierId'],
        _count: true
      })
    ]);

    return {
      totalAccounts,
      totalPointsIssued: totalPointsIssued._sum.points || 0,
      totalPointsRedeemed: Math.abs(totalPointsRedeemed._sum.points || 0),
      totalRedemptions,
      accountsByTier
    };
  }

  /**
   * Add a transaction and update balance
   */
  private async addTransaction(input: {
    accountId: string;
    type: TransactionType;
    points: number;
    orderId?: string;
    description: string;
    metadata?: Record<string, unknown>;
  }): Promise<LoyaltyTransaction> {
    const settings = await this.getSettings();
    
    // Calculate expiration date for positive points
    let expiresAt: Date | null = null;
    if (input.points > 0 && settings.pointsExpireMonths > 0) {
      expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + settings.pointsExpireMonths);
    }

    // Create transaction
    const transaction = await prisma.loyaltyTransaction.create({
      data: {
        accountId: input.accountId,
        type: input.type,
        points: input.points,
        orderId: input.orderId,
        description: input.description,
        metadata: input.metadata as Prisma.InputJsonValue | undefined,
        expiresAt
      }
    });

    // Update account balance
    const updateData: Prisma.LoyaltyAccountUpdateInput = {
      pointsBalance: { increment: input.points },
      lastActivityAt: new Date()
    };

    // Update lifetime points for positive transactions
    if (input.points > 0) {
      updateData.lifetimePoints = { increment: input.points };
    }

    await prisma.loyaltyAccount.update({
      where: { id: input.accountId },
      data: updateData
    });

    return transaction;
  }

  /**
   * Get default description for transaction type
   */
  private getDefaultDescription(type: TransactionType): string {
    const descriptions: Record<TransactionType, string> = {
      PURCHASE: 'Points earned from purchase',
      SIGNUP: 'Welcome bonus',
      REFERRAL_MADE: 'Referral bonus',
      REFERRAL_BONUS: 'Welcome referral bonus',
      REVIEW: 'Product review bonus',
      BIRTHDAY: 'Birthday bonus',
      BONUS: 'Bonus points',
      REDEMPTION: 'Points redeemed',
      EXPIRED: 'Points expired',
      ADJUSTMENT: 'Points adjustment',
      TIER_BONUS: 'Tier upgrade bonus'
    };
    return descriptions[type] || 'Points transaction';
  }

  /**
   * Initialize default tiers
   */
  async initializeDefaultTiers(): Promise<void> {
    const existingTiers = await prisma.loyaltyTier.count();
    if (existingTiers > 0) return;

    const defaultTiers = [
      {
        name: 'Seedling',
        slug: 'seedling',
        minPoints: 0,
        pointsMultiplier: 1.0,
        discountPercent: 0,
        freeShipping: false,
        earlyAccess: false,
        birthdayBonus: 0,
        color: '#8B7355',
        order: 1
      },
      {
        name: 'Sprout',
        slug: 'sprout',
        minPoints: 500,
        pointsMultiplier: 1.1,
        discountPercent: 5,
        freeShipping: false,
        earlyAccess: false,
        birthdayBonus: 25,
        color: '#90EE90',
        order: 2
      },
      {
        name: 'Bloomer',
        slug: 'bloomer',
        minPoints: 2000,
        pointsMultiplier: 1.25,
        discountPercent: 10,
        freeShipping: true,
        earlyAccess: true,
        birthdayBonus: 50,
        color: '#66BB6A',
        order: 3
      },
      {
        name: 'Garden Master',
        slug: 'garden-master',
        minPoints: 5000,
        pointsMultiplier: 1.5,
        discountPercent: 15,
        freeShipping: true,
        earlyAccess: true,
        birthdayBonus: 100,
        color: '#2E7D32',
        order: 4
      }
    ];

    await prisma.loyaltyTier.createMany({ data: defaultTiers });

    await logAgentAction({
      agent: 'loyalty',
      action: 'item_created',
      status: 'SUCCESS',
      message: 'Default loyalty tiers initialized',
      metadata: { tierCount: defaultTiers.length }
    });
  }

  /**
   * Initialize default rewards
   */
  async initializeDefaultRewards(): Promise<void> {
    const existingRewards = await prisma.loyaltyReward.count();
    if (existingRewards > 0) return;

    const defaultRewards = [
      {
        name: '₹100 Off Your Order',
        description: 'Get ₹100 off your next order of ₹500 or more',
        pointsCost: 500,
        type: 'FIXED_DISCOUNT' as const,
        value: 100,
        minOrderValue: 500,
        validDays: 30
      },
      {
        name: '₹250 Off Your Order',
        description: 'Get ₹250 off your next order of ₹1000 or more',
        pointsCost: 1000,
        type: 'FIXED_DISCOUNT' as const,
        value: 250,
        minOrderValue: 1000,
        validDays: 30
      },
      {
        name: '10% Off Everything',
        description: 'Get 10% off your entire order',
        pointsCost: 750,
        type: 'PERCENT_DISCOUNT' as const,
        value: 10,
        validDays: 30
      },
      {
        name: 'Free Shipping',
        description: 'Get free shipping on your next order',
        pointsCost: 300,
        type: 'FREE_SHIPPING' as const,
        validDays: 30
      },
      {
        name: '15% Off Your Order',
        description: 'Get 15% off your entire order (max ₹500 discount)',
        pointsCost: 1200,
        type: 'PERCENT_DISCOUNT' as const,
        value: 15,
        validDays: 30
      }
    ];

    await prisma.loyaltyReward.createMany({ data: defaultRewards });

    await logAgentAction({
      agent: 'loyalty',
      action: 'item_created',
      status: 'SUCCESS',
      message: 'Default loyalty rewards initialized',
      metadata: { rewardCount: defaultRewards.length }
    });
  }
}

// Export singleton instance
export const loyaltyEngine = new LoyaltyEngine();
