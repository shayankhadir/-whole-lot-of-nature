import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { isEmailConfigured } from '@/lib/email/emailAutomation';

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'scripts', 'growth-agent', 'data', 'growth-data.json');
    
    // Check email configuration status
    const emailConfigured = isEmailConfigured();
    
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json({ 
        agentStatus: 'IDLE', 
        leads: [], 
        activities: [],
        seoScore: 0,
        lastRun: null,
        emailConfigured,
        emailWarning: !emailConfigured ? 'Email service not configured. Add RESEND_API_KEY to enable outreach.' : null
      });
    }

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    return NextResponse.json({
      ...data,
      emailConfigured,
      emailWarning: !emailConfigured ? 'Email service not configured. Add RESEND_API_KEY to enable outreach.' : null
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch growth stats' }, { status: 500 });
  }
}
