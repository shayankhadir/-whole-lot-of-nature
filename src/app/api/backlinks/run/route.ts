import { NextRequest, NextResponse } from 'next/server';
import BacklinkAgent from '@/lib/agents/backlinkAgent';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'analyze';

    const agent = new BacklinkAgent();

    if (action === 'build') {
      const result = await agent.buildBacklinks(4);
      return NextResponse.json({
        success: true,
        report: result.report,
        operations: result.operations,
        summary: result.summary,
        timestamp: new Date().toISOString(),
      });
    }

    const report = await agent.runAnalysis();
    return NextResponse.json({
      success: true,
      report,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error('Backlink agent error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to execute backlink agent';
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}