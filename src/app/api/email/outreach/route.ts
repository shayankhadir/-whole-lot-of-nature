/**
 * Outreach Email API Route
 * Sends lead-specific outreach emails
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendOutreachEmail } from '@/lib/email/emailAutomation';
import type { OutreachLeadType } from '@/lib/email/outreachTemplates';

function verifyAdmin(request: NextRequest): boolean {
  const adminKey = request.headers.get('x-admin-key');
  return adminKey === process.env.ADMIN_SECRET_KEY;
}

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { email, leadType, lead } = body as {
      email: string;
      leadType: OutreachLeadType;
      lead: {
        name: string;
        company?: string;
        niche?: string;
        contact?: string;
        source?: string;
      };
    };

    if (!email || !leadType || !lead?.name) {
      return NextResponse.json({ error: 'Missing outreach parameters' }, { status: 400 });
    }

    const result = await sendOutreachEmail(email, leadType, lead);

    if (result.success) {
      return NextResponse.json({ success: true, emailId: result.id });
    }

    return NextResponse.json({ error: result.error || 'Failed to send outreach email' }, { status: 500 });
  } catch (error) {
    console.error('[Outreach API] Error:', error);
    return NextResponse.json({ error: 'Failed to send outreach email' }, { status: 500 });
  }
}
