/**
 * API Route: Automatic Draft Publisher
 * Endpoint: POST /api/publisher/schedule
 * Manages automatic publishing of draft posts
 */

import { NextRequest, NextResponse } from 'next/server';
import AutomaticDraftPublisher from '@/lib/agents/automaticDraftPublisher';

export const dynamic = 'force-dynamic';

// Store publisher in memory (in production, use database)
let publisher: AutomaticDraftPublisher | null = null;

function getPublisher(): AutomaticDraftPublisher {
  if (!publisher) {
    publisher = new AutomaticDraftPublisher({
      wordPressUrl: process.env.WORDPRESS_SITE_URL || '',
      username: process.env.WORDPRESS_USERNAME || '',
      password: process.env.WORDPRESS_PASSWORD || '',
      publishInterval: parseInt(process.env.PUBLISH_INTERVAL || '120'), // 2 hours by default
      maxPostsPerInterval: parseInt(process.env.MAX_POSTS_PER_INTERVAL || '1'), // 1 post per interval
      enabled: true,
    });
  }

  return publisher;
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    const publisher = getPublisher();

    if (action === 'start') {
      // Start the automatic publishing schedule
      publisher.startSchedule();

      const status = publisher.getStatus();

      return NextResponse.json({
        success: true,
        message: 'Automatic publishing schedule started',
        status,
        timestamp: new Date().toISOString(),
      });
    } else if (action === 'stop') {
      // Stop the automatic publishing schedule
      publisher.stopSchedule();

      return NextResponse.json({
        success: true,
        message: 'Automatic publishing schedule stopped',
        timestamp: new Date().toISOString(),
      });
    } else if (action === 'publish-now') {
      // Publish next batch of drafts immediately
      const result = await publisher.publishNextDrafts();

      return NextResponse.json({
        success: result.success,
        result,
        timestamp: new Date().toISOString(),
      });
    } else if (action === 'status') {
      // Get current publishing status
      const status = publisher.getStatus();

      return NextResponse.json({
        success: true,
        status,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      );
    }
  } catch (error) {
    const err = error as Error;
    console.error('Error in publisher schedule:', err);

    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}
