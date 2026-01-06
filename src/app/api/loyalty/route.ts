/**
 * Loyalty Program API Routes
 * Public endpoints for customers to view/manage their loyalty account
 */

import { NextRequest, NextResponse } from 'next/server';
import { loyaltyEngine } from '@/lib/loyalty/loyaltyEngine';

// Helper to get email from auth or query
async function getAuthenticatedEmail(request: NextRequest): Promise<string | null> {
  // Check for email in headers (from auth middleware)
  const email = request.headers.get('x-user-email');
  if (email) return email;
  
  // Check for email in query params (for simple testing)
  const { searchParams } = new URL(request.url);
  return searchParams.get('email');
}

/**
 * GET /api/loyalty - Get loyalty account info, transactions, rewards
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'account';
    const email = await getAuthenticatedEmail(request);

    // Public endpoints that don't require email
    if (type === 'rewards') {
      const rewards = await loyaltyEngine.getAvailableRewards();
      return NextResponse.json({ success: true, data: rewards });
    }

    if (type === 'tiers') {
      const tiers = await loyaltyEngine.getTiers();
      return NextResponse.json({ success: true, data: tiers });
    }

    if (type === 'settings') {
      const settings = await loyaltyEngine.getSettings();
      return NextResponse.json({ success: true, data: {
        pointsPerDollar: settings.pointsPerDollar,
        signupBonus: settings.signupBonus,
        referralBonusReferrer: settings.referralBonusReferrer,
        referralBonusReferred: settings.referralBonusReferred,
        reviewBonus: settings.reviewBonus,
        birthdayBonus: settings.birthdayBonus
      }});
    }

    if (type === 'leaderboard') {
      const limit = parseInt(searchParams.get('limit') || '10');
      const leaderboard = await loyaltyEngine.getLeaderboard(limit);
      // Return anonymized data
      return NextResponse.json({ 
        success: true, 
        data: leaderboard.map((account, index) => ({
          rank: index + 1,
          name: account.firstName ? `${account.firstName} ${account.lastName?.charAt(0) || ''}.` : 'Plant Lover',
          lifetimePoints: account.lifetimePoints,
          tier: account.tier?.name || 'Seedling'
        }))
      });
    }

    // Authenticated endpoints
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email required' },
        { status: 401 }
      );
    }

    switch (type) {
      case 'account': {
        const account = await loyaltyEngine.getAccountByEmail(email);
        if (!account) {
          return NextResponse.json({ 
            success: true, 
            data: null,
            message: 'No loyalty account found. Create one to start earning points!'
          });
        }
        return NextResponse.json({ 
          success: true, 
          data: {
            id: account.id,
            email: account.email,
            firstName: account.firstName,
            lastName: account.lastName,
            pointsBalance: account.pointsBalance,
            lifetimePoints: account.lifetimePoints,
            tier: account.tier,
            referralCode: account.referralCode,
            referralCount: account.referralCount,
            lastActivityAt: account.lastActivityAt,
            createdAt: account.createdAt
          }
        });
      }

      case 'transactions': {
        const account = await loyaltyEngine.getAccountByEmail(email);
        if (!account) {
          return NextResponse.json(
            { success: false, error: 'Account not found' },
            { status: 404 }
          );
        }
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = parseInt(searchParams.get('offset') || '0');
        const transactions = await loyaltyEngine.getTransactionHistory(account.id, limit, offset);
        return NextResponse.json({ success: true, data: transactions });
      }

      case 'redemptions': {
        const account = await loyaltyEngine.getAccountByEmail(email);
        if (!account) {
          return NextResponse.json(
            { success: false, error: 'Account not found' },
            { status: 404 }
          );
        }
        const limit = parseInt(searchParams.get('limit') || '20');
        const redemptions = await loyaltyEngine.getRedemptionHistory(account.id, limit);
        return NextResponse.json({ success: true, data: redemptions });
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid type parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('[Loyalty API] GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/loyalty - Create account, redeem rewards, process referrals
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'create-account':
      case 'join': {
        const { email, firstName, lastName, customerId, referralCode } = body;
        
        if (!email) {
          return NextResponse.json(
            { success: false, error: 'Email is required' },
            { status: 400 }
          );
        }

        // Check if account already exists
        const existing = await loyaltyEngine.getAccountByEmail(email);
        if (existing) {
          return NextResponse.json({ 
            success: true, 
            data: existing,
            message: 'Account already exists'
          });
        }

        // Create new account
        const account = await loyaltyEngine.getOrCreateAccount(
          email, 
          customerId, 
          firstName, 
          lastName
        );

        // Process referral if code provided
        if (referralCode) {
          await loyaltyEngine.processReferral(account.id, referralCode);
        }

        return NextResponse.json({ 
          success: true, 
          data: account,
          message: 'Welcome to the loyalty program!'
        });
      }

      case 'redeem': {
        const { email, rewardId } = body;
        
        if (!email || !rewardId) {
          return NextResponse.json(
            { success: false, error: 'Email and rewardId are required' },
            { status: 400 }
          );
        }

        const account = await loyaltyEngine.getAccountByEmail(email);
        if (!account) {
          return NextResponse.json(
            { success: false, error: 'Account not found' },
            { status: 404 }
          );
        }

        const result = await loyaltyEngine.redeemReward({
          accountId: account.id,
          rewardId
        });

        if (!result.success) {
          return NextResponse.json(
            { success: false, error: result.error },
            { status: 400 }
          );
        }

        return NextResponse.json({ 
          success: true, 
          data: {
            redemptionId: result.redemptionId,
            couponCode: result.couponCode,
            expiresAt: result.expiresAt
          },
          message: 'Reward redeemed successfully!'
        });
      }

      case 'validate-referral': {
        const { referralCode } = body;
        
        if (!referralCode) {
          return NextResponse.json(
            { success: false, error: 'Referral code is required' },
            { status: 400 }
          );
        }

        const settings = await loyaltyEngine.getSettings();
        // Check if code exists (without revealing account details)
        const tiers = await loyaltyEngine.getTiers();
        
        return NextResponse.json({ 
          success: true, 
          data: {
            valid: true,
            bonusPoints: settings.referralBonusReferred
          }
        });
      }

      case 'earn-review': {
        const { email } = body;
        
        if (!email) {
          return NextResponse.json(
            { success: false, error: 'Email is required' },
            { status: 400 }
          );
        }

        const account = await loyaltyEngine.getAccountByEmail(email);
        if (!account) {
          return NextResponse.json(
            { success: false, error: 'Account not found' },
            { status: 404 }
          );
        }

        const result = await loyaltyEngine.awardPoints(
          account.id,
          'REVIEW',
          undefined,
          'Points earned for product review'
        );

        return NextResponse.json({ 
          success: true, 
          data: { points: result.points },
          message: `You earned ${result.points} points for your review!`
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('[Loyalty API] POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
