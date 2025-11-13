/**
 * Website Scanner - Automated Design & Typography Audit Tool
 * Scans the entire website for design consistency, typography issues, and generates report
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// CONFIGURATION
// ============================================================================

const DESIGN_SYSTEM = {
  colors: {
    emerald: '#2E7D32',
    turquoise: '#66BB6A',
    charcoal: '#0A0A0A',
    darkGray: '#0F0F0F',
  },
  typography: {
    goldenRatio: 1.618,
    baseSize: 16,
    scale: {
      body: '16px',
      h6: '26px',
      h5: '42px',
      h4: '68px',
      h3: '110px',
      h2: '178px',
      h1: 'clamp(4rem, 14vw, 18rem)', // 288px max
    },
    fontFamily: {
      primary: 'var(--font-geist-sans)',
      mono: 'var(--font-geist-mono)',
    }
  },
  spacing: {
    goldenRatioBase: 38, // px
  },
  effects: {
    glassmorphism: 'backdrop-blur-md',
    borderRadius: '6px-8px',
    emeraldGlow: '0_8px_20px_-10px_rgba(46,125,50,0.25)',
  }
};

const DIRECTORIES_TO_SCAN = [
  'src/app',
  'src/components',
  'src/lib',
];

const FILE_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js', '.css'];

// ============================================================================
// TYPES
// ============================================================================

interface ScanResult {
  file: string;
  issues: Issue[];
  warnings: Warning[];
  suggestions: Suggestion[];
}

interface Issue {
  type: 'typography' | 'color' | 'spacing' | 'component' | 'accessibility';
  severity: 'critical' | 'high' | 'medium' | 'low';
  line: number;
  code: string;
  message: string;
  fix?: string;
}

interface Warning {
  type: string;
  message: string;
  line: number;
}

interface Suggestion {
  type: string;
  message: string;
  improvement: string;
}

interface ScanStats {
  filesScanned: number;
  totalIssues: number;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  totalWarnings: number;
  totalSuggestions: number;
}

// ============================================================================
// SCANNER CLASS
// ============================================================================

class WebsiteScanner {
  private results: ScanResult[] = [];
  private stats: ScanStats = {
    filesScanned: 0,
    totalIssues: 0,
    criticalIssues: 0,
    highIssues: 0,
    mediumIssues: 0,
    lowIssues: 0,
    totalWarnings: 0,
    totalSuggestions: 0,
  };

  async scan(): Promise<void> {
    console.log('🔍 Starting Website Scan...\n');
    console.log('📋 Design System Reference:');
    console.log(`  - Colors: Emerald ${DESIGN_SYSTEM.colors.emerald}, Turquoise ${DESIGN_SYSTEM.colors.turquoise}`);
    console.log(`  - Typography: Golden Ratio (1.618) scale from ${DESIGN_SYSTEM.typography.baseSize}px`);
    console.log(`  - Effects: Glassmorphism, Emerald glow\n`);

    for (const dir of DIRECTORIES_TO_SCAN) {
      await this.scanDirectory(dir);
    }

    this.generateReport();
  }

  private async scanDirectory(dirPath: string): Promise<void> {
    const fullPath = path.join(process.cwd(), dirPath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  Directory not found: ${dirPath}`);
      return;
    }

    const files = this.getAllFiles(fullPath);
    
    for (const file of files) {
      if (FILE_EXTENSIONS.some(ext => file.endsWith(ext))) {
        await this.scanFile(file);
      }
    }
  }

  private getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      if (fs.statSync(filePath).isDirectory()) {
        if (!file.startsWith('.') && file !== 'node_modules') {
          arrayOfFiles = this.getAllFiles(filePath, arrayOfFiles);
        }
      } else {
        arrayOfFiles.push(filePath);
      }
    });

    return arrayOfFiles;
  }

  private async scanFile(filePath: string): Promise<void> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const relativePath = path.relative(process.cwd(), filePath);

    const result: ScanResult = {
      file: relativePath,
      issues: [],
      warnings: [],
      suggestions: [],
    };

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // Check for typography issues
      this.checkTypography(line, lineNumber, result);

      // Check for color inconsistencies
      this.checkColors(line, lineNumber, result);

      // Check for spacing issues
      this.checkSpacing(line, lineNumber, result);

      // Check for component best practices
      this.checkComponentPatterns(line, lineNumber, result);

      // Check for accessibility
      this.checkAccessibility(line, lineNumber, result);
    });

    if (result.issues.length > 0 || result.warnings.length > 0 || result.suggestions.length > 0) {
      this.results.push(result);
      this.stats.filesScanned++;
      this.stats.totalIssues += result.issues.length;
      this.stats.totalWarnings += result.warnings.length;
      this.stats.totalSuggestions += result.suggestions.length;

      result.issues.forEach(issue => {
        if (issue.severity === 'critical') this.stats.criticalIssues++;
        else if (issue.severity === 'high') this.stats.highIssues++;
        else if (issue.severity === 'medium') this.stats.mediumIssues++;
        else this.stats.lowIssues++;
      });
    }
  }

  // ============================================================================
  // TYPOGRAPHY CHECKS
  // ============================================================================

  private checkTypography(line: string, lineNumber: number, result: ScanResult): void {
    // Check for hardcoded font sizes (not using golden ratio)
    const fontSizeRegex = /text-\[(\d+)px\]|fontSize:\s*['"]\d+px['"]/g;
    const matches = line.matchAll(fontSizeRegex);

    for (const match of matches) {
      const size = match[1];
      if (size && !this.isGoldenRatioSize(parseInt(size))) {
        result.issues.push({
          type: 'typography',
          severity: 'high',
          line: lineNumber,
          code: match[0],
          message: `Hardcoded font size ${size}px doesn't follow golden ratio scale`,
          fix: `Use: text-base (16px), text-[26px] (H6), text-[42px] (H5), text-[68px] (H4), text-[110px] (H3), text-[178px] (H2), or clamp() for H1`
        });
      }
    }

    // Check for missing clamp() on large headings
    if (line.includes('text-9xl') || line.includes('text-8xl') || line.includes('text-7xl')) {
      if (!line.includes('clamp')) {
        result.issues.push({
          type: 'typography',
          severity: 'medium',
          line: lineNumber,
          code: line.trim(),
          message: 'Large heading should use clamp() for responsive scaling',
          fix: 'Use: text-[clamp(4rem,14vw,18rem)] for H1'
        });
      }
    }

    // Check for inconsistent font families
    if (line.includes('font-') && !line.includes('font-geist') && !line.includes('font-sans') && !line.includes('font-mono')) {
      if (line.includes('font-serif') || line.includes('fontFamily')) {
        result.warnings.push({
          type: 'typography',
          message: 'Custom font family detected - ensure it aligns with design system',
          line: lineNumber,
        });
      }
    }

    // Check for missing font smoothing
    if (line.includes('className') && (line.includes('text-') || line.includes('font-'))) {
      if (!line.includes('antialiased') && !line.includes('subpixel-antialiased')) {
        result.suggestions.push({
          type: 'typography',
          message: 'Consider adding antialiased class for better font rendering',
          improvement: 'Add "antialiased" to className for smoother text',
        });
      }
    }
  }

  private isGoldenRatioSize(size: number): boolean {
    const validSizes = [16, 26, 42, 68, 110, 178, 288];
    return validSizes.some(valid => Math.abs(size - valid) <= 2);
  }

  // ============================================================================
  // COLOR CHECKS
  // ============================================================================

  private checkColors(line: string, lineNumber: number, result: ScanResult): void {
    // Check for hardcoded colors that don't match design system
    const colorRegex = /#([0-9A-Fa-f]{3,8})|rgb\(|rgba\(/g;
    const matches = line.matchAll(colorRegex);

    for (const match of matches) {
      const color = match[0];
      
      // Skip if it's a design system color
      if (this.isDesignSystemColor(color)) continue;

      // Skip common opacity variations
      if (color.includes('/') || color.includes('opacity')) continue;

      result.warnings.push({
        type: 'color',
        message: `Custom color "${color}" - verify it aligns with design system (Emerald #2E7D32, Turquoise #66BB6A, Charcoal #0A0A0A)`,
        line: lineNumber,
      });
    }

    // Check for green colors that should use emerald
    if (line.includes('bg-green-') || line.includes('text-green-')) {
      if (!line.includes('emerald')) {
        result.issues.push({
          type: 'color',
          severity: 'medium',
          line: lineNumber,
          code: line.trim(),
          message: 'Using generic green color instead of emerald',
          fix: 'Replace with: bg-[#2E7D32] or text-[#2E7D32] for primary emerald'
        });
      }
    }

    // Check for missing opacity on overlays
    if ((line.includes('bg-black') || line.includes('bg-white')) && line.includes('absolute')) {
      if (!line.includes('/') && !line.includes('opacity')) {
        result.suggestions.push({
          type: 'color',
          message: 'Absolute positioned overlay without opacity',
          improvement: 'Add opacity modifier like bg-black/50 for semi-transparent overlays',
        });
      }
    }
  }

  private isDesignSystemColor(color: string): boolean {
    const systemColors = [
      '#2E7D32', '#2e7d32', // Emerald
      '#66BB6A', '#66bb6a', // Turquoise
      '#0A0A0A', '#0a0a0a', // Charcoal
      '#0F0F0F', '#0f0f0f', // Dark Gray
    ];

    return systemColors.some(sys => color.toUpperCase().includes(sys.toUpperCase()));
  }

  // ============================================================================
  // SPACING CHECKS
  // ============================================================================

  private checkSpacing(line: string, lineNumber: number, result: ScanResult): void {
    // Check for arbitrary spacing values
    const spacingRegex = /(?:p|m)[trblxy]?-\[(\d+)px\]/g;
    const matches = line.matchAll(spacingRegex);

    for (const match of matches) {
      const value = parseInt(match[1]);
      
      // Check if it follows golden ratio spacing (38, 62, 100, 162, etc.)
      if (!this.isGoldenRatioSpacing(value)) {
        result.warnings.push({
          type: 'spacing',
          message: `Arbitrary spacing ${value}px - consider using golden ratio multiples (38, 62, 100, 162, 262)`,
          line: lineNumber,
        });
      }
    }

    // Check for inconsistent padding
    if (line.includes('py-') && !line.includes('px-')) {
      result.suggestions.push({
        type: 'spacing',
        message: 'Vertical padding without horizontal - ensure intentional',
        improvement: 'Consider symmetric padding: py-X px-X',
      });
    }
  }

  private isGoldenRatioSpacing(value: number): boolean {
    const goldenSpacing = [38, 62, 100, 162, 262, 424];
    return goldenSpacing.some(valid => Math.abs(value - valid) <= 5);
  }

  // ============================================================================
  // COMPONENT PATTERN CHECKS
  // ============================================================================

  private checkComponentPatterns(line: string, lineNumber: number, result: ScanResult): void {
    // Check for missing 'use client' in components with hooks
    if ((line.includes('useState') || line.includes('useEffect') || line.includes('useRouter')) && 
        !line.includes("'use client'") && !line.includes('"use client"')) {
      result.suggestions.push({
        type: 'component',
        message: 'Component uses hooks - may need "use client" directive',
        improvement: 'Add "use client"; at top of file if not server component',
      });
    }

    // Check for motion components without Framer Motion import
    if (line.includes('motion.') && !line.includes('framer-motion')) {
      result.suggestions.push({
        type: 'component',
        message: 'Using motion component - verify Framer Motion is imported',
        improvement: 'Import: import { motion } from "framer-motion"',
      });
    }

    // Check for glassmorphism without backdrop-blur
    if (line.includes('bg-opacity') || line.includes('bg-') && line.includes('/')) {
      if (!line.includes('backdrop-blur')) {
        result.suggestions.push({
          type: 'component',
          message: 'Semi-transparent background without backdrop-blur',
          improvement: 'Add backdrop-blur-md for glassmorphism effect',
        });
      }
    }

    // Check for border radius consistency
    if (line.includes('rounded-') && !line.includes('rounded-lg') && !line.includes('rounded-md')) {
      if (line.includes('rounded-xl') || line.includes('rounded-3xl')) {
        result.warnings.push({
          type: 'component',
          message: 'Border radius larger than design system standard (6-8px / rounded-lg)',
          line: lineNumber,
        });
      }
    }
  }

  // ============================================================================
  // ACCESSIBILITY CHECKS
  // ============================================================================

  private checkAccessibility(line: string, lineNumber: number, result: ScanResult): void {
    // Check for images without alt text
    if (line.includes('<img ') || line.includes('<Image ')) {
      if (!line.includes('alt=')) {
        result.issues.push({
          type: 'accessibility',
          severity: 'high',
          line: lineNumber,
          code: line.trim(),
          message: 'Image without alt text',
          fix: 'Add alt="" for decorative images or alt="description" for meaningful images'
        });
      }
    }

    // Check for buttons without accessible text
    if (line.includes('<button') && !line.includes('aria-label')) {
      if (line.includes('Icon') || line.includes('svg')) {
        result.issues.push({
          type: 'accessibility',
          severity: 'medium',
          line: lineNumber,
          code: line.trim(),
          message: 'Icon button without aria-label',
          fix: 'Add aria-label="description" for screen readers'
        });
      }
    }

    // Check for contrast issues
    if (line.includes('text-white') && (line.includes('bg-white') || line.includes('bg-gray-100'))) {
      result.issues.push({
        type: 'accessibility',
        severity: 'critical',
        line: lineNumber,
        code: line.trim(),
        message: 'Insufficient color contrast: white text on light background',
        fix: 'Use dark text on light backgrounds for WCAG AA compliance'
      });
    }
  }

  // ============================================================================
  // REPORT GENERATION
  // ============================================================================

  private generateReport(): void {
    console.log('\n' + '='.repeat(80));
    console.log('📊 WEBSITE SCAN REPORT');
    console.log('='.repeat(80) + '\n');

    // Statistics
    console.log('📈 SCAN STATISTICS:');
    console.log(`  Files Scanned: ${this.stats.filesScanned}`);
    console.log(`  Total Issues: ${this.stats.totalIssues}`);
    console.log(`    - Critical: ${this.stats.criticalIssues}`);
    console.log(`    - High: ${this.stats.highIssues}`);
    console.log(`    - Medium: ${this.stats.mediumIssues}`);
    console.log(`    - Low: ${this.stats.lowIssues}`);
    console.log(`  Total Warnings: ${this.stats.totalWarnings}`);
    console.log(`  Total Suggestions: ${this.stats.totalSuggestions}\n`);

    // Critical and High Issues
    console.log('🚨 CRITICAL & HIGH PRIORITY ISSUES:\n');
    this.results.forEach(result => {
      const criticalAndHigh = result.issues.filter(i => i.severity === 'critical' || i.severity === 'high');
      if (criticalAndHigh.length > 0) {
        console.log(`📄 ${result.file}`);
        criticalAndHigh.forEach(issue => {
          console.log(`  [${issue.severity.toUpperCase()}] Line ${issue.line}: ${issue.message}`);
          if (issue.fix) {
            console.log(`    Fix: ${issue.fix}`);
          }
        });
        console.log('');
      }
    });

    // Detailed breakdown by file
    console.log('\n' + '-'.repeat(80));
    console.log('📋 DETAILED BREAKDOWN BY FILE:');
    console.log('-'.repeat(80) + '\n');

    this.results.forEach(result => {
      console.log(`\n📄 ${result.file}`);
      console.log(`   Issues: ${result.issues.length} | Warnings: ${result.warnings.length} | Suggestions: ${result.suggestions.length}\n`);

      if (result.issues.length > 0) {
        console.log('   🔴 Issues:');
        result.issues.forEach(issue => {
          console.log(`     [${issue.type}] Line ${issue.line}: ${issue.message}`);
          if (issue.fix) {
            console.log(`       → ${issue.fix}`);
          }
        });
      }

      if (result.warnings.length > 0) {
        console.log('   ⚠️  Warnings:');
        result.warnings.forEach(warning => {
          console.log(`     [${warning.type}] Line ${warning.line}: ${warning.message}`);
        });
      }

      if (result.suggestions.length > 0) {
        console.log('   💡 Suggestions:');
        result.suggestions.forEach(suggestion => {
          console.log(`     [${suggestion.type}] ${suggestion.message}`);
          console.log(`       → ${suggestion.improvement}`);
        });
      }
    });

    // Generate JSON report
    this.saveJSONReport();

    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('✅ SCAN COMPLETE');
    console.log('='.repeat(80));
    console.log(`\n📁 Detailed report saved to: scan-report-${new Date().toISOString().split('T')[0]}.json\n`);
  }

  private saveJSONReport(): void {
    const report = {
      scanDate: new Date().toISOString(),
      stats: this.stats,
      designSystem: DESIGN_SYSTEM,
      results: this.results,
    };

    const filename = `scan-report-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(filename, JSON.stringify(report, null, 2));
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  const scanner = new WebsiteScanner();
  await scanner.scan();
}

main().catch(console.error);
