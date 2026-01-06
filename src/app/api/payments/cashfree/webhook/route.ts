import { NextResponse } from 'next/server';
import { cashfreeService } from '@/lib/services/cashfreeService';
import { woocommerceClient } from '@/lib/services/woocommerceService';

// Log webhook events for debugging
function logWebhookEvent(type: string, data: any, success: boolean) {
  console.log(`[WEBHOOK] ${new Date().toISOString()} | Type: ${type} | Success: ${success}`);
  if (process.env.NODE_ENV === 'development') {
    console.log('[WEBHOOK] Data:', JSON.stringify(data, null, 2));
  }
}

export async function POST(req: Request) {
  try {
    // Get raw body for signature verification
    const rawBody = await req.text();
    const signature = req.headers.get('x-webhook-signature') || '';
    const timestamp = req.headers.get('x-webhook-timestamp') || '';

    // Verify webhook signature in production
    if (process.env.NODE_ENV === 'production') {
      const isValid = cashfreeService.verifySignature(rawBody, signature, timestamp);
      if (!isValid) {
        console.error('[WEBHOOK] Invalid signature - rejecting webhook');
        return NextResponse.json(
          { success: false, message: 'Invalid signature' }, 
          { status: 401 }
        );
      }
    }

    // Parse the verified body
    const body = JSON.parse(rawBody);
    const { type, data } = body;

    logWebhookEvent(type, data, true);

    if (type === 'PAYMENT_SUCCESS_WEBHOOK' || type === 'ORDER_PAID') {
      const { order, payment } = data;
      const orderId = order?.order_id || data?.order_id;
      
      if (!orderId) {
        console.error('[WEBHOOK] No order_id found in webhook data');
        return NextResponse.json({ success: false, message: 'Missing order_id' }, { status: 400 });
      }

      console.log(`[WEBHOOK] Payment successful for Order ${orderId}`);
      
      // Extract WooCommerce order ID from Cashfree order_id
      // Format: WC_ORDER_{wooOrderId}_{timestamp} or just the WC order ID
      let wooOrderId: string | null = null;
      
      if (orderId.startsWith('WC_ORDER_')) {
        // Extract WC order ID from format: WC_ORDER_123_timestamp
        const parts = orderId.split('_');
        wooOrderId = parts[2];
      } else if (/^\d+$/.test(orderId)) {
        // It's already a numeric WC order ID
        wooOrderId = orderId;
      } else {
        // Try to find the WC order ID in order notes/metadata
        console.log(`[WEBHOOK] Order ID format not recognized: ${orderId}`);
        wooOrderId = orderId;
      }

      // Update WooCommerce order status to 'processing'
      try {
        const updateResult = await woocommerceClient.put(`orders/${wooOrderId}`, {
          status: 'processing',
          transaction_id: payment?.cf_payment_id || payment?.payment_id,
          meta_data: [
            { key: '_cashfree_payment_id', value: payment?.cf_payment_id || payment?.payment_id },
            { key: '_cashfree_order_id', value: orderId },
            { key: '_payment_completed_at', value: new Date().toISOString() }
          ]
        });
        
        console.log(`[WEBHOOK] WooCommerce order ${wooOrderId} updated to 'processing'`);
        
        // Optionally trigger order confirmation email
        // This is usually handled automatically by WooCommerce when status changes
        
      } catch (wcError: any) {
        console.error(`[WEBHOOK] Failed to update WooCommerce order ${wooOrderId}:`, wcError.message);
        // Don't fail the webhook - Cashfree might retry and we don't want duplicates
        // Log for manual intervention
      }
    } else if (type === 'PAYMENT_FAILED_WEBHOOK' || type === 'ORDER_FAILED') {
      const orderId = data?.order?.order_id || data?.order_id;
      console.log(`[WEBHOOK] Payment failed for Order ${orderId}`);
      
      // Optionally update WooCommerce order to 'failed' status
      // This helps with inventory management
    } else if (type === 'REFUND_WEBHOOK' || type === 'REFUND_PROCESSED') {
      const orderId = data?.order?.order_id || data?.order_id;
      console.log(`[WEBHOOK] Refund processed for Order ${orderId}`);
      
      // Handle refund logic - update WC order status to 'refunded'
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error: any) {
    console.error('[WEBHOOK] Processing error:', error.message);
    // Return 200 to prevent Cashfree from retrying on parse errors
    // But log for investigation
    return NextResponse.json({ success: false, error: error.message }, { status: 200 });
  }
}

// Handle GET requests (for webhook verification by Cashfree)
export async function GET(req: Request) {
  return NextResponse.json({ 
    status: 'Webhook endpoint active',
    timestamp: new Date().toISOString()
  });
}
