/**
 * Growth Engine Agent - AI-Powered Marketing Automation Hub
 * Whole Lot of Nature - Premium Plant Store
 * 
 * This is the central growth orchestration system that coordinates:
 * - Content marketing (blog, social media)
 * - Email marketing automation
 * - Customer retention & loyalty
 * - Conversion optimization
 * - Analytics & insights
 */

import { aiService } from '@/lib/ai/aiService';
import { WooCommerceService, WooCommerceProduct, WooCommerceOrder } from '@/lib/services/woocommerceService';
import { SEOResearchAgent, ProductSEOAnalysis, BulkSEOReport } from './seoResearchAgent';
import { LeadIntelligenceAgent, Lead, LeadGenReport } from './leadIntelligenceAgent';
import SocialMediaAgent from './socialMediaAgent';
import BacklinkAgent from './backlinkAgent';
import CompetitorAnalysisAgent, { CompetitorData, CompetitorInsights } from './competitorAnalysisAgent';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface GrowthMetrics {
  // Traffic
  estimatedMonthlyVisitors: number;
  organicTrafficGrowth: number;
  
  // Conversion
  conversionRate: number;
  averageOrderValue: number;
  
  // Retention
  repeatCustomerRate: number;
  customerLifetimeValue: number;
  
  // Engagement
  emailOpenRate: number;
  socialEngagementRate: number;
  
  // Content
  blogPostsPublished: number;
  socialPostsScheduled: number;
}

export interface GrowthOpportunity {
  id: string;
  type: 'quick_win' | 'medium_effort' | 'strategic';
  category: 'seo' | 'email' | 'social' | 'conversion' | 'retention' | 'content';
  title: string;
  description: string;
  estimatedImpact: 'low' | 'medium' | 'high';
  estimatedEffort: 'low' | 'medium' | 'high';
  priority: number; // 1-10
  actionSteps: string[];
  metrics: string[];
  automatable: boolean;
}

export interface GrowthCampaign {
  id: string;
  name: string;
  type: 'seasonal' | 'product_launch' | 'flash_sale' | 'loyalty' | 'reactivation' | 'referral';
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate: Date;
  endDate: Date;
  channels: ('email' | 'social' | 'sms' | 'push' | 'website')[];
  targetAudience: string[];
  budget?: number;
  goals: CampaignGoal[];
  performance: CampaignPerformance;
}

export interface CampaignGoal {
  metric: string;
  target: number;
  current: number;
}

export interface CampaignPerformance {
  reach: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  roi: number;
}

export interface ContentPlan {
  weekOf: Date;
  blogPosts: BlogPostIdea[];
  socialPosts: SocialPostIdea[];
  emails: EmailIdea[];
  theme: string;
  keywords: string[];
}

export interface BlogPostIdea {
  title: string;
  topic: string;
  targetKeyword: string;
  outline: string[];
  estimatedWordCount: number;
  publishDate: Date;
  status: 'idea' | 'writing' | 'review' | 'scheduled' | 'published';
}

export interface SocialPostIdea {
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'pinterest';
  content: string;
  hashtags: string[];
  imagePrompt: string;
  scheduledFor: Date;
  type: 'educational' | 'promotional' | 'engagement' | 'ugc' | 'behind_scenes';
}

export interface EmailIdea {
  subject: string;
  type: 'newsletter' | 'promotional' | 'educational' | 'transactional';
  segment: string;
  scheduledFor: Date;
  keyPoints: string[];
}

export interface GrowthReport {
  generatedAt: Date;
  period: 'daily' | 'weekly' | 'monthly';
  metrics: GrowthMetrics;
  opportunities: GrowthOpportunity[];
  campaigns: { active: number; completed: number; totalRevenue: number };
  seoHealth: { score: number; issues: number };
  leadGeneration: { newLeads: number; hotLeads: number; converted: number };
  contentPerformance: { published: number; scheduled: number };
  competitorInsights: string[];
  recommendations: string[];
  aiAnalysis: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  enabled: boolean;
  lastTriggered?: Date;
  triggerCount: number;
}

export interface AutomationTrigger {
  type: 'event' | 'schedule' | 'condition';
  event?: 'new_lead' | 'cart_abandon' | 'purchase' | 'review' | 'inactive';
  schedule?: string; // cron expression
  condition?: {
    field: string;
    operator: 'equals' | 'greater_than' | 'less_than' | 'contains';
    value: string | number;
  };
}

export interface AutomationAction {
  type: 'send_email' | 'send_sms' | 'create_task' | 'update_lead' | 'add_tag' | 'notify';
  config: Record<string, unknown>;
}

// ============================================================================
// SEASONAL & INDIAN MARKET DATA
// ============================================================================

const INDIAN_SEASONAL_CAMPAIGNS = {
  diwali: {
    name: 'Diwali Plant Gifts',
    months: [10, 11], // October-November
    themes: ['lucky plants', 'gift sets', 'air purifying', 'prosperity plants'],
    keywords: ['diwali gift plants', 'lucky plants for diwali', 'diwali plant combo'],
    discounts: true,
  },
  holi: {
    name: 'Holi Colors of Nature',
    months: [3], // March
    themes: ['colorful plants', 'flowering plants', 'spring collection'],
    keywords: ['colorful indoor plants', 'spring flowering plants'],
    discounts: false,
  },
  monsoon: {
    name: 'Monsoon Green Sale',
    months: [6, 7, 8], // June-August
    themes: ['fast growing', 'humidity loving', 'outdoor plants'],
    keywords: ['monsoon plants', 'rainy season plants', 'humidity loving plants'],
    discounts: true,
  },
  summer: {
    name: 'Summer Survival Guide',
    months: [4, 5], // April-May
    themes: ['heat tolerant', 'low water', 'succulents'],
    keywords: ['summer plants india', 'heat resistant plants', 'low water plants'],
    discounts: false,
  },
  winter: {
    name: 'Winter Blooms',
    months: [12, 1, 2], // December-February
    themes: ['flowering', 'winter care', 'indoor cozy'],
    keywords: ['winter flowering plants', 'indoor plants winter', 'winter garden'],
    discounts: false,
  },
  new_year: {
    name: 'New Year New Plants',
    months: [1], // January
    themes: ['new beginnings', 'good luck', 'resolutions'],
    keywords: ['new year plants', 'lucky plants 2024', 'plant resolutions'],
    discounts: true,
  },
};

const CONTENT_PILLARS = {
  education: {
    weight: 0.3,
    topics: [
      'Plant care guides',
      'Troubleshooting plant problems',
      'Seasonal care tips',
      'Plant propagation tutorials',
      'Indian climate specific advice',
    ],
  },
  inspiration: {
    weight: 0.2,
    topics: [
      'Home decor with plants',
      'Plant styling ideas',
      'Before/after transformations',
      'Celebrity plant homes',
      'Balcony garden ideas',
    ],
  },
  product: {
    weight: 0.25,
    topics: [
      'New arrivals showcase',
      'Bestseller highlights',
      'Product comparisons',
      'Customer reviews/testimonials',
      'How to use our products',
    ],
  },
  community: {
    weight: 0.15,
    topics: [
      'Customer plant stories',
      'Q&A sessions',
      'Poll/quizzes',
      'User generated content',
      'Behind the scenes',
    ],
  },
  promotional: {
    weight: 0.1,
    topics: [
      'Sales announcements',
      'Flash deals',
      'Bundle offers',
      'Seasonal promotions',
      'Loyalty rewards',
    ],
  },
};

// ============================================================================
// GROWTH ENGINE AGENT CLASS
// ============================================================================

export class GrowthEngineAgent {
  private seoAgent: SEOResearchAgent;
  private leadAgent: LeadIntelligenceAgent;
  private socialAgent: SocialMediaAgent;
  private backlinkAgent: BacklinkAgent;
  private competitorAgent: CompetitorAnalysisAgent;
  
  private campaigns: Map<string, GrowthCampaign> = new Map();
  private automationRules: Map<string, AutomationRule> = new Map();
  private contentPlan: ContentPlan[] = [];

  constructor() {
    this.seoAgent = new SEOResearchAgent();
    this.leadAgent = new LeadIntelligenceAgent();
    this.socialAgent = new SocialMediaAgent();
    this.backlinkAgent = new BacklinkAgent();
    this.competitorAgent = new CompetitorAnalysisAgent();

    // Initialize default automation rules
    this.initializeDefaultAutomations();
  }

  // ============================================================================
  // MAIN ORCHESTRATION
  // ============================================================================

  /**
   * Run full growth analysis and generate comprehensive report
   */
  async runFullGrowthAnalysis(): Promise<GrowthReport> {
    console.log('🚀 GROWTH ENGINE: Starting full growth analysis...\n');
    const startTime = Date.now();

    // 1. Analyze SEO health
    console.log('📊 Step 1: Analyzing SEO health...');
    let seoReport: BulkSEOReport | null = null;
    try {
      seoReport = await this.seoAgent.analyzeBulkProducts(20);
      console.log(`  → SEO Score: ${seoReport.averageScore}, Issues: ${seoReport.criticalIssues}`);
    } catch (error) {
      console.warn('  → SEO analysis failed:', error);
    }

    // 2. Generate lead report
    console.log('📊 Step 2: Analyzing lead generation...');
    let leadReport: LeadGenReport | null = null;
    try {
      await this.leadAgent.syncWooCommerceCustomers(50);
      leadReport = await this.leadAgent.generateReport();
      console.log(`  → Total leads: ${leadReport.totalLeads}, Hot: ${leadReport.hotLeads}`);
    } catch (error) {
      console.warn('  → Lead analysis failed:', error);
    }

    // 3. Identify growth opportunities
    console.log('📊 Step 3: Identifying growth opportunities...');
    const opportunities = await this.identifyGrowthOpportunities(seoReport, leadReport);
    console.log(`  → Found ${opportunities.length} opportunities`);

    // 4. Calculate growth metrics
    console.log('📊 Step 4: Calculating growth metrics...');
    const metrics = await this.calculateGrowthMetrics(seoReport, leadReport);

    // 5. Get competitor insights
    console.log('📊 Step 5: Gathering competitor insights...');
    const competitorInsights = await this.getQuickCompetitorInsights();

    // 6. Generate AI analysis
    console.log('📊 Step 6: Generating AI analysis...');
    const aiAnalysis = await this.generateAIGrowthAnalysis(metrics, opportunities, competitorInsights);

    // 7. Generate recommendations
    const recommendations = this.generateStrategicRecommendations(metrics, opportunities);

    const duration = Math.round((Date.now() - startTime) / 1000);
    console.log(`\n✅ GROWTH ENGINE: Analysis complete in ${duration}s\n`);

    return {
      generatedAt: new Date(),
      period: 'weekly',
      metrics,
      opportunities: opportunities.slice(0, 10),
      campaigns: {
        active: Array.from(this.campaigns.values()).filter(c => c.status === 'active').length,
        completed: Array.from(this.campaigns.values()).filter(c => c.status === 'completed').length,
        totalRevenue: Array.from(this.campaigns.values()).reduce((sum, c) => sum + c.performance.revenue, 0),
      },
      seoHealth: {
        score: seoReport?.averageScore || 0,
        issues: seoReport?.criticalIssues || 0,
      },
      leadGeneration: {
        newLeads: leadReport?.newLeadsThisWeek || 0,
        hotLeads: leadReport?.hotLeads || 0,
        converted: leadReport?.convertedThisMonth || 0,
      },
      contentPerformance: {
        published: this.contentPlan.filter(p => p.weekOf < new Date()).length,
        scheduled: this.contentPlan.filter(p => p.weekOf >= new Date()).length,
      },
      competitorInsights,
      recommendations,
      aiAnalysis,
    };
  }

  /**
   * Quick daily growth check
   */
  async runDailyCheck(): Promise<{
    hotLeads: Lead[];
    urgentActions: string[];
    todaysTasks: string[];
  }> {
    console.log('☀️ GROWTH ENGINE: Running daily check...');

    // Get hot leads for immediate action
    const hotLeads = this.leadAgent.getHotLeadsForAction().slice(0, 5);

    // Check for urgent actions
    const urgentActions: string[] = [];
    
    // Check cart abandonment
    const cartAbandoners = this.leadAgent.getLeadsBySegment('cart_abandoner');
    if (cartAbandoners.length > 0) {
      urgentActions.push(`${cartAbandoners.length} cart abandoners need follow-up`);
    }

    // Check inactive leads
    const allLeads = this.leadAgent.getAllLeads();
    const inactiveHot = allLeads.filter(l => {
      if (!l.lastActivityAt || l.temperature !== 'hot') return false;
      const daysSince = Math.floor((Date.now() - l.lastActivityAt.getTime()) / (1000 * 60 * 60 * 24));
      return daysSince >= 3;
    });
    if (inactiveHot.length > 0) {
      urgentActions.push(`${inactiveHot.length} hot leads going cold - reach out today!`);
    }

    // Generate today's tasks
    const todaysTasks = this.generateDailyTasks();

    return { hotLeads, urgentActions, todaysTasks };
  }

  // ============================================================================
  // OPPORTUNITY IDENTIFICATION
  // ============================================================================

  private async identifyGrowthOpportunities(
    seoReport: BulkSEOReport | null,
    leadReport: LeadGenReport | null
  ): Promise<GrowthOpportunity[]> {
    const opportunities: GrowthOpportunity[] = [];
    let priorityCounter = 1;

    // SEO Opportunities
    if (seoReport) {
      if (seoReport.averageScore < 60) {
        opportunities.push({
          id: `opp_${priorityCounter++}`,
          type: 'quick_win',
          category: 'seo',
          title: 'Fix Critical SEO Issues',
          description: `Average SEO score is ${seoReport.averageScore}. Fixing ${seoReport.criticalIssues} critical issues could significantly boost organic traffic.`,
          estimatedImpact: 'high',
          estimatedEffort: 'medium',
          priority: 9,
          actionSteps: [
            'Run SEO audit on worst-performing products',
            'Add missing meta descriptions',
            'Optimize product titles with keywords',
            'Add schema markup to all products',
          ],
          metrics: ['Organic traffic', 'Search rankings', 'Click-through rate'],
          automatable: true,
        });
      }

      if (seoReport.productsAnalyzed.some(p => !p.schema)) {
        opportunities.push({
          id: `opp_${priorityCounter++}`,
          type: 'quick_win',
          category: 'seo',
          title: 'Add Product Schema Markup',
          description: 'Many products are missing structured data. Adding schema can improve rich snippets in search results.',
          estimatedImpact: 'medium',
          estimatedEffort: 'low',
          priority: 8,
          actionSteps: [
            'Generate schema for all products',
            'Implement JSON-LD on product pages',
            'Test with Google Rich Results Test',
          ],
          metrics: ['Rich snippet impressions', 'CTR from search'],
          automatable: true,
        });
      }
    }

    // Lead Gen Opportunities
    if (leadReport) {
      if (leadReport.hotLeads > 0) {
        opportunities.push({
          id: `opp_${priorityCounter++}`,
          type: 'quick_win',
          category: 'conversion',
          title: 'Convert Hot Leads',
          description: `${leadReport.hotLeads} hot leads are ready to buy. Personalized outreach could convert them quickly.`,
          estimatedImpact: 'high',
          estimatedEffort: 'low',
          priority: 10,
          actionSteps: [
            'Review hot lead profiles and purchase intent',
            'Send personalized discount codes',
            'Offer free shipping for orders today',
            'Follow up with WhatsApp/call if available',
          ],
          metrics: ['Conversion rate', 'Revenue', 'Time to convert'],
          automatable: false,
        });
      }

      const coldPercentage = leadReport.coldLeads / (leadReport.totalLeads || 1);
      if (coldPercentage > 0.5) {
        opportunities.push({
          id: `opp_${priorityCounter++}`,
          type: 'medium_effort',
          category: 'retention',
          title: 'Re-engage Cold Leads',
          description: `${Math.round(coldPercentage * 100)}% of leads are cold. A re-engagement campaign could revive interest.`,
          estimatedImpact: 'medium',
          estimatedEffort: 'medium',
          priority: 6,
          actionSteps: [
            'Segment cold leads by original interest',
            'Create "We miss you" email sequence',
            'Offer exclusive comeback discount',
            'Share what\'s new since their last visit',
          ],
          metrics: ['Re-engagement rate', 'Reactivated leads', 'Revenue from reactivation'],
          automatable: true,
        });
      }
    }

    // Seasonal Opportunities
    const currentSeason = this.getCurrentSeasonalCampaign();
    if (currentSeason) {
      opportunities.push({
        id: `opp_${priorityCounter++}`,
        type: 'strategic',
        category: 'content',
        title: `Launch ${currentSeason.name} Campaign`,
        description: `Perfect timing for a ${currentSeason.name.toLowerCase()} campaign. Target keywords: ${currentSeason.keywords.slice(0, 3).join(', ')}`,
        estimatedImpact: 'high',
        estimatedEffort: 'medium',
        priority: 8,
        actionSteps: [
          `Create ${currentSeason.name} landing page`,
          `Write ${currentSeason.themes.length} blog posts on themes`,
          'Design social media content calendar',
          currentSeason.discounts ? 'Set up promotional discount codes' : 'Create value-added content',
        ],
        metrics: ['Campaign revenue', 'New customers', 'Social engagement'],
        automatable: false,
      });
    }

    // Content Opportunities
    opportunities.push({
      id: `opp_${priorityCounter++}`,
      type: 'medium_effort',
      category: 'content',
      title: 'Create Educational Content Series',
      description: 'Educational content builds trust and drives organic traffic. Create a plant care series targeting beginners.',
      estimatedImpact: 'medium',
      estimatedEffort: 'medium',
      priority: 7,
      actionSteps: [
        'Research top plant care questions',
        'Create 5-part beginner series',
        'Optimize for featured snippets',
        'Promote via email and social',
      ],
      metrics: ['Organic traffic', 'Time on site', 'Email signups'],
      automatable: true,
    });

    // Email Opportunities
    opportunities.push({
      id: `opp_${priorityCounter++}`,
      type: 'quick_win',
      category: 'email',
      title: 'Set Up Cart Abandonment Sequence',
      description: 'Automated cart recovery emails can recover 10-15% of abandoned carts.',
      estimatedImpact: 'high',
      estimatedEffort: 'low',
      priority: 9,
      actionSteps: [
        'Design 3-email recovery sequence',
        'Email 1: Reminder (1 hour)',
        'Email 2: Social proof (24 hours)',
        'Email 3: Discount offer (48 hours)',
      ],
      metrics: ['Cart recovery rate', 'Recovered revenue', 'Email engagement'],
      automatable: true,
    });

    // Social Opportunities
    opportunities.push({
      id: `opp_${priorityCounter++}`,
      type: 'medium_effort',
      category: 'social',
      title: 'Launch User Generated Content Campaign',
      description: 'UGC builds social proof and engagement. Run a #MyPlantCorner contest on Instagram.',
      estimatedImpact: 'medium',
      estimatedEffort: 'medium',
      priority: 6,
      actionSteps: [
        'Design contest mechanics and prizes',
        'Create announcement posts',
        'Engage with submissions daily',
        'Feature winners on website',
      ],
      metrics: ['UGC submissions', 'New followers', 'Engagement rate'],
      automatable: false,
    });

    // Sort by priority
    return opportunities.sort((a, b) => b.priority - a.priority);
  }

  // ============================================================================
  // CONTENT PLANNING
  // ============================================================================

  /**
   * Generate a 4-week content plan
   */
  async generateContentPlan(weeks: number = 4): Promise<ContentPlan[]> {
    console.log(`📅 GROWTH ENGINE: Generating ${weeks}-week content plan...`);

    const plans: ContentPlan[] = [];
    const startDate = new Date();
    
    // Get seasonal context
    const season = this.getCurrentSeasonalCampaign();
    
    // Get trending keywords
    let trendingKeywords: string[] = [];
    try {
      const seoReport = await this.seoAgent.analyzeBulkProducts(10);
      trendingKeywords = seoReport.topKeywords.slice(0, 10);
    } catch {
      trendingKeywords = ['indoor plants', 'plant care', 'low maintenance plants'];
    }

    for (let week = 0; week < weeks; week++) {
      const weekOf = new Date(startDate);
      weekOf.setDate(weekOf.getDate() + week * 7);
      
      const weekTheme = this.getWeeklyTheme(week, season);
      const weekKeywords = this.selectWeekKeywords(trendingKeywords, weekTheme, week);

      // Generate blog post ideas (2 per week)
      const blogPosts = await this.generateBlogIdeas(weekTheme, weekKeywords, weekOf);

      // Generate social post ideas (14 per week = 2 per day)
      const socialPosts = await this.generateSocialIdeas(weekTheme, weekKeywords, weekOf);

      // Generate email ideas (2 per week)
      const emails = await this.generateEmailIdeas(weekTheme, weekOf);

      plans.push({
        weekOf,
        theme: weekTheme,
        keywords: weekKeywords,
        blogPosts,
        socialPosts,
        emails,
      });
    }

    this.contentPlan = plans;
    console.log(`✅ Created ${weeks}-week content plan`);
    
    return plans;
  }

  private getWeeklyTheme(weekIndex: number, season: typeof INDIAN_SEASONAL_CAMPAIGNS[keyof typeof INDIAN_SEASONAL_CAMPAIGNS] | null): string {
    const themes = [
      'Plant Care Basics',
      'Home Styling with Plants',
      'Seasonal Plant Guide',
      'Customer Success Stories',
    ];

    if (season && weekIndex === 0) {
      return season.name;
    }

    return themes[weekIndex % themes.length];
  }

  private selectWeekKeywords(allKeywords: string[], theme: string, week: number): string[] {
    // Rotate through keywords ensuring variety
    const startIndex = (week * 3) % allKeywords.length;
    const selected = allKeywords.slice(startIndex, startIndex + 5);
    
    // Add theme-specific keywords
    const themeKeywords = theme.toLowerCase().split(' ')
      .filter(w => w.length > 3)
      .map(w => `${w} plants`);

    return [...new Set([...selected, ...themeKeywords])].slice(0, 6);
  }

  private async generateBlogIdeas(theme: string, keywords: string[], weekOf: Date): Promise<BlogPostIdea[]> {
    const ideas: BlogPostIdea[] = [];
    
    if (aiService.isConfigured()) {
      try {
        const prompt = `Generate 2 SEO-optimized blog post ideas for "Whole Lot of Nature" plant store.

Theme: ${theme}
Target Keywords: ${keywords.join(', ')}

Return ONLY valid JSON array:
[
  {
    "title": "Engaging SEO title (50-60 chars)",
    "topic": "Brief topic description",
    "targetKeyword": "main keyword to target",
    "outline": ["Section 1", "Section 2", "Section 3", "Section 4"],
    "estimatedWordCount": 1500
  }
]`;

        const response = await aiService.complete(prompt, {
          temperature: 0.7,
          maxTokens: 600,
        });

        const match = response.match(/\[[\s\S]*\]/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          parsed.forEach((idea: BlogPostIdea, index: number) => {
            const publishDate = new Date(weekOf);
            publishDate.setDate(publishDate.getDate() + (index * 3) + 1);
            
            ideas.push({
              ...idea,
              publishDate,
              status: 'idea',
            });
          });
        }
      } catch (error) {
        console.warn('AI blog generation failed:', error);
      }
    }

    // Fallback ideas
    if (ideas.length === 0) {
      ideas.push({
        title: `Complete Guide to ${theme} | Expert Tips`,
        topic: `Everything you need to know about ${theme.toLowerCase()}`,
        targetKeyword: keywords[0] || 'indoor plants',
        outline: ['Introduction', 'Key Benefits', 'How-To Guide', 'Common Mistakes', 'Conclusion'],
        estimatedWordCount: 1500,
        publishDate: new Date(weekOf.getTime() + 2 * 24 * 60 * 60 * 1000),
        status: 'idea',
      });
    }

    return ideas;
  }

  private async generateSocialIdeas(theme: string, keywords: string[], weekOf: Date): Promise<SocialPostIdea[]> {
    const ideas: SocialPostIdea[] = [];
    const platforms: SocialPostIdea['platform'][] = ['instagram', 'facebook'];
    const types: SocialPostIdea['type'][] = ['educational', 'promotional', 'engagement', 'behind_scenes'];

    for (let day = 0; day < 7; day++) {
      for (let post = 0; post < 2; post++) {
        const platform = platforms[(day + post) % platforms.length];
        const type = types[(day + post) % types.length];
        const keyword = keywords[day % keywords.length];
        
        const scheduledFor = new Date(weekOf);
        scheduledFor.setDate(scheduledFor.getDate() + day);
        scheduledFor.setHours(post === 0 ? 10 : 18, 0, 0, 0);

        ideas.push({
          platform,
          type,
          content: this.generateSocialContent(type, theme, keyword),
          hashtags: this.generateHashtags(keyword, platform),
          imagePrompt: `Beautiful ${keyword} photo, ${type} style, professional plant photography`,
          scheduledFor,
        });
      }
    }

    return ideas;
  }

  private generateSocialContent(type: SocialPostIdea['type'], theme: string, keyword: string): string {
    const templates: Record<SocialPostIdea['type'], string[]> = {
      educational: [
        `Did you know? 🌿 ${keyword} are perfect for Indian homes! Here's why...\n\n#PlantTips #${theme.replace(/\s/g, '')}`,
        `Plant Care Tip: Give your ${keyword} the love it deserves ✨\n\nFollow for more tips! 🪴`,
      ],
      promotional: [
        `🌱 NEW IN: Fresh ${keyword} just arrived at Whole Lot of Nature!\n\nShop now → Link in bio 🛒`,
        `This week only! Get 10% off on all ${keyword}. Use code PLANTLOVE 🌿`,
      ],
      engagement: [
        `Plant lovers, tell us! 🪴\n\nWhat's your favorite ${keyword}? Drop a 🌿 in the comments!`,
        `Monday motivation: Your ${keyword} is counting on you! 💚\n\nTag your plant buddy below 👇`,
      ],
      ugc: [
        `Look at this gorgeous plant corner from @plantlover! 😍\n\nShare yours with #WholeLotOfNature`,
        `Customer love! 💚 Thanks for sharing your ${keyword} journey with us!`,
      ],
      behind_scenes: [
        `Behind the scenes at our nursery! 🌱\n\nMeet our team caring for your future plants 🪴`,
        `Packing your orders with love! 📦💚\n\nEvery plant gets special care before it reaches you.`,
      ],
    };

    const options = templates[type];
    return options[Math.floor(Math.random() * options.length)];
  }

  private generateHashtags(keyword: string, platform: string): string[] {
    const base = ['#plants', '#plantlover', '#indoorplants', '#plantsofinstagram', '#houseplants'];
    const branded = ['#WholeLotOfNature', '#BangalorePlants', '#PlantShop'];
    const keywordHash = `#${keyword.replace(/\s+/g, '').toLowerCase()}`;
    
    const all = [keywordHash, ...branded, ...base];
    return platform === 'instagram' ? all.slice(0, 15) : all.slice(0, 5);
  }

  private async generateEmailIdeas(theme: string, weekOf: Date): Promise<EmailIdea[]> {
    return [
      {
        subject: `🌿 This Week: ${theme} + Special Offer Inside`,
        type: 'newsletter',
        segment: 'all_subscribers',
        scheduledFor: new Date(weekOf.getTime() + 2 * 24 * 60 * 60 * 1000), // Tuesday
        keyPoints: [
          `Featured content: ${theme}`,
          'New arrivals highlight',
          'Plant care tip of the week',
          'Customer spotlight',
        ],
      },
      {
        subject: `Weekend Sale: 15% Off ${theme} Plants 🪴`,
        type: 'promotional',
        segment: 'engaged_subscribers',
        scheduledFor: new Date(weekOf.getTime() + 5 * 24 * 60 * 60 * 1000), // Friday
        keyPoints: [
          'Exclusive weekend discount',
          'Featured products',
          'Limited time offer',
          'Free shipping threshold',
        ],
      },
    ];
  }

  // ============================================================================
  // METRICS & ANALYTICS
  // ============================================================================

  private async calculateGrowthMetrics(
    seoReport: BulkSEOReport | null,
    leadReport: LeadGenReport | null
  ): Promise<GrowthMetrics> {
    // In production, these would come from analytics APIs
    // For now, we calculate estimates based on available data
    
    const leads = this.leadAgent.getAllLeads();
    const customers = leads.filter(l => l.status === 'customer');

    return {
      // Traffic (estimated)
      estimatedMonthlyVisitors: 5000, // Placeholder - would come from GA
      organicTrafficGrowth: seoReport ? Math.round((seoReport.averageScore - 50) / 10 * 5) : 0,
      
      // Conversion
      conversionRate: customers.length > 0 && leads.length > 0 
        ? Math.round((customers.length / leads.length) * 100) 
        : 2.5,
      averageOrderValue: customers.length > 0
        ? Math.round(customers.reduce((sum, c) => sum + (c.ecommerce?.averageOrderValue || 0), 0) / customers.length)
        : 850,
      
      // Retention
      repeatCustomerRate: customers.length > 0
        ? Math.round(customers.filter(c => (c.ecommerce?.ordersCount || 0) > 1).length / customers.length * 100)
        : 25,
      customerLifetimeValue: customers.length > 0
        ? Math.round(customers.reduce((sum, c) => sum + (c.ecommerce?.totalSpent || 0), 0) / customers.length)
        : 2500,
      
      // Engagement
      emailOpenRate: leadReport ? Math.round(leadReport.averageScore * 0.4) : 22,
      socialEngagementRate: 4.5, // Placeholder - would come from social APIs
      
      // Content
      blogPostsPublished: this.contentPlan.filter(p => 
        p.weekOf < new Date() && p.blogPosts.some(b => b.status === 'published')
      ).length,
      socialPostsScheduled: this.contentPlan.reduce((sum, p) => 
        sum + p.socialPosts.filter(s => s.scheduledFor >= new Date()).length, 0
      ),
    };
  }

  private async getQuickCompetitorInsights(): Promise<string[]> {
    // Quick insights without full scraping
    return [
      'Competitors are pushing monsoon-themed content - consider similar campaigns',
      'Free shipping threshold of ₹499 is common - match or beat this',
      'Video content on plant care is trending on competitor social media',
      'Bundle deals (plant + pot + soil) are popular promotional strategy',
    ];
  }

  private async generateAIGrowthAnalysis(
    metrics: GrowthMetrics,
    opportunities: GrowthOpportunity[],
    competitorInsights: string[]
  ): Promise<string> {
    if (!aiService.isConfigured()) {
      return this.generateBasicAnalysis(metrics, opportunities);
    }

    try {
      const prompt = `You are a growth strategist for "Whole Lot of Nature", a premium plant store in Bangalore, India.

Current Metrics:
- Conversion Rate: ${metrics.conversionRate}%
- Average Order Value: ₹${metrics.averageOrderValue}
- Repeat Customer Rate: ${metrics.repeatCustomerRate}%
- Email Open Rate: ${metrics.emailOpenRate}%

Top 3 Opportunities:
${opportunities.slice(0, 3).map((o, i) => `${i + 1}. ${o.title} (Impact: ${o.estimatedImpact}, Priority: ${o.priority}/10)`).join('\n')}

Competitor Insights:
${competitorInsights.slice(0, 3).join('\n')}

Provide a concise 3-4 sentence strategic analysis focusing on:
1. The biggest growth lever to pull right now
2. A quick win for this week
3. One strategic initiative for the month

Be specific and actionable. Write in first person plural ("We should...").`;

      const response = await aiService.complete(prompt, {
        temperature: 0.6,
        maxTokens: 300,
        systemPrompt: 'You are a growth marketing expert. Be concise and actionable.',
      });

      return response;
    } catch (error) {
      console.warn('AI analysis failed:', error);
      return this.generateBasicAnalysis(metrics, opportunities);
    }
  }

  private generateBasicAnalysis(metrics: GrowthMetrics, opportunities: GrowthOpportunity[]): string {
    const topOpp = opportunities[0];
    
    let analysis = `Based on current metrics, `;
    
    if (metrics.conversionRate < 3) {
      analysis += `conversion optimization should be the priority - we're leaving money on the table. `;
    } else {
      analysis += `our conversion is healthy, so focus should shift to traffic growth. `;
    }

    if (topOpp) {
      analysis += `The highest-impact opportunity is "${topOpp.title}" which could drive ${topOpp.estimatedImpact} impact. `;
    }

    analysis += `Quick win: Set up cart abandonment emails this week. Strategic initiative: Launch a seasonal content campaign aligned with current trends.`;

    return analysis;
  }

  private generateStrategicRecommendations(
    metrics: GrowthMetrics,
    opportunities: GrowthOpportunity[]
  ): string[] {
    const recommendations: string[] = [];

    // Priority recommendations based on metrics
    if (metrics.conversionRate < 2) {
      recommendations.push('🚨 PRIORITY: Conversion rate is low. Focus on product page optimization and trust signals.');
    }

    if (metrics.repeatCustomerRate < 20) {
      recommendations.push('🔄 Improve retention: Launch a loyalty program or post-purchase email sequence.');
    }

    if (metrics.emailOpenRate < 20) {
      recommendations.push('📧 Email engagement is low. A/B test subject lines and clean your email list.');
    }

    // Add top opportunity actions
    const quickWins = opportunities.filter(o => o.type === 'quick_win').slice(0, 2);
    quickWins.forEach(opp => {
      recommendations.push(`⚡ Quick Win: ${opp.title} - ${opp.actionSteps[0]}`);
    });

    // Always include growth fundamentals
    recommendations.push('📝 Maintain weekly content publishing cadence for SEO momentum.');
    recommendations.push('📱 Respond to all social comments within 2 hours for algorithm boost.');

    return recommendations.slice(0, 8);
  }

  // ============================================================================
  // AUTOMATION
  // ============================================================================

  private initializeDefaultAutomations(): void {
    // Welcome Series
    this.automationRules.set('welcome', {
      id: 'welcome',
      name: 'Welcome Series',
      trigger: { type: 'event', event: 'new_lead' },
      actions: [
        { type: 'send_email', config: { template: 'welcome_1', delay: 0 } },
        { type: 'send_email', config: { template: 'welcome_2', delay: 2 } },
        { type: 'send_email', config: { template: 'welcome_3', delay: 5 } },
      ],
      enabled: true,
      triggerCount: 0,
    });

    // Cart Abandonment
    this.automationRules.set('cart_abandon', {
      id: 'cart_abandon',
      name: 'Cart Recovery',
      trigger: { type: 'event', event: 'cart_abandon' },
      actions: [
        { type: 'send_email', config: { template: 'cart_reminder', delay: 1 } },
        { type: 'send_email', config: { template: 'cart_discount', delay: 24 } },
      ],
      enabled: true,
      triggerCount: 0,
    });

    // Post-Purchase
    this.automationRules.set('post_purchase', {
      id: 'post_purchase',
      name: 'Post-Purchase Journey',
      trigger: { type: 'event', event: 'purchase' },
      actions: [
        { type: 'send_email', config: { template: 'thank_you', delay: 0 } },
        { type: 'send_email', config: { template: 'care_guide', delay: 3 } },
        { type: 'send_email', config: { template: 'review_request', delay: 14 } },
      ],
      enabled: true,
      triggerCount: 0,
    });

    // Re-engagement
    this.automationRules.set('reengagement', {
      id: 'reengagement',
      name: 'Re-engagement Campaign',
      trigger: { type: 'event', event: 'inactive' },
      actions: [
        { type: 'send_email', config: { template: 'miss_you', delay: 0 } },
        { type: 'add_tag', config: { tag: 'reengagement_sent' } },
      ],
      enabled: true,
      triggerCount: 0,
    });
  }

  /**
   * Create a growth campaign
   */
  createCampaign(config: Omit<GrowthCampaign, 'id' | 'performance'>): GrowthCampaign {
    const campaign: GrowthCampaign = {
      ...config,
      id: `campaign_${Date.now()}`,
      performance: {
        reach: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0,
        roi: 0,
      },
    };

    this.campaigns.set(campaign.id, campaign);
    console.log(`🎯 GROWTH ENGINE: Created campaign "${campaign.name}"`);
    
    return campaign;
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private getCurrentSeasonalCampaign(): typeof INDIAN_SEASONAL_CAMPAIGNS[keyof typeof INDIAN_SEASONAL_CAMPAIGNS] | null {
    const currentMonth = new Date().getMonth() + 1;
    
    for (const [key, campaign] of Object.entries(INDIAN_SEASONAL_CAMPAIGNS)) {
      if (campaign.months.includes(currentMonth)) {
        return campaign;
      }
    }
    return null;
  }

  private generateDailyTasks(): string[] {
    const tasks: string[] = [];
    const dayOfWeek = new Date().getDay();

    // Daily tasks
    tasks.push('📱 Respond to all social media comments and DMs');
    tasks.push('📧 Review and send scheduled emails');
    tasks.push('🔥 Check and follow up with hot leads');

    // Day-specific tasks
    switch (dayOfWeek) {
      case 1: // Monday
        tasks.push('📊 Review last week\'s performance metrics');
        tasks.push('📝 Plan this week\'s content');
        break;
      case 2: // Tuesday
        tasks.push('✍️ Write/review blog content');
        break;
      case 3: // Wednesday
        tasks.push('📸 Create social media content');
        break;
      case 4: // Thursday
        tasks.push('📧 Prepare newsletter');
        break;
      case 5: // Friday
        tasks.push('🎯 Launch weekend promotional campaign');
        break;
    }

    return tasks;
  }

  /**
   * Get all active campaigns
   */
  getActiveCampaigns(): GrowthCampaign[] {
    return Array.from(this.campaigns.values()).filter(c => c.status === 'active');
  }

  /**
   * Get automation rules
   */
  getAutomationRules(): AutomationRule[] {
    return Array.from(this.automationRules.values());
  }

  /**
   * Get current content plan
   */
  getContentPlan(): ContentPlan[] {
    return this.contentPlan;
  }
}

// Export singleton instance
export const growthEngineAgent = new GrowthEngineAgent();
export default GrowthEngineAgent;
