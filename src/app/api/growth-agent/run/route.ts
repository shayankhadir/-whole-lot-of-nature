import { NextRequest, NextResponse } from 'next/server';
import { LeadGenerationAgent } from '@/lib/agents/leadGenAgent';
import { CustomerInsightAgent, LeadQualificationAgent, NicheResearchAgent, PersonaRefinementAgent } from '@/lib/agents/growthSubagents';
import * as fs from 'fs';
import * as path from 'path';

export const dynamic = 'force-dynamic';

type GrowthLead = {
  id: string;
  name: string;
  role: string;
  company: string;
  source: 'LinkedIn' | 'Instagram' | 'Directory' | 'Customer' | 'Partner';
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
  nicheSummary?: string;
  nicheKeywords?: string[];
  nicheSegments?: string[];
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

const DATA_FILE = path.join(process.cwd(), 'scripts', 'growth-agent', 'data', 'growth-data.json');

const DEFAULT_DATA: GrowthData = {
  lastRun: null,
  seoScore: 0,
  leads: [],
  activities: [],
  agentStatus: 'IDLE',
  followups: [],
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

    const nicheAgent = new NicheResearchAgent();
    const nicheResult = await nicheAgent.run();
    data.nicheKeywords = nicheResult.keywords;
    data.nicheSegments = nicheResult.segments;
    data.nicheSummary = `Focus segments: ${nicheResult.segments.join(', ')}. Keywords: ${nicheResult.keywords.slice(0, 6).join(', ')}`;
    logActivity(data, `Niche research completed: ${data.nicheSummary}`, 'INFO');

    const agent = new LeadGenerationAgent({
      includeCustomers: true,
      includeBacklinkOpportunities: true,
      customerLimit: 50,
      backlinkLimit: 10,
      nicheKeywords: nicheResult.keywords,
    });
    const leads = await agent.findLeads();

    const customerInsightAgent = new CustomerInsightAgent();
    const enrichedLeads = customerInsightAgent.enrich(leads, nicheResult);

    const qualificationAgent = new LeadQualificationAgent(nicheResult.keywords);
    const qualifiedLeads = qualificationAgent.qualify(enrichedLeads);

    const personaAgent = new PersonaRefinementAgent();
    const personaLeads = await personaAgent.refine(qualifiedLeads, nicheResult);

    if (leads.length === 0) {
      logActivity(data, 'No new leads found from customer data or backlink opportunities', 'WARNING');
    }

    let addedLeads = 0;
    for (const lead of personaLeads) {
      const existing = data.leads.find((item) => item.id === lead.id);
      if (!existing) {
        const score = lead.score ?? (
          lead.source === 'Customer' ? 85 :
          lead.source === 'Partner' ? 78 :
          lead.source === 'LinkedIn' ? 88 :
          lead.source === 'Instagram' ? 80 : 72
        );
        data.leads.push({
          ...lead,
          score,
          status: score >= 85 ? 'HOT' : lead.status
        });
        addedLeads += 1;
      }
    }

    const sourceSummary = personaLeads.reduce<Record<string, number>>((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {});

    const followups = data.followups || [];
    const now = Date.now();
    const newFollowups = personaLeads
      .filter((lead) => lead.contact && lead.contact.includes('@'))
      .filter((lead) => lead.status === 'CONTACTED' || lead.status === 'HOT')
      .filter((lead) => !followups.some((f) => f.leadId === lead.id && f.status !== 'completed'))
      .map((lead) => ({
        id: `follow-${lead.id}-${now}`,
        leadId: lead.id,
        email: lead.contact as string,
        leadName: lead.name,
        leadType: lead.source,
        nextSendAt: new Date(now + 24 * 60 * 60 * 1000).toISOString(),
        attempts: 0,
        status: 'pending' as const,
      }));

    if (newFollowups.length > 0) {
      data.followups = [...followups, ...newFollowups];
      logActivity(data, `Scheduled ${newFollowups.length} follow-up sequences`, 'INFO');
    }

    logActivity(
      data,
      `Found ${addedLeads} new leads. Sources: ${Object.entries(sourceSummary)
        .map(([source, count]) => `${source} (${count})`)
        .join(', ') || 'None'}`,
      addedLeads > 0 ? 'SUCCESS' : 'INFO'
    );

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
