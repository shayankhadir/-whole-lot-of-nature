import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    console.log('🚀 Running Growth Agent...');
    
    // Run the growth agent
    const { stdout, stderr } = await execAsync('npm run growth:run', {
      cwd: process.cwd(),
      timeout: 180000, // 3 minute timeout
    });

    return NextResponse.json({
      success: true,
      message: 'Growth Agent completed successfully',
      output: stdout,
      errors: stderr,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const err = error as Error & { stdout?: string; stderr?: string };
    console.error('Growth Agent error:', err);
    
    return NextResponse.json({
      success: false,
      message: 'Growth Agent failed',
      error: err.message,
      output: err.stdout || '',
      errors: err.stderr || '',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Return the latest growth data
    const fs = await import('fs');
    const path = await import('path');
    const dataPath = path.join(process.cwd(), 'scripts', 'growth-agent', 'data', 'growth-data.json');
    
    if (fs.existsSync(dataPath)) {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      return NextResponse.json({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: false,
      message: 'No growth data available',
    }, { status: 404 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({
      success: false,
      error: err.message,
    }, { status: 500 });
  }
}
