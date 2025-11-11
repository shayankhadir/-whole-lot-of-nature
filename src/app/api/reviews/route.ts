import { woocommerceClient as woocommerce } from '@/lib/services/woocommerceService';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') || '1';
  const per_page = searchParams.get('per_page') || '10';
  const product = searchParams.get('product');

  try {
    // WooCommerce SDK expects flattened query params (no nested `params` key)
    const query: Record<string, string> = {
      page,
      per_page,
      status: 'approved',
    };
    if (product) {
      query.product = product;
    }

    const response = await woocommerce.get('products/reviews', query);
    return Response.json(response.data);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return Response.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await woocommerce.post('products/reviews', body);
    return Response.json(response.data);
  } catch (error) {
    console.error('Error creating review:', error);
    return Response.json({ error: 'Failed to create review' }, { status: 500 });
  }
}