/**
 * Order Webhook Endpoint
 * 
 * Receives webhooks from WooCommerce when order status changes.
 * Use this to send additional notifications or trigger automations.
 * 
 * Setup in WooCommerce:
 * 1. Go to WooCommerce → Settings → Advanced → Webhooks
 * 2. Add webhook:
 *    - Name: Order Status Changed
 *    - Status: Active
 *    - Topic: Order updated
 *    - Delivery URL: https://wholelotofnature.com/api/webhooks/order
 *    - Secret: Your WEBHOOK_SECRET from env
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { buildBrandedEmail, sendEmail } from '@/lib/services/emailService';

// Verify WooCommerce webhook signature
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('base64');
  return signature === expectedSignature;
}

interface WooCommerceOrderWebhook {
  id: number;
  status: string;
  total: string;
  currency: string;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  line_items: Array<{
    name: string;
    quantity: number;
    total: string;
  }>;
  date_created: string;
  date_paid?: string;
  payment_method_title?: string;
  meta_data?: Array<{
    key: string;
    value: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.WOOCOMMERCE_WEBHOOK_SECRET;
    
    // Get the raw body for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get('x-wc-webhook-signature') || '';
    
    // Verify webhook signature if secret is configured
    if (webhookSecret && signature) {
      const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        console.error('Invalid webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const order: WooCommerceOrderWebhook = JSON.parse(rawBody);
    
    console.log(`Order webhook received: #${order.id} - Status: ${order.status}`);

    // Handle different order statuses
    switch (order.status) {
      case 'completed':
        await handleOrderCompleted(order);
        break;
      case 'processing':
        await handleOrderProcessing(order);
        break;
      case 'on-hold':
        await handleOrderOnHold(order);
        break;
      case 'cancelled':
        await handleOrderCancelled(order);
        break;
      case 'refunded':
        await handleOrderRefunded(order);
        break;
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error('Order webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

// Order completed - shipped and delivered
async function handleOrderCompleted(order: WooCommerceOrderWebhook) {
  const trackingNumber = order.meta_data?.find(m => m.key === '_tracking_number')?.value;
  
  // Only send custom email if we have tracking info
  if (trackingNumber && order.billing.email) {
    const trackingUrl = `https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/TrackConsignment.aspx?consignment=${trackingNumber}`;
    
    const itemsList = order.line_items.map(item => 
      `<tr><td style="padding:8px;border-bottom:1px solid #e5e7eb;">${item.name}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb;">×${item.quantity}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb;">₹${item.total}</td></tr>`
    ).join('');

    const html = buildBrandedEmail({
      title: 'Your Order is On Its Way',
      intro: `Great news! Your order #${order.id} has been shipped.`,
      body: `
        <p>Hi ${order.billing.first_name},</p>
        <p>Your plants are on their way to you! Here's your tracking information:</p>
        
        <div style="background:#f0fdf4;padding:20px;border-radius:12px;margin:20px 0;">
          <p style="margin:0;font-weight:600;color:#166534;">Tracking Number: ${trackingNumber}</p>
        </div>
        
        <h3 style="margin-top:24px;">Order Summary</h3>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#f9fafb;">
              <th style="padding:8px;text-align:left;">Item</th>
              <th style="padding:8px;text-align:left;">Qty</th>
              <th style="padding:8px;text-align:left;">Total</th>
            </tr>
          </thead>
          <tbody>${itemsList}</tbody>
        </table>
        
        <p style="font-weight:600;margin-top:16px;">Order Total: ₹${order.total}</p>
        
        <h3 style="margin-top:24px;">Shipping Address</h3>
        <p style="margin:0;">
          ${order.shipping.first_name} ${order.shipping.last_name}<br>
          ${order.shipping.address_1}${order.shipping.address_2 ? ', ' + order.shipping.address_2 : ''}<br>
          ${order.shipping.city}, ${order.shipping.state} ${order.shipping.postcode}
        </p>
      `,
      buttonText: 'Track Your Order',
      buttonUrl: trackingUrl,
      footer: 'Thank you for shopping with Whole Lot of Nature. Your plants are ready to bring life to your space.',
    });

    await sendEmail({
      to: order.billing.email,
      subject: `Your Order #${order.id} is on its way`,
      html,
      text: `Your order #${order.id} has been shipped! Tracking number: ${trackingNumber}`,
    });

    console.log(`Shipping notification sent to ${order.billing.email}`);
  }
}

// Order processing - payment received, preparing shipment
async function handleOrderProcessing(order: WooCommerceOrderWebhook) {
  // WooCommerce already sends "Order Processing" email
  // Add any additional automation here (e.g., notify warehouse)
  console.log(`Order #${order.id} is now processing`);
}

// Order on hold - awaiting payment
async function handleOrderOnHold(order: WooCommerceOrderWebhook) {
  console.log(`Order #${order.id} is on hold`);
}

// Order cancelled
async function handleOrderCancelled(order: WooCommerceOrderWebhook) {
  console.log(`Order #${order.id} was cancelled`);
}

// Order refunded
async function handleOrderRefunded(order: WooCommerceOrderWebhook) {
  console.log(`Order #${order.id} was refunded`);
}

// GET endpoint to verify webhook is working
export async function GET() {
  return NextResponse.json({
    status: 'Order webhook endpoint active',
    supportedStatuses: ['completed', 'processing', 'on-hold', 'cancelled', 'refunded'],
    setup: 'Configure webhook in WooCommerce → Settings → Advanced → Webhooks',
  });
}
