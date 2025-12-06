/**
 * API Route: Instagram Connection Test & Validation
 * Endpoint: GET/POST /api/instagram/instagram-test
 * 
 * Tests Instagram Graph API connection and validates credentials
 */

import { NextRequest, NextResponse } from 'next/server';
import InstagramAutomationService from '@/lib/services/instagramService';

export const dynamic = 'force-dynamic';

export async function GET() {
  const instagramService = new InstagramAutomationService();

  if (!instagramService.isConfigured()) {
    return NextResponse.json({
      success: false,
      configured: false,
      message: 'Instagram API not configured',
      instructions: [
        '1. You need an Instagram Business Account (not personal)',
        '2. Link it to a Facebook Page',
        '3. Get access token from Facebook Developer Console',
        '4. Add these to .env.local:',
        '   INSTAGRAM_ACCESS_TOKEN=your_token',
        '   INSTAGRAM_BUSINESS_ACCOUNT_ID=your_account_id',
        '5. Restart server',
        '',
        'Quick Setup Guide: See INSTAGRAM_AUTO_SETUP.md',
      ],
    });
  }

  try {
    // Validate account and get info
    const isValid = await instagramService.validateAccount();
    
    if (!isValid) {
      return NextResponse.json({
        success: false,
        configured: true,
        error: 'Invalid Instagram credentials',
        message: 'Token or Account ID is invalid. Check your .env.local file.',
      }, { status: 401 });
    }

    // Get account details
    const accountInfo = await instagramService.getAccountInfo() as any;

    return NextResponse.json({
      success: true,
      configured: true,
      account: {
        id: accountInfo.id,
        username: accountInfo.username,
        followers: accountInfo.followers_count,
        following: accountInfo.follows_count,
        posts: accountInfo.media_count,
        profilePicture: accountInfo.profile_picture_url,
      },
      message: `✅ Connected to @${accountInfo.username}! Ready for automated posting.`,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      configured: true,
      error: errorMessage,
      message: 'Failed to connect to Instagram. Check your credentials.',
    }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  const instagramService = new InstagramAutomationService();

  if (!instagramService.isConfigured()) {
    return NextResponse.json({
      success: false,
      error: 'Instagram API not configured. Add credentials to .env.local',
    }, { status: 400 });
  }

  try {
    const { action } = await request.json();

    if (action === 'test-post') {
      // Schedule a test post 1 hour from now
      const testPostTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour ahead
      
      const testPost = {
        caption: '🌿 Test post from Whole Lot of Nature automation system!\n\nIf you see this, your Instagram automation is working perfectly! 🎉',
        hashtags: ['#WholeLotsOfNature', '#PlantsOfInstagram', '#AutomationTest'],
        scheduledTime: testPostTime,
      };

      const result = await instagramService.schedulePost(testPost, testPostTime);

      return NextResponse.json({
        success: true,
        postId: result.id,
        scheduledTime: testPostTime.toISOString(),
        message: '✅ Test post scheduled successfully!',
        nextSteps: [
          '1. Check Instagram to verify the post is scheduled',
          '2. If it worked, your automation is ready!',
          '3. Run the full automation to schedule 30 posts',
        ],
      });
    }

    if (action === 'get-stats') {
      // Get account insights
      const insights = await instagramService.getAccountInsights();
      const recentPosts = await instagramService.getRecentPosts(5) as any[];

      return NextResponse.json({
        success: true,
        insights,
        recentPosts: recentPosts.map((post: any) => ({
          id: post.id,
          caption: post.caption?.substring(0, 100) + '...',
          likes: post.like_count,
          comments: post.comments_count,
          timestamp: post.timestamp,
          permalink: post.permalink,
        })),
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action. Use: test-post or get-stats',
    }, { status: 400 });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Instagram test error:', error);
    return NextResponse.json({
      success: false,
      error: errorMessage,
    }, { status: 500 });
  }
}
