/**
 * API Route: Generate Blog Post
 * Endpoint: POST /api/generate-blog-post
 */

import { NextRequest, NextResponse } from 'next/server';
import BlogPostGenerator from '@/lib/agents/blogPostGenerator';
import TrendScraper, { TrendData } from '@/lib/agents/trendScraper';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Security Check
    const authHeader = request.headers.get('x-admin-key');
    if (authHeader !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { trendId, topic, keyword, description } = body;

    const generator = new BlogPostGenerator();

    let post;

    if (trendId) {
      // Generate from specific trend
      const scraper = new TrendScraper();
      const trends = await scraper.getAllTrends();
      const trend = trends.find((t) => t.title === trendId);

      if (!trend) {
        return NextResponse.json(
          { success: false, error: 'Trend not found' },
          { status: 404 }
        );
      }

      post = await generator.generateFromTrend(trend);
    } else if (topic && keyword) {
      // Generate from custom topic
      const customTrend: TrendData = {
        title: topic,
        source: 'manual',
        engagement: 1000,
        timestamp: new Date(),
        category: 'gardening',
        keywords: [keyword],
        description: description || topic,
      };

      post = await generator.generateFromTrend(customTrend);
    } else {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: trendId or (topic + keyword)' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      post,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const err = error as Error;
    console.error('Error generating blog post:', err);

    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'template') {
      // Return SEO template
      return NextResponse.json({
        success: true,
        template: {
          title: '[Keyword] - Complete Guide to [Topic]',
          metaDescription: 'Learn about [keyword] and [topic]. Expert tips, step-by-step guide...',
          slug: 'keyword-topic-guide',
          categories: ['Gardening', 'Plant Care'],
          tags: ['keyword', 'topic', 'guide'],
          estimatedWordCount: '2000-3000 words',
          expectedReadTime: '10-15 minutes',
        },
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    const err = error as Error;
    console.error('Error in generate-blog-post GET:', err);

    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}
