/**
 * Loyalty Program Admin API Routes
 * Admin endpoints for managing the loyalty program
 */

import { NextRequest, NextResponse } from 'next/server';
import { loyaltyEngine } from '@/lib/loyalty/loyaltyEngine';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

// Admin key verification
function verifyAdmin(request: NextRequest): boolean {
  const adminKey = request.headers.get('x-admin-key');
  const cronSecret = request.headers.get('x-cron-secret');
  
  return (
    adminKey === process.env.ADMIN_API_KEY ||
    cronSecret === process.env.CRON_SECRET
  );
}

/**
 * GET /api/loyalty/admin - Get admin data: stats, accounts, rewards, tiers
 */
export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'stats';

    switch (type) {
      case 'stats': {
        const stats = await loyaltyEngine.getStats();
        const settings = await loyaltyEngine.getSettings();
        return NextResponse.json({ 
          success: true, 
          data: { ...stats, settings }
        });
      }

      case 'accounts': {
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const search = searchParams.get('search') || '';
        const tierId = searchParams.get('tierId');

        const where: Prisma.LoyaltyAccountWhereInput = {};
        if (search) {
          where.OR = [
            { email: { contains: search } },
            { firstName: { contains: search } },
            { lastName: { contains: search } }
          ];
        }
        if (tierId) {
          where.tierId = tierId;
        }

        const [accounts, total] = await Promise.all([
          prisma.loyaltyAccount.findMany({
            where,
            include: { tier: true },
            orderBy: { lifetimePoints: 'desc' },
            skip: (page - 1) * limit,
            take: limit
          }),
          prisma.loyaltyAccount.count({ where })
        ]);

        return NextResponse.json({ 
          success: true, 
          data: { accounts, total, page, limit, totalPages: Math.ceil(total / limit) }
        });
      }

      case 'rewards': {
        const rewards = await prisma.loyaltyReward.findMany({
          orderBy: { pointsCost: 'asc' }
        });
        return NextResponse.json({ success: true, data: rewards });
      }

      case 'tiers': {
        const tiers = await loyaltyEngine.getTiers();
        return NextResponse.json({ success: true, data: tiers });
      }

      case 'transactions': {
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const accountId = searchParams.get('accountId');
        const type = searchParams.get('transactionType');

        const where: Prisma.LoyaltyTransactionWhereInput = {};
        if (accountId) where.accountId = accountId;
        if (type) where.type = type as Prisma.EnumTransactionTypeFilter['equals'];

        const [transactions, total] = await Promise.all([
          prisma.loyaltyTransaction.findMany({
            where,
            include: { account: { select: { email: true, firstName: true, lastName: true } } },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit
          }),
          prisma.loyaltyTransaction.count({ where })
        ]);

        return NextResponse.json({ 
          success: true, 
          data: { transactions, total, page, limit }
        });
      }

      case 'redemptions': {
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const status = searchParams.get('status');

        const where: Prisma.LoyaltyRedemptionWhereInput = {};
        if (status) where.status = status as Prisma.EnumRedemptionStatusFilter['equals'];

        const [redemptions, total] = await Promise.all([
          prisma.loyaltyRedemption.findMany({
            where,
            include: { 
              account: { select: { email: true, firstName: true } },
              reward: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit
          }),
          prisma.loyaltyRedemption.count({ where })
        ]);

        return NextResponse.json({ 
          success: true, 
          data: { redemptions, total, page, limit }
        });
      }

      case 'settings': {
        const settings = await loyaltyEngine.getSettings();
        return NextResponse.json({ success: true, data: settings });
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid type parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('[Loyalty Admin API] GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/loyalty/admin - Admin actions
 */
export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'initialize': {
        // Initialize default tiers and rewards
        await loyaltyEngine.initializeDefaultTiers();
        await loyaltyEngine.initializeDefaultRewards();
        return NextResponse.json({ 
          success: true, 
          message: 'Loyalty program initialized with default tiers and rewards'
        });
      }

      case 'award-points': {
        const { accountId, email, points, type, description } = body;
        
        let targetAccountId = accountId;
        if (!targetAccountId && email) {
          const account = await loyaltyEngine.getAccountByEmail(email);
          if (!account) {
            return NextResponse.json(
              { success: false, error: 'Account not found' },
              { status: 404 }
            );
          }
          targetAccountId = account.id;
        }

        if (!targetAccountId) {
          return NextResponse.json(
            { success: false, error: 'Account ID or email required' },
            { status: 400 }
          );
        }

        const result = await loyaltyEngine.awardPoints(
          targetAccountId,
          type || 'BONUS',
          points,
          description || 'Admin bonus'
        );

        return NextResponse.json({ success: true, data: result });
      }

      case 'adjust-points': {
        const { accountId, points, reason } = body;
        
        if (!accountId || points === undefined) {
          return NextResponse.json(
            { success: false, error: 'Account ID and points required' },
            { status: 400 }
          );
        }

        const result = await loyaltyEngine.awardPoints(
          accountId,
          'ADJUSTMENT',
          points,
          reason || 'Admin adjustment'
        );

        return NextResponse.json({ success: true, data: result });
      }

      case 'create-reward': {
        const reward = await prisma.loyaltyReward.create({
          data: {
            name: body.name,
            description: body.description,
            pointsCost: body.pointsCost,
            type: body.type,
            value: body.value,
            minOrderValue: body.minOrderValue,
            maxUses: body.maxUses,
            validDays: body.validDays || 30,
            imageUrl: body.imageUrl
          }
        });
        return NextResponse.json({ success: true, data: reward });
      }

      case 'update-reward': {
        const { rewardId, ...updates } = body;
        const reward = await prisma.loyaltyReward.update({
          where: { id: rewardId },
          data: updates
        });
        return NextResponse.json({ success: true, data: reward });
      }

      case 'toggle-reward': {
        const { rewardId } = body;
        const reward = await prisma.loyaltyReward.findUnique({
          where: { id: rewardId }
        });
        if (!reward) {
          return NextResponse.json(
            { success: false, error: 'Reward not found' },
            { status: 404 }
          );
        }
        const updated = await prisma.loyaltyReward.update({
          where: { id: rewardId },
          data: { isActive: !reward.isActive }
        });
        return NextResponse.json({ success: true, data: updated });
      }

      case 'create-tier': {
        const tier = await prisma.loyaltyTier.create({
          data: {
            name: body.name,
            slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
            minPoints: body.minPoints,
            pointsMultiplier: body.pointsMultiplier || 1.0,
            discountPercent: body.discountPercent || 0,
            freeShipping: body.freeShipping || false,
            earlyAccess: body.earlyAccess || false,
            birthdayBonus: body.birthdayBonus || 0,
            color: body.color || '#888888',
            order: body.order || 0
          }
        });
        return NextResponse.json({ success: true, data: tier });
      }

      case 'update-tier': {
        const { tierId, ...updates } = body;
        const tier = await prisma.loyaltyTier.update({
          where: { id: tierId },
          data: updates
        });
        return NextResponse.json({ success: true, data: tier });
      }

      case 'update-settings': {
        const settings = await prisma.loyaltySettings.upsert({
          where: { id: 'default' },
          create: {
            id: 'default',
            pointsPerDollar: body.pointsPerDollar ?? 10,
            signupBonus: body.signupBonus ?? 100,
            referralBonusReferrer: body.referralBonusReferrer ?? 500,
            referralBonusReferred: body.referralBonusReferred ?? 250,
            reviewBonus: body.reviewBonus ?? 50,
            birthdayBonus: body.birthdayBonus ?? 100,
            pointsExpireMonths: body.pointsExpireMonths ?? 12,
            minRedemptionPoints: body.minRedemptionPoints ?? 100,
            isActive: body.isActive ?? true
          },
          update: {
            ...(body.pointsPerDollar !== undefined && { pointsPerDollar: body.pointsPerDollar }),
            ...(body.signupBonus !== undefined && { signupBonus: body.signupBonus }),
            ...(body.referralBonusReferrer !== undefined && { referralBonusReferrer: body.referralBonusReferrer }),
            ...(body.referralBonusReferred !== undefined && { referralBonusReferred: body.referralBonusReferred }),
            ...(body.reviewBonus !== undefined && { reviewBonus: body.reviewBonus }),
            ...(body.birthdayBonus !== undefined && { birthdayBonus: body.birthdayBonus }),
            ...(body.pointsExpireMonths !== undefined && { pointsExpireMonths: body.pointsExpireMonths }),
            ...(body.minRedemptionPoints !== undefined && { minRedemptionPoints: body.minRedemptionPoints }),
            ...(body.isActive !== undefined && { isActive: body.isActive })
          }
        });
        return NextResponse.json({ success: true, data: settings });
      }

      case 'expire-points': {
        const expiredCount = await loyaltyEngine.expirePoints();
        return NextResponse.json({ 
          success: true, 
          data: { expiredPoints: expiredCount }
        });
      }

      case 'sync-tiers': {
        // Re-evaluate all accounts for tier upgrades
        const accounts = await prisma.loyaltyAccount.findMany({
          select: { id: true }
        });

        let upgrades = 0;
        for (const account of accounts) {
          const newTier = await loyaltyEngine.checkTierUpgrade(account.id);
          if (newTier) upgrades++;
        }

        return NextResponse.json({ 
          success: true, 
          data: { accountsChecked: accounts.length, upgrades }
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('[Loyalty Admin API] POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/loyalty/admin - Delete rewards or tiers
 */
export async function DELETE(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json(
        { success: false, error: 'Type and ID required' },
        { status: 400 }
      );
    }

    switch (type) {
      case 'reward':
        await prisma.loyaltyReward.delete({ where: { id } });
        return NextResponse.json({ success: true, message: 'Reward deleted' });

      case 'tier':
        // Check if any accounts are on this tier
        const accountCount = await prisma.loyaltyAccount.count({
          where: { tierId: id }
        });
        if (accountCount > 0) {
          return NextResponse.json(
            { success: false, error: `Cannot delete tier with ${accountCount} active members` },
            { status: 400 }
          );
        }
        await prisma.loyaltyTier.delete({ where: { id } });
        return NextResponse.json({ success: true, message: 'Tier deleted' });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('[Loyalty Admin API] DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
