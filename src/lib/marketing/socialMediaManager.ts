/**
 * Social Media Manager
 * Manages scheduled posts and social media publishing
 */

import { prisma } from '@/lib/prisma';
import type { SocialPlatform, PostStatus, ScheduledPost, Prisma } from '@prisma/client';
import { logAgentAction } from '@/lib/services/agentLogger';

export interface SchedulePostInput {
  platform: SocialPlatform;
  content: string;
  mediaUrls?: string[];
  hashtags?: string[];
  scheduledAt: Date;
  metadata?: Record<string, unknown>;
}

export interface PostStats {
  scheduled: number;
  published: number;
  failed: number;
  byPlatform: Record<string, { scheduled: number; published: number; failed: number }>;
}

/**
 * Social Media Manager Class
 */
export class SocialMediaManager {
  
  /**
   * Schedule a new social media post
   */
  async schedulePost(input: SchedulePostInput): Promise<ScheduledPost> {
    const post = await prisma.scheduledPost.create({
      data: {
        platform: input.platform,
        content: input.content,
        mediaUrls: (input.mediaUrls || undefined) as Prisma.InputJsonValue | undefined,
        hashtags: (input.hashtags || undefined) as Prisma.InputJsonValue | undefined,
        scheduledAt: input.scheduledAt,
        status: 'SCHEDULED',
        metadata: (input.metadata || undefined) as Prisma.InputJsonValue | undefined
      }
    });
    
    await logAgentAction({
      agent: 'social',
      action: 'item_created',
      status: 'SUCCESS',
      message: `Post scheduled for ${input.platform} at ${input.scheduledAt.toISOString()}`,
      metadata: { postId: post.id, platform: input.platform }
    });
    
    return post;
  }
  
  /**
   * Schedule multiple posts (content calendar)
   */
  async scheduleBulkPosts(posts: SchedulePostInput[]): Promise<ScheduledPost[]> {
    const createdPosts: ScheduledPost[] = [];
    
    for (const input of posts) {
      const post = await this.schedulePost(input);
      createdPosts.push(post);
    }
    
    return createdPosts;
  }
  
  /**
   * Cancel a scheduled post
   */
  async cancelPost(postId: string): Promise<ScheduledPost> {
    const post = await prisma.scheduledPost.findUnique({
      where: { id: postId }
    });
    
    if (!post) {
      throw new Error('Post not found');
    }
    
    if (post.status !== 'SCHEDULED' && post.status !== 'DRAFT') {
      throw new Error(`Cannot cancel post with status: ${post.status}`);
    }
    
    const updated = await prisma.scheduledPost.update({
      where: { id: postId },
      data: { status: 'DRAFT' }
    });
    
    await logAgentAction({
      agent: 'social',
      action: 'item_updated',
      status: 'SUCCESS',
      message: `Post ${postId} cancelled`,
      metadata: { postId, platform: post.platform }
    });
    
    return updated;
  }
  
  /**
   * Reschedule a post
   */
  async reschedulePost(postId: string, newScheduledAt: Date): Promise<ScheduledPost> {
    const post = await prisma.scheduledPost.findUnique({
      where: { id: postId }
    });
    
    if (!post) {
      throw new Error('Post not found');
    }
    
    if (post.status !== 'SCHEDULED' && post.status !== 'DRAFT' && post.status !== 'FAILED') {
      throw new Error(`Cannot reschedule post with status: ${post.status}`);
    }
    
    return prisma.scheduledPost.update({
      where: { id: postId },
      data: { 
        scheduledAt: newScheduledAt,
        status: 'SCHEDULED',
        error: null
      }
    });
  }
  
  /**
   * Get upcoming scheduled posts
   */
  async getUpcomingPosts(limit: number = 20): Promise<ScheduledPost[]> {
    return prisma.scheduledPost.findMany({
      where: {
        status: 'SCHEDULED',
        scheduledAt: { gte: new Date() }
      },
      orderBy: { scheduledAt: 'asc' },
      take: limit
    });
  }
  
  /**
   * Get post history
   */
  async getPostHistory(options: {
    platform?: SocialPlatform;
    status?: PostStatus;
    limit?: number;
    offset?: number;
  } = {}): Promise<ScheduledPost[]> {
    return prisma.scheduledPost.findMany({
      where: {
        platform: options.platform,
        status: options.status
      },
      orderBy: { scheduledAt: 'desc' },
      take: options.limit || 50,
      skip: options.offset || 0
    });
  }
  
  /**
   * Get social media statistics
   */
  async getStats(): Promise<PostStats> {
    const posts = await prisma.scheduledPost.findMany({
      select: { platform: true, status: true }
    });
    
    const stats: PostStats = {
      scheduled: 0,
      published: 0,
      failed: 0,
      byPlatform: {}
    };
    
    for (const post of posts) {
      // Overall stats
      if (post.status === 'SCHEDULED') stats.scheduled++;
      if (post.status === 'PUBLISHED') stats.published++;
      if (post.status === 'FAILED') stats.failed++;
      
      // Per-platform stats
      if (!stats.byPlatform[post.platform]) {
        stats.byPlatform[post.platform] = { scheduled: 0, published: 0, failed: 0 };
      }
      
      if (post.status === 'SCHEDULED') stats.byPlatform[post.platform].scheduled++;
      if (post.status === 'PUBLISHED') stats.byPlatform[post.platform].published++;
      if (post.status === 'FAILED') stats.byPlatform[post.platform].failed++;
    }
    
    return stats;
  }
  
  /**
   * Generate content suggestions based on trends
   */
  async generateContentSuggestions(): Promise<Array<{
    platform: SocialPlatform;
    content: string;
    hashtags: string[];
    bestTime: Date;
  }>> {
    // Get product info for content generation
    const suggestions: Array<{
      platform: SocialPlatform;
      content: string;
      hashtags: string[];
      bestTime: Date;
    }> = [];
    
    // Instagram content ideas
    const instagramIdeas = [
      {
        content: "🌿 Monday motivation: Start your week surrounded by greenery!\n\nPlants don't just beautify your space—they boost your mood, purify your air, and spark creativity.\n\nWhat plant is keeping you company today?",
        hashtags: ['#mondaymotivation', '#plantlife', '#indoorjungle', '#greenery', '#plantlover', '#bangalore', '#houseplants']
      },
      {
        content: "✨ Pro tip: Yellow leaves? Don't panic!\n\nMost of the time, it's just overwatering. Let the soil dry out between waterings.\n\n💧 Check soil with your finger—if dry 2 inches down, it's time to water!\n\nTag a friend who needs this tip! 👇",
        hashtags: ['#planttips', '#plantcare', '#houseplants', '#indoorplants', '#plantparent', '#greenthumb', '#plantadvice']
      },
      {
        content: "🌱 New arrivals alert! 🚨\n\nFresh batch of gorgeous plants just landed at Whole Lot of Nature!\n\nSwipe to see what's new ➡️\n\n📍 Shop online at wholelotofnature.com\n\n#linkinbio",
        hashtags: ['#newarrivals', '#plantshop', '#houseplants', '#indoorplants', '#bangalore', '#plantstore', '#shoplocal']
      }
    ];
    
    // Best posting times (IST)
    const bestTimes = [
      new Date(new Date().setHours(9, 0, 0, 0)),   // 9 AM
      new Date(new Date().setHours(12, 30, 0, 0)), // 12:30 PM
      new Date(new Date().setHours(18, 0, 0, 0)),  // 6 PM
      new Date(new Date().setHours(20, 0, 0, 0)),  // 8 PM
    ];
    
    // Ensure times are in the future
    const now = new Date();
    for (const time of bestTimes) {
      if (time <= now) {
        time.setDate(time.getDate() + 1);
      }
    }
    
    for (let i = 0; i < instagramIdeas.length; i++) {
      const idea = instagramIdeas[i];
      const time = bestTimes[i % bestTimes.length];
      
      suggestions.push({
        platform: 'INSTAGRAM',
        content: idea.content,
        hashtags: idea.hashtags,
        bestTime: time
      });
      
      // Also suggest for Facebook (modify content slightly)
      suggestions.push({
        platform: 'FACEBOOK',
        content: idea.content.replace('#linkinbio', 'Shop now: wholelotofnature.com'),
        hashtags: idea.hashtags.slice(0, 5), // Fewer hashtags for Facebook
        bestTime: time
      });
    }
    
    return suggestions;
  }
  
  /**
   * Create a content calendar for the week
   */
  async createWeeklyCalendar(): Promise<ScheduledPost[]> {
    const suggestions = await this.generateContentSuggestions();
    const posts: SchedulePostInput[] = [];
    
    // Spread posts across the week
    const daysToSchedule = [1, 3, 5]; // Monday, Wednesday, Friday
    const now = new Date();
    
    for (let i = 0; i < suggestions.length && i < daysToSchedule.length * 2; i++) {
      const suggestion = suggestions[i];
      const dayOffset = daysToSchedule[Math.floor(i / 2)];
      
      // Calculate the next occurrence of this day
      const scheduledDate = new Date(now);
      const currentDay = now.getDay();
      const daysUntil = (dayOffset - currentDay + 7) % 7 || 7;
      scheduledDate.setDate(now.getDate() + daysUntil);
      scheduledDate.setHours(suggestion.bestTime.getHours(), suggestion.bestTime.getMinutes(), 0, 0);
      
      posts.push({
        platform: suggestion.platform,
        content: suggestion.content,
        hashtags: suggestion.hashtags,
        scheduledAt: scheduledDate
      });
    }
    
    return this.scheduleBulkPosts(posts);
  }
}

// Export singleton instance
export const socialMediaManager = new SocialMediaManager();
