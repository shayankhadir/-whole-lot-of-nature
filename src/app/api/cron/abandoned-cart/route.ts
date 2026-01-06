/**
 * Abandoned Cart Recovery Cron Job
 * Finds abandoned carts and sends reminder emails
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendAbandonedCartEmail, type AbandonedCart } from '@/lib/email/emailAutomation';

// Verify cron secret or admin access
function verifyCron(request: NextRequest): boolean {
  const cronSecret = request.headers.get('x-cron-secret');
  const adminKey = request.headers.get('x-admin-key');
  return (
    cronSecret === process.env.CRON_SECRET ||
    adminKey === process.env.ADMIN_SECRET_KEY
  );
}

interface WooCommerceSession {
  session_key: string;
  session_value: string;
  session_expiry: number;
}

interface CartData {
  cart: Array<{
    product_id: number;
    quantity: number;
    line_subtotal: number;
    data: {
      name: string;
      image?: { src: string };
    };
  }>;
  customer?: {
    email?: string;
    first_name?: string;
  };
}

export async function POST(request: NextRequest) {
  if (!verifyCron(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const abandonedCarts = await findAbandonedCarts();
    const results = {
      processed: 0,
      sent: 0,
      failed: 0,
      skipped: 0,
      details: [] as Array<{ email: string; status: string; error?: string }>
    };

    for (const cart of abandonedCarts) {
      results.processed++;

      // Skip if already sent max reminders (3)
      if (cart.reminderCount >= 3) {
        results.skipped++;
        results.details.push({
          email: cart.email,
          status: 'skipped',
          error: 'Max reminders reached'
        });
        continue;
      }

      // Skip if last reminder was less than 24 hours ago
      if (cart.lastReminderSent) {
        const hoursSinceLastReminder = 
          (Date.now() - cart.lastReminderSent.getTime()) / (1000 * 60 * 60);
        if (hoursSinceLastReminder < 24) {
          results.skipped++;
          results.details.push({
            email: cart.email,
            status: 'skipped',
            error: 'Too soon since last reminder'
          });
          continue;
        }
      }

      // Determine discount based on reminder number
      const discounts = [
        { code: undefined, percent: undefined }, // 1st reminder: no discount
        { code: 'CART10', percent: 10 },         // 2nd reminder: 10% off
        { code: 'CART15', percent: 15 }          // 3rd reminder: 15% off
      ];
      const discount = discounts[cart.reminderCount] || discounts[0];

      const result = await sendAbandonedCartEmail(
        cart,
        discount.code,
        discount.percent
      );

      if (result.success) {
        results.sent++;
        results.details.push({ email: cart.email, status: 'sent' });
        
        // Update reminder tracking
        await updateCartReminder(cart.cartToken || cart.email);
      } else {
        results.failed++;
        results.details.push({
          email: cart.email,
          status: 'failed',
          error: result.error
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Abandoned Cart Cron] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process abandoned carts' },
      { status: 500 }
    );
  }
}

/**
 * Find abandoned carts from WooCommerce sessions
 * Carts are considered abandoned if:
 * 1. Cart has items
 * 2. Cart is at least 1 hour old
 * 3. No order was completed with this session
 */
async function findAbandonedCarts(): Promise<AbandonedCart[]> {
  const abandonedCarts: AbandonedCart[] = [];
  
  try {
    // Try to get from local database first (for tracked carts)
    const { prisma } = await import('@/lib/prisma');
    
    // Get carts that were abandoned more than 1 hour ago
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    // Check if we have an AbandonedCart model (optional)
    // If not, fall back to WooCommerce API
    try {
      const carts = await (prisma as any).abandonedCart?.findMany({
        where: {
          createdAt: { lte: oneHourAgo },
          recovered: false,
          email: { not: null }
        },
        orderBy: { createdAt: 'desc' },
        take: 50
      });

      if (carts && carts.length > 0) {
        return carts.map((cart: any) => ({
          email: cart.email,
          customerName: cart.customerName,
          items: JSON.parse(cart.items || '[]'),
          cartToken: cart.token,
          createdAt: cart.createdAt,
          lastReminderSent: cart.lastReminderSent,
          reminderCount: cart.reminderCount || 0
        }));
      }
    } catch {
      // Model doesn't exist, continue with alternative
    }

    // Alternative: Check email events for cart_abandoned without follow-up purchases
    const cartAbandonments = await prisma.emailEvent.findMany({
      where: {
        type: 'CART_ABANDONED',
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
      },
      include: {
        contact: true
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    for (const event of cartAbandonments) {
      // Check if this contact made a purchase after abandonment
      const purchaseAfter = await prisma.emailEvent.findFirst({
        where: {
          contactId: event.contactId,
          type: 'PURCHASED',
          createdAt: { gt: event.createdAt }
        }
      });

      if (!purchaseAfter && event.contact.email) {
        const payload = event.payload as Record<string, any> || {};
        abandonedCarts.push({
          email: event.contact.email,
          customerName: event.contact.firstName || undefined,
          items: payload.items || [],
          cartToken: payload.cartToken,
          createdAt: event.createdAt,
          lastReminderSent: payload.lastReminderSent ? new Date(payload.lastReminderSent) : undefined,
          reminderCount: payload.reminderCount || 0
        });
      }
    }
  } catch (error) {
    console.error('[Abandoned Cart] Failed to fetch carts:', error);
  }

  return abandonedCarts;
}

/**
 * Update cart reminder tracking
 */
async function updateCartReminder(cartIdentifier: string): Promise<void> {
  try {
    const { prisma } = await import('@/lib/prisma');
    
    // Update in AbandonedCart table if it exists
    try {
      await (prisma as any).abandonedCart?.update({
        where: { token: cartIdentifier },
        data: {
          lastReminderSent: new Date(),
          reminderCount: { increment: 1 }
        }
      });
    } catch {
      // Model doesn't exist or record not found, that's okay
    }
  } catch (error) {
    console.error('[Abandoned Cart] Failed to update reminder:', error);
  }
}

// Also support GET for manual trigger from admin
export async function GET(request: NextRequest) {
  return POST(request);
}
