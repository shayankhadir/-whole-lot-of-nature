import { NextResponse } from 'next/server';
import { cashfreeService } from '@/lib/services/cashfreeService';
import { WooCommerceService } from '@/lib/services/woocommerceService';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, customerName, customerPhone, customerEmail, billing, shipping, items } = body;

    if (!amount || !customerName || !customerPhone || !customerEmail) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 1. Create WooCommerce Order
    const wcOrderData = {
      payment_method: 'cashfree',
      payment_method_title: 'Cashfree Payments',
      set_paid: false,
      billing,
      shipping,
      line_items: items,
      status: 'pending'
    };

    let wcOrder;
    try {
      wcOrder = await WooCommerceService.createOrder(wcOrderData);
    } catch (wcError) {
      console.error('Failed to create WooCommerce order:', wcError);
      // Fallback: Proceed without WC order if strictly necessary, but better to fail
      return NextResponse.json(
        { success: false, message: 'Failed to initialize order system' },
        { status: 500 }
      );
    }

    if (!wcOrder || !wcOrder.id) {
       return NextResponse.json(
        { success: false, message: 'Failed to create order ID' },
        { status: 500 }
      );
    }

    // 2. Create Cashfree Order using WC Order ID
    const orderId = wcOrder.id.toString(); // Use WC Order ID as Cashfree Order ID
    const returnUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://wholelotofnature.com'}/order-success?order_id=${orderId}`;

    const order = await cashfreeService.createOrder({
      orderId,
      orderAmount: amount,
      orderCurrency: 'INR',
      customerName,
      customerPhone,
      customerEmail,
      returnUrl,
    });

    return NextResponse.json({
      success: true,
      payment_session_id: order.payment_session_id,
      order_id: order.order_id,
    });
  } catch (error: any) {
    console.error('Payment API Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
