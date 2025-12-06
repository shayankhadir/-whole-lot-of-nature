/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AgentRunResult {
  trendsCollected: number;
  postsGenerated: number;
  postsPublished: number;
}

export interface PublishResult {
  success: boolean;
  error?: string;
  result?: {
    postsPublished: number;
  };
}

export interface Product {
  name: string;
  price: string;
  category: string;
  [key: string]: any;
}

export interface MarketingResult {
  competitorsAnalyzed: number;
  results?: Array<{
    products: Product[];
    [key: string]: any;
  }>;
  insights?: {
    topKeywords: string[];
    recommendations: string[];
    priceRange?: {
      min: number;
      max: number;
    };
    commonCategories?: string[];
  };
}

export interface SocialPost {
  platform: string;
  content: string;
  hashtags?: string[];
  scheduledTime?: string;
  imagePrompt?: string;
  [key: string]: any;
}

export interface CalendarDay {
  date: string;
  theme?: string;
  posts: SocialPost[];
  [key: string]: any;
}

export interface SocialResult {
  success?: boolean;
  instagramScheduled?: boolean;
  postsScheduled: number;
  totalPosts?: number;
  posts?: SocialPost[];
  calendar?: CalendarDay[];
  results?: {
    step2?: { data: { posts: SocialPost[] } };
    step3?: { data: { totalDays: number; postsPerDay: number } };
    [key: string]: any;
  };
  summary?: {
    platforms?: string[];
    platformBreakdown?: Record<string, number>;
    [key: string]: any;
  };
}

export interface DesignAuditResult {
    issues: any[];
    score: number;
    [key: string]: any;
}

export interface BufferStatus {
    [key: string]: any;
}

export interface BacklinkReport {
    [key: string]: any;
}

export interface AutomationResult {
    [key: string]: any;
}
