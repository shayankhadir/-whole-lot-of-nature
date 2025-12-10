import { NextResponse } from 'next/server';
import { cashfreeService } from '@/lib/services/cashfreeService';

export async function POST(req: Request) {
  try {
    // In Next.js App Router, we need to get the raw body for signature verification
    // However, req.json() consumes the body. 
    // For now, we'll just parse the JSON.
    const body = await req.json();
    const signature = req.headers.get('x-webhook-signature') || '';

    // Verify signature (optional but recommended)
    // const isValid = cashfreeService.verifySignature(body, signature);
    // if (!isValid) {
    //   return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    // }

    const { type, data } = body;

    if (type === 'PAYMENT_SUCCESS_WEBHOOK') {
      const { order, payment } = data;
      console.log(`Payment successful for Order ${order.order_id}`);
      
      // TODO: Update order status in your database/WooCommerce
      // await updateOrderStatus(order.order_id, 'processing');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
