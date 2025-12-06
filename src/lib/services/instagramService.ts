/**
 * Instagram Automation Service
 * Handles Instagram content posting, scheduling, and analytics
 * 
 * SETUP REQUIRED:
 * 1. Get Instagram Graph API access token
 * 2. Add to .env.local:
 *    INSTAGRAM_ACCESS_TOKEN=your_token
 *    INSTAGRAM_BUSINESS_ACCOUNT_ID=your_account_id
 */

interface InstagramPost {
  caption: string;
  imageUrl?: string;
  scheduledTime?: Date;
  hashtags: string[];
}

interface InstagramResponse {
  id: string;
  permalink?: string;
}

export default class InstagramAutomationService {
  private accessToken: string;
  private businessAccountId: string;
  private baseUrl = 'https://graph.facebook.com/v18.0';

  constructor() {
    this.accessToken = process.env.INSTAGRAM_ACCESS_TOKEN || '';
    this.businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || '';
  }

  /**
   * Check if Instagram API is configured
   */
  isConfigured(): boolean {
    return !!this.accessToken && !!this.businessAccountId;
  }

  /**
   * Publish a post to Instagram immediately
   */
  async publishPost(post: InstagramPost): Promise<InstagramResponse> {
    if (!this.isConfigured()) {
      throw new Error('Instagram API not configured. Add INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ACCOUNT_ID to .env.local');
    }

    try {
      // Step 1: Create media container
      const containerResponse = await this.createMediaContainer(post);
      const containerId = containerResponse.id;

      // Step 2: Publish the container
      const publishResponse = await this.publishMediaContainer(containerId);

      console.log('✅ Instagram post published:', publishResponse.id);
      return publishResponse;
    } catch (error: unknown) {
      console.error('❌ Instagram publish error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to publish to Instagram: ${errorMessage}`);
    }
  }

  /**
   * Schedule a post for later using Instagram Content Publishing API
   * Instagram supports scheduling up to 75 days in advance
   */
  async schedulePost(post: InstagramPost, scheduledTime: Date): Promise<InstagramResponse> {
    if (!this.isConfigured()) {
      throw new Error('Instagram API not configured. Add INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ACCOUNT_ID to .env.local');
    }

    try {
      const caption = this.formatCaption(post.caption, post.hashtags);
      
      // Convert to Unix timestamp (required by Instagram API)
      const publishTime = Math.floor(scheduledTime.getTime() / 1000);
      
      const params = new URLSearchParams({
        caption,
        publish_mode: 'scheduled',
        scheduled_publish_time: publishTime.toString(),
        access_token: this.accessToken,
      });

      // Add image if provided
      if (post.imageUrl) {
        params.append('image_url', post.imageUrl);
      }

      const response = await fetch(
        `${this.baseUrl}/${this.businessAccountId}/media`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString(),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to schedule post');
      }

      const result = await response.json();
      console.log('📅 Instagram post scheduled for:', scheduledTime);
      
      return {
        id: result.id,
        permalink: undefined, // Won't have permalink until published
      };
    } catch (error: unknown) {
      console.error('❌ Instagram schedule error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to schedule post: ${errorMessage}`);
    }
  }

  /**
   * Create media container (Step 1 of publishing)
   */
  private async createMediaContainer(post: InstagramPost): Promise<{ id: string }> {
    const caption = this.formatCaption(post.caption, post.hashtags);
    
    const params = new URLSearchParams({
      caption,
      access_token: this.accessToken,
    });

    // If image URL provided, add it
    if (post.imageUrl) {
      params.append('image_url', post.imageUrl);
    }

    const response = await fetch(
      `${this.baseUrl}/${this.businessAccountId}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to create media container');
    }

    return response.json();
  }

  /**
   * Publish media container (Step 2 of publishing)
   */
  private async publishMediaContainer(containerId: string): Promise<InstagramResponse> {
    const params = new URLSearchParams({
      creation_id: containerId,
      access_token: this.accessToken,
    });

    const response = await fetch(
      `${this.baseUrl}/${this.businessAccountId}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to publish media');
    }

    return response.json();
  }

  /**
   * Format caption with hashtags
   */
  private formatCaption(caption: string, hashtags: string[]): string {
    const hashtagString = hashtags.join(' ');
    return `${caption}\n\n${hashtagString}`;
  }

  /**
   * Get Instagram account insights
   */
  async getAccountInsights(): Promise<unknown> {
    if (!this.isConfigured()) {
      throw new Error('Instagram API not configured');
    }

    const params = new URLSearchParams({
      metric: 'impressions,reach,follower_count,profile_views',
      period: 'day',
      access_token: this.accessToken,
    });

    const response = await fetch(
      `${this.baseUrl}/${this.businessAccountId}/insights?${params.toString()}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get insights');
    }

    return response.json();
  }

  /**
   * Get recent posts
   */
  async getRecentPosts(limit: number = 10): Promise<unknown[]> {
    if (!this.isConfigured()) {
      throw new Error('Instagram API not configured');
    }

    const params = new URLSearchParams({
      fields: 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count',
      limit: limit.toString(),
      access_token: this.accessToken,
    });

    const response = await fetch(
      `${this.baseUrl}/${this.businessAccountId}/media?${params.toString()}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get posts');
    }

    const data = await response.json();
    return data.data || [];
  }

  /**
   * Export posts to CSV for manual scheduling
   */
  exportToCSV(posts: InstagramPost[]): string {
    const headers = ['Date', 'Time', 'Caption', 'Hashtags', 'Image Prompt'];
    const rows = posts.map(post => {
      const scheduledDate = post.scheduledTime || new Date();
      return [
        scheduledDate.toLocaleDateString(),
        scheduledDate.toLocaleTimeString(),
        `"${post.caption.replace(/"/g, '""')}"`, // Escape quotes
        post.hashtags.join(' '),
        post.imageUrl || 'No image',
      ];
    });

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    return csv;
  }

  /**
   * Validate Instagram Business Account
   */
  async validateAccount(): Promise<boolean> {
    if (!this.isConfigured()) {
      return false;
    }

    try {
      const params = new URLSearchParams({
        fields: 'id,username,profile_picture_url',
        access_token: this.accessToken,
      });

      const response = await fetch(
        `${this.baseUrl}/${this.businessAccountId}?${params.toString()}`
      );

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      console.log('✅ Instagram account validated:', data.username);
      return true;
    } catch (error) {
      console.error('❌ Instagram validation error:', error);
      return false;
    }
  }

  /**
   * Bulk schedule multiple posts to Instagram
   * Handles rate limiting with delays between requests
   */
  async bulkSchedule(posts: InstagramPost[]): Promise<unknown[]> {
    if (!this.isConfigured()) {
      throw new Error('Instagram API not configured');
    }

    const results = [];
    let scheduledCount = 0;
    let failedCount = 0;

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      
      try {
        const result = await this.schedulePost(post, post.scheduledTime || new Date());
        results.push({ 
          success: true, 
          id: result.id,
          scheduledTime: post.scheduledTime,
          caption: post.caption.substring(0, 50) + '...'
        });
        scheduledCount++;
        
        console.log(`✅ Scheduled post ${i + 1}/${posts.length}`);
        
        // Wait 1 second between requests to avoid rate limiting
        if (i < posts.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.push({ 
          success: false, 
          error: errorMessage,
          caption: post.caption.substring(0, 50) + '...'
        });
        failedCount++;
        console.error(`❌ Failed to schedule post ${i + 1}:`, errorMessage);
      }
    }

    console.log(`\n📊 Bulk Schedule Results:`);
    console.log(`  ✅ Scheduled: ${scheduledCount}/${posts.length}`);
    console.log(`  ❌ Failed: ${failedCount}/${posts.length}`);

    return results;
  }

  /**
   * Get Instagram account info (username, profile picture, etc.)
   */
  async getAccountInfo(): Promise<unknown> {
    if (!this.isConfigured()) {
      throw new Error('Instagram API not configured');
    }

    try {
      const params = new URLSearchParams({
        fields: 'id,username,profile_picture_url,followers_count,follows_count,media_count',
        access_token: this.accessToken,
      });

      const response = await fetch(
        `${this.baseUrl}/${this.businessAccountId}?${params.toString()}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to get account info');
      }

      return response.json();
    } catch (error: unknown) {
      console.error('❌ Failed to get account info:', error);
      throw error;
    }
  }
}

/**
 * Buffer API Integration (Alternative - Easier Setup)
 * Sign up at https://buffer.com and get API token
 */
export class BufferService {
  private accessToken: string;
  private baseUrl = 'https://api.bufferapp.com/1';

  constructor() {
    this.accessToken = process.env.BUFFER_ACCESS_TOKEN || '';
  }

  isConfigured(): boolean {
    return !!this.accessToken;
  }

  /**
   * Get connected Instagram profiles
   */
  async getProfiles(): Promise<unknown[]> {
    const response = await fetch(
      `${this.baseUrl}/profiles.json?access_token=${this.accessToken}`
    );

    if (!response.ok) {
      throw new Error('Failed to get Buffer profiles');
    }

    const profiles = await response.json();
    return profiles.filter((p: { service: string }) => p.service === 'instagram');
  }

  /**
   * Schedule post to Buffer
   */
  async schedulePost(
    profileId: string,
    post: InstagramPost,
    scheduledTime: Date
  ): Promise<unknown> {
    const caption = `${post.caption}\n\n${post.hashtags.join(' ')}`;

    const body = {
      text: caption,
      profile_ids: [profileId],
      scheduled_at: Math.floor(scheduledTime.getTime() / 1000),
      media: post.imageUrl ? { photo: post.imageUrl } : undefined,
    };

    const response = await fetch(
      `${this.baseUrl}/updates/create.json?access_token=${this.accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to schedule post to Buffer');
    }

    return response.json();
  }

  /**
   * Bulk schedule multiple posts
   */
  async bulkSchedule(
    profileId: string,
    posts: InstagramPost[]
  ): Promise<unknown[]> {
    const results = [];

    for (const post of posts) {
      try {
        const result = await this.schedulePost(
          profileId,
          post,
          post.scheduledTime || new Date()
        );
        results.push({ success: true, post: result });
        
        // Wait 1 second between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.push({ success: false, error: errorMessage });
      }
    }

    return results;
  }
}
