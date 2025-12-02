import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const contentType = body.type || 'blog'; // blog, product, social, meta, email
    
    console.log(`📝 Running Content Agent (${contentType})...`);
    
    // Run the content agent with the specified type
    const { stdout, stderr } = await execAsync(`npm run content:${contentType}`, {
      cwd: process.cwd(),
      timeout: 120000, // 2 minute timeout
    });

    return NextResponse.json({
      success: true,
      message: `Content Agent (${contentType}) completed successfully`,
      output: stdout,
      errors: stderr,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const err = error as Error & { stdout?: string; stderr?: string };
    console.error('Content Agent error:', err);
    
    return NextResponse.json({
      success: false,
      message: 'Content Agent failed',
      error: err.message,
      output: err.stdout || '',
      errors: err.stderr || '',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
