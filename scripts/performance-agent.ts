/**
 * Performance Monitoring Agent - Automated Performance Audit & Optimization
 * Analyzes bundle sizes, images, loading times, and suggests optimizations
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface PerformanceIssue {
  type: 'bundle' | 'image' | 'loading' | 'code' | 'caching' | 'render';
  severity: 'critical' | 'high' | 'medium' | 'low';
  file?: string;
  message: string;
  impact: string;
  fix: string;
  estimatedSavings?: string;
}

interface PerformanceStats {
  filesScanned: number;
  totalIssues: number;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  totalBundleSize: number;
  largeImagesCount: number;
  unoptimizedImagesCount: number;
  unusedCodeEstimate: number;
}

interface ImageAnalysis {
  file: string;
  size: number;
  dimensions?: { width: number; height: number };
  format: string;
  optimizable: boolean;
  estimatedSavings: number;
  suggestions: string[];
}

interface BundleAnalysis {
  route: string;
  size: number;
  firstLoadJS: number;
  isLarge: boolean;
  dependencies: string[];
  suggestions: string[];
}

interface ComponentAnalysis {
  file: string;
  linesOfCode: number;
  imports: string[];
  isClientComponent: boolean;
  hasHeavyDependencies: boolean;
  suggestions: string[];
}

// ============================================================================
// PERFORMANCE AGENT CLASS
// ============================================================================

class PerformanceAgent {
  private issues: PerformanceIssue[] = [];
  private stats: PerformanceStats = {
    filesScanned: 0,
    totalIssues: 0,
    criticalIssues: 0,
    highIssues: 0,
    mediumIssues: 0,
    lowIssues: 0,
    totalBundleSize: 0,
    largeImagesCount: 0,
    unoptimizedImagesCount: 0,
    unusedCodeEstimate: 0,
  };
  private imageAnalyses: ImageAnalysis[] = [];
  private bundleAnalyses: BundleAnalysis[] = [];
  private componentAnalyses: ComponentAnalysis[] = [];

  // ============================================================================
  // MAIN SCAN FUNCTION
  // ============================================================================

  async analyze(): Promise<void> {
    console.log('⚡ PERFORMANCE MONITORING AGENT - Starting Analysis...\n');
    console.log('📋 Analyzing:');
    console.log('  - Bundle sizes and code splitting');
    console.log('  - Image optimization opportunities');
    console.log('  - Component size and complexity');
    console.log('  - Lazy loading implementation');
    console.log('  - Unused dependencies');
    console.log('  - Render-blocking resources\n');

    await this.analyzeBundleSizes();
    await this.analyzeImages();
    await this.analyzeComponents();
    await this.checkLazyLoading();
    await this.checkDependencies();
    await this.checkCaching();

    this.generateReport();
  }

  // ============================================================================
  // BUNDLE SIZE ANALYSIS
  // ============================================================================

  private async analyzeBundleSizes(): Promise<void> {
    console.log('📦 Analyzing bundle sizes...\n');

    try {
      // Check if .next folder exists (production build)
      const nextDir = path.join(process.cwd(), '.next');
      
      if (!fs.existsSync(nextDir)) {
        this.addIssue({
          type: 'bundle',
          severity: 'medium',
          message: 'No production build found',
          impact: 'Cannot analyze bundle sizes without build',
          fix: 'Run `npm run build` first',
        });
        return;
      }

      // Analyze build output
      const buildManifest = path.join(nextDir, 'build-manifest.json');
      if (fs.existsSync(buildManifest)) {
        const manifest = JSON.parse(fs.readFileSync(buildManifest, 'utf-8'));
        
        for (const [route, files] of Object.entries(manifest.pages || {})) {
          const totalSize = (files as string[]).reduce((acc, file) => {
            const filePath = path.join(nextDir, file);
            if (fs.existsSync(filePath)) {
              return acc + fs.statSync(filePath).size;
            }
            return acc;
          }, 0);

          const sizeKB = totalSize / 1024;
          this.stats.totalBundleSize += totalSize;

          if (sizeKB > 200) {
            this.addIssue({
              type: 'bundle',
              severity: 'high',
              file: route,
              message: `Large bundle size: ${sizeKB.toFixed(2)} KB`,
              impact: 'Slow page load time, poor mobile experience',
              fix: 'Implement code splitting and dynamic imports',
              estimatedSavings: `Potential ${(sizeKB * 0.3).toFixed(0)} KB reduction`,
            });
          } else if (sizeKB > 100) {
            this.addIssue({
              type: 'bundle',
              severity: 'medium',
              file: route,
              message: `Moderately large bundle: ${sizeKB.toFixed(2)} KB`,
              impact: 'May affect load time on slow connections',
              fix: 'Consider lazy loading heavy components',
            });
          }
        }
      }

      // Check for large shared chunks
      const staticDir = path.join(nextDir, 'static/chunks');
      if (fs.existsSync(staticDir)) {
        const chunks = fs.readdirSync(staticDir);
        
        for (const chunk of chunks) {
          const chunkPath = path.join(staticDir, chunk);
          const stats = fs.statSync(chunkPath);
          const sizeKB = stats.size / 1024;

          if (sizeKB > 500) {
            this.addIssue({
              type: 'bundle',
              severity: 'critical',
              file: `chunks/${chunk}`,
              message: `Extremely large chunk: ${sizeKB.toFixed(2)} KB`,
              impact: 'Significant performance bottleneck',
              fix: 'Split chunk or remove heavy dependencies',
              estimatedSavings: `${(sizeKB * 0.4).toFixed(0)} KB potential savings`,
            });
          }
        }
      }

    } catch (error) {
      console.log('⚠️  Could not analyze bundles:', (error as Error).message);
    }
  }

  // ============================================================================
  // IMAGE ANALYSIS
  // ============================================================================

  private async analyzeImages(): Promise<void> {
    console.log('🖼️  Analyzing images...\n');

    const imageDirs = [
      path.join(process.cwd(), 'public/images'),
      path.join(process.cwd(), 'public/assets'),
      path.join(process.cwd(), 'public'),
    ];

    for (const dir of imageDirs) {
      if (fs.existsSync(dir)) {
        await this.scanImagesInDir(dir);
      }
    }

    console.log(`   Found ${this.imageAnalyses.length} images\n`);
  }

  private async scanImagesInDir(dir: string): Promise<void> {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await this.scanImagesInDir(fullPath);
      } else if (this.isImageFile(entry.name)) {
        this.analyzeImage(fullPath);
      }
    }
  }

  private isImageFile(filename: string): boolean {
    const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif'];
    return imageExts.some(ext => filename.toLowerCase().endsWith(ext));
  }

  private analyzeImage(filePath: string): void {
    this.stats.filesScanned++;
    const stats = fs.statSync(filePath);
    const sizeKB = stats.size / 1024;
    const format = path.extname(filePath).toLowerCase().replace('.', '');

    const analysis: ImageAnalysis = {
      file: path.relative(process.cwd(), filePath),
      size: stats.size,
      format,
      optimizable: false,
      estimatedSavings: 0,
      suggestions: [],
    };

    // Check file size
    if (sizeKB > 500) {
      this.stats.largeImagesCount++;
      analysis.optimizable = true;
      analysis.estimatedSavings = stats.size * 0.6; // 60% potential reduction

      this.addIssue({
        type: 'image',
        severity: 'critical',
        file: analysis.file,
        message: `Very large image: ${sizeKB.toFixed(2)} KB`,
        impact: 'Slow page load, high bandwidth usage',
        fix: 'Compress image and convert to WebP/AVIF',
        estimatedSavings: `${(sizeKB * 0.6).toFixed(0)} KB reduction possible`,
      });

      analysis.suggestions.push('Compress to under 200KB');
      analysis.suggestions.push('Convert to WebP format');
      analysis.suggestions.push('Use responsive images with srcset');
    } else if (sizeKB > 200) {
      this.stats.largeImagesCount++;
      analysis.optimizable = true;
      analysis.estimatedSavings = stats.size * 0.4;

      this.addIssue({
        type: 'image',
        severity: 'high',
        file: analysis.file,
        message: `Large image: ${sizeKB.toFixed(2)} KB`,
        impact: 'May slow page load on mobile',
        fix: 'Compress or convert to modern format',
        estimatedSavings: `${(sizeKB * 0.4).toFixed(0)} KB reduction`,
      });

      analysis.suggestions.push('Optimize compression');
      analysis.suggestions.push('Consider WebP format');
    }

    // Check format
    if (format === 'png' && sizeKB > 50) {
      this.stats.unoptimizedImagesCount++;
      analysis.suggestions.push('PNG detected - consider WebP for photos');
      
      this.addIssue({
        type: 'image',
        severity: 'medium',
        file: analysis.file,
        message: 'PNG format for photo - inefficient',
        impact: 'Larger file size than necessary',
        fix: 'Convert to WebP or AVIF format',
        estimatedSavings: `${(sizeKB * 0.5).toFixed(0)} KB with WebP`,
      });
    }

    if (format === 'jpg' || format === 'jpeg') {
      this.stats.unoptimizedImagesCount++;
      analysis.suggestions.push('JPG detected - convert to WebP for better compression');
      
      this.addIssue({
        type: 'image',
        severity: 'low',
        file: analysis.file,
        message: 'JPG format - modern formats available',
        impact: 'Missing out on 25-35% size reduction',
        fix: 'Convert to WebP format',
        estimatedSavings: `${(sizeKB * 0.3).toFixed(0)} KB with WebP`,
      });
    }

    this.imageAnalyses.push(analysis);
  }

  // ============================================================================
  // COMPONENT ANALYSIS
  // ============================================================================

  private async analyzeComponents(): Promise<void> {
    console.log('🧩 Analyzing components...\n');

    const componentDirs = [
      path.join(process.cwd(), 'src/components'),
      path.join(process.cwd(), 'src/app'),
    ];

    for (const dir of componentDirs) {
      if (fs.existsSync(dir)) {
        await this.scanComponentsInDir(dir);
      }
    }
  }

  private async scanComponentsInDir(dir: string): Promise<void> {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory() && !entry.name.startsWith('_')) {
        await this.scanComponentsInDir(fullPath);
      } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
        this.analyzeComponent(fullPath);
      }
    }
  }

  private analyzeComponent(filePath: string): void {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    const analysis: ComponentAnalysis = {
      file: path.relative(process.cwd(), filePath),
      linesOfCode: lines.length,
      imports: [],
      isClientComponent: content.includes("'use client'") || content.includes('"use client"'),
      hasHeavyDependencies: false,
      suggestions: [],
    };

    // Extract imports
    const importMatches = content.matchAll(/import\s+.*?\s+from\s+['"]([^'"]+)['"]/g);
    for (const match of importMatches) {
      analysis.imports.push(match[1]);
    }

    // Check for heavy dependencies
    const heavyLibs = ['moment', 'lodash', 'date-fns', 'axios', 'jquery'];
    const hasHeavy = analysis.imports.some(imp => 
      heavyLibs.some(lib => imp.includes(lib))
    );

    if (hasHeavy) {
      analysis.hasHeavyDependencies = true;
      
      this.addIssue({
        type: 'code',
        severity: 'medium',
        file: analysis.file,
        message: 'Component imports heavy dependencies',
        impact: 'Increased bundle size',
        fix: 'Use lighter alternatives or dynamic imports',
      });
    }

    // Check component size
    if (analysis.linesOfCode > 500) {
      this.addIssue({
        type: 'code',
        severity: 'medium',
        file: analysis.file,
        message: `Large component: ${analysis.linesOfCode} lines`,
        impact: 'Hard to maintain, potential performance issues',
        fix: 'Split into smaller components',
      });

      analysis.suggestions.push('Consider splitting into sub-components');
    }

    // Check for unnecessary client components
    if (analysis.isClientComponent && !this.needsClientComponent(content)) {
      this.addIssue({
        type: 'render',
        severity: 'low',
        file: analysis.file,
        message: 'Marked as client component but may not need to be',
        impact: 'Prevents server-side rendering optimization',
        fix: 'Remove "use client" if hooks/browser APIs not used',
      });
    }

    this.componentAnalyses.push(analysis);
  }

  private needsClientComponent(content: string): boolean {
    return (
      content.includes('useState') ||
      content.includes('useEffect') ||
      content.includes('useRouter') ||
      content.includes('window.') ||
      content.includes('document.') ||
      content.includes('localStorage') ||
      content.includes('sessionStorage')
    );
  }

  // ============================================================================
  // LAZY LOADING CHECKS
  // ============================================================================

  private async checkLazyLoading(): Promise<void> {
    console.log('🔄 Checking lazy loading implementation...\n');

    const components = this.componentAnalyses;

    for (const component of components) {
      const content = fs.readFileSync(
        path.join(process.cwd(), component.file),
        'utf-8'
      );

      // Check if large component uses lazy loading
      if (component.linesOfCode > 300 && !content.includes('dynamic') && !content.includes('lazy')) {
        this.addIssue({
          type: 'loading',
          severity: 'medium',
          file: component.file,
          message: 'Large component not lazy loaded',
          impact: 'Increases initial bundle size',
          fix: 'Use next/dynamic for code splitting',
        });
      }

      // Check for missing Image component
      if (content.includes('<img') && !content.includes('next/image')) {
        this.addIssue({
          type: 'loading',
          severity: 'high',
          file: component.file,
          message: 'Using <img> instead of Next.js Image component',
          impact: 'Missing automatic image optimization',
          fix: 'Replace with next/image Image component',
        });
      }

      // Check for missing loading="lazy"
      const imgTags = content.match(/<img[^>]*>/g) || [];
      for (const tag of imgTags) {
        if (!tag.includes('loading=') && !tag.includes('priority')) {
          this.addIssue({
            type: 'loading',
            severity: 'medium',
            file: component.file,
            message: 'Image without lazy loading',
            impact: 'All images load immediately, slowing initial load',
            fix: 'Add loading="lazy" or use Next.js Image',
          });
        }
      }
    }
  }

  // ============================================================================
  // DEPENDENCY CHECKS
  // ============================================================================

  private async checkDependencies(): Promise<void> {
    console.log('📚 Checking dependencies...\n');

    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packageJsonPath)) return;

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    // Check for heavy/outdated packages
    const heavyPackages = {
      'moment': 'Use date-fns or native Intl',
      'lodash': 'Use lodash-es or native methods',
      'jquery': 'Use native DOM methods',
      'axios': 'Use native fetch API',
    };

    for (const [pkg, alternative] of Object.entries(heavyPackages)) {
      if (allDeps[pkg]) {
        this.addIssue({
          type: 'bundle',
          severity: 'medium',
          message: `Heavy dependency detected: ${pkg}`,
          impact: 'Increases bundle size significantly',
          fix: `Consider ${alternative}`,
          estimatedSavings: '50-200 KB reduction possible',
        });
      }
    }

    // Check for unused dependencies
    const usedPackages = new Set<string>();
    for (const component of this.componentAnalyses) {
      const content = fs.readFileSync(
        path.join(process.cwd(), component.file),
        'utf-8'
      );

      for (const dep of Object.keys(allDeps)) {
        if (content.includes(`from '${dep}'`) || content.includes(`from "${dep}"`)) {
          usedPackages.add(dep);
        }
      }
    }

    const unusedDeps = Object.keys(allDeps).filter(dep => !usedPackages.has(dep));
    if (unusedDeps.length > 0) {
      this.stats.unusedCodeEstimate = unusedDeps.length * 50; // Rough estimate

      this.addIssue({
        type: 'bundle',
        severity: 'low',
        message: `${unusedDeps.length} potentially unused dependencies`,
        impact: 'Inflated node_modules, potential security risks',
        fix: `Review and remove: ${unusedDeps.slice(0, 5).join(', ')}${unusedDeps.length > 5 ? '...' : ''}`,
      });
    }
  }

  // ============================================================================
  // CACHING CHECKS
  // ============================================================================

  private async checkCaching(): Promise<void> {
    console.log('💾 Checking caching strategies...\n');

    const nextConfigPath = path.join(process.cwd(), 'next.config.js');
    
    if (fs.existsSync(nextConfigPath)) {
      const config = fs.readFileSync(nextConfigPath, 'utf-8');

      if (!config.includes('Cache-Control') && !config.includes('headers')) {
        this.addIssue({
          type: 'caching',
          severity: 'medium',
          message: 'No custom cache headers configured',
          impact: 'Missing browser caching optimization',
          fix: 'Add Cache-Control headers in next.config.js',
        });
      }
    }
  }

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  private addIssue(issue: PerformanceIssue): void {
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
    console.log('⚡ PERFORMANCE ANALYSIS REPORT');
    console.log('='.repeat(80) + '\n');

    // Statistics
    console.log('📊 PERFORMANCE STATISTICS:');
    console.log(`  Files Scanned: ${this.stats.filesScanned}`);
    console.log(`  Total Bundle Size: ${(this.stats.totalBundleSize / 1024).toFixed(2)} KB`);
    console.log(`  Large Images: ${this.stats.largeImagesCount}`);
    console.log(`  Unoptimized Images: ${this.stats.unoptimizedImagesCount}`);
    console.log(`  Total Issues: ${this.stats.totalIssues}`);
    console.log(`    - Critical: ${this.stats.criticalIssues}`);
    console.log(`    - High: ${this.stats.highIssues}`);
    console.log(`    - Medium: ${this.stats.mediumIssues}`);
    console.log(`    - Low: ${this.stats.lowIssues}\n`);

    // Critical Issues
    const criticalIssues = this.issues.filter(i => i.severity === 'critical');
    if (criticalIssues.length > 0) {
      console.log('🚨 CRITICAL PERFORMANCE ISSUES:\n');
      criticalIssues.forEach(issue => {
        if (issue.file) console.log(`📄 ${issue.file}`);
        console.log(`   [${issue.type}] ${issue.message}`);
        console.log(`   Impact: ${issue.impact}`);
        console.log(`   Fix: ${issue.fix}`);
        if (issue.estimatedSavings) {
          console.log(`   💰 Savings: ${issue.estimatedSavings}`);
        }
        console.log('');
      });
    }

    // High Priority Issues
    const highIssues = this.issues.filter(i => i.severity === 'high');
    if (highIssues.length > 0) {
      console.log('⚠️  HIGH PRIORITY OPTIMIZATIONS:\n');
      highIssues.slice(0, 10).forEach(issue => {
        if (issue.file) console.log(`📄 ${issue.file}`);
        console.log(`   [${issue.type}] ${issue.message}`);
        console.log(`   Fix: ${issue.fix}`);
        if (issue.estimatedSavings) {
          console.log(`   💰 ${issue.estimatedSavings}`);
        }
        console.log('');
      });
      if (highIssues.length > 10) {
        console.log(`   ... and ${highIssues.length - 10} more\n`);
      }
    }

    // Performance Score
    const maxScore = 100;
    const deductions =
      (this.stats.criticalIssues * 15) +
      (this.stats.highIssues * 8) +
      (this.stats.mediumIssues * 3) +
      (this.stats.lowIssues * 1);
    const score = Math.max(0, maxScore - deductions);

    console.log('⚡ PERFORMANCE SCORE:');
    console.log(`   ${score.toFixed(1)}/100`);
    if (score >= 90) console.log('   ✅ Excellent performance!');
    else if (score >= 70) console.log('   ⚠️  Good, but optimization recommended');
    else if (score >= 50) console.log('   🔴 Poor performance - issues need fixing');
    else console.log('   🚨 Critical performance problems');

    // Top Recommendations
    console.log('\n💡 TOP RECOMMENDATIONS:\n');
    const topIssues = this.issues
      .filter(i => i.severity === 'critical' || i.severity === 'high')
      .slice(0, 5);

    topIssues.forEach((issue, i) => {
      console.log(`${i + 1}. ${issue.message}`);
      console.log(`   → ${issue.fix}`);
      if (issue.estimatedSavings) {
        console.log(`   💰 ${issue.estimatedSavings}`);
      }
    });

    console.log('\n' + '='.repeat(80));
    console.log('✅ PERFORMANCE ANALYSIS COMPLETE');
    console.log('='.repeat(80));
    console.log('\nRun `npm run perf:optimize` to auto-optimize images\n');

    // Save report
    this.saveReport();
  }

  private saveReport(): void {
    const report = {
      scanDate: new Date().toISOString(),
      stats: this.stats,
      issues: this.issues,
      imageAnalyses: this.imageAnalyses,
      bundleAnalyses: this.bundleAnalyses,
      componentAnalyses: this.componentAnalyses,
    };

    const filename = `performance-report-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(filename, JSON.stringify(report, null, 2));
    console.log(`📁 Detailed report saved to: ${filename}\n`);
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  const agent = new PerformanceAgent();
  await agent.analyze();
}

main().catch(console.error);
