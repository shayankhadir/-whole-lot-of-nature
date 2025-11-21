/**
 * API Route: Agent Supervisor
 * Endpoint: POST /api/agent/supervisor?action=run
 */

import { NextRequest, NextResponse } from 'next/server';
import AgentSupervisor, { SupervisableAgent } from '@/lib/agents/agentSupervisor';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const supervisor = new AgentSupervisor();

export async function GET() {
  return NextResponse.json({
    success: true,
    agents: supervisor.listAgents(),
    defaultSequence: ['trend', 'marketing', 'publisher', 'backlinks', 'social', 'email'],
  });
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') ?? 'run';

    if (action !== 'run') {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const agents: SupervisableAgent[] | undefined = body.agents;

    const report = await supervisor.runAgents(agents);

    return NextResponse.json({ success: report.success, report });
  } catch (error: any) {
    console.error('Agent supervisor error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
