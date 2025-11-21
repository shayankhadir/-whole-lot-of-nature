import { NextResponse } from 'next/server';
import plantsyAgent from '@/lib/agents/plantsyAgent';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { question, context } = await request.json().catch(() => ({}));

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const answer = await plantsyAgent.answerQuestion(question, context);
    return NextResponse.json({ success: true, answer });
  } catch (error) {
    console.error('Plantsy API error:', error);
    return NextResponse.json({ error: 'Unable to fetch care guidance. Try again shortly.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Use POST with { question, context } to chat with Plantsy.',
  });
}
