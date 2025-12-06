/**
 * SEO Optimization Module for Blog Post Generation
 * Handles keyword research, meta tags, and structured data
 */

export interface SEOData {
  title: string;
  metaDescription: string;
  keywords: string[];
  slug: string;
  schema: Record<string, unknown>;
  internalLinks: string[];
  readabilityScore: number;
}

export interface BlogPostSEO extends SEOData {
  h1: string;
  headings: {
    h2: string[];
    h3: string[];
  };
  contentLength: number;
  lsiKeywords: string[];
  cta: string;
}

class SEOOptimizer {
  private niche = 'plants, gardening, nature';
  private primaryKeywords = [
    'indoor plants care',
    'gardening tips for beginners',
    'sustainable gardening',
    'plant propagation',
    'eco-friendly gardening',
  ];

  /**
   * Generate SEO-optimized title (50-60 chars)
   */
  generateTitle(topic: string, mainKeyword: string): string {
    const templates = [
      `${mainKeyword} | Complete Guide to ${topic}`,
      `How to ${topic}: Best ${mainKeyword} Tips`,
      `${mainKeyword} for ${topic}: Expert Guide`,
      `The Ultimate ${topic} Guide: ${mainKeyword}`,
      `${mainKeyword}: Everything About ${topic}`,
    ];

    let title = templates[Math.floor(Math.random() * templates.length)];
    // Ensure it's 50-60 characters
    if (title.length > 60) {
      title = title.substring(0, 57) + '...';
    }
    return title;
  }

  /**
   * Generate SEO-optimized meta description (150-160 chars)
   */
  generateMetaDescription(topic: string, mainKeyword: string, summary: string): string {
    const templates = [
      `Learn about ${mainKeyword} and ${topic}. ${summary.substring(0, 80)}...`,
      `Discover expert tips on ${mainKeyword}. Complete guide to ${topic.toLowerCase()}. ${summary.substring(0, 50)}...`,
      `Master ${mainKeyword} with our comprehensive ${topic} guide. ${summary.substring(0, 70)}...`,
    ];

    let description = templates[Math.floor(Math.random() * templates.length)];
    description = description.substring(0, 160);
    return description;
  }

  /**
   * Generate URL slug from title
   */
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .split(/\s+/)
      .join('-')
      .replace(/-+/g, '-')
      .substring(0, 75);
  }

  /**
   * Find LSI (Latent Semantic Indexing) keywords for better SEO
   */
  generateLSIKeywords(mainKeyword: string, topic: string): string[] {
    const keywordMap: Record<string, string[]> = {
      'indoor plants': [
        'best indoor plants',
        'low light indoor plants',
        'easy indoor plants for beginners',
        'indoor plant care tips',
        'tropical houseplants',
        'hanging indoor plants',
        'indoor air purifying plants',
      ],
      'gardening tips': [
        'beginner gardening',
        'organic gardening methods',
        'raised bed gardening',
        'container gardening',
        'vertical gardening',
        'companion planting',
        'seasonal gardening',
      ],
      'plant care': [
        'watering plants',
        'plant fertilizer',
        'pest control natural',
        'plant propagation methods',
        'plant diseases',
        'plant repotting',
        'plant growth tips',
      ],
      'sustainable gardening': [
        'composting for gardening',
        'organic fertilizer',
        'rainwater harvesting',
        'beneficial insects',
        'biodiversity gardening',
        'permaculture principles',
        'waste reduction gardening',
      ],
    };

    const normalized = mainKeyword.toLowerCase();
    let lsiKeywords: string[] = [];

    for (const [key, values] of Object.entries(keywordMap)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        lsiKeywords = values;
        break;
      }
    }

    if (lsiKeywords.length === 0) {
      // Fallback to general gardening LSI
      lsiKeywords = [
        `${mainKeyword} tips`,
        `best ${mainKeyword}`,
        `${mainKeyword} guide`,
        `how to ${mainKeyword}`,
        `${mainKeyword} for beginners`,
      ];
    }

    return lsiKeywords.slice(0, 5);
  }

  /**
   * Generate schema.org structured data for blog posts
   */
  generateBlogSchema(
    title: string,
    description: string,
    author: string = 'Whole Lot of Nature',
    image: string = 'https://whole-lot-of-nature.com/og-image.jpg'
  ): Record<string, unknown> {
    const now = new Date().toISOString();
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description: description,
      image: image,
      datePublished: now,
      dateModified: now,
      author: {
        '@type': 'Organization',
        name: author,
        url: 'https://whole-lot-of-nature.com',
        logo: 'https://whole-lot-of-nature.com/logo.png',
      },
      publisher: {
        '@type': 'Organization',
        name: author,
        logo: {
          '@type': 'ImageObject',
          url: 'https://whole-lot-of-nature.com/logo.png',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://whole-lot-of-nature.com',
      },
    };
  }

  /**
   * Generate FAQ schema for article with common questions
   */
  generateFAQSchema(faqs: Array<{ question: string; answer: string }>): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };
  }

  /**
   * Calculate readability score (0-100)
   */
  calculateReadability(text: string): number {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const words = text.split(/\s+/).filter((w) => w.length > 0);
    const avgSentenceLength = words.length / (sentences.length || 1);

    // Flesch-Kincaid simplified score
    let score = 100;

    // Penalize long sentences
    if (avgSentenceLength > 20) score -= 15;
    if (avgSentenceLength > 25) score -= 10;

    // Bonus for good length
    if (words.length >= 1000) score += 10;
    if (words.length >= 2000) score += 5;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Generate suggested internal links for SEO
   */
  generateInternalLinks(topic: string, mainKeyword: string): string[] {
    const links: string[] = [];

    // Common internal link patterns for gardening niche
    const linkPatterns = [
      '/blog/complete-guide-indoor-plants',
      '/blog/best-gardening-tools-beginners',
      '/blog/organic-pest-control',
      '/blog/composting-beginners-guide',
      '/blog/seasonal-gardening-calendar',
      '/blog/plant-propagation-techniques',
      '/products', // Link to products
      '/#contact', // Link to contact
    ];

    // Select relevant links based on topic
    for (const pattern of linkPatterns) {
      if (
        pattern.includes('plant') && mainKeyword.toLowerCase().includes('plant') ||
        pattern.includes('garden') && mainKeyword.toLowerCase().includes('garden') ||
        Math.random() > 0.5
      ) {
        links.push(pattern);
      }
    }

    return links.slice(0, 3);
  }

  /**
   * Generate SEO-optimized CTA (Call-to-Action)
   */
  generateCTA(postTopic: string): string {
    const ctas = [
      `Ready to start ${postTopic}? Check out our [comprehensive guide](/) or [browse our plant collection](/products).`,
      `Want to learn more about ${postTopic}? [Subscribe to our newsletter](/#newsletter) for weekly gardening tips and updates.`,
      `Found this guide helpful? [Share it with fellow gardeners](/) and explore more [gardening resources](/blog).`,
      `Looking to implement these ${postTopic} tips? [Shop our recommended plants and tools](/products) or [get expert advice](/contact).`,
    ];

    return ctas[Math.floor(Math.random() * ctas.length)];
  }

  /**
   * Generate complete SEO data for a blog post
   */
  generateBlogPostSEO(
    topic: string,
    mainKeyword: string,
    contentSummary: string,
    contentPreview: string
  ): BlogPostSEO {
    const title = this.generateTitle(topic, mainKeyword);
    const slug = this.generateSlug(title);
    const metaDescription = this.generateMetaDescription(topic, mainKeyword, contentSummary);
    const lsiKeywords = this.generateLSIKeywords(mainKeyword, topic);
    const h1 = `Complete Guide: ${mainKeyword}`;

    return {
      title,
      metaDescription,
      slug,
      keywords: [mainKeyword, ...lsiKeywords],
      h1,
      headings: {
        h2: [
          `What is ${mainKeyword}?`,
          `Benefits of ${mainKeyword}`,
          `How to Get Started with ${mainKeyword}`,
          `Common Mistakes to Avoid`,
          `Tips for Success`,
          `FAQ: ${mainKeyword}`,
        ],
        h3: [
          `Understanding the Basics`,
          `Step-by-Step Guide`,
          `Best Practices`,
          `Troubleshooting`,
        ],
      },
      schema: this.generateBlogSchema(title, metaDescription),
      internalLinks: this.generateInternalLinks(topic, mainKeyword),
      readabilityScore: this.calculateReadability(contentPreview),
      lsiKeywords,
      cta: this.generateCTA(topic),
      contentLength: 0, // Will be updated after content generation
    };
  }

  /**
   * Validate SEO compliance
   */
  validateSEO(seoData: BlogPostSEO): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check title length (optimal 50-60)
    if (seoData.title.length < 30) issues.push('Title too short (< 30 chars)');
    if (seoData.title.length > 70) issues.push('Title too long (> 70 chars)');

    // Check meta description length (optimal 150-160)
    if (seoData.metaDescription.length < 120) issues.push('Meta description too short (< 120 chars)');
    if (seoData.metaDescription.length > 170) issues.push('Meta description too long (> 170 chars)');

    // Check primary keyword in title
    if (!seoData.title.toLowerCase().includes(seoData.keywords[0].toLowerCase())) {
      issues.push('Primary keyword not in title');
    }

    // Check H1 presence
    if (!seoData.h1 || seoData.h1.length === 0) {
      issues.push('Missing H1 heading');
    }

    // Check content length
    if (seoData.contentLength < 300) issues.push('Content too short (< 300 words)');

    // Check readability
    if (seoData.readabilityScore < 40) issues.push('Readability score too low (< 40)');

    // Check internal links
    if (seoData.internalLinks.length < 2) issues.push('Not enough internal links (< 2)');

    return {
      isValid: issues.length === 0,
      issues,
    };
  }
}

export default SEOOptimizer;
