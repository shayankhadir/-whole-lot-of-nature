/**
 * WordPress REST API Publisher
 * Auto-publishes generated blog posts to WordPress
 */

import axios, { AxiosError } from 'axios';
import { GeneratedBlogPost } from './blogPostGenerator';

export interface WordPressConfig {
  siteUrl: string;
  username: string;
  password: string;
  // Or use:
  // token: string; // Pre-generated JWT or app password
}

export interface WordPressPublishResult {
  success: boolean;
  postId?: number;
  url?: string;
  error?: string;
  timestamp: Date;
}

export interface WordPressPost {
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  status: 'publish' | 'draft' | 'pending' | 'private';
  categories: number[];
  tags: number[];
  featured_media?: number;
  meta?: {
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: string;
    _yoast_wpseo_metadesc?: string;
    _yoast_wpseo_focuskw?: string;
  };
  yoast_head_json?: Record<string, any>;
}

class WordPressPublisher {
  private config: WordPressConfig;
  private baseUrl: string;
  private authHeader: string;

  constructor(config: WordPressConfig) {
    this.config = config;
    this.baseUrl = `${config.siteUrl}/wp-json/wp/v2`;

    // Create basic auth header
    const credentials = Buffer.from(`${config.username}:${config.password}`).toString('base64');
    this.authHeader = `Basic ${credentials}`;
  }

  /**
   * Publish a single blog post to WordPress
   */
  async publishPost(post: GeneratedBlogPost, featured: boolean = true): Promise<WordPressPublishResult> {
    try {
      // First, get or create categories
      const categoryIds = await this.getOrCreateCategories(post.categories);

      // Then, get or create tags
      const tagIds = await this.getOrCreateTags(post.tags);

      // Upload featured image if needed
      let featuredMediaId;
      if (featured && post.seoData.schema) {
        featuredMediaId = await this.uploadFeaturedImage(post.title);
      }

      // Create the post object
      const wordPressPost: WordPressPost = {
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        slug: post.slug,
        status: post.status === 'draft' ? 'draft' : 'publish',
        categories: categoryIds,
        tags: tagIds,
        featured_media: featuredMediaId,
        meta: {
          seo_title: post.seoData.title,
          seo_description: post.seoData.metaDescription,
          seo_keywords: post.seoData.keywords.join(', '),
          _yoast_wpseo_metadesc: post.seoData.metaDescription,
          _yoast_wpseo_focuskw: post.seoData.keywords[0],
        },
      };

      // Publish the post
      const response = await axios.post(`${this.baseUrl}/posts`, wordPressPost, {
        headers: {
          Authorization: this.authHeader,
          'Content-Type': 'application/json',
        },
      });

      const data = response.data as any;

      return {
        success: true,
        postId: data.id,
        url: data.link,
        timestamp: new Date(),
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error publishing to WordPress:', axiosError.message);

      return {
        success: false,
        error: axiosError.message || 'Failed to publish post',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Publish multiple posts (batch operation)
   */
  async publishBatch(posts: GeneratedBlogPost[]): Promise<WordPressPublishResult[]> {
    const results: WordPressPublishResult[] = [];

    for (const post of posts) {
      const result = await this.publishPost(post);
      results.push(result);

      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return results;
  }

  /**
   * Schedule a post for future publishing
   */
  async schedulePost(post: GeneratedBlogPost, scheduledDate: Date): Promise<WordPressPublishResult> {
    try {
      const categoryIds = await this.getOrCreateCategories(post.categories);
      const tagIds = await this.getOrCreateTags(post.tags);

      const wordPressPost: WordPressPost = {
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        slug: post.slug,
        status: 'future',
        categories: categoryIds,
        tags: tagIds,
        meta: {
          seo_title: post.seoData.title,
          seo_description: post.seoData.metaDescription,
          seo_keywords: post.seoData.keywords.join(', '),
        },
      };

      const response = await axios.post(
        `${this.baseUrl}/posts`,
        {
          ...wordPressPost,
          date: scheduledDate.toISOString(),
        },
        {
          headers: {
            Authorization: this.authHeader,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data as any;

      return {
        success: true,
        postId: data.id,
        url: data.link,
        timestamp: new Date(),
      };
    } catch (error) {
      const axiosError = error as AxiosError;

      return {
        success: false,
        error: axiosError.message || 'Failed to schedule post',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Get existing categories or create new ones
   */
  private async getOrCreateCategories(categoryNames: string[]): Promise<number[]> {
    const categoryIds: number[] = [];

    for (const name of categoryNames) {
      try {
        // First, try to find existing category
        const searchResponse = await axios.get(`${this.baseUrl}/categories`, {
          params: {
            search: name,
            per_page: 1,
          },
          headers: {
            Authorization: this.authHeader,
          },
        });

        if (searchResponse.data.length > 0) {
          categoryIds.push(searchResponse.data[0].id);
        } else {
          // Create new category
          const createResponse = await axios.post(
            `${this.baseUrl}/categories`,
            { name },
            {
              headers: {
                Authorization: this.authHeader,
              },
            }
          );

          categoryIds.push(createResponse.data.id);
        }
      } catch (error) {
        console.error(`Error handling category "${name}":`, error);
      }
    }

    return categoryIds;
  }

  /**
   * Get existing tags or create new ones
   */
  private async getOrCreateTags(tagNames: string[]): Promise<number[]> {
    const tagIds: number[] = [];

    for (const name of tagNames) {
      try {
        // First, try to find existing tag
        const searchResponse = await axios.get(`${this.baseUrl}/tags`, {
          params: {
            search: name,
            per_page: 1,
          },
          headers: {
            Authorization: this.authHeader,
          },
        });

        if (searchResponse.data.length > 0) {
          tagIds.push(searchResponse.data[0].id);
        } else {
          // Create new tag
          const createResponse = await axios.post(
            `${this.baseUrl}/tags`,
            { name },
            {
              headers: {
                Authorization: this.authHeader,
              },
            }
          );

          tagIds.push(createResponse.data.id);
        }
      } catch (error) {
        console.error(`Error handling tag "${name}":`, error);
      }
    }

    return tagIds;
  }

  /**
   * Upload featured image from URL
   */
  private async uploadFeaturedImage(title: string): Promise<number | undefined> {
    try {
      // Generate Unsplash image URL
      const imageUrl = `https://source.unsplash.com/1200x600/?${encodeURIComponent(title.split(' ')[0])}`;

      // Download image
      const imageResponse = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });

      // Upload to WordPress media library
      const uploadResponse = await axios.post(
        `${this.baseUrl}/media`,
        imageResponse.data,
        {
          headers: {
            Authorization: this.authHeader,
            'Content-Type': 'image/jpeg',
            'Content-Disposition': `attachment; filename="${title.replace(/[^a-z0-9]/gi, '-')}.jpg"`,
          },
        }
      );

      return uploadResponse.data.id;
    } catch (error) {
      console.error('Error uploading featured image:', error);
      return undefined;
    }
  }

  /**
   * Update existing post
   */
  async updatePost(postId: number, post: Partial<GeneratedBlogPost>): Promise<WordPressPublishResult> {
    try {
      const updateData: Record<string, any> = {};

      if (post.title) updateData.title = post.title;
      if (post.content) updateData.content = post.content;
      if (post.excerpt) updateData.excerpt = post.excerpt;

      if (post.categories && post.categories.length > 0) {
        updateData.categories = await this.getOrCreateCategories(post.categories);
      }

      if (post.tags && post.tags.length > 0) {
        updateData.tags = await this.getOrCreateTags(post.tags);
      }

      const response = await axios.post(`${this.baseUrl}/posts/${postId}`, updateData, {
        headers: {
          Authorization: this.authHeader,
          'Content-Type': 'application/json',
        },
      });

      const data = response.data as any;

      return {
        success: true,
        postId: data.id,
        url: data.link,
        timestamp: new Date(),
      };
    } catch (error) {
      const axiosError = error as AxiosError;

      return {
        success: false,
        error: axiosError.message || 'Failed to update post',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Delete a post
   */
  async deletePost(postId: number): Promise<WordPressPublishResult> {
    try {
      await axios.delete(`${this.baseUrl}/posts/${postId}`, {
        params: { force: true },
        headers: {
          Authorization: this.authHeader,
        },
      });

      return {
        success: true,
        timestamp: new Date(),
      };
    } catch (error) {
      const axiosError = error as AxiosError;

      return {
        success: false,
        error: axiosError.message || 'Failed to delete post',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Get published posts count
   */
  async getPublishedPostsCount(): Promise<number> {
    try {
      const response = await axios.get(`${this.baseUrl}/posts`, {
        params: {
          status: 'publish',
          per_page: 1,
        },
        headers: {
          Authorization: this.authHeader,
        },
      });

      const totalHeader = response.headers['x-wp-total'];
      return parseInt(totalHeader) || 0;
    } catch (error) {
      console.error('Error getting posts count:', error);
      return 0;
    }
  }

  /**
   * Verify connection to WordPress
   */
  async verifyConnection(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/posts`, {
        params: { per_page: 1 },
        headers: {
          Authorization: this.authHeader,
        },
      });

      return response.status === 200;
    } catch (error) {
      console.error('Error verifying WordPress connection:', error);
      return false;
    }
  }
}

export default WordPressPublisher;
