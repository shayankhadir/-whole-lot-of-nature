/**
 * Marketing Automation API Routes
 * Manage workflows, campaigns, and triggers
 */

import { NextRequest, NextResponse } from 'next/server';
import { automationEngine } from '@/lib/marketing/automationEngine';
import { campaignManager } from '@/lib/marketing/campaignManager';
import { socialMediaManager } from '@/lib/marketing/socialMediaManager';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import type { AutomationTrigger, CampaignType, SocialPlatform } from '@prisma/client';

// Verify admin access
function verifyAdmin(request: NextRequest): boolean {
  const adminKey = request.headers.get('x-admin-key');
  return adminKey === process.env.ADMIN_SECRET_KEY;
}

/**
 * GET - Retrieve marketing data
 */
export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview';

    switch (type) {
      case 'overview':
        return await getOverview();
      
      case 'workflows':
        return await getWorkflows();
      
      case 'campaigns':
        return await getCampaigns();
      
      case 'posts':
        return await getScheduledPosts(searchParams);
      
      case 'campaign-stats':
        const campaignId = searchParams.get('id');
        if (!campaignId) {
          return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 });
        }
        const stats = await campaignManager.getCampaignStats(campaignId);
        return NextResponse.json({ success: true, data: stats });
      
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    console.error('[Marketing API] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

/**
 * POST - Create or trigger marketing actions
 */
export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      // Workflow actions
      case 'create-workflow':
        return await createWorkflow(body);
      
      case 'trigger-workflow':
        return await triggerWorkflow(body);
      
      // Campaign actions
      case 'create-campaign':
        return await createCampaign(body);
      
      case 'activate-campaign':
        const activated = await campaignManager.activateCampaign(body.campaignId);
        return NextResponse.json({ success: true, data: activated });
      
      case 'pause-campaign':
        const paused = await campaignManager.pauseCampaign(body.campaignId);
        return NextResponse.json({ success: true, data: paused });
      
      case 'validate-discount':
        const validation = await campaignManager.validateDiscountCode(
          body.code,
          body.orderValue || 0
        );
        return NextResponse.json({ success: true, data: validation });
      
      // Social media actions
      case 'schedule-post':
        return await schedulePost(body);
      
      case 'generate-calendar':
        const calendar = await socialMediaManager.createWeeklyCalendar();
        return NextResponse.json({ success: true, data: calendar });
      
      case 'get-suggestions':
        const suggestions = await socialMediaManager.generateContentSuggestions();
        return NextResponse.json({ success: true, data: suggestions });
      
      // Manual trigger for testing
      case 'run-scheduler':
        const workflowsResumed = await automationEngine.resumeWaitingExecutions();
        const campaignsActivated = await campaignManager.processScheduledCampaigns();
        return NextResponse.json({
          success: true,
          data: { workflowsResumed, campaignsActivated }
        });
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('[Marketing API] Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

/**
 * DELETE - Remove marketing items
 */
export async function DELETE(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json({ error: 'Type and ID required' }, { status: 400 });
    }

    switch (type) {
      case 'workflow':
        await prisma.automationWorkflow.delete({ where: { id } });
        break;
      
      case 'campaign':
        await prisma.promoCampaign.delete({ where: { id } });
        break;
      
      case 'post':
        await socialMediaManager.cancelPost(id);
        break;
      
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Marketing API] Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// Helper functions

async function getOverview() {
  const [
    workflowStats,
    campaignStats,
    socialStats,
    recentExecutions
  ] = await Promise.all([
    prisma.automationWorkflow.groupBy({
      by: ['status'],
      _count: { status: true }
    }),
    prisma.promoCampaign.groupBy({
      by: ['status'],
      _count: { status: true }
    }),
    socialMediaManager.getStats(),
    prisma.workflowExecution.findMany({
      orderBy: { startedAt: 'desc' },
      take: 10,
      include: {
        workflow: { select: { name: true } }
      }
    })
  ]);

  return NextResponse.json({
    success: true,
    data: {
      workflows: {
        byStatus: workflowStats.reduce((acc, s) => {
          acc[s.status] = s._count.status;
          return acc;
        }, {} as Record<string, number>)
      },
      campaigns: {
        byStatus: campaignStats.reduce((acc, s) => {
          acc[s.status] = s._count.status;
          return acc;
        }, {} as Record<string, number>)
      },
      social: socialStats,
      recentExecutions: recentExecutions.map(e => ({
        id: e.id,
        workflowName: e.workflow.name,
        status: e.status,
        startedAt: e.startedAt,
        completedAt: e.completedAt
      }))
    }
  });
}

async function getWorkflows() {
  const workflows = await prisma.automationWorkflow.findMany({
    include: {
      steps: { orderBy: { order: 'asc' } },
      _count: { select: { executions: true } }
    },
    orderBy: { updatedAt: 'desc' }
  });

  return NextResponse.json({ success: true, data: workflows });
}

async function getCampaigns() {
  const campaigns = await prisma.promoCampaign.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ success: true, data: campaigns });
}

async function getScheduledPosts(searchParams: URLSearchParams) {
  const platform = searchParams.get('platform') as SocialPlatform | null;
  const status = searchParams.get('status') as 'SCHEDULED' | 'PUBLISHED' | 'FAILED' | null;
  
  const posts = await socialMediaManager.getPostHistory({
    platform: platform || undefined,
    status: status || undefined,
    limit: 50
  });

  const stats = await socialMediaManager.getStats();

  return NextResponse.json({ success: true, data: { posts, stats } });
}

async function createWorkflow(body: {
  name: string;
  description?: string;
  trigger: AutomationTrigger;
  config?: Record<string, unknown>;
  steps: Array<{
    type: string;
    config: Record<string, unknown>;
    delayMins?: number;
  }>;
}) {
  const workflow = await prisma.automationWorkflow.create({
    data: {
      name: body.name,
      description: body.description,
      trigger: body.trigger,
      config: (body.config || {}) as Prisma.InputJsonValue,
      status: 'DRAFT',
      steps: {
        create: body.steps.map((step, index) => ({
          order: index,
          type: step.type as 'SEND_EMAIL' | 'WAIT' | 'CONDITION' | 'UPDATE_CONTACT' | 'ADD_TAG' | 'REMOVE_TAG' | 'WEBHOOK' | 'SOCIAL_POST' | 'INTERNAL_NOTE' | 'SEND_SMS',
          config: step.config as Prisma.InputJsonValue,
          delayMins: step.delayMins || 0
        }))
      }
    },
    include: { steps: true }
  });

  return NextResponse.json({ success: true, data: workflow });
}

async function triggerWorkflow(body: {
  trigger: AutomationTrigger;
  email?: string;
  contactId?: string;
  customerId?: string;
  data?: Record<string, unknown>;
}) {
  const executionIds = await automationEngine.handleTrigger({
    trigger: body.trigger,
    email: body.email,
    contactId: body.contactId,
    customerId: body.customerId,
    data: body.data
  });

  return NextResponse.json({
    success: true,
    data: { executionIds, count: executionIds.length }
  });
}

async function createCampaign(body: {
  name: string;
  description?: string;
  type: CampaignType;
  discountCode?: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrderValue?: number;
  maxUses?: number;
  targetAudience?: Record<string, unknown>;
  channels: ('email' | 'sms' | 'social' | 'push')[];
  startDate: string;
  endDate: string;
}) {
  const campaign = await campaignManager.createCampaign({
    name: body.name,
    description: body.description,
    type: body.type,
    discountCode: body.discountCode,
    discountPercent: body.discountPercent,
    discountAmount: body.discountAmount,
    minOrderValue: body.minOrderValue,
    maxUses: body.maxUses,
    targetAudience: body.targetAudience,
    channels: body.channels,
    startDate: new Date(body.startDate),
    endDate: new Date(body.endDate)
  });

  return NextResponse.json({ success: true, data: campaign });
}

async function schedulePost(body: {
  platform: SocialPlatform;
  content: string;
  mediaUrls?: string[];
  hashtags?: string[];
  scheduledAt: string;
  metadata?: Record<string, unknown>;
}) {
  const post = await socialMediaManager.schedulePost({
    platform: body.platform,
    content: body.content,
    mediaUrls: body.mediaUrls,
    hashtags: body.hashtags,
    scheduledAt: new Date(body.scheduledAt),
    metadata: body.metadata
  });

  return NextResponse.json({ success: true, data: post });
}
