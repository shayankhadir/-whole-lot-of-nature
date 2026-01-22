/**
 * Follow-up sequence processor
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendOutreachEmail } from '@/lib/email/emailAutomation';
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
    const data = loadGrowthData();
    if (!data || !data.followups) {
      return NextResponse.json({ success: true, message: 'No follow-ups scheduled.' });
    }

    const now = Date.now();
    const updates: Array<{ id: string; status: string }> = [];
    let sentCount = 0;

    for (const followup of data.followups) {
      if (followup.status === 'completed') continue;
      if (new Date(followup.nextSendAt).getTime() > now) continue;

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
    });
  } catch (error) {
    console.error('[Followup] Error:', error);
    return NextResponse.json({ error: 'Failed to process follow-ups' }, { status: 500 });
  }
}
