/**
 * Design Audit Agent
 * 
 * Scans entire frontend for design issues:
 * - Low contrast text (WCAG compliance)
 * - Dark/hard-to-read fonts
 * - Color accessibility issues
 * - Typography hierarchy problems
 * - Spacing inconsistencies
 * 
 * Returns actionable fixes with file paths and line numbers.
 */

import fs from 'fs';
import path from 'path';

export interface DesignIssue {
  file: string;
  line: number;
  issue: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  currentValue: string;
  suggestedFix: string;
  category: 'contrast' | 'typography' | 'color' | 'spacing' | 'accessibility';
}

interface DesignAuditResult {
  totalIssues: number;
  criticalIssues: number;
  issuesByCategory: Record<string, number>;
  issues: DesignIssue[];
  filesScanned: number;
  summary: string;
}

export class DesignAuditAgent {
  private issues: DesignIssue[] = [];
  private filesScanned = 0;

  /**
   * Problematic color patterns that need fixing
   */
  private contrastIssues = [
    // Dark gray text that's hard to read
    { pattern: /text-gray-100(?!\s*\/)/g, issue: 'text-gray-100 has low contrast', fix: 'text-gray-100 or text-white/90' },
    { pattern: /text-gray-500(?!\s*\/)/g, issue: 'text-gray-500 is too dark', fix: 'text-gray-200 or text-white/80' },
    { pattern: /text-gray-100(?!\s*\/)/g, issue: 'text-gray-100 is very hard to read on dark backgrounds', fix: 'text-gray-100 or text-white/90' },
    
    // Dark text on dark backgrounds
    { pattern: /text-\[#[0-9A-Fa-f]{6}\](?=.*bg-\[#0[0-9A-D])/g, issue: 'Dark text on dark background', fix: 'Use light text colors' },
    
    // White opacity too low
    { pattern: /text-white\/60/g, issue: 'text-white/85 is too transparent', fix: 'text-white/85 or text-white/90' },
    { pattern: /text-white\/70/g, issue: 'text-white/85 may be hard to read', fix: 'text-white/85 or text-white/90' },
    
    // Green text on green backgrounds
    { pattern: new RegExp('text-green' + '-\\d+(?=.*bg-green)', 'g'), issue: 'Green on green - low contrast', fix: 'text-white or text-gray-900' },
  ];

  /**
   * Typography issues to check
   */
  private typographyIssues = [
    { pattern: /text-xs(?=.*text-gray-[4-6]00)/g, issue: 'Extra small text with low contrast', fix: 'Increase size to text-sm or improve contrast' },
    { pattern: new RegExp('text-sm(?=.*text-white/[1-6]0)', 'g'), issue: 'Small text with low opacity', fix: 'Increase opacity to /80 or /90' },
  ];

  /**
   * Main audit function - scans all frontend files
   */
  async auditFrontend(projectRoot: string): Promise<DesignAuditResult> {
    console.log('Starting Design Audit Agent...\n');
    
    this.issues = [];
    this.filesScanned = 0;

    const srcPath = path.join(projectRoot, 'src');
    
    // Scan all TypeScript/TSX files
    await this.scanDirectory(srcPath);

    // Generate summary
    const summary = this.generateSummary();

    return {
      totalIssues: this.issues.length,
      criticalIssues: this.issues.filter(i => i.severity === 'critical').length,
      issuesByCategory: this.categorizeIssues(),
      issues: this.issues,
      filesScanned: this.filesScanned,
      summary
    };
  }

  /**
   * Recursively scan directory for design issues
   */
  private async scanDirectory(dirPath: string): Promise<void> {
    if (!fs.existsSync(dirPath)) return;

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // Skip node_modules, .next, etc.
        if (!['node_modules', '.next', 'dist', 'build'].includes(entry.name)) {
          await this.scanDirectory(fullPath);
        }
      } else if (entry.isFile() && /\.(tsx|ts|jsx|js)$/.test(entry.name)) {
        await this.scanFile(fullPath);
      }
    }
  }

  /**
   * Scan individual file for design issues
   */
  private async scanFile(filePath: string): Promise<void> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      this.filesScanned++;

      // Check each line for design issues
      lines.forEach((line, index) => {
        const lineNumber = index + 1;

        // Check contrast issues
        this.contrastIssues.forEach(({ pattern, issue, fix }) => {
          if (pattern.test(line)) {
            this.issues.push({
              file: filePath,
              line: lineNumber,
              issue,
              severity: this.determineSeverity(issue),
              currentValue: this.extractValue(line, pattern),
              suggestedFix: fix,
              category: 'contrast'
            });
          }
        });

        // Check typography issues
        this.typographyIssues.forEach(({ pattern, issue, fix }) => {
          if (pattern.test(line)) {
            this.issues.push({
              file: filePath,
              line: lineNumber,
              issue,
              severity: 'medium',
              currentValue: this.extractValue(line, pattern),
              suggestedFix: fix,
              category: 'typography'
            });
          }
        });

        // Check for specific problematic patterns
        this.checkSpecificPatterns(line, lineNumber, filePath);
      });
    } catch (error) {
      console.error(`Error scanning ${filePath}:`, error);
    }
  }

  /**
   * Check for specific design anti-patterns
   */
  private checkSpecificPatterns(line: string, lineNumber: number, filePath: string): void {
    // Dark backgrounds with dark text
    if (line.includes('bg-[#0') && line.includes('text-gray-')) {
      this.issues.push({
        file: filePath,
        line: lineNumber,
        issue: 'Dark text on dark background - major contrast issue',
        severity: 'critical',
        currentValue: line.trim(),
        suggestedFix: 'Use ' + 'text-white' + ' or ' + 'text-gray-100' + ' on dark backgrounds',
        category: 'contrast'
      });
    }

    // Low opacity white text on already transparent backgrounds
    if (line.includes('text-white' + '/85') || line.includes('text-white' + '/85')) {
      this.issues.push({
        file: filePath,
        line: lineNumber,
        issue: 'White text opacity too low - hard to read',
        severity: 'high',
        currentValue: line.trim(),
        suggestedFix: 'Increase to ' + 'text-white/85' + ' or ' + 'text-white/90',
        category: 'contrast'
      });
    }

    // text-gray-100 on anything (almost always too dark)
    if (line.includes('text-gray-' + '100') && !line.includes('bg-white')) {
      this.issues.push({
        file: filePath,
        line: lineNumber,
        issue: 'text-gray-100 is too dark for most backgrounds',
        severity: 'high',
        currentValue: 'text-gray-100',
        suggestedFix: 'text-gray-100' + ' or ' + 'text-white/90',
        category: 'contrast'
      });
    }
  }

  /**
   * Determine severity based on issue type
   */
  private determineSeverity(issue: string): 'critical' | 'high' | 'medium' | 'low' {
    if (issue.includes('very hard to read') || issue.includes('major contrast')) {
      return 'critical';
    }
    if (issue.includes('hard to read') || issue.includes('low contrast')) {
      return 'high';
    }
    if (issue.includes('may be')) {
      return 'medium';
    }
    return 'low';
  }

  /**
   * Extract the problematic value from line
   */
  private extractValue(line: string, pattern: RegExp): string {
    const match = line.match(pattern);
    return match ? match[0] : 'Unknown';
  }

  /**
   * Categorize issues by type
   */
  private categorizeIssues(): Record<string, number> {
    const categories: Record<string, number> = {
      contrast: 0,
      typography: 0,
      color: 0,
      spacing: 0,
      accessibility: 0
    };

    this.issues.forEach(issue => {
      categories[issue.category]++;
    });

    return categories;
  }

  /**
   * Generate human-readable summary
   */
  private generateSummary(): string {
    const critical = this.issues.filter(i => i.severity === 'critical').length;
    const high = this.issues.filter(i => i.severity === 'high').length;
    const medium = this.issues.filter(i => i.severity === 'medium').length;

    return `Scanned ${this.filesScanned} files and found ${this.issues.length} design issues:\n` +
           `- ${critical} CRITICAL (must fix immediately)\n` +
           `- ${high} HIGH priority (should fix soon)\n` +
           `- ${medium} MEDIUM priority (fix when possible)\n\n` +
           `Most common issues:\n` +
           `- Dark gray text (text-gray-100/500/600) on dark backgrounds\n` +
           `- Low opacity white text (text-white/85-70)\n` +
           `- Green text on green backgrounds\n`;
  }

  /**
   * Auto-fix issues by updating files
   */
  async autoFix(issues: DesignIssue[]): Promise<{ fixed: number; errors: string[] }> {
    let fixed = 0;
    const errors: string[] = [];

    // Group issues by file
    const issuesByFile = new Map<string, DesignIssue[]>();
    issues.forEach(issue => {
      if (!issuesByFile.has(issue.file)) {
        issuesByFile.set(issue.file, []);
      }
      issuesByFile.get(issue.file)!.push(issue);
    });

    // Fix each file
    for (const [filePath, fileIssues] of issuesByFile) {
      try {
        let content = fs.readFileSync(filePath, 'utf-8');
        let modified = false;

        // Apply fixes
        fileIssues.forEach(issue => {
          if (issue.severity === 'critical' || issue.severity === 'high') {
            const fixes = this.getFixes(issue.currentValue);
            fixes.forEach(fix => {
              if (content.includes(fix.from)) {
                content = content.replace(new RegExp(fix.from, 'g'), fix.to);
                modified = true;
                fixed++;
              }
            });
          }
        });

        // Write back if modified
        if (modified) {
          fs.writeFileSync(filePath, content, 'utf-8');
          console.log(`Fixed ${fileIssues.length} issues in ${path.basename(filePath)}`);
        }
      } catch (error) {
        errors.push(`Failed to fix ${filePath}: ${error}`);
      }
    }

    return { fixed, errors };
  }

  /**
   * Get specific fixes for common issues
   */
  private getFixes(currentValue: string): Array<{ from: string; to: string }> {
    const fixes: Array<{ from: string; to: string }> = [];

    // Fix gray text
    if (currentValue.includes('text-gray-100')) {
      fixes.push({ from: 'text-gray-100', to: 'text-gray-100' });
    }
    if (currentValue.includes('text-gray-500')) {
      fixes.push({ from: 'text-gray-500', to: 'text-gray-200' });
    }
    if (currentValue.includes('text-gray-100')) {
      fixes.push({ from: 'text-gray-100', to: 'text-gray-100' });
    }

    // Fix white opacity
    if (currentValue.includes('text-white/85')) {
      fixes.push({ from: 'text-white/85', to: 'text-white/85' });
    }
    if (currentValue.includes('text-white/85')) {
      fixes.push({ from: 'text-white/85', to: 'text-white/85' });
    }
    if (currentValue.includes('text-white/80')) {
      fixes.push({ from: 'text-white/80', to: 'text-white/90' });
    }

    return fixes;
  }
}

export default DesignAuditAgent;
