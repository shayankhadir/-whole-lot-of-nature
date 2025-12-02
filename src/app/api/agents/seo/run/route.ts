import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    console.log('🔍 Running SEO Agent...');
    
    // Run the SEO scan
    const { stdout, stderr } = await execAsync('npm run seo:scan', {
      cwd: process.cwd(),
      timeout: 120000, // 2 minute timeout
    });

    return NextResponse.json({
      success: true,
      message: 'SEO Agent completed successfully',
      output: stdout,
      errors: stderr,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const err = error as Error & { stdout?: string; stderr?: string };
    console.error('SEO Agent error:', err);
    
    return NextResponse.json({
      success: false,
      message: 'SEO Agent failed',
      error: err.message,
      output: err.stdout || '',
      errors: err.stderr || '',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Find the latest SEO report dynamically in a dedicated directory
    const fs = await import('fs');
    const path = await import('path');
    const reportsDir = path.join(process.cwd(), 'reports', 'seo');
    
    // Fallback to root directory if reports directory doesn't exist
    let searchDir = reportsDir;
    if (!fs.existsSync(reportsDir)) {
      searchDir = process.cwd();
    }
    
    // Get all SEO report files
    const files = fs.readdirSync(searchDir).filter(file => file.startsWith('seo-report-') && file.endsWith('.json'));
    
    if (files.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No SEO report available',
      }, { status: 404 });
    }

    // Sort by date (filename format: seo-report-YYYY-MM-DD.json) and get the latest
    const latestReport = files.sort().reverse()[0];
    const reportPath = path.join(searchDir, latestReport);
    
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    return NextResponse.json({
      success: true,
      report,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({
      success: false,
      error: err.message,
    }, { status: 500 });
  }
}
