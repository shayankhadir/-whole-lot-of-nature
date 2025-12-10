import { NextResponse } from 'next/server';
import { WooCommerceService } from '@/lib/services/woocommerceService';
import { cashfreeService } from '@/lib/services/cashfreeService';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }

    // 1. Fetch WooCommerce Order
    const wcOrder = await WooCommerceService.getOrder(parseInt(orderId));

    if (!wcOrder) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // 2. Verify Payment Status with Cashfree (Optional but recommended)
    // If the order is still pending, we might want to check Cashfree status and update it
    if (wcOrder.status === 'pending') {
        try {
            const cfOrder = await cashfreeService.getOrderStatus(orderId);
            if (cfOrder.order_status === 'PAID') {
                await WooCommerceService.updateOrderStatus(parseInt(orderId), 'processing');
                wcOrder.status = 'processing';
            }
        } catch (e) {
            console.error("Failed to verify Cashfree status:", e);
        }
    }

    return NextResponse.json({
      orderId: wcOrder.id.toString(),
      status: wcOrder.status,
      total: wcOrder.total,
      currency: wcOrder.currency,
      paymentMethod: wcOrder.payment_method_title,
      dateCreated: wcOrder.date_created,
      items: wcOrder.line_items
    });

  } catch (error: any) {
    console.error('Checkout API Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
