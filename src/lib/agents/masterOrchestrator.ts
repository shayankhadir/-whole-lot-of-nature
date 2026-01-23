/**
 * Master Agent Orchestrator - Central Command for All Marketing Agents
 * Whole Lot of Nature - Premium Plant Store
 * 
 * This is the main entry point for the entire agent system.
 * It coordinates all specialized agents and provides unified access.
 */

import { SEOResearchAgent, seoResearchAgent, BulkSEOReport, ProductSEOAnalysis } from './seoResearchAgent';
import { LeadIntelligenceAgent, leadIntelligenceAgent, Lead, LeadGenReport } from './leadIntelligenceAgent';
import { GrowthEngineAgent, growthEngineAgent, GrowthReport, ContentPlan, GrowthCampaign } from './growthEngineAgent';
import SocialMediaAgent from './socialMediaAgent';
import BacklinkAgent from './backlinkAgent';
import CompetitorAnalysisAgent from './competitorAnalysisAgent';
import MarketingAutomationAgent from './marketingAutomationAgent';
import EmailIntelligenceAgent from './emailIntelligenceAgent';
import { aiService } from '@/lib/ai/aiService';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface AgentStatus {
  name: string;
  status: 'ready' | 'running' | 'error' | 'disabled';
  lastRun?: Date;
  lastResult?: 'success' | 'partial' | 'failed';
  errorMessage?: string;
}

export interface OrchestratorConfig {
  enabledAgents: AgentName[];
  runMode: 'sequential' | 'parallel';
  logLevel: 'minimal' | 'normal' | 'verbose';
  autoRetry: boolean;
  maxRetries: number;
}

export type AgentName = 
  | 'seo'
  | 'leadGen'
  | 'growth'
  | 'social'
  | 'backlink'
  | 'competitor'
  | 'marketing'
  | 'email';

export interface AgentTask {
  id: string;
  agent: AgentName;
  action: string;
  params?: Record<string, unknown>;
  priority: 'low' | 'normal' | 'high' | 'critical';
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: unknown;
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface DashboardData {
  systemStatus: 'healthy' | 'warning' | 'error';
  agentStatuses: AgentStatus[];
  quickStats: {
    totalLeads: number;
    hotLeads: number;
    seoScore: number;
    activeCampaigns: number;
    pendingTasks: number;
  };
  recentTasks: AgentTask[];
  recommendations: string[];
  aiServiceStatus: {
    configured: boolean;
    provider: string | null;
  };
}

export interface FullSystemReport {
  generatedAt: Date;
  systemHealth: 'healthy' | 'warning' | 'error';
  
  // Agent reports
  seoReport: BulkSEOReport | null;
  leadReport: LeadGenReport | null;
  growthReport: GrowthReport | null;
  
  // Aggregated insights
  topPriorities: string[];
  quickWins: string[];
  weeklyGoals: string[];
  
  // AI summary
  executiveSummary: string;
}

// ============================================================================
// MASTER ORCHESTRATOR CLASS
// ============================================================================

export class MasterAgentOrchestrator {
  private config: OrchestratorConfig;
  private agentStatuses: Map<AgentName, AgentStatus> = new Map();
  private taskQueue: AgentTask[] = [];
  private taskHistory: AgentTask[] = [];

  // Agent instances
  private seoAgent: SEOResearchAgent;
  private leadAgent: LeadIntelligenceAgent;
  private growthAgent: GrowthEngineAgent;
  private socialAgent: SocialMediaAgent;
  private backlinkAgent: BacklinkAgent;
  private competitorAgent: CompetitorAnalysisAgent;
  private marketingAgent: MarketingAutomationAgent;
  private emailAgent: EmailIntelligenceAgent;

  constructor(config?: Partial<OrchestratorConfig>) {
    this.config = {
      enabledAgents: ['seo', 'leadGen', 'growth', 'social', 'backlink', 'competitor', 'marketing', 'email'],
      runMode: 'sequential',
      logLevel: 'normal',
      autoRetry: true,
      maxRetries: 2,
      ...config,
    };

    // Initialize agents
    this.seoAgent = seoResearchAgent;
    this.leadAgent = leadIntelligenceAgent;
    this.growthAgent = growthEngineAgent;
    this.socialAgent = new SocialMediaAgent();
    this.backlinkAgent = new BacklinkAgent();
    this.competitorAgent = new CompetitorAnalysisAgent();
    this.marketingAgent = new MarketingAutomationAgent();
    this.emailAgent = new EmailIntelligenceAgent();

    // Initialize agent statuses
    this.initializeAgentStatuses();

    this.log('🤖 Master Agent Orchestrator initialized');
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  private initializeAgentStatuses(): void {
    const agents: AgentName[] = ['seo', 'leadGen', 'growth', 'social', 'backlink', 'competitor', 'marketing', 'email'];
    
    agents.forEach(agent => {
      this.agentStatuses.set(agent, {
        name: this.getAgentDisplayName(agent),
        status: this.config.enabledAgents.includes(agent) ? 'ready' : 'disabled',
      });
    });
  }

  private getAgentDisplayName(agent: AgentName): string {
    const names: Record<AgentName, string> = {
      seo: 'SEO Research Agent',
      leadGen: 'Lead Intelligence Agent',
      growth: 'Growth Engine Agent',
      social: 'Social Media Agent',
      backlink: 'Backlink Agent',
      competitor: 'Competitor Analysis Agent',
      marketing: 'Marketing Automation Agent',
      email: 'Email Intelligence Agent',
    };
    return names[agent];
  }

  // ============================================================================
  // MAIN OPERATIONS
  // ============================================================================

  /**
   * Run a full system diagnostic and generate comprehensive report
   */
  async runFullSystemAnalysis(): Promise<FullSystemReport> {
    this.log('🚀 ORCHESTRATOR: Starting full system analysis...\n');
    const startTime = Date.now();

    let seoReport: BulkSEOReport | null = null;
    let leadReport: LeadGenReport | null = null;
    let growthReport: GrowthReport | null = null;
    let systemHealth: FullSystemReport['systemHealth'] = 'healthy';

    // Run SEO Analysis
    if (this.isAgentEnabled('seo')) {
      try {
        this.updateAgentStatus('seo', 'running');
        seoReport = await this.seoAgent.analyzeBulkProducts(25);
        this.updateAgentStatus('seo', 'ready', 'success');
      } catch (error) {
        this.updateAgentStatus('seo', 'error', 'failed', String(error));
        systemHealth = 'warning';
      }
    }

    // Run Lead Analysis
    if (this.isAgentEnabled('leadGen')) {
      try {
        this.updateAgentStatus('leadGen', 'running');
        await this.leadAgent.syncWooCommerceCustomers(100);
        leadReport = await this.leadAgent.generateReport();
        this.updateAgentStatus('leadGen', 'ready', 'success');
      } catch (error) {
        this.updateAgentStatus('leadGen', 'error', 'failed', String(error));
        systemHealth = 'warning';
      }
    }

    // Run Growth Analysis
    if (this.isAgentEnabled('growth')) {
      try {
        this.updateAgentStatus('growth', 'running');
        growthReport = await this.growthAgent.runFullGrowthAnalysis();
        this.updateAgentStatus('growth', 'ready', 'success');
      } catch (error) {
        this.updateAgentStatus('growth', 'error', 'failed', String(error));
        systemHealth = 'warning';
      }
    }

    // Generate aggregated insights
    const topPriorities = this.generateTopPriorities(seoReport, leadReport, growthReport);
    const quickWins = this.generateQuickWins(seoReport, leadReport, growthReport);
    const weeklyGoals = this.generateWeeklyGoals(seoReport, leadReport, growthReport);

    // Generate AI executive summary
    const executiveSummary = await this.generateExecutiveSummary(
      seoReport, 
      leadReport, 
      growthReport,
      topPriorities
    );

    const duration = Math.round((Date.now() - startTime) / 1000);
    this.log(`\n✅ ORCHESTRATOR: Full analysis complete in ${duration}s`);

    return {
      generatedAt: new Date(),
      systemHealth,
      seoReport,
      leadReport,
      growthReport,
      topPriorities,
      quickWins,
      weeklyGoals,
      executiveSummary,
    };
  }

  /**
   * Run quick daily diagnostics
   */
  async runDailyDiagnostics(): Promise<{
    date: Date;
    health: 'healthy' | 'warning' | 'error';
    hotLeads: Lead[];
    urgentActions: string[];
    todaysTasks: string[];
    aiSuggestion: string;
  }> {
    this.log('☀️ ORCHESTRATOR: Running daily diagnostics...');

    // Get hot leads
    const hotLeads = this.leadAgent.getHotLeadsForAction().slice(0, 5);

    // Run growth daily check
    const growthCheck = await this.growthAgent.runDailyCheck();

    // Get AI suggestion for the day
    const aiSuggestion = await this.generateDailySuggestion(hotLeads, growthCheck.urgentActions);

    // Determine overall health
    let health: 'healthy' | 'warning' | 'error' = 'healthy';
    if (growthCheck.urgentActions.length > 3) health = 'warning';
    if (this.hasErrorAgents()) health = 'error';

    return {
      date: new Date(),
      health,
      hotLeads,
      urgentActions: growthCheck.urgentActions,
      todaysTasks: growthCheck.todaysTasks,
      aiSuggestion,
    };
  }

  /**
   * Get dashboard data for the admin panel
   */
  async getDashboardData(): Promise<DashboardData> {
    this.log('📊 ORCHESTRATOR: Generating dashboard data...');

    const leads = this.leadAgent.getAllLeads();
    const hotLeads = leads.filter(l => l.temperature === 'hot');
    const activeCampaigns = this.growthAgent.getActiveCampaigns();

    // Determine system status
    let systemStatus: DashboardData['systemStatus'] = 'healthy';
    if (this.hasErrorAgents()) systemStatus = 'error';
    else if (this.hasWarningConditions(leads)) systemStatus = 'warning';

    // Get AI service status
    const aiConfigured = aiService.isConfigured();

    return {
      systemStatus,
      agentStatuses: Array.from(this.agentStatuses.values()),
      quickStats: {
        totalLeads: leads.length,
        hotLeads: hotLeads.length,
        seoScore: 0, // Will be updated after SEO run
        activeCampaigns: activeCampaigns.length,
        pendingTasks: this.taskQueue.filter(t => t.status === 'pending').length,
      },
      recentTasks: this.taskHistory.slice(-10).reverse(),
      recommendations: this.generateQuickRecommendations(leads, hotLeads.length),
      aiServiceStatus: {
        configured: aiConfigured,
        provider: aiConfigured ? 'Groq/Together/Qwen' : null,
      },
    };
  }

  // ============================================================================
  // INDIVIDUAL AGENT COMMANDS
  // ============================================================================

  /**
   * Run SEO analysis for a specific product
   */
  async analyzeProductSEO(productId: number): Promise<ProductSEOAnalysis | null> {
    const task = this.createTask('seo', 'analyzeProduct', { productId }, 'normal');
    
    try {
      this.updateTaskStatus(task.id, 'running');
      // In a real implementation, would fetch single product
      // For now, run bulk and find the product
      const report = await this.seoAgent.analyzeBulkProducts(50);
      const analysis = report.productsAnalyzed.find(p => p.productId === productId) || null;
      this.updateTaskStatus(task.id, 'completed', analysis);
      return analysis;
    } catch (error) {
      this.updateTaskStatus(task.id, 'failed', null, String(error));
      return null;
    }
  }

  /**
   * Capture a new lead
   */
  async captureLead(data: {
    email: string;
    firstName?: string;
    lastName?: string;
    source: string;
    tags?: string[];
  }): Promise<Lead> {
    const task = this.createTask('leadGen', 'captureLead', data, 'high');
    
    try {
      this.updateTaskStatus(task.id, 'running');
      const lead = await this.leadAgent.captureLead({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        source: data.source as any,
        tags: data.tags,
      });
      this.updateTaskStatus(task.id, 'completed', lead);
      return lead;
    } catch (error) {
      this.updateTaskStatus(task.id, 'failed', null, String(error));
      throw error;
    }
  }

  /**
   * Generate content plan
   */
  async generateContentPlan(weeks: number = 4): Promise<ContentPlan[]> {
    const task = this.createTask('growth', 'generateContentPlan', { weeks }, 'normal');
    
    try {
      this.updateTaskStatus(task.id, 'running');
      const plan = await this.growthAgent.generateContentPlan(weeks);
      this.updateTaskStatus(task.id, 'completed', plan);
      return plan;
    } catch (error) {
      this.updateTaskStatus(task.id, 'failed', null, String(error));
      throw error;
    }
  }

  /**
   * Create a growth campaign
   */
  createGrowthCampaign(config: Parameters<typeof growthEngineAgent.createCampaign>[0]): GrowthCampaign {
    const campaign = this.growthAgent.createCampaign(config);
    this.log(`🎯 Created campaign: ${campaign.name}`);
    return campaign;
  }

  /**
   * Run competitor analysis
   */
  async runCompetitorAnalysis(competitorUrls?: string[]): Promise<unknown> {
    const task = this.createTask('competitor', 'analyze', { urls: competitorUrls }, 'normal');
    
    try {
      this.updateTaskStatus(task.id, 'running');
      // Would run actual analysis
      const result = { analyzed: true, competitors: competitorUrls || [] };
      this.updateTaskStatus(task.id, 'completed', result);
      return result;
    } catch (error) {
      this.updateTaskStatus(task.id, 'failed', null, String(error));
      throw error;
    }
  }

  /**
   * Generate social media posts
   */
  async generateSocialPosts(config: {
    keywords: string[];
    platforms: string[];
    count: number;
  }): Promise<unknown[]> {
    const task = this.createTask('social', 'generatePosts', config, 'normal');
    
    try {
      this.updateTaskStatus(task.id, 'running');
      const posts = await this.socialAgent.generatePostsFromInsights(
        config.keywords,
        [],
        config.platforms,
        config.count
      );
      this.updateTaskStatus(task.id, 'completed', posts);
      return posts;
    } catch (error) {
      this.updateTaskStatus(task.id, 'failed', null, String(error));
      throw error;
    }
  }

  /**
   * Sync WooCommerce customers to leads
   */
  async syncWooCommerceLeads(limit: number = 100): Promise<{ imported: number; updated: number }> {
    const task = this.createTask('leadGen', 'syncWooCommerce', { limit }, 'high');
    
    try {
      this.updateTaskStatus(task.id, 'running');
      const result = await this.leadAgent.syncWooCommerceCustomers(limit);
      this.updateTaskStatus(task.id, 'completed', result);
      return result;
    } catch (error) {
      this.updateTaskStatus(task.id, 'failed', null, String(error));
      throw error;
    }
  }

  // ============================================================================
  // BATCH OPERATIONS
  // ============================================================================

  /**
   * Run all agents in sequence
   */
  async runAllAgents(): Promise<Record<AgentName, { success: boolean; result?: unknown; error?: string }>> {
    this.log('🔄 ORCHESTRATOR: Running all enabled agents...\n');
    
    const results: Record<string, { success: boolean; result?: unknown; error?: string }> = {};
    
    for (const agent of this.config.enabledAgents) {
      this.log(`  Running ${this.getAgentDisplayName(agent)}...`);
      
      try {
        this.updateAgentStatus(agent, 'running');
        const result = await this.runAgent(agent);
        results[agent] = { success: true, result };
        this.updateAgentStatus(agent, 'ready', 'success');
        this.log(`  ✅ ${this.getAgentDisplayName(agent)} completed`);
      } catch (error) {
        results[agent] = { success: false, error: String(error) };
        this.updateAgentStatus(agent, 'error', 'failed', String(error));
        this.log(`  ❌ ${this.getAgentDisplayName(agent)} failed: ${error}`);
      }
    }

    return results as Record<AgentName, { success: boolean; result?: unknown; error?: string }>;
  }

  private async runAgent(agent: AgentName): Promise<unknown> {
    switch (agent) {
      case 'seo':
        return this.seoAgent.analyzeBulkProducts(20);
      case 'leadGen':
        await this.leadAgent.syncWooCommerceCustomers(50);
        return this.leadAgent.generateReport();
      case 'growth':
        return this.growthAgent.runFullGrowthAnalysis();
      case 'social':
        return this.socialAgent.generatePostsFromInsights(
          ['indoor plants', 'plant care'],
          [],
          ['instagram', 'facebook'],
          10
        );
      case 'backlink':
        return this.backlinkAgent.runAnalysis();
      case 'competitor':
        return { analyzed: true }; // Placeholder
      case 'marketing':
        return this.marketingAgent.runFullAutomation();
      case 'email':
        return this.emailAgent.getDashboardSnapshot();
      default:
        throw new Error(`Unknown agent: ${agent}`);
    }
  }

  // ============================================================================
  // AI GENERATION
  // ============================================================================

  private async generateExecutiveSummary(
    seoReport: BulkSEOReport | null,
    leadReport: LeadGenReport | null,
    growthReport: GrowthReport | null,
    topPriorities: string[]
  ): Promise<string> {
    if (!aiService.isConfigured()) {
      return this.generateBasicSummary(seoReport, leadReport, growthReport);
    }

    try {
      const prompt = `You are the CMO of "Whole Lot of Nature", a premium plant store in Bangalore. Write a brief executive summary (3-4 sentences) of the current marketing status.

Data:
- SEO Health: ${seoReport ? `${seoReport.averageScore}/100, ${seoReport.criticalIssues} critical issues` : 'Not analyzed'}
- Leads: ${leadReport ? `${leadReport.totalLeads} total, ${leadReport.hotLeads} hot, ${leadReport.newLeadsThisWeek} new this week` : 'Not analyzed'}
- Growth: ${growthReport ? `Conversion: ${growthReport.metrics.conversionRate}%, AOV: ₹${growthReport.metrics.averageOrderValue}` : 'Not analyzed'}

Top Priorities:
${topPriorities.slice(0, 3).join('\n')}

Write in first person ("We..."). Focus on actionable insights and key metrics. Be concise and executive-level.`;

      return await aiService.complete(prompt, {
        temperature: 0.6,
        maxTokens: 200,
        systemPrompt: 'You are a marketing executive. Be concise and data-driven.',
      });
    } catch {
      return this.generateBasicSummary(seoReport, leadReport, growthReport);
    }
  }

  private generateBasicSummary(
    seoReport: BulkSEOReport | null,
    leadReport: LeadGenReport | null,
    growthReport: GrowthReport | null
  ): string {
    const parts: string[] = [];

    if (seoReport) {
      parts.push(`SEO health is at ${seoReport.averageScore}% with ${seoReport.criticalIssues} critical issues to address.`);
    }

    if (leadReport) {
      parts.push(`We have ${leadReport.totalLeads} leads in the pipeline with ${leadReport.hotLeads} ready for conversion.`);
    }

    if (growthReport) {
      parts.push(`Current conversion rate is ${growthReport.metrics.conversionRate}% with an AOV of ₹${growthReport.metrics.averageOrderValue}.`);
    }

    if (parts.length === 0) {
      return 'Run a full system analysis to generate insights.';
    }

    return parts.join(' ') + ' Focus on converting hot leads and fixing SEO issues for quick wins.';
  }

  private async generateDailySuggestion(hotLeads: Lead[], urgentActions: string[]): Promise<string> {
    if (!aiService.isConfigured()) {
      if (hotLeads.length > 0) {
        return `Focus on converting ${hotLeads.length} hot leads today. Personalized outreach can make the difference!`;
      }
      return 'Review your content calendar and ensure all scheduled posts are ready for publishing.';
    }

    try {
      const prompt = `As a marketing coach, give one specific, actionable suggestion for today.

Context:
- Hot leads ready to convert: ${hotLeads.length}
- Urgent actions: ${urgentActions.slice(0, 3).join(', ') || 'None'}

Give ONE specific action (1-2 sentences) they should do TODAY. Be practical and motivating.`;

      return await aiService.complete(prompt, {
        temperature: 0.7,
        maxTokens: 100,
      });
    } catch {
      return hotLeads.length > 0 
        ? `Focus on converting ${hotLeads.length} hot leads today!`
        : 'Review and optimize your best-performing product pages.';
    }
  }

  // ============================================================================
  // INSIGHTS GENERATION
  // ============================================================================

  private generateTopPriorities(
    seoReport: BulkSEOReport | null,
    leadReport: LeadGenReport | null,
    growthReport: GrowthReport | null
  ): string[] {
    const priorities: string[] = [];

    // Hot leads are always top priority
    if (leadReport && leadReport.hotLeads > 0) {
      priorities.push(`🔥 CONVERT: ${leadReport.hotLeads} hot leads ready for conversion`);
    }

    // Critical SEO issues
    if (seoReport && seoReport.criticalIssues > 5) {
      priorities.push(`🔧 FIX: ${seoReport.criticalIssues} critical SEO issues hurting rankings`);
    }

    // Cart abandonment
    const cartAbandoners = this.leadAgent.getLeadsBySegment('cart_abandoner').length;
    if (cartAbandoners > 3) {
      priorities.push(`🛒 RECOVER: ${cartAbandoners} abandoned carts waiting for recovery`);
    }

    // Growth opportunities
    if (growthReport && growthReport.opportunities.length > 0) {
      const topOpp = growthReport.opportunities[0];
      priorities.push(`📈 GROW: ${topOpp.title}`);
    }

    // Content
    priorities.push('📝 PUBLISH: Maintain consistent content for SEO momentum');

    return priorities.slice(0, 5);
  }

  private generateQuickWins(
    seoReport: BulkSEOReport | null,
    leadReport: LeadGenReport | null,
    growthReport: GrowthReport | null
  ): string[] {
    const wins: string[] = [];

    if (leadReport && leadReport.hotLeads > 0) {
      wins.push('Send personalized discount to hot leads (5 min)');
    }

    if (seoReport && seoReport.averageScore < 70) {
      wins.push('Add meta descriptions to top 5 products (15 min)');
    }

    wins.push('Schedule this week\'s social posts (10 min)');
    wins.push('Reply to all pending comments/DMs (10 min)');
    wins.push('Set up abandoned cart email automation (20 min)');

    return wins.slice(0, 5);
  }

  private generateWeeklyGoals(
    seoReport: BulkSEOReport | null,
    leadReport: LeadGenReport | null,
    growthReport: GrowthReport | null
  ): string[] {
    return [
      '📊 Improve SEO score by 5 points',
      '👥 Convert at least 3 hot leads to customers',
      '📝 Publish 2 blog posts optimized for target keywords',
      '📱 Post daily on Instagram with 15+ hashtags',
      '📧 Send weekly newsletter with 25%+ open rate',
    ];
  }

  private generateQuickRecommendations(leads: Lead[], hotLeadsCount: number): string[] {
    const recs: string[] = [];

    if (hotLeadsCount > 0) {
      recs.push(`${hotLeadsCount} hot leads need immediate follow-up`);
    }

    const cartAbandoners = leads.filter(l => l.segments.includes('cart_abandoner')).length;
    if (cartAbandoners > 0) {
      recs.push(`${cartAbandoners} cart abandoners - send recovery emails`);
    }

    recs.push('Review and respond to all social media comments');
    recs.push('Check inventory for low stock best-sellers');

    return recs.slice(0, 4);
  }

  // ============================================================================
  // TASK MANAGEMENT
  // ============================================================================

  private createTask(
    agent: AgentName,
    action: string,
    params: Record<string, unknown> | undefined,
    priority: AgentTask['priority']
  ): AgentTask {
    const task: AgentTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      agent,
      action,
      params,
      priority,
      status: 'pending',
      createdAt: new Date(),
    };

    this.taskQueue.push(task);
    return task;
  }

  private updateTaskStatus(
    taskId: string,
    status: AgentTask['status'],
    result?: unknown,
    error?: string
  ): void {
    const task = this.taskQueue.find(t => t.id === taskId);
    if (!task) return;

    task.status = status;
    if (status === 'running') task.startedAt = new Date();
    if (status === 'completed' || status === 'failed') {
      task.completedAt = new Date();
      task.result = result;
      task.error = error;
      
      // Move to history
      this.taskHistory.push(task);
      this.taskQueue = this.taskQueue.filter(t => t.id !== taskId);
      
      // Keep history manageable
      if (this.taskHistory.length > 100) {
        this.taskHistory = this.taskHistory.slice(-100);
      }
    }
  }

  // ============================================================================
  // STATUS MANAGEMENT
  // ============================================================================

  private updateAgentStatus(
    agent: AgentName,
    status: AgentStatus['status'],
    lastResult?: AgentStatus['lastResult'],
    errorMessage?: string
  ): void {
    const current = this.agentStatuses.get(agent);
    if (!current) return;

    this.agentStatuses.set(agent, {
      ...current,
      status,
      lastRun: new Date(),
      lastResult,
      errorMessage,
    });
  }

  private isAgentEnabled(agent: AgentName): boolean {
    return this.config.enabledAgents.includes(agent);
  }

  private hasErrorAgents(): boolean {
    return Array.from(this.agentStatuses.values()).some(s => s.status === 'error');
  }

  private hasWarningConditions(leads: Lead[]): boolean {
    // Warning if many cold leads or inactive hot leads
    const coldPercentage = leads.filter(l => l.temperature === 'cold').length / (leads.length || 1);
    return coldPercentage > 0.7;
  }

  // ============================================================================
  // UTILITY
  // ============================================================================

  private log(message: string): void {
    if (this.config.logLevel !== 'minimal') {
      console.log(message);
    }
  }

  /**
   * Get all agent statuses
   */
  getAgentStatuses(): AgentStatus[] {
    return Array.from(this.agentStatuses.values());
  }

  /**
   * Get pending tasks
   */
  getPendingTasks(): AgentTask[] {
    return this.taskQueue.filter(t => t.status === 'pending');
  }

  /**
   * Get task history
   */
  getTaskHistory(limit: number = 20): AgentTask[] {
    return this.taskHistory.slice(-limit).reverse();
  }

  /**
   * Enable/disable an agent
   */
  setAgentEnabled(agent: AgentName, enabled: boolean): void {
    if (enabled && !this.config.enabledAgents.includes(agent)) {
      this.config.enabledAgents.push(agent);
      this.updateAgentStatus(agent, 'ready');
    } else if (!enabled) {
      this.config.enabledAgents = this.config.enabledAgents.filter(a => a !== agent);
      this.updateAgentStatus(agent, 'disabled');
    }
  }

  /**
   * Get direct access to specific agents
   */
  getAgent(name: 'seo'): SEOResearchAgent;
  getAgent(name: 'leadGen'): LeadIntelligenceAgent;
  getAgent(name: 'growth'): GrowthEngineAgent;
  getAgent(name: 'social'): SocialMediaAgent;
  getAgent(name: 'backlink'): BacklinkAgent;
  getAgent(name: 'competitor'): CompetitorAnalysisAgent;
  getAgent(name: 'marketing'): MarketingAutomationAgent;
  getAgent(name: 'email'): EmailIntelligenceAgent;
  getAgent(name: AgentName): unknown {
    switch (name) {
      case 'seo': return this.seoAgent;
      case 'leadGen': return this.leadAgent;
      case 'growth': return this.growthAgent;
      case 'social': return this.socialAgent;
      case 'backlink': return this.backlinkAgent;
      case 'competitor': return this.competitorAgent;
      case 'marketing': return this.marketingAgent;
      case 'email': return this.emailAgent;
    }
  }
}

// Export singleton instance
export const masterOrchestrator = new MasterAgentOrchestrator();
export default MasterAgentOrchestrator;
