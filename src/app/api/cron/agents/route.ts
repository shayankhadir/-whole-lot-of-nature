/**
 * Master Agent Cron Job
 * Runs all marketing agents automatically on a schedule
 * 
 * Endpoints:
 * - GET: Triggered by Vercel cron (daily at 6 AM IST)
 * - POST: Manual trigger with admin auth
 */

import { NextRequest, NextResponse } from 'next/server';
import { masterOrchestrator } from '@/lib/agents/masterOrchestrator';

// Verify cron secret or admin access
function verifyAccess(request: NextRequest): boolean {
  const cronSecret = request.headers.get('x-cron-secret');
  const authHeader = request.headers.get('authorization');
  const adminKey = request.nextUrl.searchParams.get('key');
  
  return (
    cronSecret === process.env.CRON_SECRET ||
    authHeader === `Bearer ${process.env.CRON_SECRET}` ||
    adminKey === process.env.ADMIN_SECRET_KEY
  );
}

export async function GET(request: NextRequest) {
  console.log('[Agent Cron] Starting scheduled run...');
  
  // Vercel cron jobs are verified by the platform
  // But also check our secret for manual triggers
  const isVercelCron = request.headers.get('x-vercel-cron') === 'true';
  
  if (!isVercelCron && !verifyAccess(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const startTime = Date.now();
    
    // Run daily diagnostics (lightweight check)
    console.log('[Agent Cron] Running daily diagnostics...');
    const diagnostics = await masterOrchestrator.runDailyDiagnostics();
    
    // Get urgent actions as recommendations
    const recommendations = diagnostics.urgentActions || [];
    
    // Track execution time
    const executionTime = Date.now() - startTime;
    
    console.log('[Agent Cron] Completed in', executionTime, 'ms');
    
    return NextResponse.json({
      success: true,
      message: 'Agent cron job completed successfully',
      timestamp: new Date().toISOString(),
      executionTime: `${executionTime}ms`,
      results: {
        diagnostics: {
          health: diagnostics.health,
          hotLeadsCount: diagnostics.hotLeads?.length || 0,
          todaysTasks: diagnostics.todaysTasks?.length || 0,
        },
        aiSuggestion: diagnostics.aiSuggestion,
        urgentActions: recommendations.slice(0, 5),
      }
    });
  } catch (error) {
    console.error('[Agent Cron] Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Agent cron job failed',
      message: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // POST requires authentication
  if (!verifyAccess(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const mode = body.mode || 'daily'; // 'daily', 'full', 'specific'
    
    console.log(`[Agent Cron] Manual trigger - mode: ${mode}`);
    
    const startTime = Date.now();
    let results;
    
    if (mode === 'full') {
      // Run complete system analysis (heavier operation)
      results = await masterOrchestrator.runFullSystemAnalysis();
    } else if (mode === 'specific' && body.agents) {
      // Run specific agents
      results = { specificRun: true, agents: body.agents };
      // Could implement specific agent runs here
    } else {
      // Default: daily diagnostics
      results = await masterOrchestrator.runDailyDiagnostics();
    }
    
    const executionTime = Date.now() - startTime;
    
    return NextResponse.json({
      success: true,
      message: `Agent ${mode} run completed`,
      timestamp: new Date().toISOString(),
      executionTime: `${executionTime}ms`,
      mode,
      results,
    });
  } catch (error) {
    console.error('[Agent Cron] Manual trigger error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Agent run failed',
      message: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
