/**
 * Daily lead drop report
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendLeadDropReport } from '@/lib/email/emailAutomation';
import * as fs from 'fs';
import * as path from 'path';

const DATA_FILE = path.join(process.cwd(), 'scripts', 'growth-agent', 'data', 'growth-data.json');

function verifyAdmin(request: NextRequest): boolean {
  const adminKey = request.headers.get('x-admin-key');
  return adminKey === process.env.ADMIN_SECRET_KEY;
}

function buildReport(data: any) {
  const leads = Array.isArray(data?.leads) ? data.leads : [];
  const sources = leads.reduce<Record<string, number>>((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {});

  const hotLeads = leads.filter((lead: any) => lead.status === 'HOT');
  const newLeads = leads.filter((lead: any) => lead.status === 'NEW');
  const contacted = leads.filter((lead: any) => lead.status === 'CONTACTED');

  return {
    date: new Date().toLocaleDateString('en-IN'),
    totalLeads: leads.length,
    hotLeads: hotLeads.length,
    newLeads: newLeads.length,
    contacted: contacted.length,
    sources,
    topLeads: leads.slice(0, 8).map((lead: any) => ({
      name: lead.name,
      source: lead.source,
      score: lead.score,
    })),
  };
}

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json({ error: 'No lead data found' }, { status: 404 });
    }

    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const report = buildReport(data);
    const targetEmail = process.env.REPORT_EMAIL_TO || process.env.ADMIN_EMAIL;

    if (!targetEmail) {
      return NextResponse.json({ error: 'REPORT_EMAIL_TO or ADMIN_EMAIL must be set' }, { status: 400 });
    }

    const result = await sendLeadDropReport(targetEmail, report);

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to send report' }, { status: 500 });
    }

    if (process.env.SLACK_WEBHOOK_URL) {
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `Daily Lead Drop — ${report.date}\nTotal: ${report.totalLeads} | Hot: ${report.hotLeads} | New: ${report.newLeads}`,
        }),
      });
    }

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error('[Lead Report] Error:', error);
    return NextResponse.json({ error: 'Failed to send report' }, { status: 500 });
  }
}
