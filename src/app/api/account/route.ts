import { NextRequest, NextResponse } from 'next/server';

const WC_URL = process.env.WORDPRESS_URL || 'https://admin.wholelotofnature.com';
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;

async function wooFetch(endpoint: string) {
  const url = `${WC_URL}/wp-json/wc/v3/${endpoint}`;
  const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');
  
  const res = await fetch(url, {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 }, // Cache for 1 minute
  });
  
  if (!res.ok) {
    throw new Error(`WooCommerce API error: ${res.status}`);
  }
  
  return res.json();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const type = searchParams.get('type') || 'customer';

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    if (type === 'customer') {
      // Fetch customer by email
      const customers = await wooFetch(`customers?email=${encodeURIComponent(email)}`);
      
      if (customers && customers.length > 0) {
        const customer = customers[0];
        return NextResponse.json({
          success: true,
          data: {
            id: customer.id,
            email: customer.email,
            first_name: customer.first_name,
            last_name: customer.last_name,
            avatar_url: customer.avatar_url,
            billing: customer.billing,
            shipping: customer.shipping,
          }
        });
      }
      
      return NextResponse.json({
        success: true,
        data: null,
        message: 'Customer not found'
      });
    }

    if (type === 'orders') {
      // First find customer by email
      const customers = await wooFetch(`customers?email=${encodeURIComponent(email)}`);
      
      if (!customers || customers.length === 0) {
        // Try to find orders by billing email instead
        const orders = await wooFetch(`orders?search=${encodeURIComponent(email)}&per_page=20&orderby=date&order=desc`);
        
        // Filter to only orders with matching billing email
        const filteredOrders = orders.filter((order: { billing: { email: string } }) => 
          order.billing?.email?.toLowerCase() === email.toLowerCase()
        );

        return NextResponse.json({
          success: true,
          data: filteredOrders.map((order: {
            id: number;
            number: string;
            status: string;
            date_created: string;
            total: string;
            currency: string;
            line_items: Array<{
              id: number;
              name: string;
              quantity: number;
              total: string;
              image?: { src: string };
            }>;
          }) => ({
            id: order.id,
            number: order.number,
            status: order.status,
            date_created: order.date_created,
            total: order.total,
            currency: order.currency,
            line_items: order.line_items.map((item: {
              id: number;
              name: string;
              quantity: number;
              total: string;
              image?: { src: string };
            }) => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              total: item.total,
              image: item.image,
            })),
          }))
        });
      }

      const customerId = customers[0].id;
      const orders = await wooFetch(`orders?customer=${customerId}&per_page=20&orderby=date&order=desc`);

      return NextResponse.json({
        success: true,
        data: orders.map((order: {
          id: number;
          number: string;
          status: string;
          date_created: string;
          total: string;
          currency: string;
          line_items: Array<{
            id: number;
            name: string;
            quantity: number;
            total: string;
            image?: { src: string };
          }>;
        }) => ({
          id: order.id,
          number: order.number,
          status: order.status,
          date_created: order.date_created,
          total: order.total,
          currency: order.currency,
          line_items: order.line_items.map((item: {
            id: number;
            name: string;
            quantity: number;
            total: string;
            image?: { src: string };
          }) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            total: item.total,
            image: item.image,
          })),
        }))
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid type parameter' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Account API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch account data' },
      { status: 500 }
    );
  }
}
