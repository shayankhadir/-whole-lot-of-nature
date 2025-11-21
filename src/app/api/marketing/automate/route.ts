/**
 * API Route: Complete Marketing Automation
 * Endpoint: POST /api/marketing/automate
 * Full automation: Analyze competitors → Generate content → Create pages
 */

import { NextRequest, NextResponse } from 'next/server';
import MarketingAutomationAgent from '@/lib/agents/marketingAutomationAgent';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes for full automation
const automationAgent = new MarketingAutomationAgent();

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'full-automation': {
        console.log('🚀 Starting full marketing automation...');
        const response = await automationAgent.runFullAutomation();
        return NextResponse.json({
          ...response,
          timestamp: new Date().toISOString(),
        });
      }
      case 'generate-content-only': {
        const contentResponse = await automationAgent.generateContentOnly();

        if (!contentResponse.success) {
          return NextResponse.json(
            { success: false, error: 'No competitors analyzed' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          ...contentResponse,
          timestamp: new Date().toISOString(),
        });
      }
      case 'list-pages': {
        const pages = await automationAgent.listGeneratedPages();
        return NextResponse.json({
          pages: pages.map((slug) => ({
            slug,
            url: `/seo-pages/${slug}`,
          })),
          timestamp: new Date().toISOString(),
        });
      }
      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action. Use: full-automation, generate-content-only, or list-pages',
          },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Marketing automation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
