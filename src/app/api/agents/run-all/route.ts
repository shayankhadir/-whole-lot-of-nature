import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    console.log('🚀 Running ALL Agents in sequence...');
    
    const results: { agent: string; success: boolean; message: string }[] = [];
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    // Define agents to run in sequence
    const agents = [
      { name: 'Growth Agent', endpoint: '/api/agents/growth/run' },
      { name: 'SEO Agent', endpoint: '/api/agents/seo/run' },
      { name: 'Performance Agent', endpoint: '/api/agents/performance/run' },
      { name: 'WooCommerce Sync', endpoint: '/api/agents/woo/run', body: { action: 'sync' } },
      { name: 'Content Agent', endpoint: '/api/agents/content/run', body: { type: 'blog' } },
    ];

    // Run each agent sequentially
    for (const agent of agents) {
      try {
        console.log(`Running ${agent.name}...`);
        const response = await fetch(`${baseUrl}${agent.endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: agent.body ? JSON.stringify(agent.body) : undefined,
        });

        const data = await response.json();
        results.push({
          agent: agent.name,
          success: data.success,
          message: data.message || data.error || 'Completed',
        });
      } catch (error: unknown) {
        const err = error as Error;
        results.push({
          agent: agent.name,
          success: false,
          message: err.message,
        });
      }
    }

    const allSuccess = results.every(r => r.success);

    return NextResponse.json({
      success: allSuccess,
      message: allSuccess ? 'All agents completed successfully' : 'Some agents failed',
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Run all agents error:', err);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to run all agents',
      error: err.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
