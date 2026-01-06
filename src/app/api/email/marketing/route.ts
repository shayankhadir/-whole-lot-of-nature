/**
 * Email Marketing API Route
 * Handles sending automated emails and retrieving statistics
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  sendWelcomeEmail,
  sendAbandonedCartEmail,
  sendOrderConfirmationEmail,
  sendShippingNotificationEmail,
  sendReviewRequestEmail,
  sendReEngagementEmail,
  getEmailStats,
  type AbandonedCart,
  type OrderData
} from '@/lib/email/emailAutomation';

// Verify admin access
function verifyAdmin(request: NextRequest): boolean {
  const adminKey = request.headers.get('x-admin-key');
  return adminKey === process.env.ADMIN_SECRET_KEY;
}

export async function GET(request: NextRequest) {
  // Get email statistics
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const stats = await getEmailStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('[Email API] Failed to get stats:', error);
    return NextResponse.json({ error: 'Failed to get email stats' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Send emails
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, ...data } = body;

    let result;

    switch (type) {
      case 'welcome':
        result = await sendWelcomeEmail(
          data.email,
          data.customerName,
          data.discountCode
        );
        break;

      case 'abandoned_cart':
        const cart: AbandonedCart = {
          email: data.email,
          customerName: data.customerName,
          items: data.items || [],
          createdAt: new Date(data.createdAt || Date.now()),
          reminderCount: data.reminderCount || 0
        };
        result = await sendAbandonedCartEmail(
          cart,
          data.discountCode,
          data.discountPercent
        );
        break;

      case 'order_confirmation':
        const order: OrderData = {
          orderId: data.orderId,
          email: data.email,
          customerName: data.customerName,
          items: data.items || [],
          total: data.total || 0,
          trackingUrl: data.trackingUrl
        };
        result = await sendOrderConfirmationEmail(order);
        break;

      case 'shipping':
        result = await sendShippingNotificationEmail(
          data.email,
          data.customerName,
          data.orderId,
          data.trackingUrl
        );
        break;

      case 'review_request':
        result = await sendReviewRequestEmail(
          data.email,
          data.customerName,
          data.orderId,
          data.productUrl
        );
        break;

      case 'reengagement':
        result = await sendReEngagementEmail(
          data.email,
          data.customerName,
          data.discountCode,
          data.discountPercent
        );
        break;

      default:
        return NextResponse.json(
          { error: `Unknown email type: ${type}` },
          { status: 400 }
        );
    }

    if (result.success) {
      return NextResponse.json({ success: true, emailId: result.id });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[Email API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process email request' },
      { status: 500 }
    );
  }
}
