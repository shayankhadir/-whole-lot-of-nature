import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    console.log('⚡ Running Performance Agent...');
    
    // Run performance analysis
    const { stdout, stderr } = await execAsync('npm run perf:analyze', {
      cwd: process.cwd(),
      timeout: 180000, // 3 minute timeout
    });

    return NextResponse.json({
      success: true,
      message: 'Performance Agent completed successfully',
      output: stdout,
      errors: stderr,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const err = error as Error & { stdout?: string; stderr?: string };
    console.error('Performance Agent error:', err);
    
    return NextResponse.json({
      success: false,
      message: 'Performance Agent failed',
      error: err.message,
      output: err.stdout || '',
      errors: err.stderr || '',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Return the latest performance report if it exists
    const fs = await import('fs');
    const path = await import('path');
    const reportPath = path.join(process.cwd(), 'performance-report-2025-11-13.json');
    
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
      message: 'No performance report available',
    }, { status: 404 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({
      success: false,
      error: err.message,
    }, { status: 500 });
  }
}
