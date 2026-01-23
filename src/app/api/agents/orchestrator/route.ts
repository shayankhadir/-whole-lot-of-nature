/**
 * Unified Agent API Endpoint
 * Provides REST access to all marketing agents via the Master Orchestrator
 */

import { NextRequest, NextResponse } from 'next/server';
import { masterOrchestrator } from '@/lib/agents/masterOrchestrator';

// ============================================================================
// GET - Dashboard Data & Status
// ============================================================================

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action') || 'dashboard';

  try {
    switch (action) {
      case 'dashboard':
        const dashboardData = await masterOrchestrator.getDashboardData();
        return NextResponse.json({
          success: true,
          data: dashboardData,
        });

      case 'status':
        return NextResponse.json({
          success: true,
          data: {
            agents: masterOrchestrator.getAgentStatuses(),
            pendingTasks: masterOrchestrator.getPendingTasks().length,
            recentTasks: masterOrchestrator.getTaskHistory(10),
          },
        });

      case 'daily':
        const dailyData = await masterOrchestrator.runDailyDiagnostics();
        return NextResponse.json({
          success: true,
          data: dailyData,
        });

      case 'leads':
        const leadAgent = masterOrchestrator.getAgent('leadGen');
        const leads = leadAgent.getAllLeads();
        const temperature = searchParams.get('temperature');
        const segment = searchParams.get('segment');
        
        let filteredLeads = leads;
        if (temperature) {
          filteredLeads = filteredLeads.filter(l => l.temperature === temperature);
        }
        if (segment) {
          filteredLeads = filteredLeads.filter(l => l.segments.includes(segment));
        }

        return NextResponse.json({
          success: true,
          data: {
            total: leads.length,
            filtered: filteredLeads.length,
            leads: filteredLeads.slice(0, 50), // Limit response size
          },
        });

      case 'hot-leads':
        const hotLeads = masterOrchestrator.getAgent('leadGen').getHotLeadsForAction();
        return NextResponse.json({
          success: true,
          data: hotLeads,
        });

      case 'content-plan':
        const contentPlan = masterOrchestrator.getAgent('growth').getContentPlan();
        return NextResponse.json({
          success: true,
          data: contentPlan,
        });

      case 'campaigns':
        const campaigns = masterOrchestrator.getAgent('growth').getActiveCampaigns();
        return NextResponse.json({
          success: true,
          data: campaigns,
        });

      case 'automations':
        const automations = masterOrchestrator.getAgent('growth').getAutomationRules();
        return NextResponse.json({
          success: true,
          data: automations,
        });

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`,
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Agent API GET error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// ============================================================================
// POST - Run Agent Operations
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, params } = body;

    if (!action) {
      return NextResponse.json({
        success: false,
        error: 'Action is required',
      }, { status: 400 });
    }

    switch (action) {
      // ========== FULL ANALYSIS ==========
      case 'full-analysis':
        const fullReport = await masterOrchestrator.runFullSystemAnalysis();
        return NextResponse.json({
          success: true,
          data: fullReport,
        });

      case 'run-all-agents':
        const allResults = await masterOrchestrator.runAllAgents();
        return NextResponse.json({
          success: true,
          data: allResults,
        });

      // ========== SEO ==========
      case 'seo-analyze':
        const seoAgent = masterOrchestrator.getAgent('seo');
        const limit = params?.limit || 25;
        const seoReport = await seoAgent.analyzeBulkProducts(limit);
        return NextResponse.json({
          success: true,
          data: seoReport,
        });

      case 'seo-product':
        if (!params?.productId) {
          return NextResponse.json({
            success: false,
            error: 'productId is required',
          }, { status: 400 });
        }
        const productAnalysis = await masterOrchestrator.analyzeProductSEO(params.productId);
        return NextResponse.json({
          success: true,
          data: productAnalysis,
        });

      case 'seo-keywords':
        const seoKeywordAgent = masterOrchestrator.getAgent('seo');
        // Would need a product object for this
        return NextResponse.json({
          success: true,
          data: {
            message: 'Use seo-analyze for bulk keyword research',
          },
        });

      // ========== LEAD GENERATION ==========
      case 'capture-lead':
        if (!params?.email) {
          return NextResponse.json({
            success: false,
            error: 'email is required',
          }, { status: 400 });
        }
        const newLead = await masterOrchestrator.captureLead({
          email: params.email,
          firstName: params.firstName,
          lastName: params.lastName,
          source: params.source || 'api',
          tags: params.tags,
        });
        return NextResponse.json({
          success: true,
          data: newLead,
        });

      case 'sync-woocommerce':
        const syncResult = await masterOrchestrator.syncWooCommerceLeads(params?.limit || 100);
        return NextResponse.json({
          success: true,
          data: syncResult,
        });

      case 'lead-report':
        const leadGenAgent = masterOrchestrator.getAgent('leadGen');
        const leadReport = await leadGenAgent.generateReport();
        return NextResponse.json({
          success: true,
          data: leadReport,
        });

      case 'track-behavior':
        if (!params?.email || !params?.event) {
          return NextResponse.json({
            success: false,
            error: 'email and event are required',
          }, { status: 400 });
        }
        const behaviorAgent = masterOrchestrator.getAgent('leadGen');
        await behaviorAgent.trackBehavior(params.email, {
          type: params.event,
          data: params.data,
        });
        return NextResponse.json({
          success: true,
          data: { tracked: true },
        });

      // ========== GROWTH ==========
      case 'growth-report':
        const growthReport = await masterOrchestrator.getAgent('growth').runFullGrowthAnalysis();
        return NextResponse.json({
          success: true,
          data: growthReport,
        });

      case 'content-plan':
        const weeks = params?.weeks || 4;
        const contentPlan = await masterOrchestrator.generateContentPlan(weeks);
        return NextResponse.json({
          success: true,
          data: contentPlan,
        });

      case 'create-campaign':
        if (!params?.name || !params?.type) {
          return NextResponse.json({
            success: false,
            error: 'name and type are required',
          }, { status: 400 });
        }
        const campaign = masterOrchestrator.createGrowthCampaign({
          name: params.name,
          type: params.type,
          status: params.status || 'draft',
          startDate: params.startDate ? new Date(params.startDate) : new Date(),
          endDate: params.endDate ? new Date(params.endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          channels: params.channels || ['email', 'social'],
          targetAudience: params.targetAudience || ['all'],
          goals: params.goals || [],
        });
        return NextResponse.json({
          success: true,
          data: campaign,
        });

      // ========== SOCIAL ==========
      case 'generate-social':
        const socialPosts = await masterOrchestrator.generateSocialPosts({
          keywords: params?.keywords || ['indoor plants', 'plant care'],
          platforms: params?.platforms || ['instagram', 'facebook'],
          count: params?.count || 10,
        });
        return NextResponse.json({
          success: true,
          data: socialPosts,
        });

      // ========== COMPETITOR ==========
      case 'competitor-analyze':
        const competitorResult = await masterOrchestrator.runCompetitorAnalysis(params?.urls);
        return NextResponse.json({
          success: true,
          data: competitorResult,
        });

      // ========== MARKETING ==========
      case 'marketing-automation':
        const marketingAgent = masterOrchestrator.getAgent('marketing');
        const marketingResult = await marketingAgent.runFullAutomation();
        return NextResponse.json({
          success: true,
          data: marketingResult,
        });

      // ========== AGENT CONTROL ==========
      case 'enable-agent':
        if (!params?.agent) {
          return NextResponse.json({
            success: false,
            error: 'agent name is required',
          }, { status: 400 });
        }
        masterOrchestrator.setAgentEnabled(params.agent, true);
        return NextResponse.json({
          success: true,
          data: { agent: params.agent, enabled: true },
        });

      case 'disable-agent':
        if (!params?.agent) {
          return NextResponse.json({
            success: false,
            error: 'agent name is required',
          }, { status: 400 });
        }
        masterOrchestrator.setAgentEnabled(params.agent, false);
        return NextResponse.json({
          success: true,
          data: { agent: params.agent, enabled: false },
        });

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`,
          availableActions: [
            'full-analysis',
            'run-all-agents',
            'seo-analyze',
            'seo-product',
            'capture-lead',
            'sync-woocommerce',
            'lead-report',
            'track-behavior',
            'growth-report',
            'content-plan',
            'create-campaign',
            'generate-social',
            'competitor-analyze',
            'marketing-automation',
            'enable-agent',
            'disable-agent',
          ],
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Agent API POST error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
