/**
 * API Route: Email Intelligence + Marketing
 * Endpoint: /api/email/intelligence
 */

import { NextRequest, NextResponse } from 'next/server';
import EmailIntelligenceAgent from '@/lib/agents/emailIntelligenceAgent';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') ?? 'ingest';
    const payload = await request.json().catch(() => ({}));
    const agent = new EmailIntelligenceAgent();

    switch (action) {
      case 'ingest': {
        if (!payload.email) {
          return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
        }
        const contact = await agent.ingestContact(payload);
        return NextResponse.json({ success: true, contact });
      }
      case 'newsletter': {
        if (!payload.email) {
          return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
        }
        const contact = await agent.recordNewsletterSignup(payload);
        return NextResponse.json({ success: true, contact });
      }
      case 'sync-woocommerce': {
        const result = await agent.synchronizeWooCommerceCustomers(payload.limit);
        return NextResponse.json({ success: true, result });
      }
      case 'refresh-orders': {
        const result = await agent.refreshIntentScoresFromOrders();
        return NextResponse.json({ success: true, result });
      }
      case 'send-offer': {
        const result = await agent.sendOfferCampaign(payload);
        return NextResponse.json({ success: result.success, result });
      }
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Email intelligence POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') ?? 'snapshot';
    const agent = new EmailIntelligenceAgent();

    if (view === 'contacts') {
      const limit = parseInt(searchParams.get('limit') || '200', 10);
      const contacts = await agent.getContactSheet(Math.min(limit, 500));
      return NextResponse.json({ success: true, contacts });
    }

    const snapshot = await agent.getDashboardSnapshot();
    return NextResponse.json({ success: true, snapshot });
  } catch (error: any) {
    console.error('Email intelligence GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
