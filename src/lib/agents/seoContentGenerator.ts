/**
 * SEO Content Generator Agent
 * Automatically generates optimized content based on competitor analysis
 */

import { CompetitorData, CompetitorInsights } from './competitorAnalysisAgent';

export interface SEOContent {
  title: string;
  metaDescription: string;
  slug: string;
  content: string;
  keywords: string[];
  h1: string;
  h2Tags: string[];
  targetKeyword: string;
  wordCount: number;
  internalLinks: string[];
  faqs: Array<{ question: string; answer: string }>;
}

export interface LandingPageData {
  keyword: string;
  content: SEOContent;
  competitorData: {
    averageWordCount: number;
    topCompetitorUrls: string[];
    keywordDensity: number;
  };
}

class SEOContentGenerator {
  /**
   * Generate SEO-optimized content from competitor insights
   */
  async generateContentFromInsights(
    insights: CompetitorInsights,
    competitors: CompetitorData[]
  ): Promise<SEOContent[]> {
    const generatedContent: SEOContent[] = [];

    // Generate content for top 5 keywords
    for (const keyword of insights.topKeywords.slice(0, 5)) {
      const content = await this.generateKeywordContent(keyword, insights, competitors);
      generatedContent.push(content);
    }

    // Generate content for identified gaps
    for (const gap of insights.contentGaps.slice(0, 3)) {
      const content = await this.generateGapContent(gap, insights);
      generatedContent.push(content);
    }

    return generatedContent;
  }

  /**
   * Generate content targeting a specific keyword
   */
  private async generateKeywordContent(
    keyword: string,
    insights: CompetitorInsights,
    competitors: CompetitorData[]
  ): Promise<SEOContent> {
    const targetWordCount = Math.round(insights.averageWordCount * 1.3); // 30% longer than competitors
    const title = this.generateTitle(keyword);
    const slug = this.generateSlug(keyword);

    // Generate comprehensive content
    const sections = this.generateContentSections(keyword, insights);
    const content = this.assembleContent(sections, targetWordCount);

    // Generate FAQs
    const faqs = this.generateFAQs(keyword);

    return {
      title,
      metaDescription: this.generateMetaDescription(keyword, insights),
      slug,
      content,
      keywords: this.generateKeywordVariations(keyword),
      h1: title,
      h2Tags: sections.map((s) => s.heading),
      targetKeyword: keyword,
      wordCount: content.split(' ').length,
      internalLinks: this.generateInternalLinks(keyword),
      faqs,
    };
  }

  /**
   * Generate content for content gaps
   */
  private async generateGapContent(gap: string, insights: CompetitorInsights): Promise<SEOContent> {
    const title = this.generateTitle(gap);
    const slug = this.generateSlug(gap);

    const sections = [
      {
        heading: `What is ${gap}?`,
        content: this.generateIntroduction(gap),
      },
      {
        heading: `Benefits of ${gap}`,
        content: this.generateBenefits(gap),
      },
      {
        heading: `How to Get Started with ${gap}`,
        content: this.generateHowTo(gap),
      },
      {
        heading: `Best Practices for ${gap}`,
        content: this.generateBestPractices(gap),
      },
      {
        heading: `Common Mistakes to Avoid`,
        content: this.generateCommonMistakes(gap),
      },
      {
        heading: `Expert Tips for ${gap}`,
        content: this.generateExpertTips(gap),
      },
    ];

    const content = this.assembleContent(sections, 1200);

    return {
      title,
      metaDescription: this.generateMetaDescription(gap, insights),
      slug,
      content,
      keywords: this.generateKeywordVariations(gap),
      h1: title,
      h2Tags: sections.map((s) => s.heading),
      targetKeyword: gap,
      wordCount: content.split(' ').length,
      internalLinks: this.generateInternalLinks(gap),
      faqs: this.generateFAQs(gap),
    };
  }

  /**
   * Generate SEO-optimized title
   */
  private generateTitle(keyword: string): string {
    const templates = [
      `Complete Guide to ${this.capitalize(keyword)} in India`,
      `${this.capitalize(keyword)}: Everything You Need to Know`,
      `Best ${this.capitalize(keyword)} - Expert Guide 2025`,
      `${this.capitalize(keyword)} - Tips, Tricks & Complete Guide`,
      `How to Master ${this.capitalize(keyword)} - Comprehensive Guide`,
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * Generate URL slug
   */
  private generateSlug(keyword: string): string {
    return keyword
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Generate meta description
   */
  private generateMetaDescription(keyword: string, insights: CompetitorInsights): string {
    return `Discover everything about ${keyword} with our comprehensive guide. Expert tips, best practices, and actionable advice for ${keyword}. Shop now!`;
  }

  /**
   * Generate content sections
   */
  private generateContentSections(
    keyword: string,
    insights: CompetitorInsights
  ): Array<{ heading: string; content: string }> {
    return [
      {
        heading: `Introduction to ${this.capitalize(keyword)}`,
        content: this.generateIntroduction(keyword),
      },
      {
        heading: `Why ${this.capitalize(keyword)} Matters`,
        content: this.generateWhyMatters(keyword),
      },
      {
        heading: `Types of ${this.capitalize(keyword)}`,
        content: this.generateTypes(keyword),
      },
      {
        heading: `How to Choose the Right ${this.capitalize(keyword)}`,
        content: this.generateHowToChoose(keyword),
      },
      {
        heading: `Best ${this.capitalize(keyword)} for Indian Climate`,
        content: this.generateBestFor(keyword),
      },
      {
        heading: `Care and Maintenance Tips`,
        content: this.generateCareTips(keyword),
      },
      {
        heading: `Common Problems and Solutions`,
        content: this.generateProblems(keyword),
      },
      {
        heading: `Where to Buy ${this.capitalize(keyword)} Online`,
        content: this.generateWhereToBuy(keyword, insights),
      },
    ];
  }

  /**
   * Assemble content from sections
   */
  private assembleContent(sections: Array<{ heading: string; content: string }>, targetWordCount: number): string {
    let html = '';

    sections.forEach((section) => {
      html += `<h2>${section.heading}</h2>\n`;
      html += `<p>${section.content}</p>\n\n`;
    });

    return html;
  }

  /**
   * Generate introduction content
   */
  private generateIntroduction(topic: string): string {
    return `${this.capitalize(topic)} has become increasingly popular among Indian gardening enthusiasts. Whether you're a beginner or an experienced gardener, understanding ${topic} is essential for creating a thriving garden. In this comprehensive guide, we'll explore everything you need to know about ${topic}, from selection to care and maintenance.`;
  }

  /**
   * Generate "why it matters" content
   */
  private generateWhyMatters(topic: string): string {
    return `${this.capitalize(topic)} plays a crucial role in successful gardening. It helps improve plant health, increases yield, and creates a more sustainable garden ecosystem. For Indian gardeners, ${topic} is especially important due to our diverse climate conditions ranging from tropical to temperate zones.`;
  }

  /**
   * Generate types/varieties
   */
  private generateTypes(topic: string): string {
    return `There are several types of ${topic} available in the Indian market. Each type has its own advantages and is suited for different purposes. Understanding these varieties will help you make an informed decision based on your specific needs, climate, and gardening goals.`;
  }

  /**
   * Generate selection guide
   */
  private generateHowToChoose(topic: string): string {
    return `Choosing the right ${topic} depends on several factors including your location, climate zone, available space, and gardening experience. Consider your specific requirements, budget, and long-term goals when making your selection. Quality should always be prioritized over price for best results.`;
  }

  /**
   * Generate "best for India" content
   */
  private generateBestFor(topic: string): string {
    return `India's diverse climate presents unique challenges and opportunities for ${topic}. We've researched and tested various options to bring you the best ${topic} specifically suited for Indian conditions. These recommendations consider factors like heat tolerance, water requirements, and pest resistance.`;
  }

  /**
   * Generate care tips
   */
  private generateCareTips(topic: string): string {
    return `Proper care and maintenance of ${topic} ensures longevity and optimal performance. Regular monitoring, timely intervention, and following best practices are key to success. Here are essential care tips that every gardener should follow for ${topic}.`;
  }

  /**
   * Generate problems and solutions
   */
  private generateProblems(topic: string): string {
    return `Like any aspect of gardening, ${topic} can present challenges. Understanding common problems and their solutions helps you troubleshoot effectively. From pest issues to environmental factors, we'll cover the most frequent problems and provide practical solutions.`;
  }

  /**
   * Generate where to buy content
   */
  private generateWhereToBuy(topic: string, insights: CompetitorInsights): string {
    const priceRange = insights.priceRange.min > 0 
      ? `Prices typically range from ₹${insights.priceRange.min} to ₹${insights.priceRange.max}. `
      : '';

    return `At Whole Lot of Nature, we offer premium quality ${topic} delivered across India. ${priceRange}We source directly from trusted growers and ensure quality through rigorous checks. Shop our collection of ${topic} with confidence, backed by expert support and hassle-free returns.`;
  }

  /**
   * Generate benefits
   */
  private generateBenefits(topic: string): string {
    return `The benefits of ${topic} extend beyond aesthetics. It improves environmental quality, enhances well-being, and can even provide economic value. Understanding these benefits motivates better practices and helps you maximize results from your gardening efforts.`;
  }

  /**
   * Generate how-to guide
   */
  private generateHowTo(topic: string): string {
    return `Getting started with ${topic} is easier than you might think. Follow these step-by-step instructions to ensure success from the beginning. Whether you're setting up for the first time or improving your existing setup, these guidelines will help you achieve optimal results.`;
  }

  /**
   * Generate best practices
   */
  private generateBestPractices(topic: string): string {
    return `Following proven best practices for ${topic} significantly improves your chances of success. These recommendations are based on years of experience and scientific research. Implement these practices consistently for the best outcomes in your gardening journey.`;
  }

  /**
   * Generate common mistakes
   */
  private generateCommonMistakes(topic: string): string {
    return `Avoid these common mistakes when working with ${topic}. Learning from others' experiences saves time, money, and frustration. Understanding what not to do is just as important as knowing the right approaches.`;
  }

  /**
   * Generate expert tips
   */
  private generateExpertTips(topic: string): string {
    return `Our gardening experts share insider tips for mastering ${topic}. These advanced techniques and insights go beyond basic knowledge to help you achieve professional-level results. Apply these expert recommendations to take your gardening to the next level.`;
  }

  /**
   * Generate FAQs
   */
  private generateFAQs(keyword: string): Array<{ question: string; answer: string }> {
    return [
      {
        question: `What is the best ${keyword} for beginners?`,
        answer: `For beginners, we recommend starting with low-maintenance options that are forgiving of mistakes. Look for ${keyword} that requires minimal care and is well-suited to your local climate.`,
      },
      {
        question: `How much does ${keyword} cost in India?`,
        answer: `Prices vary based on quality, variety, and size. You can find options ranging from budget-friendly to premium. At Whole Lot of Nature, we offer competitive prices with excellent quality.`,
      },
      {
        question: `Is ${keyword} suitable for Indian climate?`,
        answer: `Yes, ${keyword} can thrive in Indian conditions when properly selected and cared for. Choose varieties that are specifically adapted to your region's climate.`,
      },
      {
        question: `How do I maintain ${keyword}?`,
        answer: `Regular care including proper watering, fertilization, and monitoring is essential. Follow our detailed care guide above for specific maintenance instructions.`,
      },
      {
        question: `Where can I buy quality ${keyword} online?`,
        answer: `Whole Lot of Nature offers premium ${keyword} with nationwide delivery. We guarantee quality and provide expert support to ensure your success.`,
      },
    ];
  }

  /**
   * Generate keyword variations
   */
  private generateKeywordVariations(keyword: string): string[] {
    const base = keyword.toLowerCase();
    return [
      base,
      `${base} online`,
      `${base} india`,
      `buy ${base}`,
      `best ${base}`,
      `${base} online india`,
      `${base} price`,
      `${base} for sale`,
    ];
  }

  /**
   * Generate internal links
   */
  private generateInternalLinks(keyword: string): string[] {
    return [
      '/shop',
      '/shop/category/seeds',
      '/shop/category/fertilizers',
      '/blog',
      '/guides',
      '/about',
    ];
  }

  /**
   * Capitalize first letter
   */
  private capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}

export default SEOContentGenerator;
