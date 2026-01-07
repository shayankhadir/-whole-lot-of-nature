import { NextRequest, NextResponse } from 'next/server';
import { LeadGenerationAgent } from '@/lib/agents/leadGenAgent';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Security Check
    const authHeader = request.headers.get('x-admin-key');
    if (authHeader !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const agent = new LeadGenerationAgent();
    const leads = await agent.findLeads();

    return NextResponse.json({
      success: true,
      leads,
      message: `Found ${leads.length} new leads`
    });
  } catch (error) {
    const err = error as Error;
    console.error('Error running lead gen agent:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
