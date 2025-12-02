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
    // Return the latest SEO report if it exists
    const fs = await import('fs');
    const path = await import('path');
    const reportPath = path.join(process.cwd(), 'seo-report-2025-11-21.json');
    
    if (fs.existsSync(reportPath)) {
      const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
      return NextResponse.json({
        success: true,
        report,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: false,
      message: 'No SEO report available',
    }, { status: 404 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({
      success: false,
      error: err.message,
    }, { status: 500 });
  }
}
