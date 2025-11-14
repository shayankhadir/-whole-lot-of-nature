/**
 * API Route: Manage Agent Runs
 * Endpoint: POST /api/agent/run
 */

import { NextRequest, NextResponse } from 'next/server';
import ScheduledTrendAgent from '@/lib/agents/scheduledTrendAgent';

export const dynamic = 'force-dynamic';

// Store agent in memory (in production, use database)
let agent: ScheduledTrendAgent | null = null;

function getAgent(): ScheduledTrendAgent {
  if (!agent) {
    agent = new ScheduledTrendAgent({
      runInterval: 'daily', // Run daily to generate 5 posts per day
      publishStrategy: 'draft', // Keep as draft, automatic publisher will publish
      maxPostsPerRun: 5, // Generate 5 posts per day
      wordPressConfig: process.env.WORDPRESS_SITE_URL
        ? {
            siteUrl: process.env.WORDPRESS_SITE_URL,
            username: process.env.WORDPRESS_USERNAME || '',
            password: process.env.WORDPRESS_PASSWORD || '',
          }
        : undefined,
    });
  }

  return agent;
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    const agent = getAgent();

    if (action === 'execute') {
      // Execute a full agent run
      const run = await agent.executeRun();

      return NextResponse.json({
        success: true,
        run,
        timestamp: new Date().toISOString(),
      });
    } else if (action === 'stats') {
      // Get statistics
      const stats = agent.getStatistics();

      return NextResponse.json({
        success: true,
        stats,
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
    console.error('Error in agent run:', err);

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

    const agent = getAgent();

    if (action === 'history') {
      const limit = parseInt(searchParams.get('limit') || '10');
      const runs = agent.getRuns(limit);

      return NextResponse.json({
        success: true,
        runs,
        timestamp: new Date().toISOString(),
      });
    } else if (action === 'latest') {
      const latestRun = agent.getLatestRun();

      return NextResponse.json({
        success: true,
        run: latestRun,
        timestamp: new Date().toISOString(),
      });
    } else if (action === 'stats') {
      const stats = agent.getStatistics();

      return NextResponse.json({
        success: true,
        stats,
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
    console.error('Error retrieving agent data:', err);

    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}
