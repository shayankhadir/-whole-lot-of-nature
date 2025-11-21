import ScheduledTrendAgent, { AgentConfig } from '@/lib/agents/scheduledTrendAgent';
import MarketingAutomationAgent from '@/lib/agents/marketingAutomationAgent';
import AutomaticDraftPublisher from '@/lib/agents/automaticDraftPublisher';
import BacklinkAgent from '@/lib/agents/backlinkAgent';
import SocialMediaAgent from '@/lib/agents/socialMediaAgent';
import EmailIntelligenceAgent from '@/lib/agents/emailIntelligenceAgent';

export type SupervisableAgent = 'trend' | 'marketing' | 'publisher' | 'backlinks' | 'social' | 'email';

export interface AgentRunResult {
  name: SupervisableAgent;
  success: boolean;
  durationMs: number;
  data?: any;
  error?: string;
}

export interface SupervisorReport {
  success: boolean;
  startedAt: string;
  finishedAt: string;
  results: AgentRunResult[];
}

const DEFAULT_SEQUENCE: SupervisableAgent[] = ['trend', 'marketing', 'publisher', 'backlinks', 'social', 'email'];

class AgentSupervisor {
  listAgents() {
    return [
      { name: 'trend', description: 'Runs the trend scraper → blog generator → WordPress publisher pipeline.' },
      { name: 'marketing', description: 'Performs competitor analysis, generates SEO pages, and deploys landing pages.' },
      { name: 'publisher', description: 'Publishes queued WordPress drafts according to configured cadence.' },
      { name: 'backlinks', description: 'Analyzes competitor backlinks + suggests internal link opportunities.' },
      { name: 'social', description: 'Creates social content calendar entries for Instagram/Facebook/Twitter.' },
      { name: 'email', description: 'Aggregates contacts from WooCommerce + orders and refreshes intent scoring.' },
    ];
  }

  async runAgents(agentNames?: SupervisableAgent[]): Promise<SupervisorReport> {
    const sequence = agentNames && agentNames.length ? agentNames : DEFAULT_SEQUENCE;
    const startedAt = new Date();
    const results: AgentRunResult[] = [];

    for (const name of sequence) {
      const start = Date.now();
      try {
        const data = await this.runAgent(name);
        results.push({ name, success: true, data, durationMs: Date.now() - start });
      } catch (error: any) {
        console.error(`Agent ${name} failed:`, error);
        results.push({
          name,
          success: false,
          error: error.message,
          durationMs: Date.now() - start,
        });
      }
    }

    const finishedAt = new Date();
    return {
      success: results.every((result) => result.success),
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      results,
    };
  }

  private async runAgent(name: SupervisableAgent) {
    switch (name) {
      case 'trend':
        return this.runTrendAgent();
      case 'marketing':
        return this.runMarketingAgent();
      case 'publisher':
        return this.runPublisherAgent();
      case 'backlinks':
        return this.runBacklinkAgent();
      case 'social':
        return this.runSocialAgent();
      case 'email':
        return this.runEmailAgent();
      default:
        throw new Error(`Unsupported agent: ${name}`);
    }
  }

  private async runTrendAgent() {
    const agent = new ScheduledTrendAgent({
      runInterval: 'daily',
      publishStrategy: this.resolvePublishStrategy(),
      maxPostsPerRun: 5,
      wordPressConfig: this.buildWordPressConfig(),
    });
    const run = await agent.executeRun();
    return {
      runId: run.id,
      status: run.status,
      postsGenerated: run.postsGenerated,
      postsPublished: run.postsPublished,
      errors: run.errors,
    };
  }

  private async runMarketingAgent() {
    const agent = new MarketingAutomationAgent();
    return agent.runFullAutomation();
  }

  private async runPublisherAgent() {
    const publisher = new AutomaticDraftPublisher({
      wordPressUrl: process.env.WORDPRESS_SITE_URL || '',
      username: process.env.WORDPRESS_USERNAME || '',
      password: process.env.WORDPRESS_PASSWORD || '',
      publishInterval: parseInt(process.env.PUBLISH_INTERVAL || '120', 10),
      maxPostsPerInterval: parseInt(process.env.MAX_POSTS_PER_INTERVAL || '1', 10),
      enabled: true,
    });

    return publisher.publishNextDrafts();
  }

  private async runBacklinkAgent() {
    const agent = new BacklinkAgent();
    return agent.runAnalysis();
  }

  private async runSocialAgent() {
    const agent = new SocialMediaAgent();
    const posts = await agent.generatePostsFromInsights(
      ['indoor plants', 'self-watering planters', 'terrariums', 'organic fertilizer'],
      [],
      ['instagram', 'facebook', 'twitter'],
      12,
    );
    const calendar = agent.createContentCalendar(posts, new Date());

    return {
      posts: posts.slice(0, 6),
      calendarPreview: calendar.slice(0, 7),
    };
  }

  private async runEmailAgent() {
    const agent = new EmailIntelligenceAgent();
    const [wooSync, ordersRefresh, snapshot] = await Promise.all([
      agent.synchronizeWooCommerceCustomers(75),
      agent.refreshIntentScoresFromOrders(),
      agent.getDashboardSnapshot(),
    ]);

    return {
      wooSync,
      ordersRefresh,
      snapshot,
    };
  }

  private resolvePublishStrategy(): AgentConfig['publishStrategy'] {
    const value = process.env.AGENT_PUBLISH_STRATEGY;
    if (value === 'draft' || value === 'scheduled' || value === 'immediate') {
      return value;
    }
    return 'scheduled';
  }

  private buildWordPressConfig(): AgentConfig['wordPressConfig'] {
    if (!process.env.WORDPRESS_SITE_URL) return undefined;
    return {
      siteUrl: process.env.WORDPRESS_SITE_URL,
      username: process.env.WORDPRESS_USERNAME || '',
      password: process.env.WORDPRESS_PASSWORD || '',
    };
  }
}

export default AgentSupervisor;
