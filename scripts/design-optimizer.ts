#!/usr/bin/env tsx

/**
 * Design Optimizer - Combined Auto-Fix & Scanner
 * Runs auto-fix.ts followed by website-scanner.ts in sequence
 * 
 * Usage:
 *   npm run optimize:design
 *   or
 *   npx tsx scripts/design-optimizer.ts
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function printHeader(text: string) {
  console.log('\n' + colors.bright + colors.cyan + '═'.repeat(80) + colors.reset);
  console.log(colors.bright + colors.cyan + `  ${text}` + colors.reset);
  console.log(colors.bright + colors.cyan + '═'.repeat(80) + colors.reset + '\n');
}

function printStep(step: number, text: string) {
  console.log(colors.bright + colors.blue + `\n[STEP ${step}] ${text}` + colors.reset);
  console.log(colors.blue + '─'.repeat(80) + colors.reset);
}

function printSuccess(text: string) {
  console.log(colors.bright + colors.green + `✅ ${text}` + colors.reset);
}

function printError(text: string) {
  console.log(colors.bright + '\x1b[31m' + `❌ ${text}` + colors.reset);
}

function printInfo(text: string) {
  console.log(colors.yellow + `ℹ️  ${text}` + colors.reset);
}

async function runAutoFix(): Promise<boolean> {
  printStep(1, 'Running Auto-Fix (Design System Corrections)');
  
  try {
    const output = execSync('npx tsx scripts/auto-fix.ts all', {
      cwd: process.cwd(),
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    
    console.log(output);
    
    // Parse the output to check if fixes were applied
    const fixesMatch = output.match(/Total Fixes Applied: (\d+)/);
    const filesMatch = output.match(/Files Modified: (\d+)/);
    
    const totalFixes = fixesMatch ? parseInt(fixesMatch[1]) : 0;
    const filesModified = filesMatch ? parseInt(filesMatch[1]) : 0;
    
    if (totalFixes === 0) {
      printSuccess('Auto-Fix Complete - No issues found! Design system is perfect. ✨');
    } else {
      printSuccess(`Auto-Fix Complete - ${totalFixes} fixes applied across ${filesModified} files`);
    }
    
    return true;
  } catch (error: any) {
    printError('Auto-Fix failed');
    console.error(error.message);
    if (error.stdout) console.log(error.stdout.toString());
    if (error.stderr) console.error(error.stderr.toString());
    return false;
  }
}

async function runScanner(): Promise<boolean> {
  printStep(2, 'Running Website Scanner (Design Validation)');
  
  try {
    const output = execSync('npx tsx scripts/website-scanner.ts', {
      cwd: process.cwd(),
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    
    console.log(output);
    
    // Check if scan report was generated
    const today = new Date().toISOString().split('T')[0];
    const reportPath = path.join(process.cwd(), `scan-report-${today}.json`);
    
    if (fs.existsSync(reportPath)) {
      const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
      const totalIssues = report.summary?.totalIssues || 0;
      
      if (totalIssues === 0) {
        printSuccess('Scanner Complete - No issues detected! 🎉');
      } else {
        printInfo(`Scanner Complete - Found ${totalIssues} items to review`);
        printInfo(`Detailed report: scan-report-${today}.json`);
      }
    } else {
      printSuccess('Scanner Complete');
    }
    
    return true;
  } catch (error: any) {
    printError('Scanner failed');
    console.error(error.message);
    if (error.stdout) console.log(error.stdout.toString());
    if (error.stderr) console.error(error.stderr.toString());
    return false;
  }
}

function printSummary(autoFixSuccess: boolean, scannerSuccess: boolean) {
  printHeader('DESIGN OPTIMIZATION SUMMARY');
  
  console.log(colors.bright + 'Results:' + colors.reset);
  console.log(`  ${autoFixSuccess ? '✅' : '❌'} Auto-Fix: ${autoFixSuccess ? 'Success' : 'Failed'}`);
  console.log(`  ${scannerSuccess ? '✅' : '❌'} Scanner: ${scannerSuccess ? 'Success' : 'Failed'}`);
  
  if (autoFixSuccess && scannerSuccess) {
    console.log('\n' + colors.bright + colors.green + '🎉 DESIGN OPTIMIZATION COMPLETE! 🎉' + colors.reset);
    console.log(colors.green + '\nYour frontend is now fully optimized:' + colors.reset);
    console.log('  • Design system consistency enforced');
    console.log('  • Color palette standardized (#2E7D32, #66BB6A)');
    console.log('  • Typography enhanced with antialiasing');
    console.log('  • Glassmorphism effects applied');
    console.log('  • All issues validated and documented');
  } else {
    console.log('\n' + colors.yellow + '⚠️  PARTIAL SUCCESS - Some operations failed' + colors.reset);
    console.log(colors.yellow + 'Please review the errors above and try again.' + colors.reset);
  }
  
  console.log('\n' + colors.cyan + 'Next Steps:' + colors.reset);
  console.log('  • Review scan report for any remaining suggestions');
  console.log('  • Run ' + colors.bright + 'npm run optimize:design' + colors.reset + ' anytime to re-optimize');
  console.log('  • Check dashboard at http://localhost:3000/blog-agent (Design Audit tab)');
  console.log('');
}

async function main() {
  printHeader('🎨 DESIGN OPTIMIZER - Auto-Fix + Scanner');
  
  console.log(colors.bright + 'This script will:' + colors.reset);
  console.log('  1. Run auto-fix to correct design system issues');
  console.log('  2. Run scanner to validate all changes');
  console.log('  3. Generate a detailed report\n');
  
  const startTime = Date.now();
  
  // Run auto-fix first
  const autoFixSuccess = await runAutoFix();
  
  // Always run scanner, even if auto-fix fails (to see current state)
  const scannerSuccess = await runScanner();
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  // Print summary
  printSummary(autoFixSuccess, scannerSuccess);
  
  console.log(colors.magenta + `⏱️  Total time: ${duration}s` + colors.reset + '\n');
  
  // Exit with appropriate code
  process.exit(autoFixSuccess && scannerSuccess ? 0 : 1);
}

// Run the script
main().catch((error) => {
  printError('Unexpected error occurred');
  console.error(error);
  process.exit(1);
});
