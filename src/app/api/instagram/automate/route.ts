/**
 * API Route: Instagram Automation
 * Endpoint: POST /api/instagram/automate
 * Actions: publish, schedule, export-csv, validate-account
 */

import { NextRequest, NextResponse } from 'next/server';
import InstagramAutomationService from '@/lib/services/instagramService';
import SocialMediaAgent from '@/lib/agents/socialMediaAgent';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const body = await request.json().catch(() => ({}));

    const instagramService = new InstagramAutomationService();

    switch (action) {
      case 'validate-account': {
        console.log('🔍 Validating Instagram account...');

        const isValid = await instagramService.validateAccount();

        return NextResponse.json({
          success: isValid,
          configured: instagramService.isConfigured(),
          message: isValid 
            ? 'Instagram account validated successfully' 
            : 'Instagram API not configured. Check INSTAGRAM_AUTO_SETUP.md for instructions.',
        });
      }

      case 'generate-and-export': {
        console.log('📱 Generating Instagram content and exporting to CSV...');

        const {
          postCount = 30,
          keywords = ['indoor plants', 'plant care', 'houseplants', 'gardening'],
        } = body;

        // Generate posts
        const socialAgent = new SocialMediaAgent();
        const posts = await socialAgent.generatePostsFromInsights(
          keywords,
          [],
          ['instagram'],
          postCount
        );

        // Create calendar
        const calendar = socialAgent.createContentCalendar(posts, new Date());

        // Export to CSV
        const csvPosts = posts.map(p => ({
          caption: p.content,
          hashtags: p.hashtags,
          imageUrl: p.imagePrompt,
          scheduledTime: p.scheduledTime,
        }));

        const csv = instagramService.exportToCSV(csvPosts);

        return NextResponse.json({
          success: true,
          posts,
          calendar: calendar.slice(0, 7), // First week
          csvData: csv,
          downloadInstructions: 'Save csvData to a .csv file and import into Meta Business Suite',
        });
      }

      case 'publish-now': {
        console.log('📤 Publishing to Instagram now...');

        if (!instagramService.isConfigured()) {
          return NextResponse.json({
            success: false,
            error: 'Instagram API not configured. See INSTAGRAM_AUTO_SETUP.md for setup instructions.',
          }, { status: 400 });
        }

        const { caption, imageUrl, hashtags } = body;

        if (!caption || !hashtags) {
          return NextResponse.json({
            success: false,
            error: 'Missing required fields: caption and hashtags',
          }, { status: 400 });
        }

        const result = await instagramService.publishPost({
          caption,
          imageUrl,
          hashtags,
        });

        return NextResponse.json({
          success: true,
          post: result,
          message: 'Post published to Instagram successfully!',
        });
      }

      case 'schedule-instagram': {
        console.log('📅 Scheduling posts to Instagram...');

        if (!instagramService.isConfigured()) {
          return NextResponse.json({
            success: false,
            error: 'Instagram API not configured. Add INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ACCOUNT_ID to .env.local',
          }, { status: 400 });
        }

        const { posts } = body;

        if (!posts || posts.length === 0) {
          return NextResponse.json({
            success: false,
            error: 'No posts provided',
          }, { status: 400 });
        }

        // Convert posts to Instagram format
        const instagramPosts = posts.map((post: any) => ({
          caption: post.content || post.caption,
          hashtags: post.hashtags || [],
          imageUrl: post.imageUrl,
          scheduledTime: post.scheduledTime ? new Date(post.scheduledTime) : undefined,
        }));

        // Bulk schedule to Instagram
        const results = await instagramService.bulkSchedule(instagramPosts);

        const successCount = results.filter(r => r.success).length;

        return NextResponse.json({
          success: true,
          scheduled: successCount,
          total: posts.length,
          results,
          message: `Successfully scheduled ${successCount}/${posts.length} posts to Instagram`,
          note: 'Posts will appear in your Instagram scheduled posts. You can edit or delete them in the Instagram app.',
        });
      }

      case 'get-insights': {
        console.log('📊 Fetching Instagram insights...');

        if (!instagramService.isConfigured()) {
          return NextResponse.json({
            success: false,
            error: 'Instagram API not configured',
          }, { status: 400 });
        }

        const insights = await instagramService.getAccountInsights();

        return NextResponse.json({
          success: true,
          insights,
        });
      }

      case 'get-recent-posts': {
        console.log('📸 Fetching recent Instagram posts...');

        if (!instagramService.isConfigured()) {
          return NextResponse.json({
            success: false,
            error: 'Instagram API not configured',
          }, { status: 400 });
        }

        const { limit = 10 } = body;
        const posts = await instagramService.getRecentPosts(limit);

        return NextResponse.json({
          success: true,
          posts,
          count: posts.length,
        });
      }

      case 'auto-post-daily': {
        console.log('🤖 Running daily auto-post...');

        // Generate 2 posts for today
        const socialAgent = new SocialMediaAgent();
        const posts = await socialAgent.generatePostsFromInsights(
          ['indoor plants', 'plant care', 'houseplants'],
          [],
          ['instagram'],
          2
        );

        // If Instagram configured, schedule the posts
        if (instagramService.isConfigured()) {
          const instagramPosts = posts.map(post => ({
            caption: post.content,
            hashtags: post.hashtags,
            imageUrl: undefined,
            scheduledTime: post.scheduledTime ? new Date(post.scheduledTime) : new Date(),
          }));

          const results = await instagramService.bulkSchedule(instagramPosts);

          return NextResponse.json({
            success: true,
            method: 'instagram',
            posts: results,
            message: 'Daily posts scheduled to Instagram',
          });
        }

        // If Instagram not configured, return posts for manual posting
        return NextResponse.json({
          success: true,
          method: 'manual',
          posts,
          message: 'Generated daily posts. Configure Instagram API for auto-posting.',
        });
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action',
            availableActions: [
              'validate-account',
              'generate-and-export',
              'publish-now',
              'schedule-instagram',
              'get-insights',
              'get-recent-posts',
              'auto-post-daily',
            ],
          },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('❌ Instagram API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Instagram automation failed',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    service: 'Instagram Automation API',
    status: 'active',
    actions: {
      'validate-account': 'Check if Instagram API is configured',
      'generate-and-export': 'Generate 30 posts and export to CSV',
      'publish-now': 'Publish a post to Instagram immediately',
      'schedule-instagram': 'Schedule posts directly to Instagram (FREE)',
      'get-insights': 'Get Instagram account analytics',
      'get-recent-posts': 'Fetch recent Instagram posts',
      'auto-post-daily': 'Generate and post 2 daily posts automatically',
    },
    setup: 'See INSTAGRAM_AUTO_SETUP.md for configuration instructions',
  });
}
