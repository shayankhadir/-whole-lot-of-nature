import { NextRequest, NextResponse } from 'next/server';
import { woocommerceClient } from '@/lib/services/woocommerceService';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutData {
  items: CartItem[];
  customer?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  billing?: {
    firstName?: string;
    lastName?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    email?: string;
    phone?: string;
  };
  shipping?: {
    firstName?: string;
    lastName?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  couponCode?: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: CheckoutData = await request.json();
    
    if (!data.items || data.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Transform cart items to WooCommerce line items format
    const lineItems = data.items.map(item => ({
      product_id: parseInt(item.id),
      quantity: item.quantity,
    }));

    // Create WooCommerce order
    const orderData: Record<string, unknown> = {
      status: 'pending',
      line_items: lineItems,
      set_paid: false,
    };

    // Add billing info if provided
    if (data.billing) {
      orderData.billing = {
        first_name: data.billing.firstName || '',
        last_name: data.billing.lastName || '',
        address_1: data.billing.address1 || '',
        address_2: data.billing.address2 || '',
        city: data.billing.city || '',
        state: data.billing.state || '',
        postcode: data.billing.postcode || '',
        country: data.billing.country || 'IN',
        email: data.billing.email || data.customer?.email || '',
        phone: data.billing.phone || data.customer?.phone || '',
      };
    }

    // Add shipping info if provided
    if (data.shipping) {
      orderData.shipping = {
        first_name: data.shipping.firstName || '',
        last_name: data.shipping.lastName || '',
        address_1: data.shipping.address1 || '',
        address_2: data.shipping.address2 || '',
        city: data.shipping.city || '',
        state: data.shipping.state || '',
        postcode: data.shipping.postcode || '',
        country: data.shipping.country || 'IN',
      };
    }

    // Add coupon if provided
    if (data.couponCode) {
      orderData.coupon_lines = [
        { code: data.couponCode }
      ];
    }

    console.log('Creating WooCommerce order with data:', JSON.stringify(orderData, null, 2));

    const response = await woocommerceClient.post('orders', orderData);
    const order = response.data;

    console.log('WooCommerce order created:', order.id);

    // Get the WordPress base URL for checkout redirect
    const wpBaseUrl = process.env.WORDPRESS_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://admin.wholelotofnature.com';
    
    // Generate checkout URL - WooCommerce uses order-pay endpoint for pending orders
    const checkoutUrl = `${wpBaseUrl}/checkout/order-pay/${order.id}/?pay_for_order=true&key=${order.order_key}`;

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderKey: order.order_key,
      checkoutUrl: checkoutUrl,
      total: order.total,
      currency: order.currency,
    });

  } catch (error: unknown) {
    console.error('Checkout API error:', error);
    
    const e = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
    
    if (e.response) {
      return NextResponse.json(
        { 
          error: 'Failed to create order',
          details: e.response.data?.message || 'WooCommerce API error'
        },
        { status: e.response.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process checkout', details: e.message },
      { status: 500 }
    );
  }
}

// GET endpoint to check order status
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return NextResponse.json(
      { error: 'Order ID is required' },
      { status: 400 }
    );
  }

  try {
    const response = await woocommerceClient.get(`orders/${orderId}`);
    const order = response.data;

    return NextResponse.json({
      orderId: order.id,
      status: order.status,
      total: order.total,
      currency: order.currency,
      paymentMethod: order.payment_method_title,
      dateCreated: order.date_created,
    });

  } catch (error: unknown) {
    console.error('Order status check error:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch order status' },
      { status: 500 }
    );
  }
}
