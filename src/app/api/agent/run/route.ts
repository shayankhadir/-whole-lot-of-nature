/**
 * API Route: Manage Agent Runs
 * Endpoint: POST /api/agent/run
 */

import { NextRequest, NextResponse } from 'next/server';
import ScheduledTrendAgent, { AgentConfig } from '@/lib/agents/scheduledTrendAgent';
import { validateAgentApiKey, createUnauthorizedResponse } from '@/lib/auth/agentApiAuth';

export const dynamic = 'force-dynamic';

// Store agent in memory (in production, use database)
let agent: ScheduledTrendAgent | null = null;
let cachedPublishStrategy: AgentConfig['publishStrategy'] | null = null;

const DEFAULT_PUBLISH_STRATEGY: AgentConfig['publishStrategy'] =
  resolvePublishStrategy(process.env.AGENT_PUBLISH_STRATEGY) || 'scheduled';

function resolvePublishStrategy(value?: string | null): AgentConfig['publishStrategy'] | undefined {
  if (value === 'draft' || value === 'scheduled' || value === 'immediate') {
    return value;
  }
  return undefined;
}

function getAgent(strategyOverride?: AgentConfig['publishStrategy']): ScheduledTrendAgent {
  const publishStrategy = strategyOverride || cachedPublishStrategy || DEFAULT_PUBLISH_STRATEGY;

  if (!agent || cachedPublishStrategy !== publishStrategy) {
    agent = new ScheduledTrendAgent({
      runInterval: 'daily',
      publishStrategy,
      maxPostsPerRun: 5,
      wordPressConfig: process.env.WORDPRESS_SITE_URL
        ? {
            siteUrl: process.env.WORDPRESS_SITE_URL,
            username: process.env.WORDPRESS_USERNAME || '',
            password: process.env.WORDPRESS_PASSWORD || '',
          }
        : undefined,
    });
    cachedPublishStrategy = publishStrategy;
  }

  return agent;
}

export async function POST(request: NextRequest) {
  // Validate API key
  if (!validateAgentApiKey(request)) {
    return createUnauthorizedResponse();
  }

  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    const strategyParam = resolvePublishStrategy(searchParams.get('publishStrategy'));
    const agent = getAgent(strategyParam);

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

    const strategyParam = resolvePublishStrategy(searchParams.get('publishStrategy'));
    const agent = getAgent(strategyParam);

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
