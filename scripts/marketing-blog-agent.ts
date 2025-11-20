#!/usr/bin/env tsx
/**
 * Marketing Blog Agent
 * Automated SEO-optimized blog post generation based on competitor analysis and trends
 * 
 * Features:
 * - Analyzes competitors for SEO insights
 * - Gathers trending topics from multiple sources
 * - Generates 10+ SEO-optimized blog posts
 * - Saves comprehensive reports
 * 
 * Usage:
 *   npm run marketing:blog
 *   npm run marketing:blog -- --posts=15
 *   npm run marketing:blog -- --quick
 */

import * as fs from 'fs';
import * as path from 'path';
import CompetitorAnalysisAgent, { CompetitorData, CompetitorInsights } from '../src/lib/agents/competitorAnalysisAgent';
import TrendScraper, { TrendData } from '../src/lib/agents/trendScraper';

// Import brand voice configuration
interface BrandVoice {
  brand: { name: string; tagline: string; website: string };
  seo_keywords: { primary: string[]; secondary: string[]; long_tail: string[] };
  content_pillars: Array<{ name: string; focus: string; topics: string[] }>;
  social_media: { hashtags: { main: string[]; supporting: string[] }; calls_to_action: string[] };
}

interface ContentRequest {
  type: 'blog' | 'product' | 'social' | 'meta' | 'email';
  topic: string;
  keywords?: string[];
  length?: 'short' | 'medium' | 'long';
  tone?: 'educational' | 'inspirational' | 'storytelling' | 'promotional';
}

interface GeneratedContent {
  type: string;
  title?: string;
  content: string;
  meta_description?: string;
  seo_keywords: string[];
  hashtags?: string[];
  call_to_action?: string;
  word_count: number;
  seo_score: number;
  suggestions: string[];
}

class MarketingBlogAgent {
  private brandVoice: BrandVoice;
  private competitorAgent: CompetitorAnalysisAgent;
  private trendScraper: TrendScraper;
  private outputDir: string;
  private reportDir: string;

  // Competitor list
  private competitors = [
    { name: 'Nurserylive', url: 'https://nurserylive.com' },
    { name: 'Ugaoo', url: 'https://www.ugaoo.com' },
    { name: 'The Affordable Organic Store', url: 'https://theaffordableorganicstore.com' },
  ];

  constructor() {
    // Load brand voice
    const brandVoicePath = path.join(process.cwd(), 'brand-voice.json');
    this.brandVoice = JSON.parse(fs.readFileSync(brandVoicePath, 'utf-8'));

    // Initialize agents
    this.competitorAgent = new CompetitorAnalysisAgent();
    this.trendScraper = new TrendScraper({
      redditSubreddits: ['gardening', 'plants', 'houseplants', 'Indiegardeners', 'IndianGardening'],
      maxResults: 50,
    });

    // Setup output directories
    this.outputDir = path.join(process.cwd(), 'content-output');
    this.reportDir = path.join(process.cwd(), 'marketing-reports');

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true });
    }
  }

  /**
   * Main execution flow
   */
  async run(options: { posts?: number; quick?: boolean } = {}): Promise<void> {
    const postsToGenerate = options.posts || 10;
    const quickMode = options.quick || false;

    console.log('\n' + '='.repeat(80));
    console.log('🚀 MARKETING BLOG AGENT - SEO-Optimized Content Generation');
    console.log('='.repeat(80));
    console.log(`Target: Generate ${postsToGenerate} blog posts`);
    console.log(`Mode: ${quickMode ? 'Quick (mock data)' : 'Full (competitor analysis + trends)'}`);
    console.log('='.repeat(80) + '\n');

    try {
      // Step 1: Analyze Competitors
      console.log('\n📊 STEP 1: COMPETITOR ANALYSIS');
      console.log('-'.repeat(80));
      const competitorData = await this.analyzeCompetitors(quickMode);

      // Step 2: Gather Trending Topics
      console.log('\n📈 STEP 2: TREND ANALYSIS');
      console.log('-'.repeat(80));
      const trends = await this.gatherTrends(quickMode);

      // Step 3: Generate Blog Topics
      console.log('\n💡 STEP 3: GENERATING BLOG TOPICS');
      console.log('-'.repeat(80));
      const blogTopics = this.generateBlogTopics(competitorData, trends, postsToGenerate);
      console.log(`✅ Generated ${blogTopics.length} unique blog topics\n`);

      // Step 4: Generate Blog Posts
      console.log('\n✍️  STEP 4: GENERATING SEO-OPTIMIZED BLOG POSTS');
      console.log('-'.repeat(80));
      const generatedPosts = await this.generateBlogPosts(blogTopics);

      // Step 5: Generate Summary Report
      console.log('\n📝 STEP 5: GENERATING REPORTS');
      console.log('-'.repeat(80));
      this.generateReports(competitorData, trends, generatedPosts);

      // Final Summary
      console.log('\n' + '='.repeat(80));
      console.log('✅ MARKETING BLOG AGENT - COMPLETE');
      console.log('='.repeat(80));
      console.log(`📊 Competitors Analyzed: ${competitorData.competitors.length}`);
      console.log(`📈 Trends Gathered: ${trends.length}`);
      console.log(`📝 Blog Posts Generated: ${generatedPosts.length}`);
      console.log(`📁 Output Directory: ${this.outputDir}`);
      console.log(`📋 Reports Directory: ${this.reportDir}`);
      console.log('='.repeat(80) + '\n');

      console.log('🎉 Success! Your SEO-optimized blog posts are ready for publishing.');
      console.log(`\n💡 Next Steps:`);
      console.log(`   1. Review generated posts in: ${this.outputDir}/`);
      console.log(`   2. Check analysis reports in: ${this.reportDir}/`);
      console.log(`   3. Edit and customize as needed`);
      console.log(`   4. Publish to your blog/website\n`);
    } catch (error: any) {
      console.error('\n❌ ERROR:', error.message);
      console.error('\nStack trace:', error.stack);
      process.exit(1);
    }
  }

  /**
   * Analyze competitors for SEO insights
   */
  private async analyzeCompetitors(quickMode: boolean): Promise<{ competitors: CompetitorData[]; insights: CompetitorInsights | null }> {
    if (quickMode) {
      console.log('⚡ Quick mode: Using mock competitor data\n');
      const mockCompetitors = this.competitors.map(c =>
        this.competitorAgent.generateMockData(c.name, c.url)
      );
      const insights = this.competitorAgent.generateInsights(mockCompetitors);
      return { competitors: mockCompetitors, insights };
    }

    console.log(`Analyzing ${this.competitors.length} competitors...\n`);
    const competitorData: CompetitorData[] = [];

    for (const competitor of this.competitors) {
      try {
        console.log(`\n🔍 Analyzing: ${competitor.name}`);
        const analysis = await this.competitorAgent.analyzeCompetitor(competitor.url, competitor.name);
        
        // Use mock data if scraping failed
        if (analysis.products.length === 0 && analysis.keywords.length <= 3) {
          console.log(`  ⚠️ Scraping returned minimal data, using mock data`);
          competitorData.push(this.competitorAgent.generateMockData(competitor.name, competitor.url));
        } else {
          competitorData.push(analysis);
        }
      } catch (error: any) {
        console.error(`  ❌ Error analyzing ${competitor.name}: ${error.message}`);
        console.log(`  ℹ️  Using mock data for ${competitor.name}`);
        competitorData.push(this.competitorAgent.generateMockData(competitor.name, competitor.url));
      }

      // Delay between requests to be respectful
      await this.delay(2000);
    }

    const insights = competitorData.length > 0 ? this.competitorAgent.generateInsights(competitorData) : null;

    console.log('\n✅ Competitor Analysis Complete');
    console.log(`   - Competitors analyzed: ${competitorData.length}`);
    console.log(`   - Total products found: ${competitorData.reduce((sum, c) => sum + c.products.length, 0)}`);
    console.log(`   - Unique keywords extracted: ${insights?.topKeywords.length || 0}`);

    return { competitors: competitorData, insights };
  }

  /**
   * Gather trending topics from multiple sources
   */
  private async gatherTrends(quickMode: boolean): Promise<TrendData[]> {
    if (quickMode) {
      console.log('⚡ Quick mode: Generating trending topics from keywords\n');
      return this.generateMockTrends();
    }

    console.log('Scraping trending topics from Reddit, Medium, and other sources...\n');

    try {
      const trends = await this.trendScraper.getAllTrends();
      console.log(`✅ Found ${trends.length} trending topics`);
      
      if (trends.length === 0) {
        console.log('⚠️ No trends found, generating from keywords');
        return this.generateMockTrends();
      }

      // Display top trends
      console.log('\n📌 Top Trending Topics:');
      trends.slice(0, 10).forEach((trend, i) => {
        console.log(`   ${i + 1}. ${trend.title} (${trend.source}, ${trend.engagement} engagement)`);
      });

      return trends;
    } catch (error: any) {
      console.error(`❌ Error gathering trends: ${error.message}`);
      console.log('ℹ️  Falling back to keyword-based topics');
      return this.generateMockTrends();
    }
  }

  /**
   * Generate mock trends from brand keywords
   */
  private generateMockTrends(): TrendData[] {
    const allKeywords = [
      ...this.brandVoice.seo_keywords.primary,
      ...this.brandVoice.seo_keywords.secondary,
      ...this.brandVoice.seo_keywords.long_tail,
    ];

    const trendTemplates = [
      'How to grow {keyword} successfully',
      'Best practices for {keyword}',
      '{keyword}: Complete beginner guide',
      'Top 10 tips for {keyword}',
      '{keyword} mistakes to avoid',
      'Ultimate guide to {keyword}',
      '{keyword} for small spaces',
      'Organic {keyword} techniques',
      '{keyword} in Indian climate',
      '{keyword}: Benefits and uses',
    ];

    const trends: TrendData[] = [];
    const usedTopics = new Set<string>();

    for (const keyword of allKeywords) {
      for (const template of trendTemplates) {
        const title = template.replace('{keyword}', keyword);
        
        if (!usedTopics.has(title.toLowerCase())) {
          trends.push({
            title,
            source: 'brand-keywords',
            engagement: Math.floor(Math.random() * 500) + 100,
            timestamp: new Date(),
            category: this.categorizeKeyword(keyword),
            keywords: [keyword],
            description: `Trending topic about ${keyword}`,
          });
          usedTopics.add(title.toLowerCase());
        }

        if (trends.length >= 50) break;
      }
      if (trends.length >= 50) break;
    }

    return trends.sort((a, b) => b.engagement - a.engagement);
  }

  /**
   * Generate blog topics from competitor insights and trends
   */
  private generateBlogTopics(
    competitorData: { competitors: CompetitorData[]; insights: CompetitorInsights | null },
    trends: TrendData[],
    count: number
  ): string[] {
    const topics: string[] = [];
    const usedTopics = new Set<string>();

    // 1. Topics from competitor keywords
    if (competitorData.insights) {
      const topKeywords = competitorData.insights.topKeywords.slice(0, 15);
      topKeywords.forEach(keyword => {
        const topic = this.createBlogTopic(keyword, 'competitor');
        if (topic && !usedTopics.has(topic.toLowerCase())) {
          topics.push(topic);
          usedTopics.add(topic.toLowerCase());
        }
      });
    }

    // 2. Topics from trends
    trends.slice(0, 20).forEach(trend => {
      // Use trend title or create topic from keywords
      let topic = trend.title;
      
      // If it's already a question or guide, use it directly
      if (trend.title.match(/how to|guide|tips|best|top|ultimate/i)) {
        topic = trend.title;
      } else {
        // Otherwise, create a topic from the trend
        const keyword = trend.keywords[0] || trend.title.split(' ')[0];
        topic = this.createBlogTopic(keyword, 'trend');
      }

      if (topic && !usedTopics.has(topic.toLowerCase())) {
        topics.push(topic);
        usedTopics.add(topic.toLowerCase());
      }
    });

    // 3. Topics from content pillars
    this.brandVoice.content_pillars.forEach(pillar => {
      pillar.topics.slice(0, 3).forEach(topic => {
        const blogTopic = this.createBlogTopic(topic, 'pillar');
        if (blogTopic && !usedTopics.has(blogTopic.toLowerCase())) {
          topics.push(blogTopic);
          usedTopics.add(blogTopic.toLowerCase());
        }
      });
    });

    // 4. Topics from long-tail keywords
    this.brandVoice.seo_keywords.long_tail.forEach(keyword => {
      if (!usedTopics.has(keyword.toLowerCase())) {
        topics.push(keyword);
        usedTopics.add(keyword.toLowerCase());
      }
    });

    // Return the requested number of unique topics
    return topics.slice(0, count);
  }

  /**
   * Create a blog-worthy topic from a keyword
   */
  private createBlogTopic(keyword: string, source: 'competitor' | 'trend' | 'pillar'): string {
    const templates: { [key: string]: string[] } = {
      competitor: [
        `The Complete Guide to ${keyword}`,
        `Everything You Need to Know About ${keyword}`,
        `${keyword}: Best Practices for Beginners`,
        `How to Master ${keyword} in Your Garden`,
        `${keyword}: Tips from the Experts`,
      ],
      trend: [
        `${keyword}: The Ultimate Guide for Indian Gardeners`,
        `Why ${keyword} is Trending in 2025`,
        `${keyword}: Top 10 Tips for Success`,
        `The Truth About ${keyword} That Nobody Tells You`,
        `${keyword} Made Easy: A Step-by-Step Guide`,
      ],
      pillar: [
        `${keyword}: A Comprehensive Guide`,
        `Mastering ${keyword} for Sustainable Living`,
        `${keyword}: From Beginner to Expert`,
        `The Science and Art of ${keyword}`,
        `${keyword}: Transform Your Garden Naturally`,
      ],
    };

    const templateList = templates[source];
    const template = templateList[Math.floor(Math.random() * templateList.length)];
    return template.replace('${keyword}', keyword);
  }

  /**
   * Generate blog posts using the content agent logic
   */
  private async generateBlogPosts(topics: string[]): Promise<GeneratedContent[]> {
    const generatedPosts: GeneratedContent[] = [];

    console.log(`Generating ${topics.length} SEO-optimized blog posts...\n`);

    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i];
      console.log(`\n[${i + 1}/${topics.length}] Generating: ${topic}`);

      try {
        const content = this.generateBlogPost(topic);
        generatedPosts.push(content);

        // Save individual post
        this.saveBlogPost(content, i + 1);

        console.log(`   ✅ Generated (${content.word_count} words, SEO score: ${content.seo_score}/100)`);
      } catch (error: any) {
        console.error(`   ❌ Error: ${error.message}`);
      }

      // Small delay
      await this.delay(100);
    }

    console.log(`\n✅ Successfully generated ${generatedPosts.length}/${topics.length} blog posts`);
    return generatedPosts;
  }

  /**
   * Generate a single blog post
   */
  private generateBlogPost(topic: string): GeneratedContent {
    const keywords = this.selectKeywords(topic, 5);
    const pillar = this.findContentPillar(topic);

    // Generate title
    const title = this.generateBlogTitle(topic, keywords);

    // Generate content
    const intro = this.generateIntro(topic, pillar);
    const body = this.generateBody(topic, keywords, pillar);
    const conclusion = this.generateConclusion(topic);

    const fullContent = `# ${title}\n\n${intro}\n\n${body}\n\n${conclusion}`;

    // Generate meta
    const metaDescription = this.generateMetaDescription(topic, keywords);

    // Calculate SEO score
    const seoScore = this.calculateSEOScore(fullContent, title, metaDescription, keywords);

    return {
      type: 'blog',
      title,
      content: fullContent,
      meta_description: metaDescription,
      seo_keywords: keywords,
      hashtags: this.selectHashtags(5),
      word_count: fullContent.split(/\s+/).length,
      seo_score: seoScore,
      suggestions: this.generateSuggestions(seoScore, fullContent, keywords),
    };
  }

  // Content generation helpers (simplified versions from content-agent.ts)

  private generateBlogTitle(topic: string, keywords: string[]): string {
    return `${topic} | ${this.brandVoice.brand.name}`;
  }

  private generateIntro(topic: string, pillar: any): string {
    return `At ${this.brandVoice.brand.name}, we believe in "${this.brandVoice.brand.tagline}." And when it comes to ${topic.toLowerCase()}, this philosophy guides everything we do.\n\nWhether you're just starting your gardening journey or looking to deepen your connection with nature, this comprehensive guide will help you understand ${topic.toLowerCase()} in a way that's practical, sustainable, and deeply rewarding.`;
  }

  private generateBody(topic: string, keywords: string[], pillar: any): string {
    return `## Understanding ${topic}\n\n${topic} is more than just a gardening practice — it's a way of life. When you embrace ${topic.toLowerCase()}, you're participating in Earth's natural cycles and creating a healthier environment.\n\n### Key Benefits of ${topic}\n\n- **Sustainable Living**: ${keywords[0]} supports eco-friendly practices\n- **Natural Connection**: Strengthens your relationship with ${keywords[1]}\n- **Health Benefits**: Promotes ${keywords[2]} and overall wellbeing\n- **Cost-Effective**: Reduces dependence on commercial products\n- **Community Building**: Connects you with like-minded nature lovers\n\n## Getting Started with ${topic}\n\n**Step 1: Choose the Right ${keywords[0]}**\nNot all ${keywords[0]} are created equal. Look for native varieties that are adapted to your local climate and soil conditions.\n\n**Step 2: Prepare Your ${keywords[1]}**\nHealthy ${keywords[1]} is the foundation of success. Ensure proper drainage, nutrients, and organic matter.\n\n**Step 3: Practice Sustainable ${keywords[2]}**\nAvoid chemical solutions. Instead, focus on natural, organic methods that support long-term ecosystem health.\n\n## Common Mistakes to Avoid\n\n❌ **Over-reliance on chemicals** — Synthetic fertilizers damage soil biology\n❌ **Ignoring native plants** — Non-native species require more resources\n❌ **Impatient approach** — Natural methods take time but yield better results\n\n✅ Instead, embrace organic, patient, and soil-centered practices.\n\n## How We Can Help\n\nAt ${this.brandVoice.brand.name}, we offer:\n\n🌱 **100% Organic Products** — No harmful chemicals\n💚 **Expert Guidance** — Free consultations and care tips\n🌍 **Sustainable Sourcing** — Supporting local ecosystems\n📦 **Fast Delivery** — Fresh products delivered to your door\n\nExplore our collection of ${keywords[0]}, ${keywords[1]}, and ${keywords[2]} products to start your journey today.`;
  }

  private generateConclusion(topic: string): string {
    return `## Join the Movement\n\n${topic} is more than a trend — it's a return to our roots, a reconnection with the Earth, and a promise to future generations.\n\nAt ${this.brandVoice.brand.name}, we're here to support your journey every step of the way. From premium organic products to expert guidance, we've got everything you need to succeed.\n\n💚 **Ready to get started?** Browse our collection and discover the joy of ${topic.toLowerCase()}.\n\n🌱 *${this.brandVoice.brand.tagline}*\n\n---\n\n**Questions?** Reach out to our team at ${this.brandVoice.brand.website} — we're always happy to help fellow nature lovers!\n\n#${topic.replace(/\s+/g, '')} #SustainableGardening #OrganicGardening #WholeLotOfNature`;
  }

  private generateMetaDescription(topic: string, keywords: string[]): string {
    return `Complete guide to ${topic.toLowerCase()}. Learn about ${keywords[0]}, ${keywords[1]}, and sustainable practices. Expert tips from ${this.brandVoice.brand.name}.`;
  }

  private findContentPillar(topic: string): any {
    const normalized = topic.toLowerCase();
    return this.brandVoice.content_pillars.find(p =>
      p.name.toLowerCase().includes(normalized) ||
      p.topics.some(t => t.toLowerCase().includes(normalized))
    ) || this.brandVoice.content_pillars[0];
  }

  private selectKeywords(topic: string, count: number): string[] {
    const allKeywords = [
      ...this.brandVoice.seo_keywords.primary,
      ...this.brandVoice.seo_keywords.secondary,
    ];

    const relevant = allKeywords.filter(k =>
      topic.toLowerCase().includes(k.toLowerCase()) ||
      k.toLowerCase().includes(topic.toLowerCase())
    );

    while (relevant.length < count && allKeywords.length > 0) {
      const random = allKeywords[Math.floor(Math.random() * allKeywords.length)];
      if (!relevant.includes(random)) {
        relevant.push(random);
      }
    }

    return relevant.slice(0, count);
  }

  private selectHashtags(count: number): string[] {
    const main = this.brandVoice.social_media.hashtags.main;
    const supporting = this.brandVoice.social_media.hashtags.supporting;

    const selected = [...main];

    while (selected.length < count && supporting.length > 0) {
      const random = supporting[Math.floor(Math.random() * supporting.length)];
      if (!selected.includes(random)) {
        selected.push(random);
      }
    }

    return selected.slice(0, count);
  }

  private calculateSEOScore(content: string, title: string, meta: string, keywords: string[]): number {
    let score = 100;

    if (title.length < 50 || title.length > 60) score -= 10;
    if (meta.length < 150 || meta.length > 160) score -= 10;

    const contentLower = content.toLowerCase();
    keywords.forEach(keyword => {
      if (!contentLower.includes(keyword.toLowerCase())) {
        score -= 5;
      }
    });

    const wordCount = content.split(/\s+/).length;
    if (wordCount < 300) score -= 15;
    if (wordCount > 2000) score -= 5;

    if (!content.includes('##')) score -= 10;

    return Math.max(0, score);
  }

  private generateSuggestions(score: number, content: string, keywords: string[]): string[] {
    const suggestions: string[] = [];

    if (score < 70) {
      suggestions.push('⚠️ SEO score is low. Review keyword usage and content structure.');
    }

    const wordCount = content.split(/\s+/).length;
    if (wordCount < 300) {
      suggestions.push('📝 Content is too short. Aim for at least 300 words for better SEO.');
    }

    if (!content.includes('##')) {
      suggestions.push('📋 Add section headers (##) to improve readability and SEO.');
    }

    if (suggestions.length === 0) {
      suggestions.push('✅ Content looks great! Review and publish.');
    }

    return suggestions;
  }

  private categorizeKeyword(keyword: string): 'plants' | 'gardening' | 'nature' | 'sustainability' {
    const lower = keyword.toLowerCase();

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
   * Save individual blog post
   */
  private saveBlogPost(content: GeneratedContent, index: number): void {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `blog-post-${index}-${timestamp}.md`;
    const filepath = path.join(this.outputDir, filename);

    let output = `# ${content.title}\n\n`;
    output += `**Meta Description:** ${content.meta_description}\n\n`;
    output += `**Keywords:** ${content.seo_keywords.join(', ')}\n\n`;
    output += `**Hashtags:** ${content.hashtags?.join(' ')}\n\n`;
    output += `---\n\n${content.content}\n\n---\n\n`;
    output += `**Word Count:** ${content.word_count}\n`;
    output += `**SEO Score:** ${content.seo_score}/100\n\n`;
    output += `**Suggestions:**\n${content.suggestions.map(s => `- ${s}`).join('\n')}\n`;

    fs.writeFileSync(filepath, output, 'utf-8');
  }

  /**
   * Generate comprehensive reports
   */
  private generateReports(
    competitorData: { competitors: CompetitorData[]; insights: CompetitorInsights | null },
    trends: TrendData[],
    generatedPosts: GeneratedContent[]
  ): void {
    const timestamp = new Date().toISOString().split('T')[0];

    // 1. Competitor Analysis Report
    const competitorReport = this.generateCompetitorReport(competitorData);
    fs.writeFileSync(
      path.join(this.reportDir, `competitor-analysis-${timestamp}.md`),
      competitorReport,
      'utf-8'
    );

    // 2. Trend Analysis Report
    const trendReport = this.generateTrendReport(trends);
    fs.writeFileSync(
      path.join(this.reportDir, `trend-analysis-${timestamp}.md`),
      trendReport,
      'utf-8'
    );

    // 3. Content Generation Summary
    const summaryReport = this.generateSummaryReport(competitorData, trends, generatedPosts);
    fs.writeFileSync(
      path.join(this.reportDir, `content-summary-${timestamp}.md`),
      summaryReport,
      'utf-8'
    );

    // 4. JSON data export
    const dataExport = {
      timestamp: new Date().toISOString(),
      competitors: competitorData.competitors.map(c => ({
        name: c.name,
        url: c.url,
        seoScore: c.seoScore,
        productsFound: c.products.length,
        keywordsExtracted: c.keywords.length,
      })),
      insights: competitorData.insights,
      trends: trends.slice(0, 20),
      generatedPosts: generatedPosts.map(p => ({
        title: p.title,
        wordCount: p.word_count,
        seoScore: p.seo_score,
        keywords: p.seo_keywords,
      })),
    };

    fs.writeFileSync(
      path.join(this.reportDir, `marketing-data-${timestamp}.json`),
      JSON.stringify(dataExport, null, 2),
      'utf-8'
    );

    console.log(`✅ Reports saved to ${this.reportDir}/`);
  }

  private generateCompetitorReport(data: { competitors: CompetitorData[]; insights: CompetitorInsights | null }): string {
    let report = `# Competitor Analysis Report\n\n`;
    report += `**Generated:** ${new Date().toLocaleString()}\n\n`;
    report += `---\n\n`;

    report += `## Summary\n\n`;
    report += `- **Competitors Analyzed:** ${data.competitors.length}\n`;
    report += `- **Total Products Found:** ${data.competitors.reduce((sum, c) => sum + c.products.length, 0)}\n`;
    report += `- **Unique Keywords:** ${data.insights?.topKeywords.length || 0}\n`;
    report += `- **Average SEO Score:** ${Math.round(data.competitors.reduce((sum, c) => sum + c.seoScore, 0) / data.competitors.length)}/100\n\n`;

    if (data.insights) {
      report += `## Top Keywords to Target\n\n`;
      data.insights.topKeywords.slice(0, 20).forEach((keyword, i) => {
        report += `${i + 1}. ${keyword}\n`;
      });
      report += `\n`;

      report += `## Recommendations\n\n`;
      data.insights.recommendations.forEach(rec => {
        report += `- ${rec}\n`;
      });
      report += `\n`;

      if (data.insights.priceRange.min > 0) {
        report += `## Price Analysis\n\n`;
        report += `- **Minimum Price:** ₹${data.insights.priceRange.min}\n`;
        report += `- **Maximum Price:** ₹${data.insights.priceRange.max}\n`;
        report += `- **Average Content Length:** ${data.insights.averageWordCount} words\n\n`;
      }
    }

    report += `## Competitor Details\n\n`;
    data.competitors.forEach(comp => {
      report += `### ${comp.name}\n\n`;
      report += `- **URL:** ${comp.url}\n`;
      report += `- **SEO Score:** ${comp.seoScore}/100\n`;
      report += `- **Products Found:** ${comp.products.length}\n`;
      report += `- **Keywords Extracted:** ${comp.keywords.length}\n`;
      report += `- **Top Keywords:** ${comp.keywords.slice(0, 10).map(k => k.keyword).join(', ')}\n\n`;
    });

    return report;
  }

  private generateTrendReport(trends: TrendData[]): string {
    let report = `# Trend Analysis Report\n\n`;
    report += `**Generated:** ${new Date().toLocaleString()}\n\n`;
    report += `---\n\n`;

    report += `## Summary\n\n`;
    report += `- **Total Trends Collected:** ${trends.length}\n`;
    report += `- **Sources:** Reddit, Medium, Google Trends, Keywords\n`;
    report += `- **Date Range:** Last 30 days\n\n`;

    report += `## Top Trending Topics\n\n`;
    trends.slice(0, 30).forEach((trend, i) => {
      report += `${i + 1}. **${trend.title}**\n`;
      report += `   - Source: ${trend.source}\n`;
      report += `   - Engagement: ${trend.engagement}\n`;
      report += `   - Category: ${trend.category}\n`;
      report += `   - Keywords: ${trend.keywords.join(', ')}\n\n`;
    });

    report += `## Category Breakdown\n\n`;
    const categoryCount = trends.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(categoryCount).forEach(([category, count]) => {
      report += `- **${category}:** ${count} trends\n`;
    });

    return report;
  }

  private generateSummaryReport(
    competitorData: { competitors: CompetitorData[]; insights: CompetitorInsights | null },
    trends: TrendData[],
    posts: GeneratedContent[]
  ): string {
    let report = `# Marketing Content Generation Summary\n\n`;
    report += `**Generated:** ${new Date().toLocaleString()}\n`;
    report += `**Brand:** ${this.brandVoice.brand.name}\n`;
    report += `**Tagline:** ${this.brandVoice.brand.tagline}\n\n`;
    report += `---\n\n`;

    report += `## Execution Summary\n\n`;
    report += `✅ **Competitors Analyzed:** ${competitorData.competitors.length}\n`;
    report += `✅ **Trends Gathered:** ${trends.length}\n`;
    report += `✅ **Blog Posts Generated:** ${posts.length}\n`;
    report += `✅ **Average SEO Score:** ${Math.round(posts.reduce((sum, p) => sum + p.seo_score, 0) / posts.length)}/100\n`;
    report += `✅ **Total Word Count:** ${posts.reduce((sum, p) => sum + p.word_count, 0).toLocaleString()} words\n\n`;

    report += `## Generated Blog Posts\n\n`;
    posts.forEach((post, i) => {
      report += `### ${i + 1}. ${post.title}\n\n`;
      report += `- **Word Count:** ${post.word_count}\n`;
      report += `- **SEO Score:** ${post.seo_score}/100\n`;
      report += `- **Keywords:** ${post.seo_keywords.join(', ')}\n`;
      report += `- **Status:** ${post.seo_score >= 80 ? '✅ Ready to publish' : '⚠️ Needs review'}\n\n`;
    });

    report += `## Next Steps\n\n`;
    report += `1. Review generated blog posts in \`content-output/\` directory\n`;
    report += `2. Edit and customize content as needed\n`;
    report += `3. Add relevant images and internal links\n`;
    report += `4. Publish to your blog/website\n`;
    report += `5. Share on social media using provided hashtags\n`;
    report += `6. Monitor performance and engagement\n\n`;

    report += `## SEO Recommendations\n\n`;
    if (competitorData.insights) {
      competitorData.insights.recommendations.forEach(rec => {
        report += `- ${rec}\n`;
      });
    }

    return report;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const options: { posts?: number; quick?: boolean } = {};

  // Parse arguments
  args.forEach(arg => {
    if (arg.startsWith('--posts=')) {
      options.posts = parseInt(arg.split('=')[1]) || 10;
    }
    if (arg === '--quick') {
      options.quick = true;
    }
  });

  const agent = new MarketingBlogAgent();
  await agent.run(options);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
