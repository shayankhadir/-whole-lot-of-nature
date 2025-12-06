import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'scripts', 'growth-agent', 'data', 'growth-data.json');
    
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json({ 
        agentStatus: 'IDLE', 
        leads: [], 
        activities: [],
        seoScore: 0,
        lastRun: null
      });
    }

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch growth stats' }, { status: 500 });
  }
}
