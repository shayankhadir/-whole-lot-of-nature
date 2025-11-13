#!/usr/bin/env tsx
/**
 * Performance Optimization Agent
 * Automatically optimizes images and bundles based on performance analysis
 * - Converts large PNGs to WebP
 * - Compresses images above threshold
 * - Updates components to use Next.js Image
 * - Implements lazy loading
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface PerformanceIssue {
  file: string;
  type: 'bundle' | 'image' | 'component' | 'loading' | 'dependency' | 'caching';
  severity: 'critical' | 'high' | 'medium' | 'low';
  issue: string;
  impact: string;
  estimatedSavings?: string;
}

class PerformanceOptimizer {
  private rootDir: string;
  private optimizedCount: number = 0;
  private skipCount: number = 0;
  private errors: string[] = [];
  private totalSavings: number = 0;

  constructor() {
    this.rootDir = process.cwd();
  }

  async optimize(): Promise<void> {
    console.log('⚡ PERFORMANCE OPTIMIZER - Starting...\n');
    console.log('📋 Optimizing:');
    console.log('  - Converting large images to WebP');
    console.log('  - Compressing oversized images');
    console.log('  - Replacing <img> with Next.js Image');
    console.log('  - Adding lazy loading\n');

    // Load the performance report
    const reportPath = this.findLatestReport();
    if (!reportPath) {
      console.log('❌ No performance report found. Run `npm run perf:analyze` first.');
      return;
    }

    const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    console.log(`📊 Found ${report.issues.length} issues to optimize\n`);

    // Check if sharp is installed (needed for image optimization)
    if (!this.checkSharpInstalled()) {
      console.log('📦 Installing sharp for image optimization...');
      try {
        execSync('npm install --save-dev sharp', { stdio: 'inherit' });
      } catch (error) {
        console.log('⚠️  Could not install sharp. Image optimization will be skipped.');
      }
    }

    // Group issues by type
    const imageIssues = report.issues.filter((i: PerformanceIssue) => i.type === 'image');
    const loadingIssues = report.issues.filter((i: PerformanceIssue) => i.type === 'loading');

    // Optimize images
    console.log('🖼️  Optimizing images...\n');
    for (const issue of imageIssues) {
      await this.optimizeImage(issue);
    }

    // Fix lazy loading issues
    console.log('\n🔄 Fixing lazy loading...\n');
    for (const issue of loadingIssues) {
      await this.fixLazyLoading(issue);
    }

    this.printSummary();
  }

  private findLatestReport(): string | null {
    const files = fs.readdirSync(this.rootDir);
    const reports = files.filter(f => f.startsWith('performance-report-') && f.endsWith('.json'));
    
    if (reports.length === 0) return null;
    
    reports.sort((a, b) => b.localeCompare(a)); // Sort by date descending
    return path.join(this.rootDir, reports[0]);
  }

  private checkSharpInstalled(): boolean {
    try {
      require.resolve('sharp');
      return true;
    } catch {
      return false;
    }
  }

  private async optimizeImage(issue: PerformanceIssue): Promise<void> {
    const imagePath = path.join(this.rootDir, issue.file);
    
    if (!fs.existsSync(imagePath)) {
      this.errors.push(`Image not found: ${issue.file}`);
      return;
    }

    const ext = path.extname(imagePath).toLowerCase();
    const basename = path.basename(imagePath, ext);
    const dirname = path.dirname(imagePath);

    try {
      // For very large images (>500KB), convert to WebP
      const stats = fs.statSync(imagePath);
      const sizeKB = stats.size / 1024;

      if (sizeKB > 500 && (ext === '.png' || ext === '.jpg' || ext === '.jpeg')) {
        const webpPath = path.join(dirname, `${basename}.webp`);
        
        // Only convert if WebP doesn't already exist
        if (!fs.existsSync(webpPath)) {
          await this.convertToWebP(imagePath, webpPath);
          
          const newStats = fs.statSync(webpPath);
          const newSizeKB = newStats.size / 1024;
          const savings = sizeKB - newSizeKB;
          
          this.totalSavings += savings;
          console.log(`✅ Converted: ${issue.file}`);
          console.log(`   💰 Saved: ${savings.toFixed(0)} KB (${((savings / sizeKB) * 100).toFixed(0)}% reduction)`);
          this.optimizedCount++;
        } else {
          console.log(`⏭️  Skipped: ${issue.file} (WebP already exists)`);
          this.skipCount++;
        }
      } else if (sizeKB > 200 && sizeKB <= 500) {
        // For medium images, compress in place
        await this.compressImage(imagePath);
        
        const newStats = fs.statSync(imagePath);
        const newSizeKB = newStats.size / 1024;
        const savings = sizeKB - newSizeKB;
        
        if (savings > 10) {
          this.totalSavings += savings;
          console.log(`✅ Compressed: ${issue.file}`);
          console.log(`   💰 Saved: ${savings.toFixed(0)} KB (${((savings / sizeKB) * 100).toFixed(0)}% reduction)`);
          this.optimizedCount++;
        } else {
          this.skipCount++;
        }
      } else {
        this.skipCount++;
      }
    } catch (error) {
      this.errors.push(`Failed to optimize ${issue.file}: ${error}`);
    }
  }

  private async convertToWebP(inputPath: string, outputPath: string): Promise<void> {
    try {
      const sharp = require('sharp');
      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath);
    } catch (error) {
      throw new Error(`WebP conversion failed: ${error}`);
    }
  }

  private async compressImage(imagePath: string): Promise<void> {
    try {
      const sharp = require('sharp');
      const ext = path.extname(imagePath).toLowerCase();
      const tempPath = imagePath + '.tmp';

      if (ext === '.png') {
        await sharp(imagePath)
          .png({ quality: 80, compressionLevel: 9 })
          .toFile(tempPath);
      } else if (ext === '.jpg' || ext === '.jpeg') {
        await sharp(imagePath)
          .jpeg({ quality: 80 })
          .toFile(tempPath);
      } else {
        return;
      }

      // Replace original with compressed version
      fs.unlinkSync(imagePath);
      fs.renameSync(tempPath, imagePath);
    } catch (error) {
      throw new Error(`Image compression failed: ${error}`);
    }
  }

  private async fixLazyLoading(issue: PerformanceIssue): Promise<void> {
    const filePath = path.join(this.rootDir, issue.file);
    
    if (!fs.existsSync(filePath)) {
      this.errors.push(`File not found: ${issue.file}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;

    // Add Next.js Image import if not present
    if (!content.includes("from 'next/image'") && !content.includes('from "next/image"')) {
      const importStatement = "import Image from 'next/image';\n";
      
      if (content.includes('import')) {
        // Add after first import
        const lines = content.split('\n');
        let firstImportIndex = -1;
        
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim().startsWith('import')) {
            firstImportIndex = i;
            break;
          }
        }

        if (firstImportIndex !== -1) {
          lines.splice(firstImportIndex, 0, importStatement);
          content = lines.join('\n');
        }
      } else {
        content = importStatement + content;
      }
    }

    // Replace <img> with <Image>
    // This is a basic replacement - may need manual review for complex cases
    const imgTagRegex = /<img\s+([^>]*?)src=["']([^"']+)["']([^>]*?)>/g;
    
    content = content.replace(imgTagRegex, (match, before, src, after) => {
      // Extract attributes
      const altMatch = (before + after).match(/alt=["']([^"']+)["']/);
      const classMatch = (before + after).match(/class(?:Name)?=["']([^"']+)["']/);
      const widthMatch = (before + after).match(/width=["']?(\d+)["']?/);
      const heightMatch = (before + after).match(/height=["']?(\d+)["']?/);

      const alt = altMatch ? altMatch[1] : '';
      const className = classMatch ? classMatch[1] : '';
      const width = widthMatch ? widthMatch[1] : '500';
      const height = heightMatch ? heightMatch[1] : '500';

      // Build Image component
      let imageComponent = `<Image\n        src="${src}"\n        alt="${alt}"`;
      
      if (width && height) {
        imageComponent += `\n        width={${width}}\n        height={${height}}`;
      }
      
      if (className) {
        imageComponent += `\n        className="${className}"`;
      }

      imageComponent += '\n      />';

      return imageComponent;
    });

    // Only write if content changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✅ Fixed: ${issue.file}`);
      this.optimizedCount++;
    } else {
      this.skipCount++;
    }
  }

  private printSummary(): void {
    console.log('\n' + '='.repeat(80));
    console.log('✅ PERFORMANCE OPTIMIZATION COMPLETE');
    console.log('='.repeat(80));
    console.log(`\n📊 SUMMARY:`);
    console.log(`  Files Optimized: ${this.optimizedCount}`);
    console.log(`  Files Skipped: ${this.skipCount}`);
    console.log(`  Total Savings: ${this.totalSavings.toFixed(0)} KB (${(this.totalSavings / 1024).toFixed(2)} MB)`);
    console.log(`  Errors: ${this.errors.length}`);

    if (this.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      this.errors.forEach(err => console.log(`  - ${err}`));
    }

    console.log('\n💡 Next Steps:');
    console.log('  1. Review optimized images and code changes');
    console.log('  2. Test images display correctly in browser');
    console.log('  3. Run `npm run perf:analyze` to verify improvements');
    console.log('  4. Consider implementing responsive images');
    console.log('  5. Update image references to use .webp versions\n');
    
    if (this.totalSavings > 1000) {
      console.log(`🎉 Excellent! You saved ${(this.totalSavings / 1024).toFixed(2)} MB!`);
      console.log(`   This will significantly improve page load times.\n`);
    }
  }
}

// Run the optimizer
const optimizer = new PerformanceOptimizer();
optimizer.optimize().catch(console.error);
