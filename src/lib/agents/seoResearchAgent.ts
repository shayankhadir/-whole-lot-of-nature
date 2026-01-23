/**
 * SEO Research Agent - Advanced AI-Powered SEO for Product Pages
 * Uses AI to find high-ranking keywords, optimize product pages, and track rankings
 * Whole Lot of Nature - Premium Plant Store
 */

import { aiService } from '@/lib/ai/aiService';
import { WooCommerceService, WooCommerceProduct } from '@/lib/services/woocommerceService';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface KeywordResearch {
  primary: string;
  secondary: string[];
  longtail: string[];
  questions: string[];
  relatedTerms: string[];
  searchIntent: 'transactional' | 'informational' | 'navigational' | 'commercial';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedVolume: 'low' | 'medium' | 'high';
}

export interface ProductSEOAnalysis {
  productId: number;
  productName: string;
  currentScore: number;
  issues: SEOIssue[];
  recommendations: SEORecommendation[];
  keywords: KeywordResearch;
  optimizedTitle: string;
  optimizedDescription: string;
  optimizedMetaDescription: string;
  suggestedTags: string[];
  schema: ProductSchema;
  competitorGaps: string[];
}

export interface SEOIssue {
  type: 'critical' | 'warning' | 'info';
  category: 'title' | 'description' | 'images' | 'schema' | 'keywords' | 'content';
  message: string;
  impact: string;
}

export interface SEORecommendation {
  priority: 'high' | 'medium' | 'low';
  category: string;
  action: string;
  expectedImpact: string;
}

export interface ProductSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  image: string[];
  brand: { '@type': string; name: string };
  offers: {
    '@type': string;
    price: string;
    priceCurrency: string;
    availability: string;
    url: string;
  };
  aggregateRating?: {
    '@type': string;
    ratingValue: string;
    reviewCount: string;
  };
}

export interface BulkSEOReport {
  analyzedAt: Date;
  totalProducts: number;
  averageScore: number;
  criticalIssues: number;
  productsAnalyzed: ProductSEOAnalysis[];
  topKeywords: string[];
  overallRecommendations: string[];
  priorityActions: string[];
}

export interface RankingTracker {
  keyword: string;
  product: string;
  targetPosition: number;
  currentStatus: 'tracking' | 'improved' | 'declined' | 'stable';
  lastChecked: Date;
  history: { date: Date; position: number | null }[];
}

// ============================================================================
// PLANT-SPECIFIC KEYWORD DATABASE
// ============================================================================

const PLANT_KEYWORD_CLUSTERS = {
  indoorPlants: {
    primary: ['indoor plants', 'houseplants', 'indoor plants online'],
    modifiers: ['low maintenance', 'air purifying', 'pet friendly', 'low light', 'easy care', 'beginner'],
    locations: ['bangalore', 'india', 'online', 'near me', 'delivery'],
    intents: ['buy', 'shop', 'order', 'price', 'best'],
  },
  succulents: {
    primary: ['succulents', 'cactus', 'succulent plants'],
    modifiers: ['rare', 'colorful', 'mini', 'exotic', 'easy care'],
    locations: ['bangalore', 'india', 'online'],
    intents: ['buy', 'shop', 'collection', 'varieties'],
  },
  airPurifying: {
    primary: ['air purifying plants', 'oxygen plants', 'air cleaning plants'],
    modifiers: ['best', 'NASA approved', 'bedroom', 'office', 'indoor'],
    locations: ['bangalore', 'india', 'online'],
    intents: ['buy', 'shop', 'list', 'top'],
  },
  lowLight: {
    primary: ['low light plants', 'shade plants', 'dark room plants'],
    modifiers: ['indoor', 'best', 'easy', 'bathroom', 'office'],
    locations: ['india', 'online'],
    intents: ['buy', 'shop', 'best'],
  },
  flowering: {
    primary: ['flowering plants', 'flower plants', 'blooming plants'],
    modifiers: ['indoor', 'outdoor', 'perennial', 'seasonal', 'fragrant'],
    locations: ['bangalore', 'india', 'online'],
    intents: ['buy', 'shop', 'order'],
  },
  herbs: {
    primary: ['herb plants', 'kitchen herbs', 'medicinal plants'],
    modifiers: ['organic', 'fresh', 'cooking', 'ayurvedic', 'indian'],
    locations: ['bangalore', 'india', 'online'],
    intents: ['buy', 'grow', 'shop'],
  },
  soil: {
    primary: ['potting soil', 'potting mix', 'garden soil'],
    modifiers: ['organic', 'premium', 'succulent', 'indoor plant', 'cocopeat'],
    locations: ['bangalore', 'india', 'online'],
    intents: ['buy', 'shop', 'best'],
  },
  planters: {
    primary: ['planters', 'plant pots', 'flower pots'],
    modifiers: ['ceramic', 'terracotta', 'self watering', 'decorative', 'hanging'],
    locations: ['bangalore', 'india', 'online'],
    intents: ['buy', 'shop', 'designer'],
  },
  fertilizers: {
    primary: ['plant fertilizer', 'plant food', 'organic fertilizer'],
    modifiers: ['liquid', 'organic', 'slow release', 'indoor plant', 'flowering'],
    locations: ['india', 'online'],
    intents: ['buy', 'best', 'shop'],
  },
  gifts: {
    primary: ['plant gifts', 'gift plants', 'plant gift sets'],
    modifiers: ['corporate', 'birthday', 'housewarming', 'anniversary', 'diwali'],
    locations: ['bangalore', 'india', 'online', 'delivery'],
    intents: ['buy', 'send', 'order'],
  },
};

const SEARCH_INTENT_PATTERNS = {
  transactional: ['buy', 'shop', 'order', 'price', 'discount', 'sale', 'cheap', 'affordable', 'cost'],
  informational: ['how to', 'what is', 'guide', 'tips', 'care', 'benefits', 'why', 'when'],
  commercial: ['best', 'top', 'review', 'vs', 'compare', 'recommended'],
  navigational: ['near me', 'in bangalore', 'online', 'store', 'website'],
};

const INDIAN_PLANT_TERMS = {
  'money plant': ['pothos', 'golden pothos', 'devils ivy'],
  'snake plant': ['sansevieria', 'mother in law tongue'],
  'lucky bamboo': ['dracaena sanderiana', 'feng shui plant'],
  'rubber plant': ['ficus elastica', 'rubber tree'],
  'spider plant': ['chlorophytum', 'airplane plant'],
  'peace lily': ['spathiphyllum', 'white sails'],
  'areca palm': ['dypsis lutescens', 'golden cane palm', 'butterfly palm'],
  'tulsi': ['holy basil', 'sacred basil'],
  'neem': ['azadirachta indica', 'indian lilac'],
  'curry leaf': ['murraya koenigii', 'kadi patta'],
  'aloe vera': ['aloe barbadensis', 'medicinal aloe'],
  'jade plant': ['crassula ovata', 'friendship tree', 'money tree'],
};

// ============================================================================
// SEO RESEARCH AGENT CLASS
// ============================================================================

export class SEOResearchAgent {
  private rankingTrackers: RankingTracker[] = [];

  // ============================================================================
  // KEYWORD RESEARCH
  // ============================================================================

  /**
   * Generate comprehensive keyword research for a product
   */
  async researchKeywordsForProduct(product: WooCommerceProduct): Promise<KeywordResearch> {
    console.log(`🔍 SEO AGENT: Researching keywords for "${product.name}"...`);

    const productName = product.name.toLowerCase();
    const categories = product.categories?.map(c => c.name.toLowerCase()) || [];
    const description = product.short_description || product.description || '';

    // Determine product cluster
    const cluster = this.identifyProductCluster(productName, categories);
    
    // Generate keyword variations
    const primaryKeyword = this.generatePrimaryKeyword(productName, cluster);
    const secondaryKeywords = this.generateSecondaryKeywords(productName, cluster);
    const longtailKeywords = this.generateLongtailKeywords(productName, cluster);
    const questionKeywords = this.generateQuestionKeywords(productName);
    const relatedTerms = this.findRelatedTerms(productName);
    
    // Determine search intent
    const searchIntent = this.determineSearchIntent(productName, categories);
    
    // Estimate difficulty based on keyword type
    const difficulty = this.estimateDifficulty(primaryKeyword);
    const estimatedVolume = this.estimateVolume(primaryKeyword, cluster);

    // Use AI to enhance keyword research if available
    const aiEnhanced = await this.aiEnhanceKeywords(product, {
      primary: primaryKeyword,
      secondary: secondaryKeywords,
      longtail: longtailKeywords,
    });

    return {
      primary: aiEnhanced.primary || primaryKeyword,
      secondary: [...new Set([...aiEnhanced.secondary, ...secondaryKeywords])].slice(0, 8),
      longtail: [...new Set([...aiEnhanced.longtail, ...longtailKeywords])].slice(0, 10),
      questions: questionKeywords,
      relatedTerms,
      searchIntent,
      difficulty,
      estimatedVolume,
    };
  }

  /**
   * AI-enhanced keyword research
   */
  private async aiEnhanceKeywords(
    product: WooCommerceProduct,
    baseKeywords: { primary: string; secondary: string[]; longtail: string[] }
  ): Promise<{ primary: string; secondary: string[]; longtail: string[] }> {
    if (!aiService.isConfigured()) {
      return baseKeywords;
    }

    try {
      const prompt = `You are an SEO expert for an Indian online plant store called "Whole Lot of Nature" in Bangalore.

Product: ${product.name}
Categories: ${product.categories?.map(c => c.name).join(', ') || 'General'}
Current Primary Keyword: ${baseKeywords.primary}
Current Secondary: ${baseKeywords.secondary.join(', ')}

Generate optimized keywords for this product that will rank well in Google India.

IMPORTANT GUIDELINES:
- Focus on keywords Indian customers actually search for
- Include both Hindi transliterations and English terms
- Add location modifiers (bangalore, india, online)
- Include buying intent keywords
- Consider seasonal trends in India

Return ONLY valid JSON with this structure:
{
  "primary": "best optimized primary keyword phrase",
  "secondary": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "longtail": ["long tail phrase 1", "long tail phrase 2", "long tail phrase 3"]
}`;

      const response = await aiService.complete(prompt, {
        temperature: 0.3,
        maxTokens: 500,
        systemPrompt: 'You are an SEO expert. Return only valid JSON, no explanations.',
      });

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          primary: parsed.primary || baseKeywords.primary,
          secondary: Array.isArray(parsed.secondary) ? parsed.secondary : baseKeywords.secondary,
          longtail: Array.isArray(parsed.longtail) ? parsed.longtail : baseKeywords.longtail,
        };
      }
    } catch (error) {
      console.warn('AI keyword enhancement failed, using base keywords:', error);
    }

    return baseKeywords;
  }

  private identifyProductCluster(name: string, categories: string[]): keyof typeof PLANT_KEYWORD_CLUSTERS {
    const text = `${name} ${categories.join(' ')}`.toLowerCase();
    
    if (text.includes('succulent') || text.includes('cactus')) return 'succulents';
    if (text.includes('air purif') || text.includes('oxygen') || text.includes('nasa')) return 'airPurifying';
    if (text.includes('low light') || text.includes('shade')) return 'lowLight';
    if (text.includes('flower') || text.includes('bloom')) return 'flowering';
    if (text.includes('herb') || text.includes('basil') || text.includes('mint')) return 'herbs';
    if (text.includes('soil') || text.includes('potting') || text.includes('cocopeat')) return 'soil';
    if (text.includes('planter') || text.includes('pot') || text.includes('container')) return 'planters';
    if (text.includes('fertilizer') || text.includes('nutrient') || text.includes('food')) return 'fertilizers';
    if (text.includes('gift') || text.includes('combo') || text.includes('set')) return 'gifts';
    
    return 'indoorPlants';
  }

  private generatePrimaryKeyword(productName: string, cluster: keyof typeof PLANT_KEYWORD_CLUSTERS): string {
    const clusterData = PLANT_KEYWORD_CLUSTERS[cluster];
    const primaryBase = clusterData.primary[0];
    
    // Check if product name contains a specific plant name
    const cleanName = productName.toLowerCase().replace(/[^a-z\s]/g, ' ').trim();
    
    // Extract the main plant/product name
    const words = cleanName.split(' ').filter(w => w.length > 2);
    const mainTerm = words.slice(0, 2).join(' ');
    
    // Combine with buying intent
    return `buy ${mainTerm} online india`;
  }

  private generateSecondaryKeywords(productName: string, cluster: keyof typeof PLANT_KEYWORD_CLUSTERS): string[] {
    const clusterData = PLANT_KEYWORD_CLUSTERS[cluster];
    const keywords: string[] = [];
    const cleanName = productName.toLowerCase().replace(/[^a-z\s]/g, ' ').trim();
    const mainTerm = cleanName.split(' ').filter(w => w.length > 2).slice(0, 2).join(' ');

    // Add primary variations
    clusterData.primary.forEach(p => {
      keywords.push(`${p} bangalore`);
      keywords.push(`best ${p} online`);
    });

    // Add modifier combinations
    clusterData.modifiers.slice(0, 3).forEach(mod => {
      keywords.push(`${mod} ${mainTerm}`);
    });

    // Add location variations
    keywords.push(`${mainTerm} price india`);
    keywords.push(`${mainTerm} online delivery`);

    return [...new Set(keywords)].slice(0, 8);
  }

  private generateLongtailKeywords(productName: string, cluster: keyof typeof PLANT_KEYWORD_CLUSTERS): string[] {
    const clusterData = PLANT_KEYWORD_CLUSTERS[cluster];
    const keywords: string[] = [];
    const cleanName = productName.toLowerCase().replace(/[^a-z\s]/g, ' ').trim();

    // Generate long-tail combinations
    clusterData.modifiers.forEach(mod => {
      clusterData.locations.forEach(loc => {
        keywords.push(`${mod} ${clusterData.primary[0]} ${loc}`);
      });
    });

    // Add specific long-tail patterns
    keywords.push(`where to buy ${cleanName} in bangalore`);
    keywords.push(`best ${cleanName} for home india`);
    keywords.push(`${cleanName} price with pot`);
    keywords.push(`${cleanName} care tips beginners`);
    keywords.push(`${cleanName} online with free delivery`);

    return [...new Set(keywords)].slice(0, 10);
  }

  private generateQuestionKeywords(productName: string): string[] {
    const cleanName = productName.toLowerCase().replace(/[^a-z\s]/g, ' ').trim();
    
    return [
      `how to care for ${cleanName}`,
      `is ${cleanName} good for home`,
      `how often to water ${cleanName}`,
      `where to place ${cleanName} in house`,
      `what are benefits of ${cleanName}`,
      `does ${cleanName} purify air`,
      `how to propagate ${cleanName}`,
      `why is my ${cleanName} dying`,
    ];
  }

  private findRelatedTerms(productName: string): string[] {
    const cleanName = productName.toLowerCase();
    const related: string[] = [];

    // Check Indian plant terms
    for (const [indianTerm, englishTerms] of Object.entries(INDIAN_PLANT_TERMS)) {
      if (cleanName.includes(indianTerm) || englishTerms.some(t => cleanName.includes(t))) {
        related.push(indianTerm, ...englishTerms);
      }
    }

    return [...new Set(related)];
  }

  private determineSearchIntent(name: string, categories: string[]): KeywordResearch['searchIntent'] {
    const text = `${name} ${categories.join(' ')}`.toLowerCase();
    
    if (text.includes('gift') || text.includes('combo')) return 'transactional';
    if (text.includes('care') || text.includes('guide')) return 'informational';
    if (text.includes('best') || text.includes('top')) return 'commercial';
    
    return 'transactional'; // Default for product pages
  }

  private estimateDifficulty(keyword: string): KeywordResearch['difficulty'] {
    const words = keyword.split(' ').length;
    if (words >= 5) return 'easy'; // Long-tail = easier
    if (words >= 3) return 'medium';
    return 'hard';
  }

  private estimateVolume(keyword: string, cluster: keyof typeof PLANT_KEYWORD_CLUSTERS): KeywordResearch['estimatedVolume'] {
    const highVolumeCategories: (keyof typeof PLANT_KEYWORD_CLUSTERS)[] = ['indoorPlants', 'airPurifying', 'gifts'];
    const mediumVolumeCategories: (keyof typeof PLANT_KEYWORD_CLUSTERS)[] = ['succulents', 'flowering', 'planters'];
    
    if (highVolumeCategories.includes(cluster)) return 'high';
    if (mediumVolumeCategories.includes(cluster)) return 'medium';
    return 'low';
  }

  // ============================================================================
  // PRODUCT PAGE ANALYSIS
  // ============================================================================

  /**
   * Analyze a product page for SEO issues and generate recommendations
   */
  async analyzeProductSEO(product: WooCommerceProduct): Promise<ProductSEOAnalysis> {
    console.log(`📊 SEO AGENT: Analyzing SEO for "${product.name}"...`);

    const issues: SEOIssue[] = [];
    const recommendations: SEORecommendation[] = [];

    // Research keywords first
    const keywords = await this.researchKeywordsForProduct(product);

    // Analyze title
    const titleAnalysis = this.analyzeTitle(product.name, keywords.primary);
    issues.push(...titleAnalysis.issues);
    recommendations.push(...titleAnalysis.recommendations);

    // Analyze description
    const descAnalysis = this.analyzeDescription(product.description || '', product.short_description || '', keywords);
    issues.push(...descAnalysis.issues);
    recommendations.push(...descAnalysis.recommendations);

    // Analyze images
    const imageAnalysis = this.analyzeImages(product.images || []);
    issues.push(...imageAnalysis.issues);
    recommendations.push(...imageAnalysis.recommendations);

    // Generate optimized content
    const optimizedContent = await this.generateOptimizedContent(product, keywords);

    // Generate schema
    const schema = this.generateProductSchema(product);

    // Calculate score
    const currentScore = this.calculateSEOScore(issues);

    // Find competitor gaps using AI
    const competitorGaps = await this.findCompetitorGaps(product, keywords);

    return {
      productId: product.id,
      productName: product.name,
      currentScore,
      issues,
      recommendations,
      keywords,
      optimizedTitle: optimizedContent.title,
      optimizedDescription: optimizedContent.description,
      optimizedMetaDescription: optimizedContent.metaDescription,
      suggestedTags: optimizedContent.tags,
      schema,
      competitorGaps,
    };
  }

  private analyzeTitle(title: string, primaryKeyword: string): { issues: SEOIssue[]; recommendations: SEORecommendation[] } {
    const issues: SEOIssue[] = [];
    const recommendations: SEORecommendation[] = [];

    // Check title length
    if (title.length < 30) {
      issues.push({
        type: 'warning',
        category: 'title',
        message: 'Title is too short (under 30 characters)',
        impact: 'Lower click-through rate in search results',
      });
      recommendations.push({
        priority: 'high',
        category: 'Title Optimization',
        action: 'Expand title to 50-60 characters including primary keyword',
        expectedImpact: 'Better visibility in search results',
      });
    }

    if (title.length > 70) {
      issues.push({
        type: 'warning',
        category: 'title',
        message: 'Title is too long (over 70 characters)',
        impact: 'Title will be truncated in search results',
      });
    }

    // Check for keyword presence
    const keywordParts = primaryKeyword.toLowerCase().split(' ').filter(w => w.length > 3);
    const titleLower = title.toLowerCase();
    const hasKeyword = keywordParts.some(part => titleLower.includes(part));

    if (!hasKeyword) {
      issues.push({
        type: 'critical',
        category: 'keywords',
        message: 'Primary keyword not found in title',
        impact: 'Significantly lower ranking potential',
      });
      recommendations.push({
        priority: 'high',
        category: 'Keyword Optimization',
        action: `Include "${primaryKeyword}" naturally in the product title`,
        expectedImpact: 'Major improvement in search rankings',
      });
    }

    return { issues, recommendations };
  }

  private analyzeDescription(
    description: string,
    shortDescription: string,
    keywords: KeywordResearch
  ): { issues: SEOIssue[]; recommendations: SEORecommendation[] } {
    const issues: SEOIssue[] = [];
    const recommendations: SEORecommendation[] = [];

    const fullContent = `${description} ${shortDescription}`.toLowerCase();
    const wordCount = fullContent.split(/\s+/).filter(w => w.length > 0).length;

    // Check content length
    if (wordCount < 100) {
      issues.push({
        type: 'critical',
        category: 'content',
        message: `Description too short (${wordCount} words). Minimum 150 recommended.`,
        impact: 'Thin content penalty, lower rankings',
      });
      recommendations.push({
        priority: 'high',
        category: 'Content',
        action: 'Expand description to at least 150 words with care instructions, benefits, and specifications',
        expectedImpact: 'Significant ranking improvement',
      });
    } else if (wordCount < 200) {
      issues.push({
        type: 'warning',
        category: 'content',
        message: `Description could be longer (${wordCount} words). Target 200-300 for best results.`,
        impact: 'Missing opportunity for more keyword coverage',
      });
    }

    // Check for secondary keywords
    const secondaryFound = keywords.secondary.filter(kw => fullContent.includes(kw.toLowerCase())).length;
    if (secondaryFound < 2) {
      issues.push({
        type: 'warning',
        category: 'keywords',
        message: 'Few secondary keywords in description',
        impact: 'Missing long-tail ranking opportunities',
      });
      recommendations.push({
        priority: 'medium',
        category: 'Keyword Density',
        action: `Naturally include these keywords: ${keywords.secondary.slice(0, 3).join(', ')}`,
        expectedImpact: 'Better long-tail keyword coverage',
      });
    }

    // Check for structured content
    if (!description.includes('<h') && !description.includes('<ul') && !description.includes('<li')) {
      issues.push({
        type: 'info',
        category: 'content',
        message: 'Description lacks structured formatting',
        impact: 'Harder to read, lower engagement',
      });
      recommendations.push({
        priority: 'low',
        category: 'Content Structure',
        action: 'Add bullet points for features and subheadings for sections',
        expectedImpact: 'Better user engagement and time on page',
      });
    }

    return { issues, recommendations };
  }

  private analyzeImages(images: Array<{ src: string; alt?: string; name?: string }>): { issues: SEOIssue[]; recommendations: SEORecommendation[] } {
    const issues: SEOIssue[] = [];
    const recommendations: SEORecommendation[] = [];

    if (images.length === 0) {
      issues.push({
        type: 'critical',
        category: 'images',
        message: 'No product images found',
        impact: 'Major negative impact on conversion and SEO',
      });
      recommendations.push({
        priority: 'high',
        category: 'Images',
        action: 'Add at least 3-5 high-quality product images',
        expectedImpact: 'Significant improvement in conversion and image search visibility',
      });
    } else if (images.length < 3) {
      issues.push({
        type: 'warning',
        category: 'images',
        message: `Only ${images.length} image(s). Recommend at least 3-5.`,
        impact: 'Lower conversion rate',
      });
    }

    // Check alt text
    const missingAlt = images.filter(img => !img.alt || img.alt.trim() === '').length;
    if (missingAlt > 0) {
      issues.push({
        type: 'warning',
        category: 'images',
        message: `${missingAlt} image(s) missing alt text`,
        impact: 'Missing image search opportunity and accessibility issues',
      });
      recommendations.push({
        priority: 'medium',
        category: 'Image SEO',
        action: 'Add descriptive alt text with keywords to all images',
        expectedImpact: 'Better image search rankings and accessibility',
      });
    }

    return { issues, recommendations };
  }

  private async generateOptimizedContent(
    product: WooCommerceProduct,
    keywords: KeywordResearch
  ): Promise<{ title: string; description: string; metaDescription: string; tags: string[] }> {
    if (!aiService.isConfigured()) {
      return this.generateBasicOptimizedContent(product, keywords);
    }

    try {
      const prompt = `You are an SEO copywriter for "Whole Lot of Nature", a premium plant store in Bangalore, India.

Product: ${product.name}
Current Description: ${product.short_description || product.description || 'None'}
Price: ₹${product.price || 'N/A'}
Categories: ${product.categories?.map(c => c.name).join(', ') || 'General'}

Primary Keyword: ${keywords.primary}
Secondary Keywords: ${keywords.secondary.join(', ')}
Long-tail Keywords: ${keywords.longtail.slice(0, 5).join(', ')}

Generate SEO-optimized content that:
1. Naturally includes keywords without stuffing
2. Highlights benefits for Indian customers
3. Includes care tips relevant to Indian climate
4. Has a compelling call-to-action
5. Is written in a friendly, trustworthy tone

Return ONLY valid JSON:
{
  "title": "SEO optimized product title (50-60 chars)",
  "description": "Compelling 150-200 word description with natural keyword usage, benefits, care tips, and HTML formatting",
  "metaDescription": "Compelling meta description (150-160 chars) with primary keyword and call-to-action",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`;

      const response = await aiService.complete(prompt, {
        temperature: 0.5,
        maxTokens: 800,
        systemPrompt: 'You are an SEO expert. Return only valid JSON with no markdown formatting.',
      });

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          title: parsed.title || product.name,
          description: parsed.description || product.description || '',
          metaDescription: parsed.metaDescription || '',
          tags: Array.isArray(parsed.tags) ? parsed.tags : [],
        };
      }
    } catch (error) {
      console.warn('AI content generation failed:', error);
    }

    return this.generateBasicOptimizedContent(product, keywords);
  }

  private generateBasicOptimizedContent(
    product: WooCommerceProduct,
    keywords: KeywordResearch
  ): { title: string; description: string; metaDescription: string; tags: string[] } {
    const cleanName = product.name;
    
    return {
      title: `${cleanName} - Buy Online India | Whole Lot of Nature`,
      description: `<p>Discover the beauty of ${cleanName} at Whole Lot of Nature, Bangalore's premium plant store.</p>
<h3>Key Benefits:</h3>
<ul>
<li>Healthy, well-rooted plants</li>
<li>Expert care guidance included</li>
<li>Safe delivery across India</li>
</ul>
<p>Perfect for ${keywords.secondary[0] || 'plant lovers'}. Order now and bring nature home!</p>`,
      metaDescription: `Buy ${cleanName} online in India. Premium quality from Whole Lot of Nature. Free care guide included. Order now!`,
      tags: [
        keywords.primary.split(' ')[0],
        'plants online',
        'buy plants india',
        'bangalore plants',
        'indoor plants',
      ],
    };
  }

  private generateProductSchema(product: WooCommerceProduct): ProductSchema {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wholelotofnature.com';
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.short_description?.replace(/<[^>]*>/g, '') || product.name,
      image: product.images?.map(img => img.src) || [],
      brand: {
        '@type': 'Brand',
        name: 'Whole Lot of Nature',
      },
      offers: {
        '@type': 'Offer',
        price: product.price || '0',
        priceCurrency: 'INR',
        availability: product.stock_status === 'instock' 
          ? 'https://schema.org/InStock' 
          : 'https://schema.org/OutOfStock',
        url: `${baseUrl}/products/${product.slug}`,
      },
      ...(product.average_rating && Number(product.average_rating) > 0 ? {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: String(product.average_rating),
          reviewCount: String(product.rating_count || 1),
        },
      } : {}),
    };
  }

  private calculateSEOScore(issues: SEOIssue[]): number {
    let score = 100;
    
    issues.forEach(issue => {
      switch (issue.type) {
        case 'critical':
          score -= 20;
          break;
        case 'warning':
          score -= 10;
          break;
        case 'info':
          score -= 5;
          break;
      }
    });

    return Math.max(0, Math.min(100, score));
  }

  private async findCompetitorGaps(product: WooCommerceProduct, keywords: KeywordResearch): Promise<string[]> {
    if (!aiService.isConfigured()) {
      return [
        `Add FAQ section for "${keywords.questions[0]}"`,
        `Include customer reviews/testimonials`,
        `Add size/dimension specifications`,
        `Include care difficulty rating`,
      ];
    }

    try {
      const prompt = `As an SEO analyst for an Indian plant store, identify 4-5 content gaps that competitors might have filled but this product page is missing.

Product: ${product.name}
Keywords targeting: ${keywords.primary}, ${keywords.secondary.slice(0, 3).join(', ')}
Current Description Length: ${(product.description || '').length} characters

Common competitor advantages in plant e-commerce:
- Detailed care guides
- Size/growth specifications
- FAQ sections
- Customer reviews
- Comparison tables
- Video content
- Delivery information

Return ONLY a JSON array of 4-5 actionable gap recommendations:
["gap 1", "gap 2", "gap 3", "gap 4"]`;

      const response = await aiService.complete(prompt, {
        temperature: 0.3,
        maxTokens: 300,
        systemPrompt: 'Return only a JSON array of strings.',
      });

      const match = response.match(/\[[\s\S]*\]/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (error) {
      console.warn('AI competitor gap analysis failed:', error);
    }

    return [
      `Add FAQ section for "${keywords.questions[0]}"`,
      `Include customer reviews/testimonials`,
      `Add size/dimension specifications`,
      `Include care difficulty rating`,
    ];
  }

  // ============================================================================
  // BULK ANALYSIS
  // ============================================================================

  /**
   * Analyze all products and generate a comprehensive SEO report
   */
  async analyzeBulkProducts(limit: number = 50): Promise<BulkSEOReport> {
    console.log(`🚀 SEO AGENT: Starting bulk analysis of up to ${limit} products...`);

    let products: WooCommerceProduct[] = [];
    
    try {
      products = await WooCommerceService.getProducts(limit);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return this.getEmptyReport();
    }

    if (products.length === 0) {
      console.log('No products found to analyze');
      return this.getEmptyReport();
    }

    console.log(`Found ${products.length} products. Analyzing...`);

    const productsAnalyzed: ProductSEOAnalysis[] = [];
    let totalScore = 0;
    let criticalCount = 0;
    const allKeywords: string[] = [];

    // Analyze each product
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log(`  [${i + 1}/${products.length}] Analyzing: ${product.name}`);
      
      try {
        const analysis = await this.analyzeProductSEO(product);
        productsAnalyzed.push(analysis);
        totalScore += analysis.currentScore;
        criticalCount += analysis.issues.filter(i => i.type === 'critical').length;
        allKeywords.push(analysis.keywords.primary, ...analysis.keywords.secondary);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.warn(`  Failed to analyze ${product.name}:`, error);
      }
    }

    // Calculate top keywords
    const keywordCounts = new Map<string, number>();
    allKeywords.forEach(kw => {
      keywordCounts.set(kw, (keywordCounts.get(kw) || 0) + 1);
    });
    const topKeywords = Array.from(keywordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([kw]) => kw);

    // Generate overall recommendations
    const overallRecommendations = this.generateOverallRecommendations(productsAnalyzed);
    const priorityActions = this.generatePriorityActions(productsAnalyzed);

    return {
      analyzedAt: new Date(),
      totalProducts: productsAnalyzed.length,
      averageScore: Math.round(totalScore / (productsAnalyzed.length || 1)),
      criticalIssues: criticalCount,
      productsAnalyzed,
      topKeywords,
      overallRecommendations,
      priorityActions,
    };
  }

  private getEmptyReport(): BulkSEOReport {
    return {
      analyzedAt: new Date(),
      totalProducts: 0,
      averageScore: 0,
      criticalIssues: 0,
      productsAnalyzed: [],
      topKeywords: [],
      overallRecommendations: ['Connect to WooCommerce to analyze products'],
      priorityActions: ['Set up WooCommerce API credentials'],
    };
  }

  private generateOverallRecommendations(analyses: ProductSEOAnalysis[]): string[] {
    const recommendations: string[] = [];
    
    const avgScore = analyses.reduce((sum, a) => sum + a.currentScore, 0) / (analyses.length || 1);
    
    if (avgScore < 60) {
      recommendations.push('Overall SEO health is poor. Focus on fixing critical issues first.');
    } else if (avgScore < 80) {
      recommendations.push('SEO is decent but has room for improvement. Focus on content optimization.');
    } else {
      recommendations.push('Good SEO foundation! Focus on advanced optimizations and content freshness.');
    }

    // Check common issues
    const titleIssues = analyses.filter(a => a.issues.some(i => i.category === 'title')).length;
    if (titleIssues > analyses.length * 0.5) {
      recommendations.push(`${titleIssues} products have title issues. Consider bulk title optimization.`);
    }

    const imageIssues = analyses.filter(a => a.issues.some(i => i.category === 'images')).length;
    if (imageIssues > analyses.length * 0.3) {
      recommendations.push(`${imageIssues} products have image SEO issues. Add alt text and more images.`);
    }

    const contentIssues = analyses.filter(a => a.issues.some(i => i.category === 'content')).length;
    if (contentIssues > analyses.length * 0.5) {
      recommendations.push(`${contentIssues} products have thin content. Expand descriptions with care guides.`);
    }

    return recommendations;
  }

  private generatePriorityActions(analyses: ProductSEOAnalysis[]): string[] {
    const actions: string[] = [];
    
    // Find worst performing products
    const worstProducts = [...analyses]
      .sort((a, b) => a.currentScore - b.currentScore)
      .slice(0, 5);

    worstProducts.forEach(product => {
      if (product.currentScore < 50) {
        actions.push(`URGENT: Fix "${product.productName}" (Score: ${product.currentScore})`);
      }
    });

    // Add general priority actions
    const criticalProducts = analyses.filter(a => a.issues.some(i => i.type === 'critical'));
    if (criticalProducts.length > 0) {
      actions.push(`Fix critical issues on ${criticalProducts.length} products`);
    }

    actions.push('Implement schema markup on all product pages');
    actions.push('Create internal linking strategy between related products');
    actions.push('Add FAQ schema for top-selling products');

    return actions.slice(0, 10);
  }

  // ============================================================================
  // RANKING TRACKER
  // ============================================================================

  /**
   * Add a keyword to track for rankings
   */
  trackKeyword(keyword: string, productName: string, targetPosition: number = 10): void {
    const existing = this.rankingTrackers.find(
      t => t.keyword === keyword && t.product === productName
    );

    if (!existing) {
      this.rankingTrackers.push({
        keyword,
        product: productName,
        targetPosition,
        currentStatus: 'tracking',
        lastChecked: new Date(),
        history: [],
      });
      console.log(`📍 Now tracking "${keyword}" for "${productName}"`);
    }
  }

  /**
   * Get all tracked keywords
   */
  getTrackedKeywords(): RankingTracker[] {
    return this.rankingTrackers;
  }

  /**
   * Generate a keyword tracking report
   */
  getTrackingReport(): {
    totalTracked: number;
    improving: number;
    declining: number;
    stable: number;
    keywords: RankingTracker[];
  } {
    return {
      totalTracked: this.rankingTrackers.length,
      improving: this.rankingTrackers.filter(t => t.currentStatus === 'improved').length,
      declining: this.rankingTrackers.filter(t => t.currentStatus === 'declined').length,
      stable: this.rankingTrackers.filter(t => t.currentStatus === 'stable').length,
      keywords: this.rankingTrackers,
    };
  }
}

// Export singleton instance
export const seoResearchAgent = new SEOResearchAgent();
export default SEOResearchAgent;
