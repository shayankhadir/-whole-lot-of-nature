/**
 * Agent Logger Service
 * Centralized logging for all admin agents/bots
 */

import { prisma } from '@/lib/prisma';

export type AgentName = 
  | 'growth'
  | 'trends'
  | 'content'
  | 'email'
  | 'seo'
  | 'inventory'
  | 'design-audit'
  | 'design-fix'
  | 'plantsy'
  | 'backlink'
  | 'social'
  | 'competitor'
  | 'landing-page'
  | 'marketing'
  | 'loyalty';

export type AgentAction = 
  | 'run_started'
  | 'run_completed'
  | 'run_error'
  | 'item_created'
  | 'item_updated'
  | 'item_deleted'
  | 'email_sent'
  | 'api_call'
  | 'sync_started'
  | 'sync_completed';

export interface LogEntry {
  agent: AgentName;
  action: AgentAction;
  status: 'RUNNING' | 'SUCCESS' | 'ERROR' | 'SKIPPED';
  message?: string;
  metadata?: Record<string, unknown>;
  duration?: number;
}

export interface AgentRun {
  id: string;
  startTime: number;
  agent: AgentName;
}

// Track active runs
const activeRuns = new Map<string, AgentRun>();

/**
 * Start an agent run - returns run ID for tracking
 */
export async function startAgentRun(agent: AgentName, message?: string): Promise<string> {
  try {
    const log = await prisma.agentLog.create({
      data: {
        agent,
        action: 'run_started',
        status: 'RUNNING',
        message: message || `${agent} started`
      }
    });
    
    activeRuns.set(log.id, {
      id: log.id,
      startTime: Date.now(),
      agent
    });
    
    return log.id;
  } catch (error) {
    console.error('[AgentLogger] Failed to start run:', error);
    return `temp-${Date.now()}`;
  }
}

/**
 * Complete an agent run
 */
export async function completeAgentRun(
  runId: string, 
  success: boolean, 
  message?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    const run = activeRuns.get(runId);
    const duration = run ? Date.now() - run.startTime : undefined;
    
    await prisma.agentLog.create({
      data: {
        agent: run?.agent || 'unknown',
        action: success ? 'run_completed' : 'run_error',
        status: success ? 'SUCCESS' : 'ERROR',
        message,
        metadata: metadata ? JSON.stringify(metadata) : undefined,
        duration
      }
    });
    
    activeRuns.delete(runId);
  } catch (error) {
    console.error('[AgentLogger] Failed to complete run:', error);
  }
}

/**
 * Log a specific agent action
 */
export async function logAgentAction(entry: LogEntry): Promise<void> {
  try {
    await prisma.agentLog.create({
      data: {
        agent: entry.agent,
        action: entry.action,
        status: entry.status,
        message: entry.message,
        metadata: entry.metadata ? JSON.stringify(entry.metadata) : undefined,
        duration: entry.duration
      }
    });
  } catch (error) {
    console.error('[AgentLogger] Failed to log action:', error);
  }
}

/**
 * Get recent logs for an agent
 */
export async function getAgentLogs(
  agent?: AgentName,
  limit: number = 50
): Promise<Array<{
  id: string;
  agent: string;
  action: string;
  status: string;
  message: string | null;
  metadata: unknown;
  duration: number | null;
  createdAt: Date;
}>> {
  try {
    return await prisma.agentLog.findMany({
      where: agent ? { agent } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  } catch (error) {
    console.error('[AgentLogger] Failed to get logs:', error);
    return [];
  }
}

/**
 * Get agent statistics
 */
export async function getAgentStats(): Promise<{
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  byAgent: Record<string, { total: number; success: number; error: number }>;
  last24Hours: number;
  last7Days: number;
}> {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const [
      total,
      successful,
      failed,
      agentGroups,
      last24h,
      last7d
    ] = await Promise.all([
      prisma.agentLog.count({ where: { action: { contains: 'run' } } }),
      prisma.agentLog.count({ where: { status: 'SUCCESS' } }),
      prisma.agentLog.count({ where: { status: 'ERROR' } }),
      prisma.agentLog.groupBy({
        by: ['agent', 'status'],
        _count: { agent: true }
      }),
      prisma.agentLog.count({ where: { createdAt: { gte: oneDayAgo } } }),
      prisma.agentLog.count({ where: { createdAt: { gte: sevenDaysAgo } } })
    ]);
    
    // Process agent groups
    const byAgent: Record<string, { total: number; success: number; error: number }> = {};
    agentGroups.forEach(group => {
      if (!byAgent[group.agent]) {
        byAgent[group.agent] = { total: 0, success: 0, error: 0 };
      }
      byAgent[group.agent].total += group._count.agent;
      if (group.status === 'SUCCESS') {
        byAgent[group.agent].success += group._count.agent;
      } else if (group.status === 'ERROR') {
        byAgent[group.agent].error += group._count.agent;
      }
    });
    
    return {
      totalRuns: total,
      successfulRuns: successful,
      failedRuns: failed,
      byAgent,
      last24Hours: last24h,
      last7Days: last7d
    };
  } catch (error) {
    console.error('[AgentLogger] Failed to get stats:', error);
    return {
      totalRuns: 0,
      successfulRuns: 0,
      failedRuns: 0,
      byAgent: {},
      last24Hours: 0,
      last7Days: 0
    };
  }
}

/**
 * Clear old logs (older than 30 days)
 */
export async function clearOldLogs(): Promise<number> {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const result = await prisma.agentLog.deleteMany({
      where: { createdAt: { lt: thirtyDaysAgo } }
    });
    return result.count;
  } catch (error) {
    console.error('[AgentLogger] Failed to clear old logs:', error);
    return 0;
  }
}
