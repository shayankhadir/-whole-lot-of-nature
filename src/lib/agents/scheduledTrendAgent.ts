/**
 * Scheduled Trend Agent
 * Runs automated trend scraping, blog generation, and publishing
 */

import TrendScraper, { TrendData } from './trendScraper';
import BlogPostGenerator, { GeneratedBlogPost } from './blogPostGenerator';
import WordPressPublisher from './wordPressPublisher';

export interface AgentConfig {
  runInterval: 'daily' | 'weekly' | 'twice-weekly';
  publishStrategy: 'draft' | 'scheduled' | 'immediate';
  maxPostsPerRun: number;
  wordPressConfig?: {
    siteUrl: string;
    username: string;
    password: string;
  };
  categories?: string[];
  maxEngagementAge?: number; // days
}

export interface AgentRun {
  id: string;
  timestamp: Date;
  trendsCollected: number;
  postsGenerated: number;
  postsPublished: number;
  errors: string[];
  status: 'running' | 'completed' | 'failed';
  results: {
    trends: TrendData[];
    posts: GeneratedBlogPost[];
    publishResults: Array<{
      postId: number;
      success: boolean;
      url?: string;
    }>;
  };
}

const DEFAULT_CONFIG: AgentConfig = {
  runInterval: 'twice-weekly',
  publishStrategy: 'scheduled',
  maxPostsPerRun: 5,
  categories: ['Gardening', 'Plant Care', 'Sustainability'],
  maxEngagementAge: 7, // Only trends from last 7 days
};

class ScheduledTrendAgent {
  private config: AgentConfig;
  private trendScraper: TrendScraper;
  private blogGenerator: BlogPostGenerator;
  private publisher?: WordPressPublisher;
  private runs: AgentRun[] = [];

  constructor(config: Partial<AgentConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.trendScraper = new TrendScraper();
    this.blogGenerator = new BlogPostGenerator();

    if (this.config.wordPressConfig) {
      this.publisher = new WordPressPublisher(this.config.wordPressConfig);
    }
  }

  /**
   * Execute a complete agent run
   */
  async executeRun(): Promise<AgentRun> {
    const runId = `run-${Date.now()}`;
    const run: AgentRun = {
      id: runId,
      timestamp: new Date(),
      trendsCollected: 0,
      postsGenerated: 0,
      postsPublished: 0,
      errors: [],
      status: 'running',
      results: {
        trends: [],
        posts: [],
        publishResults: [],
      },
    };

    try {
      console.log(`[${runId}] Starting trend agent run...`);

      // Step 1: Scrape trends
      console.log(`[${runId}] Step 1: Collecting trends...`);
      run.results.trends = await this.trendScraper.getAllTrends();
      run.trendsCollected = run.results.trends.length;
      console.log(`[${runId}] ✓ Collected ${run.trendsCollected} trends`);

      // Filter out old trends
      const recentTrends = this.filterRecentTrends(run.results.trends);
      console.log(`[${runId}] Filtered to ${recentTrends.length} recent trends`);

      // Step 2: Generate blog posts from trends
      console.log(`[${runId}] Step 2: Generating blog posts...`);
      const trendsSample = recentTrends.slice(0, this.config.maxPostsPerRun || 5);

      for (const trend of trendsSample) {
        try {
          const post = await this.blogGenerator.generateFromTrend(trend);
          run.results.posts.push(post);
          console.log(`[${runId}] ✓ Generated: "${post.title}"`);
        } catch (error) {
          const err = error as Error;
          run.errors.push(`Failed to generate post from trend: ${err.message}`);
          console.error(`[${runId}] ✗ Error generating post:`, err.message);
        }
      }

      run.postsGenerated = run.results.posts.length;
      console.log(`[${runId}] ✓ Generated ${run.postsGenerated} posts`);

      // Step 3: Publish posts to WordPress
      if (this.publisher && this.config.publishStrategy !== 'draft') {
        console.log(`[${runId}] Step 3: Publishing to WordPress...`);

        // Verify WordPress connection
        const isConnected = await this.publisher.verifyConnection();
        if (!isConnected) {
          throw new Error('WordPress connection failed');
        }

        for (const post of run.results.posts) {
          try {
            let result;

            if (this.config.publishStrategy === 'scheduled') {
              // Schedule for next available slot
              const scheduleDate = this.getNextPublishSlot();
              result = await this.publisher.schedulePost(post, scheduleDate);
              console.log(`[${runId}] ✓ Scheduled: "${post.title}" for ${scheduleDate.toLocaleDateString()}`);
            } else {
              // Publish immediately
              result = await this.publisher.publishPost(post);
              console.log(`[${runId}] ✓ Published: "${post.title}"`);
            }

            if (result.success) {
              run.results.publishResults.push({
                postId: result.postId || 0,
                success: true,
                url: result.url,
              });
              run.postsPublished++;
            } else {
              run.errors.push(`Failed to publish "${post.title}": ${result.error}`);
              console.error(`[${runId}] ✗ Publish error:`, result.error);
            }
          } catch (error) {
            const err = error as Error;
            run.errors.push(`Error publishing post: ${err.message}`);
            console.error(`[${runId}] ✗ Error publishing:`, err.message);
          }
        }
      } else {
        console.log(`[${runId}] Step 3: Skipped (strategy: ${this.config.publishStrategy})`);
      }

      run.status = 'completed';
      console.log(`[${runId}] ✓ Run completed successfully`);
    } catch (error) {
      const err = error as Error;
      run.status = 'failed';
      run.errors.push(`Agent run failed: ${err.message}`);
      console.error(`[${runId}] ✗ Agent run failed:`, err.message);
    }

    // Store run results
    this.runs.push(run);

    // Keep only last 100 runs in memory
    if (this.runs.length > 100) {
      this.runs = this.runs.slice(-100);
    }

    return run;
  }

  /**
   * Get next available publish slot (spread posts evenly)
   */
  private getNextPublishSlot(): Date {
    const now = new Date();
    const nextDate = new Date(now);

    // Schedule for next day at 9 AM
    nextDate.setDate(nextDate.getDate() + 1);
    nextDate.setHours(9, 0, 0, 0);

    return nextDate;
  }

  /**
   * Filter trends to only recent ones
   */
  private filterRecentTrends(trends: TrendData[]): TrendData[] {
    const maxAge = (this.config.maxEngagementAge || 7) * 24 * 60 * 60 * 1000; // Convert to ms
    const now = new Date();

    return trends.filter((trend) => {
      const trendAge = now.getTime() - trend.timestamp.getTime();
      return trendAge < maxAge;
    });
  }

  /**
   * Get all run history
   */
  getRuns(limit: number = 10): AgentRun[] {
    return this.runs.slice(-limit);
  }

  /**
   * Get statistics from recent runs
   */
  getStatistics(runLimit: number = 10): {
    totalRuns: number;
    successfulRuns: number;
    totalTrends: number;
    totalPosts: number;
    totalPublished: number;
    averagePostsPerRun: number;
    successRate: number;
  } {
    const recentRuns = this.runs.slice(-runLimit);

    if (recentRuns.length === 0) {
      return {
        totalRuns: 0,
        successfulRuns: 0,
        totalTrends: 0,
        totalPosts: 0,
        totalPublished: 0,
        averagePostsPerRun: 0,
        successRate: 0,
      };
    }

    const successfulRuns = recentRuns.filter((r) => r.status === 'completed').length;
    const totalTrends = recentRuns.reduce((sum, r) => sum + r.trendsCollected, 0);
    const totalPosts = recentRuns.reduce((sum, r) => sum + r.postsGenerated, 0);
    const totalPublished = recentRuns.reduce((sum, r) => sum + r.postsPublished, 0);

    return {
      totalRuns: recentRuns.length,
      successfulRuns,
      totalTrends,
      totalPosts,
      totalPublished,
      averagePostsPerRun: Math.round(totalPosts / recentRuns.length),
      successRate: Math.round((successfulRuns / recentRuns.length) * 100),
    };
  }

  /**
   * Get latest run results
   */
  getLatestRun(): AgentRun | null {
    return this.runs.length > 0 ? this.runs[this.runs.length - 1] : null;
  }

  /**
   * Format run results for display
   */
  formatRunResults(run: AgentRun): string {
    return `
Agent Run: ${run.id}
Status: ${run.status}
Timestamp: ${run.timestamp.toLocaleString()}

Results:
- Trends Collected: ${run.trendsCollected}
- Posts Generated: ${run.postsGenerated}
- Posts Published: ${run.postsPublished}

${run.results.posts.length > 0 ? `Generated Posts:\n${run.results.posts.map((p) => `  • ${p.title}`).join('\n')}` : ''}

${run.errors.length > 0 ? `Errors:\n${run.errors.map((e) => `  • ${e}`).join('\n')}` : ''}
    `.trim();
  }
}

export default ScheduledTrendAgent;
