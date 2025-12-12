/**
 * Competitor Analysis Agent
 * Scrapes and analyzes competitor websites for SEO insights
 */

import axios, { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';
import https from 'https';

// Create axios instance with SSL verification disabled for scraping
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const axiosInstance: AxiosInstance = axios.create({
  httpsAgent,
  timeout: 20000,
  maxRedirects: 5,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  },
});

export interface CompetitorData {
  name: string;
  url: string;
  scrapedAt: Date;
  pages: PageAnalysis[];
  keywords: KeywordData[];
  products: ProductData[];
  seoScore: number;
}

export interface PageAnalysis {
  url: string;
  title: string;
  metaDescription: string;
  h1Tags: string[];
  h2Tags: string[];
  wordCount: number;
  images: number;
  internalLinks: number;
  externalLinks: number;
  schemaMarkup: boolean;
}

export interface KeywordData {
  keyword: string;
  frequency: number;
  context: string;
  importance: 'high' | 'medium' | 'low';
}

export interface ProductData {
  name: string;
  price: string;
  url: string;
  category: string;
  description: string;
}

export interface CompetitorInsights {
  topKeywords: string[];
  contentGaps: string[];
  priceRange: { min: number; max: number };
  averageWordCount: number;
  commonCategories: string[];
  recommendations: string[];
}

class CompetitorAnalysisAgent {
  private userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

  /**
   * Scrape and analyze a competitor website
   */
  async analyzeCompetitor(url: string, name: string): Promise<CompetitorData> {
    console.log(`\nAnalyzing competitor: ${name} (${url})`);

    const competitorData: CompetitorData = {
      name,
      url,
      scrapedAt: new Date(),
      pages: [],
      keywords: [],
      products: [],
      seoScore: 0,
    };

    try {
      // Scrape homepage
      console.log(`  1) Scraping homepage...`);
      const homepage = await this.scrapePage(url);
      competitorData.pages.push(homepage);

      // Extract product URLs
      console.log(`  2) Finding product pages...`);
      const productUrls = await this.findProductPages(url);
      console.log(`  Found ${productUrls.length} product pages`);

      // Scrape products (limit to 10 for performance)
      console.log(`  3) Scraping products...`);
      const productsToScrape = productUrls.slice(0, 10);
      let successCount = 0;
      
      for (let i = 0; i < productsToScrape.length; i++) {
        const productUrl = productsToScrape[i];
        try {
          console.log(`    [${i + 1}/${productsToScrape.length}] ${productUrl}`);
          const productData = await this.scrapeProduct(productUrl);
          if (productData) {
            competitorData.products.push(productData);
            successCount++;
          }
          await this.delay(1000); // Be polite - 1 second delay
        } catch (error: unknown) {
          console.error(`    Error: ${error instanceof Error ? error.message : String(error)}`);
        }
      }

      console.log(`  Successfully scraped ${successCount}/${productsToScrape.length} products`);

      // Extract keywords from all scraped content
      console.log(`  4) Extracting keywords...`);
      competitorData.keywords = this.extractKeywords(competitorData);
      console.log(`  Extracted ${competitorData.keywords.length} keywords`);

      // Calculate SEO score
      competitorData.seoScore = this.calculateSEOScore(competitorData);

      console.log(`\nAnalysis complete for ${name}:`);
      console.log(`  Pages analyzed: ${competitorData.pages.length}`);
      console.log(`  Products found: ${competitorData.products.length}`);
      console.log(`  Keywords extracted: ${competitorData.keywords.length}`);
      console.log(`  SEO Score: ${competitorData.seoScore}/100\n`);

      return competitorData;
    } catch (error: unknown) {
      console.error(`Critical error analyzing ${name}:`, error instanceof Error ? error.message : String(error));
      // Return partial data instead of throwing
      return competitorData;
    }
  }

  /**
   * Scrape a single page and extract SEO data
   */
  private async scrapePage(url: string): Promise<PageAnalysis> {
    try {
      console.log(`  Scraping page: ${url}`);
      
      const response = await axiosInstance.get(url, {
        headers: { 
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        },
        validateStatus: (status) => status < 500, // Accept redirects
      });

      if (response.status !== 200) {
        console.warn(`  Warning: Page returned status ${response.status}`);
      }

      const $ = cheerio.load(response.data);

      // Extract all text content
      const bodyText = $('body').text();
      const wordCount = bodyText.split(/\s+/).filter((word) => word.length > 0).length;

      const pageData = {
        url,
        title: $('title').text()?.trim() || 'No title',
        metaDescription: $('meta[name="description"]').attr('content')?.trim() || 
                        $('meta[property="og:description"]').attr('content')?.trim() || '',
        h1Tags: $('h1')
          .map((_, el) => $(el).text().trim())
          .get()
          .filter(t => t.length > 0),
        h2Tags: $('h2')
          .map((_, el) => $(el).text().trim())
          .get()
          .filter(t => t.length > 0),
        wordCount,
        images: $('img').length,
        internalLinks: $('a[href^="/"], a[href^="' + url + '"]').length,
        externalLinks: $('a[href^="http"]').not('[href^="' + url + '"]').length,
        schemaMarkup: $('script[type="application/ld+json"]').length > 0,
      };

      console.log(`  Scraped: ${pageData.title} (${wordCount} words, ${pageData.images} images)`);
      return pageData;
    } catch (error: unknown) {
      console.error(`  Error scraping ${url}:`, error instanceof Error ? error.message : String(error));
      // Return default data instead of failing
      return {
        url,
        title: 'Error loading page',
        metaDescription: '',
        h1Tags: [],
        h2Tags: [],
        wordCount: 0,
        images: 0,
        internalLinks: 0,
        externalLinks: 0,
        schemaMarkup: false,
      };
    }
  }

  /**
   * Find product page URLs from homepage
   */
  private async findProductPages(baseUrl: string): Promise<string[]> {
    try {
      console.log(`  Finding product pages on ${baseUrl}`);
      
      const response = await axiosInstance.get(baseUrl, {
        headers: { 
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml',
        },
      });

      const $ = cheerio.load(response.data);
      const productUrls: Set<string> = new Set();

      // Find links that look like product pages with multiple patterns
      $('a[href]').each((_, el) => {
        const href = $(el).attr('href');
        if (!href) return;

        // Match common product URL patterns
        const isProductUrl = 
          href.includes('/product/') ||
          href.includes('/products/') ||
          href.includes('/p/') ||
          href.includes('/plants/') ||
          href.includes('/plant/') ||
          href.includes('/shop/') ||
          href.includes('/item/') ||
          href.includes('/buy/') ||
          href.match(/\/[a-z-]+-plant-/i); // Pattern like "/snake-plant-123"

        if (isProductUrl) {
          try {
            const fullUrl = href.startsWith('http') 
              ? href 
              : new URL(href, baseUrl).href;
            
            // Only add if it's from the same domain
            if (fullUrl.includes(new URL(baseUrl).hostname)) {
              productUrls.add(fullUrl);
            }
          } catch (e) {
            // Skip invalid URLs
          }
        }
      });

      const urls = Array.from(productUrls);
      console.log(`  Found ${urls.length} potential product URLs`);
      return urls.slice(0, 20); // Limit to 20 products
    } catch (error: unknown) {
      console.error(`  Error finding product pages:`, error instanceof Error ? error.message : String(error));
      return [];
    }
  }

  /**
   * Scrape product details
   */
  private async scrapeProduct(url: string): Promise<ProductData | null> {
    try {
      console.log(`    Scraping product: ${url}`);
      
      const response = await axiosInstance.get(url, {
        headers: { 
          'User-Agent': this.userAgent,
          'Accept': 'text/html',
        },
      });

      const $ = cheerio.load(response.data);

      // Try multiple selectors for common e-commerce patterns
      const name =
        $('h1').first().text().trim() ||
        $('.product-title, .product-name, [class*="product-title"]').text().trim() ||
        $('[itemprop="name"]').text().trim() ||
        $('meta[property="og:title"]').attr('content')?.trim();

      const price =
        $('.price, .product-price, [class*="price"]').first().text().trim() ||
        $('[itemprop="price"]').attr('content') ||
        $('[itemprop="price"]').text().trim() ||
        $('meta[property="product:price:amount"]').attr('content');

      const description =
        $('.product-description, [class*="description"]').first().text().trim() ||
        $('[itemprop="description"]').text().trim() ||
        $('meta[name="description"]').attr('content') ||
        $('meta[property="og:description"]').attr('content') ||
        '';

      if (!name) {
        console.log(`    No product name found`);
        return null;
      }

      const product = {
        name: name.substring(0, 200),
        price: price || 'N/A',
        url,
        category: this.extractCategory($, url),
        description: description.substring(0, 500),
      };

      console.log(`    Found: ${product.name} - ${product.price}`);
      return product;
    } catch (error: unknown) {
      console.log(`    Error scraping product: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Extract category from breadcrumbs or URL
   */
  private extractCategory($: cheerio.CheerioAPI, url: string): string {
    // Try breadcrumbs first
    const breadcrumb = $('.breadcrumb, .breadcrumbs, [itemtype*="BreadcrumbList"]')
      .find('a')
      .last()
      .text()
      .trim();

    if (breadcrumb) return breadcrumb;

    // Try URL path
    const urlParts = url.split('/').filter((p) => p && p !== 'product' && p !== 'p');
    return urlParts[urlParts.length - 2] || 'Uncategorized';
  }

  /**
   * Extract keywords from competitor data
   */
  private extractKeywords(data: CompetitorData): KeywordData[] {
    const keywordMap = new Map<string, number>();
    const stopWords = new Set([
      'the',
      'a',
      'an',
      'and',
      'or',
      'but',
      'in',
      'on',
      'at',
      'to',
      'for',
      'of',
      'with',
      'by',
    ]);

    // Collect text from all sources
    const texts: string[] = [];
    data.pages.forEach((page) => {
      texts.push(page.title, page.metaDescription, ...page.h1Tags, ...page.h2Tags);
    });
    data.products.forEach((product) => {
      texts.push(product.name, product.category, product.description);
    });

    // Count keyword frequency
    texts.forEach((text) => {
      const words = text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((word) => word.length > 3 && !stopWords.has(word));

      words.forEach((word) => {
        keywordMap.set(word, (keywordMap.get(word) || 0) + 1);
      });
    });

    // Convert to array and sort by frequency
    const keywords: KeywordData[] = Array.from(keywordMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50) // Top 50 keywords
      .map(([keyword, frequency]) => ({
        keyword,
        frequency,
        context: this.getKeywordContext(keyword, texts),
        importance: frequency > 10 ? 'high' : frequency > 5 ? 'medium' : 'low',
      }));

    return keywords;
  }

  /**
   * Get context where keyword appears
   */
  private getKeywordContext(keyword: string, texts: string[]): string {
    for (const text of texts) {
      if (text.toLowerCase().includes(keyword)) {
        return text.substring(0, 100);
      }
    }
    return '';
  }

  /**
   * Calculate SEO score based on best practices
   */
  private calculateSEOScore(data: CompetitorData): number {
    let score = 0;

    data.pages.forEach((page) => {
      // Title exists and is good length (10 points)
      if (page.title && page.title.length >= 30 && page.title.length <= 60) score += 10;

      // Meta description exists and is good length (10 points)
      if (page.metaDescription && page.metaDescription.length >= 120 && page.metaDescription.length <= 160)
        score += 10;

      // Has H1 tag (10 points)
      if (page.h1Tags.length > 0) score += 10;

      // Has H2 tags (10 points)
      if (page.h2Tags.length >= 3) score += 10;

      // Good word count (15 points)
      if (page.wordCount >= 300) score += 15;

      // Has images (10 points)
      if (page.images >= 3) score += 10;

      // Has internal links (10 points)
      if (page.internalLinks >= 5) score += 10;

      // Has schema markup (15 points)
      if (page.schemaMarkup) score += 15;
    });

    return Math.min(100, Math.round(score / data.pages.length));
  }

  /**
   * Generate insights from competitor analysis
   */
  generateInsights(competitors: CompetitorData[]): CompetitorInsights {
    // Aggregate all keywords
    const allKeywords = new Map<string, number>();
    competitors.forEach((comp) => {
      comp.keywords.forEach((kw) => {
        allKeywords.set(kw.keyword, (allKeywords.get(kw.keyword) || 0) + kw.frequency);
      });
    });

    const topKeywords = Array.from(allKeywords.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([keyword]) => keyword);

    // Calculate price range
    const prices = competitors
      .flatMap((c) => c.products)
      .map((p) => parseInt(p.price.replace(/[^0-9]/g, '')))
      .filter((p) => !isNaN(p) && p > 0);

    const priceRange = {
      min: prices.length > 0 ? Math.min(...prices) : 0,
      max: prices.length > 0 ? Math.max(...prices) : 0,
    };

    // Calculate average word count
    const wordCounts = competitors.flatMap((c) => c.pages.map((p) => p.wordCount));
    const averageWordCount =
      wordCounts.length > 0 ? Math.round(wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length) : 0;

    // Extract common categories
    const categoryMap = new Map<string, number>();
    competitors.forEach((comp) => {
      comp.products.forEach((product) => {
        categoryMap.set(product.category, (categoryMap.get(product.category) || 0) + 1);
      });
    });

    const commonCategories = Array.from(categoryMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([cat]) => cat);

    // Generate recommendations
    const recommendations = this.generateRecommendations(competitors, {
      topKeywords,
      averageWordCount,
      priceRange,
    });

    return {
      topKeywords,
      contentGaps: this.identifyContentGaps(topKeywords),
      priceRange,
      averageWordCount,
      commonCategories,
      recommendations,
    };
  }

  /**
   * Identify content gaps (keywords we should target)
   */
  private identifyContentGaps(topKeywords: string[]): string[] {
    const gardeningTopics = [
      'indoor plants care',
      'outdoor gardening tips',
      'organic fertilizers',
      'pest control natural',
      'watering schedule',
      'soil types',
      'plant propagation',
      'seasonal planting',
      'container gardening',
      'hydroponic growing',
    ];

    return gardeningTopics.filter((topic) => {
      return !topKeywords.some((kw) => topic.toLowerCase().includes(kw));
    });
  }

  /**
   * Generate actionable recommendations
   */
  private generateRecommendations(
    competitors: CompetitorData[],
    insights: { topKeywords: string[]; averageWordCount: number; priceRange: { min: number; max: number } }
  ): string[] {
    const recommendations: string[] = [];

    // Content length recommendation
    if (insights.averageWordCount > 0) {
      recommendations.push(
        `Create blog posts with at least ${Math.round(insights.averageWordCount * 1.2)} words to outrank competitors (they average ${insights.averageWordCount} words)`
      );
    }

    // Keyword recommendations
    recommendations.push(
      `Target these high-value keywords: ${insights.topKeywords.slice(0, 5).join(', ')}`
    );

    // Product recommendations
    if (insights.priceRange.min > 0 && insights.priceRange.max > 0) {
      recommendations.push(
        `Competitor price range: ₹${insights.priceRange.min} - ₹${insights.priceRange.max}. Consider competitive pricing strategy.`
      );
    }

    // SEO improvements
    const avgSEOScore =
      competitors.reduce((sum, c) => sum + c.seoScore, 0) / competitors.length;
    if (avgSEOScore < 80) {
      recommendations.push(
        `Competitors have average SEO score of ${Math.round(avgSEOScore)}/100. Implement comprehensive SEO to gain advantage.`
      );
    }

    // Content gaps
    recommendations.push(
      'Create content for underserved topics: plant care guides, seasonal tips, troubleshooting guides'
    );

    return recommendations;
  }

  /**
   * Helper: Delay execution
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Generate mock/fallback data when scraping fails
   */
  generateMockData(name: string, url: string): CompetitorData {
    const mockProducts = [
      { name: 'Snake Plant', price: '₹299', category: 'Indoor Plants', description: 'Low maintenance indoor plant' },
      { name: 'Money Plant', price: '₹199', category: 'Indoor Plants', description: 'Popular air purifying plant' },
      { name: 'Peace Lily', price: '₹399', category: 'Flowering Plants', description: 'Beautiful flowering houseplant' },
      { name: 'Aloe Vera', price: '₹249', category: 'Succulents', description: 'Medicinal succulent plant' },
      { name: 'Spider Plant', price: '₹179', category: 'Indoor Plants', description: 'Easy to grow hanging plant' },
    ];

    const mockKeywords = [
      { keyword: 'plants', frequency: 50, context: 'Buy plants online', importance: 'high' as const },
      { keyword: 'indoor', frequency: 35, context: 'Indoor plants for home', importance: 'high' as const },
      { keyword: 'garden', frequency: 30, context: 'Garden supplies and tools', importance: 'medium' as const },
      { keyword: 'care', frequency: 25, context: 'Plant care tips', importance: 'medium' as const },
      { keyword: 'online', frequency: 40, context: 'Buy online delivery', importance: 'high' as const },
    ];

    return {
      name,
      url,
      scrapedAt: new Date(),
      pages: [{
        url,
        title: `${name} - Buy Plants Online`,
        metaDescription: `Shop for indoor and outdoor plants at ${name}. Fast delivery across India.`,
        h1Tags: [`Welcome to ${name}`],
        h2Tags: ['Featured Products', 'Popular Categories', 'Plant Care Tips'],
        wordCount: 850,
        images: 15,
        internalLinks: 25,
        externalLinks: 5,
        schemaMarkup: true,
      }],
      keywords: mockKeywords,
      products: mockProducts.map(p => ({ ...p, url: `${url}/product/${p.name.toLowerCase().replace(/\s+/g, '-')}` })),
      seoScore: 72,
    };
  }
}

export default CompetitorAnalysisAgent;
