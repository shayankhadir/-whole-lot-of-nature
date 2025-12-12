/**
 * Automatic Draft Publisher
 * Publishes draft blog posts from WordPress at scheduled intervals
 */

import axios, { AxiosError } from 'axios';

interface WordPressPost {
  id: number;
  status: string;
  title: { rendered: string };
  [key: string]: unknown;
}

export interface PublisherConfig {
  wordPressUrl: string;
  username: string;
  password: string;
  publishInterval: number; // minutes between publishing
  maxPostsPerInterval: number; // posts to publish each interval
  enabled: boolean;
}

export interface PublishScheduleResult {
  success: boolean;
  postsPublished: number;
  postIds: number[];
  nextPublishTime: Date;
  error?: string;
}

class AutomaticDraftPublisher {
  private config: PublisherConfig;
  private baseUrl: string;
  private authHeader: string;
  private publishingSchedule: ReturnType<typeof setInterval> | null = null;

  constructor(config: PublisherConfig) {
    this.config = config;
    this.baseUrl = `${config.wordPressUrl}/wp-json/wp/v2`;

    // Create basic auth header
    const credentials = Buffer.from(`${config.username}:${config.password}`).toString('base64');
    this.authHeader = `Basic ${credentials}`;
  }

  /**
   * Get draft posts from WordPress
   */
  async getDraftPosts(limit: number = 10): Promise<WordPressPost[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/posts`, {
        params: {
          status: 'draft',
          per_page: limit,
          orderby: 'date',
          order: 'asc',
        },
        headers: {
          Authorization: this.authHeader,
        },
      });

      return response.data || [];
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error fetching draft posts:', axiosError.message);
      return [];
    }
  }

  /**
   * Publish a single draft post
   */
  async publishPost(postId: number): Promise<boolean> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/posts/${postId}`,
        { status: 'publish' },
        {
          headers: {
            Authorization: this.authHeader,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data as WordPressPost;
      const isPublished = data.status === 'publish';

      if (isPublished) {
        console.log(`Published post ID ${postId}: ${data.title.rendered}`);
      }

      return isPublished;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Error publishing post ${postId}:`, axiosError.message);
      return false;
    }
  }

  /**
   * Execute a publish cycle
   */
  async publishNextDrafts(): Promise<PublishScheduleResult> {
    try {
      // Get draft posts
      const drafts = await this.getDraftPosts(this.config.maxPostsPerInterval);

      if (drafts.length === 0) {
        console.log('No draft posts available for publishing');
        return {
          success: true,
          postsPublished: 0,
          postIds: [],
          nextPublishTime: new Date(Date.now() + this.config.publishInterval * 60 * 1000),
        };
      }

      // Publish the next batch
      const postIds: number[] = [];
      let publishedCount = 0;

      for (let i = 0; i < Math.min(drafts.length, this.config.maxPostsPerInterval); i++) {
        const post = drafts[i];
        const success = await this.publishPost(post.id);

        if (success) {
          postIds.push(post.id);
          publishedCount++;
        }

        // Small delay between publishes to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      const nextPublishTime = new Date(Date.now() + this.config.publishInterval * 60 * 1000);

      return {
        success: true,
        postsPublished: publishedCount,
        postIds,
        nextPublishTime,
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        postsPublished: 0,
        postIds: [],
        nextPublishTime: new Date(),
        error: err.message,
      };
    }
  }

  /**
   * Start automatic publishing schedule
   */
  startSchedule(): void {
    if (this.publishingSchedule) {
      console.log('Publishing schedule already running');
      return;
    }

    console.log(`Starting automatic draft publisher (every ${this.config.publishInterval} minutes)`);

    // Initial publish immediately
    this.publishNextDrafts().catch(console.error);

    // Then schedule recurring publishes
    this.publishingSchedule = setInterval(() => {
      this.publishNextDrafts().catch(console.error);
    }, this.config.publishInterval * 60 * 1000);
  }

  /**
   * Stop automatic publishing schedule
   */
  stopSchedule(): void {
    if (this.publishingSchedule) {
      clearInterval(this.publishingSchedule);
      this.publishingSchedule = null;
      console.log('Stopped automatic draft publisher');
    }
  }

  /**
   * Get current schedule status
   */
  getStatus(): {
    active: boolean;
    interval: number;
    nextPublishTime: Date;
  } {
    const isActive = this.publishingSchedule !== null;
    const nextPublishTime = new Date(Date.now() + this.config.publishInterval * 60 * 1000);

    return {
      active: isActive,
      interval: this.config.publishInterval,
      nextPublishTime,
    };
  }
}

export default AutomaticDraftPublisher;
