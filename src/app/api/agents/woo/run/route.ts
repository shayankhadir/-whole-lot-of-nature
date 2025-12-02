import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const action = body.action || 'sync'; // sync, validate, monitor, backup
    
    console.log(`🛒 Running WooCommerce Agent (${action})...`);
    
    // Run the WooCommerce agent with the specified action
    const { stdout, stderr } = await execAsync(`npm run woo:${action}`, {
      cwd: process.cwd(),
      timeout: 180000, // 3 minute timeout
    });

    return NextResponse.json({
      success: true,
      message: `WooCommerce Agent (${action}) completed successfully`,
      output: stdout,
      errors: stderr,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const err = error as Error & { stdout?: string; stderr?: string };
    console.error('WooCommerce Agent error:', err);
    
    return NextResponse.json({
      success: false,
      message: 'WooCommerce Agent failed',
      error: err.message,
      output: err.stdout || '',
      errors: err.stderr || '',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
