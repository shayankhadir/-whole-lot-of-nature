/**
 * AI-Powered Blog Post Generator
 * Creates SEO-optimized content from trending topics
 */

import { TrendData } from './trendScraper';
import SEOOptimizer, { BlogPostSEO } from './seoOptimizer';

export interface GeneratedBlogPost {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  seoData: BlogPostSEO;
  featuredImage?: string;
  categories: string[];
  tags: string[];
  status: 'draft' | 'scheduled' | 'published';
  scheduledDate?: Date;
  wordCount: number;
  estimatedReadTime: number;
}

class BlogPostGenerator {
  private seoOptimizer = new SEOOptimizer();
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
  }

  /**
   * Generate a complete blog post from a trend
   */
  async generateFromTrend(trend: TrendData): Promise<GeneratedBlogPost> {
    const { title: trendTitle, keywords: trendKeywords, description } = trend;

    // Extract main keyword from trend - handle undefined keywords
    const keywords = trendKeywords && trendKeywords.length > 0 ? trendKeywords : this.extractDefaultKeywords(trendTitle);
    const mainKeyword = keywords[0] || trendTitle;

    // Generate SEO data
    const seoData = this.seoOptimizer.generateBlogPostSEO(
      trendTitle,
      mainKeyword,
      description || trendTitle,
      trendTitle
    );

    // Generate content
    const content = await this.generateContent(
      seoData.h1,
      seoData.headings.h2,
      seoData.headings.h3,
      mainKeyword,
      trendTitle,
      description
    );

    const wordCount = this.countWords(content);
    const estimatedReadTime = Math.ceil(wordCount / 200); // Average reading speed

    // Update content length in SEO data
    seoData.contentLength = wordCount;

    return {
      title: seoData.title,
      slug: seoData.slug,
      content,
      excerpt: seoData.metaDescription,
      seoData,
      categories: this.categorizeTrend(trend),
      tags: seoData.keywords,
      status: 'draft',
      wordCount,
      estimatedReadTime,
    };
  }

  /**
   * Generate blog post content with proper structure
   */
  private async generateContent(
    h1: string,
    h2s: string[],
    h3s: string[],
    mainKeyword: string,
    topic: string,
    description?: string
  ): Promise<string> {
    // Since we don't have live API integration, generate well-structured content
    // In production, this would call OpenAI API or similar

    const content = `# ${h1}

${this.generateIntroduction(topic, mainKeyword, description)}

## ${h2s[0] || 'Overview'}

${this.generateSection('overview', mainKeyword)}

### ${h3s[0] || 'Key Points'}

${this.generateKeyPoints(mainKeyword)}

## ${h2s[1] || 'Benefits'}

${this.generateBenefits(topic)}

## ${h2s[2] || 'Getting Started'}

${this.generateGettingStarted(mainKeyword)}

### Step 1: Understanding the Basics
${this.generateStep1()}

### Step 2: Essential Tools and Materials
${this.generateStep2()}

### Step 3: Implementation Tips
${this.generateStep3()}

## ${h2s[3] || 'Common Mistakes to Avoid'}

${this.generateMistakes(mainKeyword)}

## ${h2s[4] || 'Pro Tips for Success'}

${this.generateProTips(mainKeyword)}

## ${h2s[5] || 'Frequently Asked Questions'}

${this.generateFAQs(mainKeyword)}

## Conclusion

${this.generateConclusion(mainKeyword, topic)}

${this.seoOptimizer.generateCTA(topic)}
`;

    return content;
  }

  /**
   * Generate engaging introduction
   */
  private generateIntroduction(topic: string, keyword: string, description?: string): string {
    const intros = [
      `${description || topic} has become increasingly popular among gardeners and plant enthusiasts worldwide. In this comprehensive guide, we'll explore everything you need to know about ${keyword} to transform your gardening experience.`,
      `Are you interested in ${keyword}? Whether you're a beginner or an experienced gardener, this guide will help you master the art of ${topic}. We'll cover essential techniques, common mistakes, and pro tips to help you succeed.`,
      `${keyword} is more than just a hobby—it's a lifestyle that connects us with nature. This detailed guide will walk you through the process of ${topic}, providing practical advice and expert insights to help you get started.`,
      `If you've been curious about ${keyword}, now is the perfect time to start. Our complete guide covers everything from the basics to advanced techniques, helping you achieve outstanding results in your ${topic} journey.`,
    ];

    return intros[Math.floor(Math.random() * intros.length)];
  }

  /**
   * Generate section content
   */
  private generateSection(section: string, keyword: string): string {
    const sections: Record<string, string> = {
      overview: `${keyword} is a fundamental aspect of modern gardening that offers numerous benefits for both your plants and the environment. Understanding the principles behind ${keyword} will help you make informed decisions in your gardening practice.

Key aspects to consider:
- The science behind effective ${keyword}
- How it impacts plant health and growth
- Environmental and sustainability benefits
- Cost-effectiveness and long-term savings`,
      benefits: `Implementing ${keyword} in your garden comes with several advantages:

1. **Improved Plant Health**: Better growth and stronger plants
2. **Cost Efficiency**: Reduced expenses on gardening supplies
3. **Environmental Impact**: More sustainable gardening practices
4. **Time Savings**: More efficient gardening processes
5. **Personal Satisfaction**: Greater enjoyment and connection with plants`,
    };

    return sections[section] || `Learn more about ${keyword} and how it can transform your gardening experience.`;
  }

  /**
   * Generate key points
   */
  private generateKeyPoints(keyword: string): string {
    return `- **Essential for Success**: Understanding ${keyword} is crucial for achieving your gardening goals
- **Proven Results**: Thousands of gardeners have seen improvements by implementing these methods
- **Sustainable Approach**: Environmentally friendly practices that benefit both plants and planet
- **Customizable Methods**: Techniques that work for any garden size or skill level
- **Cost-Effective**: Affordable solutions that maximize your gardening investment`;
  }

  /**
   * Generate benefits section
   */
  private generateBenefits(topic: string): string {
    return `There are numerous advantages to incorporating ${topic} into your gardening routine:

**Immediate Benefits:**
- Noticeable improvements in plant health within weeks
- Reduced plant stress and disease susceptibility
- Enhanced visual appeal of your garden

**Long-term Advantages:**
- Sustainable practices that benefit the environment
- Cost savings over time
- Increased yields and healthier plants
- Greater gardening confidence and expertise`;
  }

  /**
   * Generate getting started section
   */
  private generateGettingStarted(keyword: string): string {
    return `Starting with ${keyword} doesn't have to be complicated. Follow these simple steps to begin your journey:

**Preparation Phase:**
- Research and understand the basics
- Gather necessary materials and tools
- Plan your approach based on your specific needs
- Set realistic goals and expectations`;
  }

  /**
   * Generate step-by-step content
   */
  private generateStep1(): string {
    return `Begin by learning the fundamental concepts and principles. Understanding the "why" behind each technique will help you adapt methods to your specific situation. Take time to research, read, and absorb information about best practices.`;
  }

  private generateStep2(): string {
    return `Gather all necessary tools, materials, and supplies before you start. Quality tools and materials make a significant difference in your success rate. Investing in good equipment upfront will save you time and money in the long run.`;
  }

  private generateStep3(): string {
    return `Start small and scale up gradually. This approach allows you to learn, make adjustments, and perfect your technique before expanding. Document your progress and results to identify what works best for your specific conditions.`;
  }

  /**
   * Generate common mistakes section
   */
  private generateMistakes(keyword: string): string {
    return `Avoid these common pitfalls when working with ${keyword}:

1. **Rushing the Process**: Take your time and follow proper procedures
2. **Neglecting Preparation**: Proper planning prevents poor performance
3. **Ignoring Environmental Factors**: Consider climate, season, and location
4. **Insufficient Maintenance**: Regular care is essential for continued success
5. **Not Seeking Help**: Don't hesitate to consult experts or communities`;
  }

  /**
   * Generate pro tips section
   */
  private generateProTips(keyword: string): string {
    return `**Advanced Techniques for Maximum Success:**

1. **Monitor Progress**: Keep detailed notes of what works in your specific environment
2. **Experiment Gradually**: Try new techniques on a small scale first
3. **Connect with Communities**: Share experiences and learn from other gardeners
4. **Adapt and Adjust**: Modify approaches based on your unique conditions
5. **Continuous Learning**: Stay updated with latest tips, trends, and innovations in ${keyword}`;
  }

  /**
   * Generate FAQs section
   */
  private generateFAQs(keyword: string): string {
    return `**Q: How long does it take to see results from ${keyword}?**
A: Most gardeners see noticeable improvements within 3-4 weeks, though some results may be visible sooner.

**Q: Is ${keyword} suitable for beginners?**
A: Absolutely! These methods are designed to be accessible to gardeners of all skill levels.

**Q: What budget should I allocate for ${keyword}?**
A: You can get started affordably with basic materials, typically ranging from ₹500-2000 depending on your garden size.

**Q: Can I combine ${keyword} with other gardening methods?**
A: Yes, most techniques work well in combination with other sustainable gardening practices.

**Q: Where can I find reliable information about ${keyword}?**
A: Reputable gardening websites, books, expert blogs, and community forums are excellent resources.`;
  }

  /**
   * Generate conclusion
   */
  private generateConclusion(keyword: string, topic: string): string {
    return `${keyword} is an accessible and rewarding approach to ${topic} that can significantly improve your results. By following the techniques and tips outlined in this guide, you'll be well-equipped to create a thriving garden while contributing to environmental sustainability.

Remember that gardening is a continuous learning experience. Start with the basics, monitor your progress, and gradually incorporate more advanced techniques as you gain confidence and expertise. Happy gardening!`;
  }

  /**
   * Categorize trend into WordPress categories
   */
  private categorizeTrend(trend: TrendData): string[] {
    const categoryMap: Record<string, string[]> = {
      plants: ['Houseplants', 'Plant Care'],
      gardening: ['Gardening Tips', 'Garden DIY'],
      nature: ['Nature', 'Sustainability'],
      sustainability: ['Sustainability', 'Eco-Friendly'],
    };

    return categoryMap[trend.category] || ['General Gardening'];
  }

  /**
   * Count words in content
   */
  private countWords(content: string): number {
    return content
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }

  /**
   * Generate featured image URL based on topic
   */
  generateFeaturedImage(topic: string): string {
    // In production, this could generate or fetch images from Unsplash, Pexels, etc.
    const imageKeywords = encodeURIComponent(topic);
    return `https://images.unsplash.com/search?query=${imageKeywords}&crop=entropy&cs=tinysrgb&fm=jpg&ixid=M3wxfDB8MXxyYW5kb218MHx8YmxvZ3x8||https://source.unsplash.com/1200x600/?${imageKeywords}`;
  }

  /**
   * Schedule blog post for future publishing
   */
  scheduleBlogPost(post: GeneratedBlogPost, scheduleDate: Date): GeneratedBlogPost {
    return {
      ...post,
      status: 'scheduled',
      scheduledDate: scheduleDate,
    };
  }

  /**
   * Get estimated publishing schedule for multiple trends
   */
  generatePublishingSchedule(trends: TrendData[], baseDate: Date = new Date()): Array<GeneratedBlogPost & { publishDate: Date }> {
    return trends.map((trend, index) => {
      const publishDate = new Date(baseDate);
      publishDate.setDate(publishDate.getDate() + index * 2); // Publish every 2 days

      return {
        ...this.generateFromTrendSync(trend),
        publishDate,
      };
    });
  }

  /**
   * Synchronous version for scheduling (simplified)
   */
  private generateFromTrendSync(trend: TrendData): GeneratedBlogPost {
    const keywords = trend.keywords && trend.keywords.length > 0 ? trend.keywords : this.extractDefaultKeywords(trend.title);
    const mainKeyword = keywords[0] || trend.title;
    const seoData = this.seoOptimizer.generateBlogPostSEO(
      trend.title,
      mainKeyword,
      trend.description || trend.title,
      trend.title
    );

    const content = `# ${seoData.h1}\n\n${trend.description || 'Content coming soon...'}\n\n${this.seoOptimizer.generateCTA(trend.title)}`;

    return {
      title: seoData.title,
      slug: seoData.slug,
      content,
      excerpt: seoData.metaDescription,
      seoData,
      categories: this.categorizeTrend(trend),
      tags: seoData.keywords,
      status: 'draft',
      wordCount: this.countWords(content),
      estimatedReadTime: 3,
    };
  }

  /**
   * Extract default keywords from title if not provided
   */
  private extractDefaultKeywords(title: string): string[] {
    const commonWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'is', 'are',
    ]);

    const words = title
      .toLowerCase()
      .split(/[\s,;.!?'"()-]+/)
      .filter((word) => word.length > 3 && !commonWords.has(word))
      .slice(0, 5);

    return [...new Set(words)];
  }
}

export default BlogPostGenerator;
