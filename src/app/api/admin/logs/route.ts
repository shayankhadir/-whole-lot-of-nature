/**
 * Agent Logs API
 * Get and manage agent activity logs
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  getAgentLogs, 
  getAgentStats,
  clearOldLogs,
  type AgentName
} from '@/lib/services/agentLogger';

// Verify admin access
function verifyAdmin(request: NextRequest): boolean {
  const adminKey = request.headers.get('x-admin-key');
  return adminKey === process.env.ADMIN_SECRET_KEY;
}

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const agent = searchParams.get('agent') as AgentName | null;
    const limit = parseInt(searchParams.get('limit') || '50');
    const statsOnly = searchParams.get('stats') === 'true';

    if (statsOnly) {
      const stats = await getAgentStats();
      return NextResponse.json({ success: true, data: stats });
    }

    const logs = await getAgentLogs(agent || undefined, limit);
    const stats = await getAgentStats();
    
    return NextResponse.json({
      success: true,
      data: {
        logs,
        stats
      }
    });
  } catch (error) {
    console.error('[Agent Logs API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get agent logs' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const deleted = await clearOldLogs();
    return NextResponse.json({
      success: true,
      message: `Cleared ${deleted} old log entries`
    });
  } catch (error) {
    console.error('[Agent Logs API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to clear logs' },
      { status: 500 }
    );
  }
}
