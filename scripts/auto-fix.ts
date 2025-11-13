/**
 * Auto-Fix Script - Fixes common design issues automatically
 * Run specific fixes or all at once
 */

import * as fs from 'fs';
import * as path from 'path';

const DIRECTORIES_TO_FIX = ['src/app', 'src/components'];
const FILE_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js'];

interface FixStats {
  filesModified: number;
  totalFixes: number;
  fixesByType: Record<string, number>;
}

class AutoFixer {
  private stats: FixStats = {
    filesModified: 0,
    totalFixes: 0,
    fixesByType: {},
  };

  // ============================================================================
  // MAIN FIX FUNCTIONS
  // ============================================================================

  async fixAll(): Promise<void> {
    console.log('🔧 Starting Auto-Fix Process...\n');
    
    await this.fixAltText();
    await this.fixColors();
    await this.fixTypography();
    await this.fixGlassmorphism();
    
    this.printStats();
  }

  async fixAltText(): Promise<void> {
    console.log('📸 Fixing missing alt text...');
    let fixes = 0;

    for (const dir of DIRECTORIES_TO_FIX) {
      const files = this.getAllFiles(path.join(process.cwd(), dir));
      
      for (const file of files) {
        if (FILE_EXTENSIONS.some(ext => file.endsWith(ext))) {
          fixes += this.fixAltTextInFile(file);
        }
      }
    }

    this.stats.fixesByType['alt-text'] = fixes;
    this.stats.totalFixes += fixes;
    console.log(`  ✅ Fixed ${fixes} missing alt attributes\n`);
  }

  async fixColors(): Promise<void> {
    console.log('🎨 Fixing color consistency (green → emerald)...');
    let fixes = 0;

    for (const dir of DIRECTORIES_TO_FIX) {
      const files = this.getAllFiles(path.join(process.cwd(), dir));
      
      for (const file of files) {
        if (FILE_EXTENSIONS.some(ext => file.endsWith(ext))) {
          fixes += this.fixColorsInFile(file);
        }
      }
    }

    this.stats.fixesByType['colors'] = fixes;
    this.stats.totalFixes += fixes;
    console.log(`  ✅ Fixed ${fixes} color inconsistencies\n`);
  }

  async fixTypography(): Promise<void> {
    console.log('✍️ Fixing typography (adding antialiased)...');
    let fixes = 0;

    for (const dir of DIRECTORIES_TO_FIX) {
      const files = this.getAllFiles(path.join(process.cwd(), dir));
      
      for (const file of files) {
        if (FILE_EXTENSIONS.some(ext => file.endsWith(ext))) {
          fixes += this.fixTypographyInFile(file);
        }
      }
    }

    this.stats.fixesByType['typography'] = fixes;
    this.stats.totalFixes += fixes;
    console.log(`  ✅ Added antialiased to ${fixes} text elements\n`);
  }

  async fixGlassmorphism(): Promise<void> {
    console.log('✨ Fixing glassmorphism (adding backdrop-blur)...');
    let fixes = 0;

    for (const dir of DIRECTORIES_TO_FIX) {
      const files = this.getAllFiles(path.join(process.cwd(), dir));
      
      for (const file of files) {
        if (FILE_EXTENSIONS.some(ext => file.endsWith(ext))) {
          fixes += this.fixGlassmorphismInFile(file);
        }
      }
    }

    this.stats.fixesByType['glassmorphism'] = fixes;
    this.stats.totalFixes += fixes;
    console.log(`  ✅ Added backdrop-blur to ${fixes} elements\n`);
  }

  // ============================================================================
  // FILE-LEVEL FIX FUNCTIONS
  // ============================================================================

  private fixAltTextInFile(filePath: string): number {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    let fixes = 0;

    // Fix <Image without alt (Next.js Image component)
    content = content.replace(
      /<Image\s+([^>]*?)(?<!alt=["'][^"']*["'])\s*\/?>/g,
      (match, attrs) => {
        // Check if alt already exists
        if (/alt=/.test(match)) return match;
        
        fixes++;
        // Add alt="" before closing
        if (match.endsWith('/>')) {
          return match.replace('/>', ' alt="" />');
        } else {
          return match.replace('>', ' alt="">');
        }
      }
    );

    // Fix <img without alt (regular img tag)
    content = content.replace(
      /<img\s+([^>]*?)(?<!alt=["'][^"']*["'])\s*\/?>/g,
      (match, attrs) => {
        if (/alt=/.test(match)) return match;
        
        fixes++;
        if (match.endsWith('/>')) {
          return match.replace('/>', ' alt="" />');
        } else {
          return match.replace('>', ' alt="">');
        }
      }
    );

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      this.stats.filesModified++;
    }

    return fixes;
  }

  private fixColorsInFile(filePath: string): number {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    let fixes = 0;

    // Fix bg-green-X → bg-[#2E7D32]
    const greenBgPattern = /bg-green-(\d+)/g;
    content = content.replace(greenBgPattern, (match) => {
      fixes++;
      return 'bg-[#2E7D32]';
    });

    // Fix text-green-X → text-[#2E7D32]
    const greenTextPattern = /text-green-(\d+)/g;
    content = content.replace(greenTextPattern, (match) => {
      fixes++;
      return 'text-[#2E7D32]';
    });

    // Fix border-green-X → border-[#2E7D32]
    const greenBorderPattern = /border-green-(\d+)/g;
    content = content.replace(greenBorderPattern, (match) => {
      fixes++;
      return 'border-[#2E7D32]';
    });

    // Fix hover:bg-green-X → hover:bg-[#1B5E20] (darker emerald)
    const greenHoverPattern = /hover:bg-green-(\d+)/g;
    content = content.replace(greenHoverPattern, (match) => {
      fixes++;
      return 'hover:bg-[#1B5E20]';
    });

    // Fix common non-design-system colors
    content = content.replace(/#047857/g, () => {
      fixes++;
      return '#2E7D32'; // Emerald
    });

    content = content.replace(/#22c55e/g, () => {
      fixes++;
      return '#66BB6A'; // Turquoise
    });

    content = content.replace(/#16a34a/g, () => {
      fixes++;
      return '#2E7D32'; // Emerald
    });

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      this.stats.filesModified++;
    }

    return fixes;
  }

  private fixTypographyInFile(filePath: string): number {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    let fixes = 0;

    // Add antialiased to headings without it
    const headingPattern = /className="([^"]*text-(?:\d+xl|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|base)[^"]*)"(?![^<]*antialiased)/g;
    
    content = content.replace(headingPattern, (match, classes) => {
      // Skip if already has antialiased
      if (classes.includes('antialiased')) return match;
      
      fixes++;
      return `className="${classes} antialiased"`;
    });

    // Add antialiased to font-bold elements
    const boldPattern = /className="([^"]*font-bold[^"]*)"(?![^<]*antialiased)/g;
    content = content.replace(boldPattern, (match, classes) => {
      if (classes.includes('antialiased')) return match;
      
      fixes++;
      return `className="${classes} antialiased"`;
    });

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      this.stats.filesModified++;
    }

    return fixes;
  }

  private fixGlassmorphismInFile(filePath: string): number {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    let fixes = 0;

    // Add backdrop-blur-md to elements with bg-opacity or bg-[color]/opacity
    const opacityPattern = /className="([^"]*(?:bg-opacity-|bg-\[#[A-Fa-f0-9]{6}\]\/|bg-black\/|bg-white\/)[^"]*)"(?![^<]*backdrop-blur)/g;
    
    content = content.replace(opacityPattern, (match, classes) => {
      // Skip if already has backdrop-blur
      if (classes.includes('backdrop-blur')) return match;
      
      fixes++;
      return `className="${classes} backdrop-blur-md"`;
    });

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      this.stats.filesModified++;
    }

    return fixes;
  }

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  private getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
    if (!fs.existsSync(dirPath)) return arrayOfFiles;
    
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

  private printStats(): void {
    console.log('\n' + '='.repeat(80));
    console.log('📊 AUTO-FIX RESULTS');
    console.log('='.repeat(80) + '\n');

    console.log(`Files Modified: ${this.stats.filesModified}`);
    console.log(`Total Fixes Applied: ${this.stats.totalFixes}\n`);

    console.log('Fixes by Type:');
    Object.entries(this.stats.fixesByType).forEach(([type, count]) => {
      console.log(`  - ${type}: ${count}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log('✅ AUTO-FIX COMPLETE');
    console.log('='.repeat(80));
    console.log('\nRun `npm run scan` to verify fixes\n');
  }
}

// ============================================================================
// CLI INTERFACE
// ============================================================================

async function main() {
  const fixer = new AutoFixer();
  const command = process.argv[2];

  switch (command) {
    case 'alt-text':
      await fixer.fixAltText();
      fixer.printStats();
      break;
    case 'colors':
      await fixer.fixColors();
      fixer.printStats();
      break;
    case 'typography':
      await fixer.fixTypography();
      fixer.printStats();
      break;
    case 'glassmorphism':
      await fixer.fixGlassmorphism();
      fixer.printStats();
      break;
    case 'all':
    default:
      await fixer.fixAll();
      break;
  }
}

main().catch(console.error);
