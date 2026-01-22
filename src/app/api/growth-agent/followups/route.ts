/**
 * Follow-up sequence processor
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendOutreachEmail, isEmailConfigured } from '@/lib/email/emailAutomation';
import * as fs from 'fs';
import * as path from 'path';

const DATA_FILE = path.join(process.cwd(), 'scripts', 'growth-agent', 'data', 'growth-data.json');

function loadGrowthData() {
  if (!fs.existsSync(DATA_FILE)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) as {
    leads: Array<{ id: string; name: string; source: string }>;
    followups?: Array<{
      id: string;
      leadId: string;
      email: string;
      leadName: string;
      leadType: string;
      nextSendAt: string;
      attempts: number;
      status: 'pending' | 'sent' | 'completed';
    }>;
  };
}

function saveGrowthData(data: unknown) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function verifyAdmin(request: NextRequest): boolean {
  const adminKey = request.headers.get('x-admin-key');
  return adminKey === process.env.ADMIN_SECRET_KEY;
}

function mapLeadType(source: string) {
  const normalized = source.toLowerCase();
  if (normalized === 'customer') return 'customer';
  if (normalized === 'partner') return 'partner';
  if (normalized === 'instagram') return 'influencer';
  return 'b2b';
}

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if email is configured
    if (!isEmailConfigured()) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email service not configured. Add RESEND_API_KEY to environment variables.',
        sentCount: 0,
        emailConfigured: false
      });
    }

    const data = loadGrowthData();
    if (!data || !data.followups) {
      return NextResponse.json({ success: true, message: 'No follow-ups scheduled.', sentCount: 0 });
    }

    const now = Date.now();
    const updates: Array<{ id: string; status: string }> = [];
    let sentCount = 0;
    const pendingFollowups = data.followups.filter(f => 
      f.status !== 'completed' && new Date(f.nextSendAt).getTime() <= now
    );

    if (pendingFollowups.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No follow-ups ready to send yet.',
        sentCount: 0,
        totalFollowups: data.followups.length
      });
    }

    for (const followup of pendingFollowups) {
      const lead = data.leads.find((item) => item.id === followup.leadId);
      const leadType = mapLeadType(lead?.source || followup.leadType);

      const result = await sendOutreachEmail(followup.email, leadType, {
        name: followup.leadName,
        source: lead?.source,
      });

      if (result.success) {
        followup.attempts += 1;
        followup.status = followup.attempts >= 2 ? 'completed' : 'sent';
        followup.nextSendAt = new Date(now + 48 * 60 * 60 * 1000).toISOString();
        sentCount += 1;
      }

      updates.push({ id: followup.id, status: followup.status });
    }

    saveGrowthData(data);

    return NextResponse.json({
      success: true,
      sentCount,
      updates,
      message: sentCount > 0 ? `Sent ${sentCount} follow-up emails.` : 'No emails sent.',
    });
  } catch (error) {
    console.error('[Followup] Error:', error);
    return NextResponse.json({ error: 'Failed to process follow-ups' }, { status: 500 });
  }
}
