import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

const execAsync = promisify(exec);

// List of authorized admin emails
const ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL,
  'admin@wholelotofnature.com',
].filter(Boolean);

export async function POST(req: Request) {
  try {
    // CRITICAL: Verify admin authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      console.warn('Unauthorized script execution attempt: No session');
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (!ADMIN_EMAILS.includes(session.user.email)) {
      console.warn(`Unauthorized script execution attempt by: ${session.user.email}`);
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { script } = await req.json();
    let scriptPath = '';
    let args = '';

    switch (script) {
      case 'growth':
        scriptPath = 'scripts/growth-agent/main.ts';
        break;
      case 'content':
        scriptPath = 'scripts/content-agent.ts';
        // Default to generating a blog post if no args provided
        // In a real app, we'd pass these from the UI
        args = 'blog "Sustainable Gardening Tips for Beginners"';
        break;
      case 'seo':
        scriptPath = 'scripts/seo-agent.ts';
        break;
      default:
        return NextResponse.json({ error: 'Invalid script name' }, { status: 400 });
    }

    // Use npx tsx to run the typescript file
    // We need to ensure we are in the project root
    const projectRoot = process.cwd();
    const command = `npx tsx "${path.join(projectRoot, scriptPath)}" ${args}`;

    console.log(`Executing command: ${command}`);

    // Set a timeout for the execution to prevent hanging indefinitely, 
    // though some agents might take a while. 
    // For now, we'll let it run. In a real prod env, we might want to run this in background
    // and return a job ID. But for this request, we'll await it.
    const { stdout, stderr } = await execAsync(command, { maxBuffer: 1024 * 1024 * 10 }); // 10MB buffer

    if (stderr) {
      console.warn(`Script stderr: ${stderr}`);
    }

    return NextResponse.json({ 
      success: true, 
      output: stdout,
      message: 'Agent executed successfully' 
    });

  } catch (error: unknown) {
    console.error('Error executing script:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to execute script';
    return NextResponse.json({ 
      success: false, 
      error: errorMessage 
    }, { status: 500 });
  }
}
