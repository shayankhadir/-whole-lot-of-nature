import { NextRequest, NextResponse } from 'next/server';
import { DesignAuditAgent, DesignIssue } from '@/lib/agents/designAuditAgent';
import path from 'path';

export const maxDuration = 60;

/**
 * Design Audit API Endpoint
 * 
 * Actions:
 * - audit: Scan entire frontend for design issues
 * - auto-fix: Automatically fix high-priority issues
 * - report: Get detailed report of all issues
 */
export async function POST(request: NextRequest) {
  try {
    // Security Check
    const authHeader = request.headers.get('x-admin-key');
    if (authHeader !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'audit';
    
    const agent = new DesignAuditAgent();
    const projectRoot = path.join(process.cwd());

    switch (action) {
      case 'audit': {
        console.log('Running design audit...');
        const result = await agent.auditFrontend(projectRoot);
        
        return NextResponse.json({
          success: true,
          action: 'audit',
          ...result,
          message: `Found ${result.totalIssues} design issues (${result.criticalIssues} critical)`
        });
      }

      case 'auto-fix': {
        console.log('Auto-fixing design issues...');
        
        // First run audit
        const auditResult = await agent.auditFrontend(projectRoot);
        
        // Filter critical and high priority issues
        const highPriorityIssues = auditResult.issues.filter(
          i => i.severity === 'critical' || i.severity === 'high'
        );
        
        // Auto-fix them
        const fixResult = await agent.autoFix(highPriorityIssues);
        
        return NextResponse.json({
          success: true,
          action: 'auto-fix',
          issuesFound: auditResult.totalIssues,
          issuesFixed: fixResult.fixed,
          errors: fixResult.errors,
          message: `Fixed ${fixResult.fixed} high-priority design issues`
        });
      }

      case 'report': {
        console.log('Generating design report...');
        const result = await agent.auditFrontend(projectRoot);
        
        // Group issues by file
        const issuesByFile = result.issues.reduce((acc, issue) => {
          const fileName = path.basename(issue.file);
          if (!acc[fileName]) {
            acc[fileName] = [];
          }
          acc[fileName].push(issue);
          return acc;
        }, {} as Record<string, DesignIssue[]>);
        
        return NextResponse.json({
          success: true,
          action: 'report',
          summary: result.summary,
          totalIssues: result.totalIssues,
          criticalIssues: result.criticalIssues,
          issuesByCategory: result.issuesByCategory,
          issuesByFile,
          topIssues: result.issues.slice(0, 20)
        });
      }

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: audit, auto-fix, or report'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Design audit error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Design Audit Agent API',
    endpoints: {
      'POST ?action=audit': 'Scan frontend for design issues',
      'POST ?action=auto-fix': 'Automatically fix high-priority issues',
      'POST ?action=report': 'Get detailed design report'
    }
  });
}
