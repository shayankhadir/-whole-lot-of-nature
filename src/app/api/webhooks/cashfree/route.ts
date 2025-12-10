import { NextResponse } from 'next/server';
import { cashfreeService } from '@/lib/services/cashfreeService';
import { WooCommerceService } from '@/lib/services/woocommerceService';

export async function POST(req: Request) {
  try {
    // 1. Get the raw body and signature
    const body = await req.json();
    const signature = req.headers.get('x-webhook-signature');

    // 2. Verify Signature (Important for security)
    // Note: cashfreeService.verifySignature currently returns true (placeholder)
    // You should implement actual verification in production
    if (!signature || !cashfreeService.verifySignature(body, signature)) {
      return NextResponse.json(
        { success: false, message: 'Invalid signature' },
        { status: 401 }
      );
    }

    // 3. Handle Payment Success Event
    if (body.type === 'PAYMENT_SUCCESS_WEBHOOK') {
      const orderId = body.data.order.order_id;
      const paymentStatus = body.data.payment.payment_status;

      if (paymentStatus === 'SUCCESS') {
        console.log(`Processing successful payment for Order ${orderId}`);
        
        // Update WooCommerce Order Status
        // Since we used WC Order ID as Cashfree Order ID, we can parse it directly
        const wcOrderId = parseInt(orderId);
        if (!isNaN(wcOrderId)) {
             await WooCommerceService.updateOrderStatus(wcOrderId, 'processing', body.data.payment.cf_payment_id);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json(
      { success: false, message: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
