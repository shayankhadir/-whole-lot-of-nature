/**
 * API Route: Get Trends
 * Endpoint: GET /api/trends
 */

import { NextRequest, NextResponse } from 'next/server';
import TrendScraper from '@/lib/agents/trendScraper';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as 'plants' | 'gardening' | 'nature' | 'sustainability' | null;
    const keyword = searchParams.get('keyword');
    const limit = parseInt(searchParams.get('limit') || '20');

    const scraper = new TrendScraper({ maxResults: limit });

    let trends;

    if (category) {
      trends = await scraper.getTrendsByCategory(category);
    } else if (keyword) {
      trends = await scraper.getTrendsByKeyword(keyword);
    } else {
      trends = await scraper.getAllTrends();
    }

    return NextResponse.json({
      success: true,
      count: trends.length,
      trends: trends.slice(0, limit),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const err = error as Error;
    console.error('Error fetching trends:', err);

    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}
