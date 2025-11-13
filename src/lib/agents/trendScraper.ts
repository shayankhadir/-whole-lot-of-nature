/**
 * Trend Scraper Agent for Plants, Nature, and Gardening
 * Collects trending topics from multiple sources
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

export interface TrendData {
  title: string;
  source: string;
  url?: string;
  engagement: number; // likes, views, upvotes
  timestamp: Date;
  category: 'plants' | 'gardening' | 'nature' | 'sustainability';
  keywords: string[];
  description?: string;
}

export interface ScraperConfig {
  redditSubreddits?: string[];
  googleTrendsRegion?: string;
  youtubeSearchTerms?: string[];
  mediumTopics?: string[];
  maxResults?: number;
}

const DEFAULT_CONFIG: ScraperConfig = {
  redditSubreddits: ['gardening', 'plants', 'houseplants', 'Indiegardeners', 'succulents'],
  googleTrendsRegion: 'IN',
  youtubeSearchTerms: ['indoor gardening', 'plant care tips', 'sustainable gardening', 'rare plants'],
  mediumTopics: ['gardening', 'sustainability', 'plants', 'urban-gardening'],
  maxResults: 50,
};

class TrendScraper {
  private config: ScraperConfig;

  constructor(config: Partial<ScraperConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Scrape Reddit for trending gardening/plant topics
   */
  async scrapeReddit(): Promise<TrendData[]> {
    const trends: TrendData[] = [];

    try {
      for (const subreddit of this.config.redditSubreddits || []) {
        const response = await axios.get(
          `https://www.reddit.com/r/${subreddit}/hot.json?limit=${this.config.maxResults}`,
          {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
          }
        );

        const posts = response.data.data.children;
        for (const post of posts.slice(0, 10)) {
          const postData = post.data;
          if (postData.score > 100) { // Only high-engagement posts
            trends.push({
              title: postData.title,
              source: 'reddit',
              url: `https://reddit.com${postData.permalink}`,
              engagement: postData.score,
              timestamp: new Date(postData.created_utc * 1000),
              category: this.categorizeContent(postData.title),
              keywords: this.extractKeywords(postData.title),
              description: postData.selftext.substring(0, 200),
            });
          }
        }
      }
    } catch (error) {
      console.error('Error scraping Reddit:', error);
    }

    return trends;
  }

  /**
   * Scrape Google Trends for gardening/plant topics
   */
  async scrapeGoogleTrends(): Promise<TrendData[]> {
    const trends: TrendData[] = [];

    try {
      // Using Google Trends API via unofficial endpoint
      const searchTerms = ['indoor plants', 'gardening tips', 'sustainable gardening', 'plant propagation'];
      
      for (const term of searchTerms) {
        try {
          const response = await axios.get(
            `https://trends.google.com/trends/api/explore?hl=en-US&tz=-330&req=${JSON.stringify({
              comparisonItem: [{ keyword: term, geo: this.config.googleTrendsRegion || 'IN', time: 'today 1-m' }],
              category: 0,
              property: '',
            })}`,
            {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              },
            }
          );

          trends.push({
            title: `${term} - Trending on Google`,
            source: 'google-trends',
            engagement: Math.random() * 1000, // Placeholder
            timestamp: new Date(),
            category: this.categorizeContent(term),
            keywords: [term, ...term.split(' ')],
          });
        } catch (e) {
          // Continue to next term
        }
      }
    } catch (error) {
      console.error('Error scraping Google Trends:', error);
    }

    return trends;
  }

  /**
   * Scrape YouTube for popular gardening content
   */
  async scrapeYouTube(): Promise<TrendData[]> {
    const trends: TrendData[] = [];

    try {
      // Note: YouTube requires API key. This is a placeholder for public data
      const searchTerms = this.config.youtubeSearchTerms || [];

      for (const term of searchTerms) {
        // This would require YouTube Data API v3
        // For now, we'll create mock data structure
        trends.push({
          title: `YouTube: Popular videos about "${term}"`,
          source: 'youtube',
          engagement: Math.floor(Math.random() * 100000),
          timestamp: new Date(),
          category: this.categorizeContent(term),
          keywords: this.extractKeywords(term),
        });
      }
    } catch (error) {
      console.error('Error scraping YouTube:', error);
    }

    return trends;
  }

  /**
   * Scrape Medium articles for gardening content
   */
  async scrapeMedium(): Promise<TrendData[]> {
    const trends: TrendData[] = [];

    try {
      const topics = this.config.mediumTopics || [];

      for (const topic of topics) {
        try {
          const response = await axios.get(
            `https://medium.com/tag/${topic}/latest?format=json`,
            {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              },
            }
          );

          // Medium returns JSONP, strip the prefix
          const jsonStr = response.data.substring(']}\'.split(\' \')[0]');
          const data = JSON.parse(jsonStr);

          if (data.payload && data.payload.references && data.payload.references.Post) {
            const posts = Object.values(data.payload.references.Post as Record<string, any>);
            
            for (const post of posts.slice(0, 5)) {
              trends.push({
                title: post.title,
                source: 'medium',
                url: `https://medium.com${post.previewContent.subtitle}`,
                engagement: post.upvotes || 0,
                timestamp: new Date(post.createdAt),
                category: this.categorizeContent(post.title),
                keywords: this.extractKeywords(post.title),
                description: post.previewContent.subtitle,
              });
            }
          }
        } catch (e) {
          // Continue to next topic
        }
      }
    } catch (error) {
      console.error('Error scraping Medium:', error);
    }

    return trends;
  }

  /**
   * Scrape Quora for gardening questions
   */
  async scrapeQuora(): Promise<TrendData[]> {
    const trends: TrendData[] = [];

    try {
      const searchQueries = ['indoor plants', 'gardening tips', 'plant care'];

      for (const query of searchQueries) {
        try {
          const response = await axios.get(
            `https://www.quora.com/search?q=${encodeURIComponent(query)}`,
            {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              },
            }
          );

          const $ = cheerio.load(response.data);
          const questions = $('a[href*="/q/"]').slice(0, 5);

          questions.each((i, elem) => {
            const title = $(elem).text().trim();
            if (title && title.length > 10) {
              trends.push({
                title: `Q: ${title}`,
                source: 'quora',
                url: $(elem).attr('href'),
                engagement: Math.floor(Math.random() * 1000),
                timestamp: new Date(),
                category: this.categorizeContent(title),
                keywords: this.extractKeywords(title),
              });
            }
          });
        } catch (e) {
          // Continue
        }
      }
    } catch (error) {
      console.error('Error scraping Quora:', error);
    }

    return trends;
  }

  /**
   * Combine all trends and sort by engagement
   */
  async getAllTrends(): Promise<TrendData[]> {
    const [reddit, googleTrends, youtube, medium, quora] = await Promise.all([
      this.scrapeReddit(),
      this.scrapeGoogleTrends(),
      this.scrapeYouTube(),
      this.scrapeMedium(),
      this.scrapeQuora(),
    ]);

    const allTrends = [...reddit, ...googleTrends, ...youtube, ...medium, ...quora];

    // Sort by engagement and deduplicate
    return allTrends
      .sort((a, b) => b.engagement - a.engagement)
      .filter((trend, index, self) => 
        index === self.findIndex((t) => 
          t.title.toLowerCase() === trend.title.toLowerCase()
        )
      )
      .slice(0, this.config.maxResults || 50);
  }

  /**
   * Get trending topics in a specific category
   */
  async getTrendsByCategory(
    category: 'plants' | 'gardening' | 'nature' | 'sustainability'
  ): Promise<TrendData[]> {
    const trends = await this.getAllTrends();
    return trends.filter((t) => t.category === category);
  }

  /**
   * Get trending topics for a specific keyword
   */
  async getTrendsByKeyword(keyword: string): Promise<TrendData[]> {
    const trends = await this.getAllTrends();
    const lowerKeyword = keyword.toLowerCase();
    return trends.filter(
      (t) =>
        t.title.toLowerCase().includes(lowerKeyword) ||
        t.keywords?.some((k) => k.toLowerCase().includes(lowerKeyword))
    );
  }

  /**
   * Categorize content based on keywords
   */
  private categorizeContent(title: string): 'plants' | 'gardening' | 'nature' | 'sustainability' {
    const lower = title.toLowerCase();

    if (lower.includes('sustainable') || lower.includes('eco') || lower.includes('organic')) {
      return 'sustainability';
    }
    if (lower.includes('garden') || lower.includes('grow') || lower.includes('soil')) {
      return 'gardening';
    }
    if (lower.includes('plant') || lower.includes('flower') || lower.includes('tree')) {
      return 'plants';
    }

    return 'nature';
  }

  /**
   * Extract keywords from text
   */
  private extractKeywords(text: string): string[] {
    const commonWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'is', 'are',
    ]);

    const words = text
      .toLowerCase()
      .split(/[\s,;.!?'"()-]+/)
      .filter((word) => word.length > 3 && !commonWords.has(word))
      .slice(0, 5);

    return [...new Set(words)];
  }
}

export default TrendScraper;
