/**
 * SEO Optimization Agent - Automated SEO Audit & Fixes
 * Scans entire website for SEO issues and auto-generates optimizations
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface SEOIssue {
  type: 'meta' | 'heading' | 'image' | 'content' | 'schema' | 'sitemap';
  severity: 'critical' | 'high' | 'medium' | 'low';
  file: string;
  line?: number;
  message: string;
  fix?: string;
  suggestion?: string;
}

interface SEOStats {
  filesScanned: number;
  totalIssues: number;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  metaTagsGenerated: number;
  schemaAdded: number;
  optimizationsApplied: number;
}

interface PageMetadata {
  file: string;
  title?: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  canonicalUrl?: string;
  hasH1: boolean;
  h1Text?: string;
  headingStructure: string[];
  wordCount: number;
  images: { src: string; alt?: string; line: number }[];
  links: { href: string; text: string; internal: boolean }[];
}

interface ProductSchema {
  name: string;
  description: string;
  image: string;
  price?: string;
  availability?: string;
  rating?: number;
  ratingCount?: number;
}

// ============================================================================
// SEO AGENT CLASS
// ============================================================================

export class SEOAgent {
  private issues: SEOIssue[] = [];
  private stats: SEOStats = {
    filesScanned: 0,
    totalIssues: 0,
    criticalIssues: 0,
    highIssues: 0,
    mediumIssues: 0,
    lowIssues: 0,
    metaTagsGenerated: 0,
    schemaAdded: 0,
    optimizationsApplied: 0,
  };
  private pageMetadata: Map<string, PageMetadata> = new Map();

  // ============================================================================
  // MAIN SCAN FUNCTION
  // ============================================================================

  async scan(): Promise<void> {
    console.log('🔍 SEO OPTIMIZATION AGENT - Starting Scan...\n');
    console.log('📋 Checking:');
    console.log('  - Meta tags (title, description, OG tags)');
    console.log('  - Heading hierarchy (H1-H6)');
    console.log('  - Image alt attributes');
    console.log('  - Content quality (word count, keywords)');
    console.log('  - Structured data (Schema.org)');
    console.log('  - Internal/external links\n');

    await this.scanPages();
    await this.scanProducts();
    await this.scanBlogPosts();
    await this.checkSitemap();
    await this.checkRobotsTxt();

    this.generateReport();
  }

  // ============================================================================
  // SCAN PAGES
  // ============================================================================

  private async scanPages(): Promise<void> {
    const pagesDir = path.join(process.cwd(), 'src/app');
    const pageFiles = this.findPageFiles(pagesDir);

    console.log(`📄 Scanning ${pageFiles.length} pages...\n`);

    for (const file of pageFiles) {
      this.stats.filesScanned++;
      const metadata = await this.extractPageMetadata(file);
      this.pageMetadata.set(file, metadata);

      // Check meta tags
      this.checkMetaTags(file, metadata);

      // Check heading structure
      this.checkHeadingHierarchy(file, metadata);

      // Check image SEO
      this.checkImageSEO(file, metadata);

      // Check content quality
      this.checkContentQuality(file, metadata);
    }
  }

  // ============================================================================
  // SCAN PRODUCTS
  // ============================================================================

  private async scanProducts(): Promise<void> {
    console.log('🛍️  Scanning product pages for schema...\n');

    const productPages = Array.from(this.pageMetadata.entries())
      .filter(([file]) => file.includes('/shop/') || file.includes('/products/'));

    for (const [file, metadata] of productPages) {
      this.checkProductSchema(file, metadata);
    }
  }

  // ============================================================================
  // SCAN BLOG POSTS
  // ============================================================================

  private async scanBlogPosts(): Promise<void> {
    console.log('📝 Scanning blog posts...\n');

    const blogPages = Array.from(this.pageMetadata.entries())
      .filter(([file]) => file.includes('/blog/'));

    for (const [file, metadata] of blogPages) {
      this.checkBlogSchema(file, metadata);
    }
  }

  // ============================================================================
  // META TAG CHECKS
  // ============================================================================

  private checkMetaTags(file: string, metadata: PageMetadata): void {
    // Check title
    if (!metadata.title || metadata.title.length === 0) {
      this.addIssue({
        type: 'meta',
        severity: 'critical',
        file,
        message: 'Missing page title',
        fix: 'Add <title> tag or export metadata object',
        suggestion: this.generateTitleSuggestion(file),
      });
    } else if (metadata.title.length < 30) {
      this.addIssue({
        type: 'meta',
        severity: 'medium',
        file,
        message: `Title too short (${metadata.title.length} chars). Ideal: 50-60 chars`,
        suggestion: `Expand title to include keywords`,
      });
    } else if (metadata.title.length > 60) {
      this.addIssue({
        type: 'meta',
        severity: 'medium',
        file,
        message: `Title too long (${metadata.title.length} chars). Will be truncated in search results`,
        suggestion: `Shorten to 50-60 characters`,
      });
    }

    // Check description
    if (!metadata.description || metadata.description.length === 0) {
      this.addIssue({
        type: 'meta',
        severity: 'critical',
        file,
        message: 'Missing meta description',
        fix: 'Add meta description',
        suggestion: this.generateDescriptionSuggestion(file),
      });
    } else if (metadata.description.length < 120) {
      this.addIssue({
        type: 'meta',
        severity: 'medium',
        file,
        message: `Description too short (${metadata.description.length} chars). Ideal: 150-160 chars`,
      });
    } else if (metadata.description.length > 160) {
      this.addIssue({
        type: 'meta',
        severity: 'low',
        file,
        message: `Description too long (${metadata.description.length} chars). May be truncated`,
      });
    }

    // Check Open Graph tags
    if (!metadata.ogTitle) {
      this.addIssue({
        type: 'meta',
        severity: 'high',
        file,
        message: 'Missing OG title (Facebook/social sharing)',
        fix: 'Add og:title meta tag',
      });
    }

    if (!metadata.ogDescription) {
      this.addIssue({
        type: 'meta',
        severity: 'high',
        file,
        message: 'Missing OG description',
        fix: 'Add og:description meta tag',
      });
    }

    if (!metadata.ogImage) {
      this.addIssue({
        type: 'meta',
        severity: 'high',
        file,
        message: 'Missing OG image (social media preview)',
        fix: 'Add og:image meta tag with 1200x630px image',
      });
    }

    // Check Twitter Card
    if (!metadata.twitterCard) {
      this.addIssue({
        type: 'meta',
        severity: 'medium',
        file,
        message: 'Missing Twitter Card type',
        fix: 'Add twitter:card meta tag',
      });
    }

    // Check canonical URL
    if (!metadata.canonicalUrl) {
      this.addIssue({
        type: 'meta',
        severity: 'medium',
        file,
        message: 'Missing canonical URL (helps prevent duplicate content)',
        fix: 'Add canonical link tag',
      });
    }
  }

  // ============================================================================
  // HEADING HIERARCHY CHECKS
  // ============================================================================

  private checkHeadingHierarchy(file: string, metadata: PageMetadata): void {
    // Check H1
    if (!metadata.hasH1) {
      this.addIssue({
        type: 'heading',
        severity: 'critical',
        file,
        message: 'Missing H1 heading (required for SEO)',
        fix: 'Add exactly one H1 heading per page',
      });
    }

    // Check for multiple H1s
    const h1Count = metadata.headingStructure.filter(h => h === 'h1').length;
    if (h1Count > 1) {
      this.addIssue({
        type: 'heading',
        severity: 'high',
        file,
        message: `Multiple H1 headings found (${h1Count}). Should have exactly one`,
        fix: 'Use only one H1, convert others to H2 or H3',
      });
    }

    // Check heading sequence
    for (let i = 0; i < metadata.headingStructure.length - 1; i++) {
      const current = parseInt(metadata.headingStructure[i].replace('h', ''));
      const next = parseInt(metadata.headingStructure[i + 1].replace('h', ''));

      if (next > current + 1) {
        this.addIssue({
          type: 'heading',
          severity: 'medium',
          file,
          message: `Heading hierarchy skip detected (${metadata.headingStructure[i]} → ${metadata.headingStructure[i + 1]})`,
          suggestion: 'Maintain sequential heading levels for accessibility and SEO',
        });
      }
    }
  }

  // ============================================================================
  // IMAGE SEO CHECKS
  // ============================================================================

  private checkImageSEO(file: string, metadata: PageMetadata): void {
    for (const image of metadata.images) {
      if (!image.alt || image.alt.trim().length === 0) {
        this.addIssue({
          type: 'image',
          severity: 'high',
          file,
          line: image.line,
          message: `Image missing alt text: ${image.src}`,
          fix: 'Add descriptive alt attribute',
        });
      } else if (image.alt.length < 5) {
        this.addIssue({
          type: 'image',
          severity: 'medium',
          file,
          line: image.line,
          message: `Image alt text too short: "${image.alt}"`,
          suggestion: 'Use descriptive alt text (5-125 characters)',
        });
      } else if (image.alt.length > 125) {
        this.addIssue({
          type: 'image',
          severity: 'low',
          file,
          line: image.line,
          message: `Image alt text too long (${image.alt.length} chars)`,
          suggestion: 'Keep alt text concise (under 125 characters)',
        });
      }
    }
  }

  // ============================================================================
  // CONTENT QUALITY CHECKS
  // ============================================================================

  private checkContentQuality(file: string, metadata: PageMetadata): void {
    // Check word count
    if (metadata.wordCount < 300) {
      this.addIssue({
        type: 'content',
        severity: 'medium',
        file,
        message: `Low word count (${metadata.wordCount} words). Recommended: 300+ words for SEO`,
        suggestion: 'Add more descriptive content',
      });
    }

    // Check for thin content pages
    if (metadata.wordCount < 100) {
      this.addIssue({
        type: 'content',
        severity: 'high',
        file,
        message: `Very thin content (${metadata.wordCount} words). May be flagged as low-quality`,
        suggestion: 'Add substantial content (300+ words)',
      });
    }

    // Check internal links
    const internalLinks = metadata.links.filter(l => l.internal);
    if (internalLinks.length === 0) {
      this.addIssue({
        type: 'content',
        severity: 'low',
        file,
        message: 'No internal links found. Internal linking improves SEO',
        suggestion: 'Add relevant internal links to other pages',
      });
    }
  }

  // ============================================================================
  // SCHEMA CHECKS
  // ============================================================================

  private checkProductSchema(file: string, metadata: PageMetadata): void {
    const content = fs.readFileSync(file, 'utf-8');

    if (!content.includes('schema.org') && !content.includes('"@type": "Product"')) {
      this.addIssue({
        type: 'schema',
        severity: 'high',
        file,
        message: 'Missing Product schema (structured data)',
        fix: 'Add JSON-LD product schema for rich snippets',
        suggestion: this.generateProductSchema(metadata),
      });
    }
  }

  private checkBlogSchema(file: string, metadata: PageMetadata): void {
    const content = fs.readFileSync(file, 'utf-8');

    if (!content.includes('schema.org') && !content.includes('"@type": "Article"')) {
      this.addIssue({
        type: 'schema',
        severity: 'medium',
        file,
        message: 'Missing Article schema for blog post',
        fix: 'Add JSON-LD article schema',
      });
    }
  }

  // ============================================================================
  // SITEMAP & ROBOTS.TXT CHECKS
  // ============================================================================

  private async checkSitemap(): Promise<void> {
    const sitemapPath = path.join(process.cwd(), 'public/sitemap.xml');

    if (!fs.existsSync(sitemapPath)) {
      this.addIssue({
        type: 'sitemap',
        severity: 'critical',
        file: 'public/sitemap.xml',
        message: 'sitemap.xml not found',
        fix: 'Generate sitemap.xml for search engines',
        suggestion: 'Run: npm run seo:sitemap',
      });
    } else {
      // Check sitemap freshness
      const stats = fs.statSync(sitemapPath);
      const daysSinceUpdate = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60 * 24);

      if (daysSinceUpdate > 7) {
        this.addIssue({
          type: 'sitemap',
          severity: 'medium',
          file: 'public/sitemap.xml',
          message: `Sitemap is ${Math.round(daysSinceUpdate)} days old`,
          suggestion: 'Update sitemap regularly (weekly recommended)',
        });
      }
    }
  }

  private async checkRobotsTxt(): Promise<void> {
    const robotsPath = path.join(process.cwd(), 'public/robots.txt');

    if (!fs.existsSync(robotsPath)) {
      this.addIssue({
        type: 'sitemap',
        severity: 'high',
        file: 'public/robots.txt',
        message: 'robots.txt not found',
        fix: 'Create robots.txt to guide search engine crawlers',
      });
    }
  }

  // ============================================================================
  // METADATA EXTRACTION
  // ============================================================================

  private async extractPageMetadata(filePath: string): Promise<PageMetadata> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    const metadata: PageMetadata = {
      file: filePath,
      hasH1: false,
      headingStructure: [],
      wordCount: 0,
      images: [],
      links: [],
    };

    // Extract title
    const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
    if (titleMatch) metadata.title = titleMatch[1];

    // Extract description
    const descMatch = content.match(/description:\s*["']([^"']+)["']/);
    if (descMatch) metadata.description = descMatch[1];

    // Extract OG tags
    const ogTitleMatch = content.match(/openGraph.*?title:\s*["']([^"']+)["']/s);
    if (ogTitleMatch) metadata.ogTitle = ogTitleMatch[1];

    const ogDescMatch = content.match(/openGraph.*?description:\s*["']([^"']+)["']/s);
    if (ogDescMatch) metadata.ogDescription = ogDescMatch[1];

    const ogImageMatch = content.match(/openGraph.*?images:.*?url:\s*["']([^"']+)["']/s);
    if (ogImageMatch) metadata.ogImage = ogImageMatch[1];

    // Extract Twitter Card
    const twitterMatch = content.match(/twitter.*?card:\s*["']([^"']+)["']/s);
    if (twitterMatch) metadata.twitterCard = twitterMatch[1];

    // Extract headings
    const h1Match = content.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    if (h1Match) {
      metadata.hasH1 = true;
      metadata.h1Text = h1Match[1];
    }

    // Extract heading structure
    const headingMatches = content.matchAll(/<(h[1-6])[^>]*>/gi);
    for (const match of headingMatches) {
      metadata.headingStructure.push(match[1].toLowerCase());
    }

    // Extract images
    lines.forEach((line, index) => {
      const imgMatches = line.matchAll(/<(?:Image|img)\s+([^>]*)/gi);
      for (const match of imgMatches) {
        const attrs = match[1];
        const srcMatch = attrs.match(/src=["']([^"']+)["']/);
        const altMatch = attrs.match(/alt=["']([^"']*)["']/);

        if (srcMatch) {
          metadata.images.push({
            src: srcMatch[1],
            alt: altMatch ? altMatch[1] : undefined,
            line: index + 1,
          });
        }
      }
    });

    // Count words (rough estimate)
    const textContent = content
      .replace(/<[^>]+>/g, ' ')
      .replace(/[{}()[\]]/g, ' ')
      .replace(/\s+/g, ' ');
    metadata.wordCount = textContent.split(' ').filter(w => w.length > 2).length;

    // Extract links
    const linkMatches = content.matchAll(/<(?:Link|a)\s+href=["']([^"']+)["'][^>]*>([^<]*)</gi);
    for (const match of linkMatches) {
      metadata.links.push({
        href: match[1],
        text: match[2],
        internal: match[1].startsWith('/') || match[1].startsWith('#'),
      });
    }

    return metadata;
  }

  // ============================================================================
  // SUGGESTION GENERATORS
  // ============================================================================

  private generateTitleSuggestion(file: string): string {
    const pageName = path.basename(path.dirname(file));
    const suggestions = {
      shop: 'Buy Premium Plants Online | Whole Lot of Nature',
      about: 'About Us - Premium Plant Nursery | Whole Lot of Nature',
      blog: 'Plant Care Tips & Gardening Guides | Whole Lot of Nature',
      contact: 'Contact Us - Expert Plant Advice | Whole Lot of Nature',
    };

    return suggestions[pageName as keyof typeof suggestions] || 
           `${pageName.charAt(0).toUpperCase() + pageName.slice(1)} | Whole Lot of Nature`;
  }

  private generateDescriptionSuggestion(file: string): string {
    const pageName = path.basename(path.dirname(file));
    const suggestions = {
      shop: 'Shop premium indoor and outdoor plants online. Expert plant care, fast delivery across Bangalore. Soil mixes, pots, and gardening supplies available.',
      about: 'Learn about Whole Lot of Nature - your trusted plant nursery in Bangalore. Premium quality plants, expert advice, and sustainable gardening solutions.',
      blog: 'Discover expert plant care tips, gardening guides, and sustainable living advice. Learn how to grow and maintain healthy plants indoors and outdoors.',
      contact: 'Get in touch with our plant experts. Visit our nursery in Bangalore or contact us for plant care advice, bulk orders, and custom solutions.',
    };

    return suggestions[pageName as keyof typeof suggestions] || 
           'Discover premium plants and gardening supplies at Whole Lot of Nature. Expert advice and quality products for your green space.';
  }

  private generateProductSchema(metadata: PageMetadata): string {
    return `
Add this to your product page:

<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "${metadata.h1Text || 'Product Name'}",
  "image": "${metadata.images[0]?.src || '/images/product.jpg'}",
  "description": "${metadata.description || 'Product description'}",
  "brand": {
    "@type": "Brand",
    "name": "Whole Lot of Nature"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://wholelotofnature.com/products/...",
    "priceCurrency": "INR",
    "price": "299",
    "availability": "https://schema.org/InStock"
  }
}
</script>`;
  }

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  private findPageFiles(dir: string, files: string[] = []): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory() && !entry.name.startsWith('_') && entry.name !== 'api') {
        this.findPageFiles(fullPath, files);
      } else if (entry.name === 'page.tsx' || entry.name === 'page.ts') {
        files.push(fullPath);
      }
    }

    return files;
  }

  private addIssue(issue: SEOIssue): void {
    this.issues.push(issue);
    this.stats.totalIssues++;

    switch (issue.severity) {
      case 'critical':
        this.stats.criticalIssues++;
        break;
      case 'high':
        this.stats.highIssues++;
        break;
      case 'medium':
        this.stats.mediumIssues++;
        break;
      case 'low':
        this.stats.lowIssues++;
        break;
    }
  }

  // ============================================================================
  // REPORT GENERATION
  // ============================================================================

  private generateReport(): void {
    console.log('\n' + '='.repeat(80));
    console.log('📊 SEO OPTIMIZATION REPORT');
    console.log('='.repeat(80) + '\n');

    // Statistics
    console.log('📈 SCAN STATISTICS:');
    console.log(`  Pages Scanned: ${this.stats.filesScanned}`);
    console.log(`  Total Issues: ${this.stats.totalIssues}`);
    console.log(`    - Critical: ${this.stats.criticalIssues}`);
    console.log(`    - High: ${this.stats.highIssues}`);
    console.log(`    - Medium: ${this.stats.mediumIssues}`);
    console.log(`    - Low: ${this.stats.lowIssues}\n`);

    // Critical Issues
    const criticalIssues = this.issues.filter(i => i.severity === 'critical');
    if (criticalIssues.length > 0) {
      console.log('🚨 CRITICAL ISSUES (Fix Immediately):\n');
      criticalIssues.forEach(issue => {
        console.log(`📄 ${path.relative(process.cwd(), issue.file)}`);
        console.log(`   [${issue.type}] ${issue.message}`);
        if (issue.fix) console.log(`   Fix: ${issue.fix}`);
        if (issue.suggestion) console.log(`   💡 ${issue.suggestion}`);
        console.log('');
      });
    }

    // High Priority Issues
    const highIssues = this.issues.filter(i => i.severity === 'high');
    if (highIssues.length > 0) {
      console.log('⚠️  HIGH PRIORITY ISSUES:\n');
      highIssues.slice(0, 10).forEach(issue => {
        console.log(`📄 ${path.relative(process.cwd(), issue.file)}`);
        console.log(`   [${issue.type}] ${issue.message}`);
        if (issue.fix) console.log(`   Fix: ${issue.fix}`);
        console.log('');
      });
      if (highIssues.length > 10) {
        console.log(`   ... and ${highIssues.length - 10} more high priority issues\n`);
      }
    }

    // SEO Score
    const maxScore = 100;
    const deductions = 
      (this.stats.criticalIssues * 10) +
      (this.stats.highIssues * 5) +
      (this.stats.mediumIssues * 2) +
      (this.stats.lowIssues * 0.5);
    const score = Math.max(0, maxScore - deductions);

    console.log('📊 SEO SCORE:');
    console.log(`   ${score.toFixed(1)}/100`);
    if (score >= 90) console.log('   ✅ Excellent SEO!');
    else if (score >= 70) console.log('   ⚠️  Good, but needs improvement');
    else if (score >= 50) console.log('   🔴 Poor SEO - critical issues need fixing');
    else console.log('   🚨 Very poor SEO - immediate action required');

    console.log('\n' + '='.repeat(80));
    console.log('✅ SEO SCAN COMPLETE');
    console.log('='.repeat(80));
    console.log('\nRun `npm run seo:fix` to auto-generate meta tags and schema\n');

    // Save JSON report
    this.saveReport();
  }

  private saveReport(): void {
    const report = {
      scanDate: new Date().toISOString(),
      stats: this.stats,
      issues: this.issues,
      pageMetadata: Array.from(this.pageMetadata.entries()).map(([file, meta]) => ({
        file: path.relative(process.cwd(), file),
        ...meta,
      })),
    };

    const filename = `seo-report-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(filename, JSON.stringify(report, null, 2));
    console.log(`📁 Detailed report saved to: ${filename}\n`);
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

if (import.meta.url === `file://${process.argv[1]}`) {
  (async function main() {
    const agent = new SEOAgent();
    await agent.scan();
  })().catch(console.error);
}
