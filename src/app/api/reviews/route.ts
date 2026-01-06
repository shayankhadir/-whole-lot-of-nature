import { woocommerceClient as woocommerce } from '@/lib/services/woocommerceService';
import { type NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

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
    // Require authentication to post reviews
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return Response.json(
        { error: 'Authentication required to post reviews' }, 
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.product_id || !body.review || !body.rating) {
      return Response.json(
        { error: 'Missing required fields: product_id, review, rating' }, 
        { status: 400 }
      );
    }

    // Validate rating is between 1-5
    if (body.rating < 1 || body.rating > 5) {
      return Response.json(
        { error: 'Rating must be between 1 and 5' }, 
        { status: 400 }
      );
    }

    // Use authenticated user's email
    const reviewData = {
      ...body,
      reviewer: session.user.name || 'Customer',
      reviewer_email: session.user.email,
      status: 'hold', // Set to hold for moderation
    };

    const response = await woocommerce.post('products/reviews', reviewData);
    return Response.json(response.data);
  } catch (error) {
    console.error('Error creating review:', error);
    return Response.json({ error: 'Failed to create review' }, { status: 500 });
  }
}