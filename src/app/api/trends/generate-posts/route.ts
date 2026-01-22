/**
 * Generate and publish SEO-rich blog posts from Google Trends
 */

import { NextRequest, NextResponse } from 'next/server';
import TrendScraper from '@/lib/agents/trendScraper';
import BlogPostGenerator from '@/lib/agents/blogPostGenerator';
import WordPressPublisher from '@/lib/agents/wordPressPublisher';

export const dynamic = 'force-dynamic';

function verifyAdmin(request: NextRequest): boolean {
  const adminKey = request.headers.get('x-admin-key');
  return adminKey === process.env.ADMIN_SECRET_KEY;
}

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const count = Math.min(Math.max(Number(body.count || 3), 1), 5);

    const siteUrl = (process.env.WORDPRESS_SITE_URL || process.env.WORDPRESS_URL || '').replace(/\/$/, '');
    const username = process.env.WORDPRESS_USERNAME;
    const password = process.env.WORDPRESS_PASSWORD || process.env.WORDPRESS_APP_PASSWORD?.replace(/ /g, '');

    if (!siteUrl || !username || !password) {
      return NextResponse.json({ success: false, error: 'WordPress credentials missing' }, { status: 400 });
    }

    const scraper = new TrendScraper({ googleTrendsRegion: 'IN', maxResults: 20 });
    const trends = await scraper.scrapeGoogleTrends();
    const selected = trends.slice(0, count);

    if (selected.length === 0) {
      return NextResponse.json({ success: false, error: 'No Google Trends found' }, { status: 404 });
    }

    const generator = new BlogPostGenerator();
    const publisher = new WordPressPublisher({ siteUrl, username, password });

    const results = [] as Array<{ trend: string; published: boolean; url?: string; error?: string }>;

    for (const trend of selected) {
      const post = await generator.generateFromTrend(trend);
      post.status = 'published';
      post.featuredImage = generator.generateFeaturedImage(trend.title);

      const publishResult = await publisher.publishPost(post, true);
      results.push({
        trend: trend.title,
        published: publishResult.success,
        url: publishResult.url,
        error: publishResult.error,
      });
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    const err = error as Error;
    console.error('[Trends] Generation error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
