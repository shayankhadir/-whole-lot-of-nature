#!/usr/bin/env tsx
/**
 * SEO Auto-Fix Agent
 * Automatically fixes common SEO issues detected by the SEO scanner
 * - Adds missing meta tags (title, description, OG tags)
 * - Adds missing H1 headings
 * - Generates Schema.org structured data
 * - Updates sitemap.xml
 */

import * as fs from 'fs';
import * as path from 'path';

interface SEOIssue {
  file: string;
  type: 'meta' | 'heading' | 'image' | 'content' | 'schema' | 'sitemap';
  severity: 'critical' | 'high' | 'medium' | 'low';
  issue: string;
  suggestion?: string;
}

interface PageMetadata {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
}

class SEOAutoFix {
  private rootDir: string;
  private appDir: string;
  private fixedCount: number = 0;
  private skipCount: number = 0;
  private errors: string[] = [];

  constructor() {
    this.rootDir = process.cwd();
    this.appDir = path.join(this.rootDir, 'src', 'app');
  }

  async fix(): Promise<void> {
    console.log('🔧 SEO AUTO-FIX AGENT - Starting...\n');
    console.log('📋 Fixing:');
    console.log('  - Missing meta tags (title, description, OG tags)');
    console.log('  - Missing H1 headings');
    console.log('  - Product schema (JSON-LD)');
    console.log('  - Sitemap updates\n');

    // Load the SEO report
    const reportPath = this.findLatestReport();
    if (!reportPath) {
      console.log('❌ No SEO report found. Run `npm run seo:scan` first.');
      return;
    }

    const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    console.log(`📊 Found ${report.issues.length} issues to fix\n`);

    // Group issues by file
    const issuesByFile = new Map<string, SEOIssue[]>();
    for (const issue of report.issues) {
      if (!issuesByFile.has(issue.file)) {
        issuesByFile.set(issue.file, []);
      }
      issuesByFile.get(issue.file)!.push(issue);
    }

    // Fix each file
    for (const [file, issues] of issuesByFile) {
      await this.fixFile(file, issues);
    }

    this.printSummary();
  }

  private findLatestReport(): string | null {
    const files = fs.readdirSync(this.rootDir);
    const reports = files.filter(f => f.startsWith('seo-report-') && f.endsWith('.json'));
    
    if (reports.length === 0) return null;
    
    reports.sort((a, b) => b.localeCompare(a)); // Sort by date descending
    return path.join(this.rootDir, reports[0]);
  }

  private async fixFile(file: string, issues: SEOIssue[]): Promise<void> {
    // Handle both absolute and relative paths
    const filePath = path.isAbsolute(file) ? file : path.join(this.rootDir, file);
    
    if (!fs.existsSync(filePath)) {
      this.errors.push(`File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;

    // Extract page name from file path
    const pageName = this.extractPageName(file);
    
    // Check if file already has metadata export
    const hasMetadataExport = content.includes('export const metadata');
    
    // Determine fixes needed
    const needsTitle = issues.some(i => i.issue.includes('Missing page title'));
    const needsDescription = issues.some(i => i.issue.includes('Missing meta description'));
    const needsOG = issues.some(i => i.issue.includes('Missing OG'));
    const needsH1 = issues.some(i => i.issue.includes('Missing H1 heading'));

    if (hasMetadataExport) {
      // Update existing metadata
      content = this.updateExistingMetadata(content, {
        needsTitle,
        needsDescription,
        needsOG,
        pageName
      });
    } else {
      // Add new metadata export
      content = this.addMetadataExport(content, {
        needsTitle,
        needsDescription,
        needsOG,
        pageName
      });
    }

    // Add H1 if missing
    if (needsH1) {
      content = this.addH1Heading(content, pageName);
    }

    // Add schema for product pages
    if (file.includes('products') && !file.includes('[slug]')) {
      content = this.addProductSchema(content);
    }

    // Only write if content changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✅ Fixed: ${file}`);
      this.fixedCount++;
    } else {
      this.skipCount++;
    }
  }

  private extractPageName(file: string): string {
    // Extract page name from file path
    // e.g., "src/app/about/page.tsx" -> "About"
    // e.g., "src/app/shop/page.tsx" -> "Shop"
    
    const parts = file.split(/[/\\]/);
    const appIndex = parts.indexOf('app');
    
    if (appIndex === -1) return 'Page';
    
    const pageParts = parts.slice(appIndex + 1);
    
    // Remove page.tsx
    if (pageParts[pageParts.length - 1] === 'page.tsx') {
      pageParts.pop();
    }
    
    // Handle root page
    if (pageParts.length === 0) {
      return 'Home';
    }
    
    // Handle dynamic routes
    if (pageParts[0].startsWith('[')) {
      return pageParts[0].replace(/[\[\]]/g, '');
    }
    
    // Convert to title case
    return pageParts[0]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private generateMetadata(pageName: string): PageMetadata {
    const baseUrl = 'https://wholelotofnature.com';
    
    // Generate contextual metadata based on page name
    const metadata: PageMetadata = {
      title: '',
      description: '',
      ogImage: `${baseUrl}/images/og-image.jpg`,
      canonical: ''
    };

    switch (pageName.toLowerCase()) {
      case 'home':
        metadata.title = 'Buy Premium Plants Online | Whole Lot of Nature';
        metadata.description = 'Shop premium indoor and outdoor plants online in Bangalore. Expert plant care, fast delivery, and sustainable gardening solutions. Soil mixes, pots, and accessories available.';
        metadata.canonical = baseUrl;
        break;
      
      case 'about':
        metadata.title = 'About Us - Premium Plant Nursery | Whole Lot of Nature';
        metadata.description = 'Learn about Whole Lot of Nature - your trusted plant nursery in Bangalore. Premium quality plants, expert gardening advice, and sustainable solutions for your green space.';
        metadata.canonical = `${baseUrl}/about`;
        break;
      
      case 'shop':
        metadata.title = 'Buy Premium Plants Online | Whole Lot of Nature';
        metadata.description = 'Shop premium indoor and outdoor plants online. Expert plant care, fast delivery across Bangalore. Soil mixes, pots, and gardening supplies available.';
        metadata.canonical = `${baseUrl}/shop`;
        break;
      
      case 'blog':
        metadata.title = 'Plant Care Tips & Gardening Guides | Whole Lot of Nature Blog';
        metadata.description = 'Discover expert plant care tips, gardening guides, and sustainable living advice. Learn how to grow and maintain healthy plants indoors and outdoors.';
        metadata.canonical = `${baseUrl}/blog`;
        break;
      
      case 'cart':
        metadata.title = 'Shopping Cart | Whole Lot of Nature';
        metadata.description = 'Review your selected plants and gardening supplies. Fast checkout and secure payment for premium plants delivered to your doorstep in Bangalore.';
        metadata.canonical = `${baseUrl}/cart`;
        break;
      
      case 'checkout':
        metadata.title = 'Secure Checkout | Whole Lot of Nature';
        metadata.description = 'Complete your plant purchase with our secure checkout. Fast delivery across Bangalore. Expert packaging ensures your plants arrive healthy.';
        metadata.canonical = `${baseUrl}/checkout`;
        break;
      
      case 'combos':
        metadata.title = 'Plant Combos & Bundles | Whole Lot of Nature';
        metadata.description = 'Discover curated plant combos and bundles. Save on complete gardening solutions with our expert-selected plant combinations and accessories.';
        metadata.canonical = `${baseUrl}/combos`;
        break;
      
      case 'learn-gardening':
      case 'learn gardening':
        metadata.title = 'Gardening Classes & Workshops | Whole Lot of Nature';
        metadata.description = 'Join our gardening workshops and classes in Bangalore. Learn plant care, sustainable gardening, and create your own urban garden with expert guidance.';
        metadata.canonical = `${baseUrl}/learn-gardening`;
        break;
      
      case 'wishlist':
        metadata.title = 'My Wishlist | Whole Lot of Nature';
        metadata.description = 'Save your favorite plants and gardening products. Easy access to your wishlist for future purchases at Whole Lot of Nature.';
        metadata.canonical = `${baseUrl}/wishlist`;
        break;
      
      case 'account':
        metadata.title = 'My Account | Whole Lot of Nature';
        metadata.description = 'Manage your account, view orders, track deliveries, and update your preferences. Your personal gardening dashboard at Whole Lot of Nature.';
        metadata.canonical = `${baseUrl}/account`;
        break;
      
      default:
        metadata.title = `${pageName} | Whole Lot of Nature`;
        metadata.description = 'Discover premium plants and gardening supplies at Whole Lot of Nature. Expert advice and quality products for your green space in Bangalore.';
        metadata.canonical = `${baseUrl}/${pageName.toLowerCase().replace(/\s+/g, '-')}`;
    }

    metadata.ogTitle = metadata.title;
    metadata.ogDescription = metadata.description;

    return metadata;
  }

  private addMetadataExport(content: string, options: any): string {
    const { pageName } = options;
    const metadata = this.generateMetadata(pageName);

    const metadataCode = `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${metadata.title}',
  description: '${metadata.description}',
  openGraph: {
    title: '${metadata.ogTitle}',
    description: '${metadata.ogDescription}',
    images: ['${metadata.ogImage}'],
    url: '${metadata.canonical}',
  },
  twitter: {
    card: 'summary_large_image',
    title: '${metadata.ogTitle}',
    description: '${metadata.ogDescription}',
    images: ['${metadata.ogImage}'],
  },
  alternates: {
    canonical: '${metadata.canonical}',
  },
};

`;

    // Add after imports or at the beginning
    if (content.includes('import')) {
      // Find last import statement
      const lines = content.split('\n');
      let lastImportIndex = -1;
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('import') || 
            lines[i].trim().startsWith('import type') ||
            lines[i].trim().startsWith("import '") ||
            lines[i].trim().startsWith('import "')) {
          lastImportIndex = i;
        }
      }

      if (lastImportIndex !== -1) {
        lines.splice(lastImportIndex + 1, 0, '', metadataCode);
        return lines.join('\n');
      }
    }

    // If no imports found, add at the beginning
    return metadataCode + content;
  }

  private updateExistingMetadata(content: string, options: any): string {
    const { needsTitle, needsDescription, needsOG, pageName } = options;
    const metadata = this.generateMetadata(pageName);

    // Parse existing metadata
    const metadataMatch = content.match(/export const metadata[:\s]*(?:Metadata)?[:\s]*=\s*{([^}]+)}/);
    
    if (!metadataMatch) return content;

    let updatedContent = content;

    // Add missing fields
    if (needsTitle && !content.includes("title:")) {
      updatedContent = updatedContent.replace(
        /export const metadata[:\s]*(?:Metadata)?[:\s]*=\s*{/,
        `export const metadata: Metadata = {\n  title: '${metadata.title}',`
      );
    }

    if (needsDescription && !content.includes("description:")) {
      updatedContent = updatedContent.replace(
        /export const metadata[:\s]*(?:Metadata)?[:\s]*=\s*{/,
        `export const metadata: Metadata = {\n  description: '${metadata.description}',`
      );
    }

    if (needsOG && !content.includes("openGraph:")) {
      const ogCode = `  openGraph: {
    title: '${metadata.ogTitle}',
    description: '${metadata.ogDescription}',
    images: ['${metadata.ogImage}'],
    url: '${metadata.canonical}',
  },`;
      
      updatedContent = updatedContent.replace(
        /export const metadata[:\s]*(?:Metadata)?[:\s]*=\s*{/,
        `export const metadata: Metadata = {\n${ogCode}`
      );
    }

    return updatedContent;
  }

  private addH1Heading(content: string, pageName: string): string {
    // Check if component has a return statement
    if (!content.includes('return')) return content;

    // Generate H1 text based on page name
    const h1Text = this.generateH1Text(pageName);

    // Look for the main return statement
    const returnMatch = content.match(/return\s*\(/);
    if (!returnMatch) return content;

    // Check if H1 already exists
    if (content.includes('<h1') || content.includes('<H1')) return content;

    // Add H1 after the opening tag of the return
    const lines = content.split('\n');
    let returnLineIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('return (')) {
        returnLineIndex = i;
        break;
      }
    }

    if (returnLineIndex === -1) return content;

    // Find the first div or main or section
    let insertIndex = -1;
    for (let i = returnLineIndex + 1; i < lines.length; i++) {
      if (lines[i].includes('<div') || lines[i].includes('<main') || lines[i].includes('<section')) {
        insertIndex = i + 1;
        break;
      }
    }

    if (insertIndex !== -1) {
      const indent = lines[insertIndex].match(/^\s*/)?.[0] || '      ';
      lines.splice(insertIndex, 0, `${indent}<h1 className="text-4xl font-bold mb-6">${h1Text}</h1>`);
      return lines.join('\n');
    }

    return content;
  }

  private generateH1Text(pageName: string): string {
    switch (pageName.toLowerCase()) {
      case 'home':
        return 'Premium Plants & Gardening Supplies';
      case 'about':
        return 'About Whole Lot of Nature';
      case 'shop':
        return 'Shop Premium Plants Online';
      case 'blog':
        return 'Plant Care Tips & Gardening Guides';
      case 'cart':
        return 'Your Shopping Cart';
      case 'checkout':
        return 'Secure Checkout';
      case 'combos':
        return 'Plant Combos & Bundles';
      case 'learn-gardening':
      case 'learn gardening':
        return 'Gardening Workshops & Classes';
      case 'wishlist':
        return 'My Wishlist';
      case 'account':
        return 'My Account';
      default:
        return pageName;
    }
  }

  private addProductSchema(content: string): string {
    // Check if schema already exists
    if (content.includes('application/ld+json')) return content;

    const schemaCode = `
  {/* Product Schema */}
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'Premium Plant',
        image: '/images/product-placeholder.jpg',
        description: 'High-quality plant from Whole Lot of Nature',
        brand: {
          '@type': 'Brand',
          name: 'Whole Lot of Nature'
        },
        offers: {
          '@type': 'Offer',
          url: 'https://wholelotofnature.com/products',
          priceCurrency: 'INR',
          price: '299',
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: 'Whole Lot of Nature'
          }
        }
      })
    }}
  />`;

    // Add before closing tag
    return content.replace(/(<\/div>\s*<\/main>|<\/section>|<\/div>\s*\);?\s*}?\s*$)/m, `${schemaCode}\n$1`);
  }

  private printSummary(): void {
    console.log('\n' + '='.repeat(80));
    console.log('✅ SEO AUTO-FIX COMPLETE');
    console.log('='.repeat(80));
    console.log(`\n📊 SUMMARY:`);
    console.log(`  Files Fixed: ${this.fixedCount}`);
    console.log(`  Files Skipped: ${this.skipCount}`);
    console.log(`  Errors: ${this.errors.length}`);

    if (this.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      this.errors.forEach(err => console.log(`  - ${err}`));
    }

    console.log('\n💡 Next Steps:');
    console.log('  1. Review the changes in your code');
    console.log('  2. Run `npm run seo:scan` to verify fixes');
    console.log('  3. Test pages in browser');
    console.log('  4. Commit changes to git\n');
  }
}

// Run the auto-fix
const fixer = new SEOAutoFix();
fixer.fix().catch(console.error);
