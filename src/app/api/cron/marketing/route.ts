/**
 * Marketing Automation Scheduler Cron Job
 * Processes scheduled campaigns, waiting workflows, and social posts
 */

import { NextRequest, NextResponse } from 'next/server';
import { automationEngine } from '@/lib/marketing/automationEngine';
import { campaignManager } from '@/lib/marketing/campaignManager';
import { logAgentAction } from '@/lib/services/agentLogger';
import { prisma } from '@/lib/prisma';

// Verify cron secret or admin access
function verifyCron(request: NextRequest): boolean {
  const cronSecret = request.headers.get('x-cron-secret');
  const adminKey = request.headers.get('x-admin-key');
  return (
    cronSecret === process.env.CRON_SECRET ||
    adminKey === process.env.ADMIN_SECRET_KEY
  );
}

export async function POST(request: NextRequest) {
  if (!verifyCron(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startTime = Date.now();
  const results = {
    workflows: { resumed: 0, errors: 0 },
    campaigns: { activated: 0, errors: 0 },
    socialPosts: { published: 0, errors: 0 },
    totalDuration: 0
  };

  try {
    await logAgentAction({
      agent: 'marketing',
      action: 'run_started',
      status: 'RUNNING',
      message: 'Marketing automation scheduler started'
    });

    // 1. Resume waiting workflow executions
    try {
      results.workflows.resumed = await automationEngine.resumeWaitingExecutions();
    } catch (error) {
      console.error('[Scheduler] Failed to resume workflows:', error);
      results.workflows.errors++;
    }

    // 2. Process scheduled campaigns
    try {
      results.campaigns.activated = await campaignManager.processScheduledCampaigns();
    } catch (error) {
      console.error('[Scheduler] Failed to process campaigns:', error);
      results.campaigns.errors++;
    }

    // 3. Process scheduled social posts
    try {
      const posted = await processScheduledPosts();
      results.socialPosts.published = posted.published;
      results.socialPosts.errors = posted.errors;
    } catch (error) {
      console.error('[Scheduler] Failed to process social posts:', error);
      results.socialPosts.errors++;
    }

    results.totalDuration = Date.now() - startTime;

    await logAgentAction({
      agent: 'marketing',
      action: 'run_completed',
      status: 'SUCCESS',
      message: `Scheduler completed: ${results.workflows.resumed} workflows, ${results.campaigns.activated} campaigns, ${results.socialPosts.published} posts`,
      duration: results.totalDuration,
      metadata: results
    });

    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Scheduler] Critical error:', error);
    
    await logAgentAction({
      agent: 'marketing',
      action: 'run_error',
      status: 'ERROR',
      message: `Scheduler failed: ${String(error)}`
    });

    return NextResponse.json(
      { error: 'Scheduler failed', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * Process scheduled social media posts
 */
async function processScheduledPosts(): Promise<{ published: number; errors: number }> {
  const now = new Date();
  let published = 0;
  let errors = 0;

  // Get posts that should be published
  const posts = await prisma.scheduledPost.findMany({
    where: {
      status: 'SCHEDULED',
      scheduledAt: { lte: now }
    },
    orderBy: { scheduledAt: 'asc' },
    take: 20 // Limit batch size
  });

  for (const post of posts) {
    try {
      // Update status to publishing
      await prisma.scheduledPost.update({
        where: { id: post.id },
        data: { status: 'PUBLISHING' }
      });

      // Attempt to publish
      const result = await publishToSocialPlatform(post);

      if (result.success) {
        await prisma.scheduledPost.update({
          where: { id: post.id },
          data: {
            status: 'PUBLISHED',
            publishedAt: new Date(),
            postId: result.postId
          }
        });
        published++;
      } else {
        await prisma.scheduledPost.update({
          where: { id: post.id },
          data: {
            status: 'FAILED',
            error: result.error
          }
        });
        errors++;
      }
    } catch (error) {
      console.error(`[Scheduler] Failed to publish post ${post.id}:`, error);
      
      await prisma.scheduledPost.update({
        where: { id: post.id },
        data: {
          status: 'FAILED',
          error: String(error)
        }
      });
      errors++;
    }
  }

  return { published, errors };
}

/**
 * Publish to social media platform
 */
async function publishToSocialPlatform(post: {
  id: string;
  platform: string;
  content: string;
  mediaUrls: unknown;
  hashtags: unknown;
}): Promise<{ success: boolean; postId?: string; error?: string }> {
  const platform = post.platform;
  const content = post.content;
  const hashtags = (post.hashtags as string[]) || [];
  const mediaUrls = (post.mediaUrls as string[]) || [];
  
  // Add hashtags to content
  const fullContent = hashtags.length > 0 
    ? `${content}\n\n${hashtags.join(' ')}`
    : content;

  switch (platform) {
    case 'INSTAGRAM':
      return await publishToInstagram(fullContent, mediaUrls);
    
    case 'FACEBOOK':
      return await publishToFacebook(fullContent, mediaUrls);
    
    case 'TWITTER':
      return await publishToTwitter(fullContent, mediaUrls);
    
    default:
      console.log(`[Social] Simulating post to ${platform}: ${fullContent.substring(0, 100)}...`);
      return { 
        success: true, 
        postId: `sim-${Date.now()}`
      };
  }
}

/**
 * Publish to Instagram via Graph API
 */
async function publishToInstagram(
  content: string, 
  mediaUrls: string[]
): Promise<{ success: boolean; postId?: string; error?: string }> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const igUserId = process.env.INSTAGRAM_USER_ID;
  
  if (!accessToken || !igUserId) {
    console.log('[Instagram] No credentials configured, simulating post');
    return { success: true, postId: `ig-sim-${Date.now()}` };
  }

  try {
    // Instagram requires media for posts
    if (mediaUrls.length === 0) {
      // Create a text-based story or skip
      console.log('[Instagram] No media, skipping (Instagram requires images)');
      return { success: false, error: 'Instagram requires media for posts' };
    }

    // Step 1: Create media container
    const createMediaUrl = `https://graph.facebook.com/v18.0/${igUserId}/media`;
    const mediaResponse = await fetch(createMediaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: mediaUrls[0],
        caption: content,
        access_token: accessToken
      })
    });

    const mediaData = await mediaResponse.json();
    
    if (!mediaData.id) {
      return { success: false, error: mediaData.error?.message || 'Failed to create media' };
    }

    // Step 2: Publish the media
    const publishUrl = `https://graph.facebook.com/v18.0/${igUserId}/media_publish`;
    const publishResponse = await fetch(publishUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: mediaData.id,
        access_token: accessToken
      })
    });

    const publishData = await publishResponse.json();
    
    if (publishData.id) {
      return { success: true, postId: publishData.id };
    } else {
      return { success: false, error: publishData.error?.message || 'Failed to publish' };
    }
  } catch (error) {
    console.error('[Instagram] API error:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Publish to Facebook via Graph API
 */
async function publishToFacebook(
  content: string, 
  mediaUrls: string[]
): Promise<{ success: boolean; postId?: string; error?: string }> {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  const pageId = process.env.FACEBOOK_PAGE_ID;
  
  if (!accessToken || !pageId) {
    console.log('[Facebook] No credentials configured, simulating post');
    return { success: true, postId: `fb-sim-${Date.now()}` };
  }

  try {
    const url = `https://graph.facebook.com/v18.0/${pageId}/feed`;
    
    const body: Record<string, string> = {
      message: content,
      access_token: accessToken
    };
    
    // Add link/image if provided
    if (mediaUrls.length > 0) {
      body.link = mediaUrls[0];
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    
    if (data.id) {
      return { success: true, postId: data.id };
    } else {
      return { success: false, error: data.error?.message || 'Failed to post' };
    }
  } catch (error) {
    console.error('[Facebook] API error:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Publish to Twitter/X via API v2
 */
async function publishToTwitter(
  content: string, 
  _mediaUrls: string[]
): Promise<{ success: boolean; postId?: string; error?: string }> {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  
  if (!bearerToken) {
    console.log('[Twitter] No credentials configured, simulating post');
    return { success: true, postId: `tw-sim-${Date.now()}` };
  }

  try {
    // Twitter has 280 char limit
    const truncatedContent = content.length > 280 
      ? content.substring(0, 277) + '...'
      : content;

    const response = await fetch('https://api.twitter.com/2/tweets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: truncatedContent })
    });

    const data = await response.json();
    
    if (data.data?.id) {
      return { success: true, postId: data.data.id };
    } else {
      return { success: false, error: data.detail || 'Failed to tweet' };
    }
  } catch (error) {
    console.error('[Twitter] API error:', error);
    return { success: false, error: String(error) };
  }
}

// Also support GET for manual trigger
export async function GET(request: NextRequest) {
  return POST(request);
}
