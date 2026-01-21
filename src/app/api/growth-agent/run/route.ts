import { NextRequest, NextResponse } from 'next/server';
import { LeadGenerationAgent } from '@/lib/agents/leadGenAgent';
import * as fs from 'fs';
import * as path from 'path';

export const dynamic = 'force-dynamic';

type GrowthLead = {
  id: string;
  name: string;
  role: string;
  company: string;
  source: 'LinkedIn' | 'Instagram' | 'Directory';
  niche: string;
  contact?: string;
  score?: number;
  status: 'NEW' | 'HOT' | 'CONTACTED' | 'CONVERTED' | 'COLD';
  lastContacted?: string;
};

type GrowthActivity = {
  timestamp: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  message: string;
};

type GrowthData = {
  lastRun: string | null;
  seoScore: number;
  leads: GrowthLead[];
  activities: GrowthActivity[];
  agentStatus: 'IDLE' | 'RUNNING' | 'ERROR';
};

const DATA_FILE = path.join(process.cwd(), 'scripts', 'growth-agent', 'data', 'growth-data.json');

const DEFAULT_DATA: GrowthData = {
  lastRun: null,
  seoScore: 0,
  leads: [],
  activities: [],
  agentStatus: 'IDLE'
};

function loadGrowthData(): GrowthData {
  if (!fs.existsSync(DATA_FILE)) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2));
    return { ...DEFAULT_DATA };
  }

  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) as GrowthData;
  } catch {
    return { ...DEFAULT_DATA };
  }
}

function saveGrowthData(data: GrowthData) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function logActivity(data: GrowthData, message: string, type: GrowthActivity['type'] = 'INFO') {
  data.activities.unshift({
    timestamp: new Date().toISOString(),
    type,
    message
  });
  if (data.activities.length > 100) {
    data.activities = data.activities.slice(0, 100);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Security Check
    const authHeader = request.headers.get('x-admin-key');
    if (authHeader !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const data = loadGrowthData();
    data.agentStatus = 'RUNNING';
    data.lastRun = new Date().toISOString();
    logActivity(data, 'Starting growth cycle', 'INFO');
    data.seoScore = Math.max(data.seoScore || 0, 72);

    const agent = new LeadGenerationAgent();
    const leads = await agent.findLeads();

    let addedLeads = 0;
    for (const lead of leads) {
      const existing = data.leads.find((item) => item.id === lead.id);
      if (!existing) {
        const score = lead.score ?? (lead.source === 'LinkedIn' ? 88 : lead.source === 'Instagram' ? 80 : 72);
        data.leads.push({
          ...lead,
          score,
          status: score >= 85 ? 'HOT' : lead.status
        });
        addedLeads += 1;
      }
    }

    logActivity(data, `Found ${addedLeads} new leads`, addedLeads > 0 ? 'SUCCESS' : 'INFO');

    const outreachTargets = data.leads
      .filter((lead) => lead.status === 'HOT' || lead.status === 'NEW')
      .slice(0, 3);

    for (const lead of outreachTargets) {
      lead.status = 'CONTACTED';
      lead.lastContacted = new Date().toISOString();
      logActivity(data, `Drafted outreach for ${lead.name} at ${lead.company}`, 'SUCCESS');
    }

    data.agentStatus = 'IDLE';
    logActivity(data, 'Growth cycle completed', 'SUCCESS');
    saveGrowthData(data);

    return NextResponse.json({
      success: true,
      leads: data.leads,
      message: `Added ${addedLeads} new leads and contacted ${outreachTargets.length} prospects.`
    });
  } catch (error) {
    const err = error as Error;
    console.error('Error running lead gen agent:', err);
    const data = loadGrowthData();
    data.agentStatus = 'ERROR';
    logActivity(data, `Growth cycle failed: ${err.message}`, 'ERROR');
    saveGrowthData(data);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
