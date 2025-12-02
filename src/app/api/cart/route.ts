/**
 * Cart API Proxy
 * 
 * Proxies cart requests to WooCommerce Store API to handle CORS
 * and maintain cart session on the server side.
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const WP_URL = process.env.WORDPRESS_URL || 'https://admin.wholelotofnature.com';
const STORE_API_URL = `${WP_URL}/wp-json/wc/store/v1/cart`;

// Forward cookies from the request
async function getWCHeaders(request: NextRequest) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Get cart token from cookies if exists
  const cookieStore = await cookies();
  const cartToken = cookieStore.get('wc_cart_token')?.value;
  
  if (cartToken) {
    headers['Cart-Token'] = cartToken;
  }
  
  return headers;
}

// Handle response and extract cart token
async function handleWCResponse(response: Response, nextResponse: NextResponse) {
  // Get cart token from response headers
  const cartToken = response.headers.get('Cart-Token');
  
  if (cartToken) {
    nextResponse.cookies.set('wc_cart_token', cartToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
  }
  
  return nextResponse;
}

// GET /api/cart - Get current cart
export async function GET(request: NextRequest) {
  try {
    const headers = await getWCHeaders(request);
    
    const response = await fetch(STORE_API_URL, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch cart' }));
      return NextResponse.json(error, { status: response.status });
    }

    const cart = await response.json();
    const nextResponse = NextResponse.json(cart);
    return handleWCResponse(response, nextResponse);
  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item, remove item, update item, apply coupon
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'add-item';
    
    const body = await request.json();
    const headers = await getWCHeaders(request);
    
    let endpoint = STORE_API_URL;
    
    switch (action) {
      case 'add-item':
        endpoint = `${STORE_API_URL}/add-item`;
        break;
      case 'remove-item':
        endpoint = `${STORE_API_URL}/remove-item`;
        break;
      case 'update-item':
        endpoint = `${STORE_API_URL}/update-item`;
        break;
      case 'apply-coupon':
        endpoint = `${STORE_API_URL}/apply-coupon`;
        break;
      case 'remove-coupon':
        endpoint = `${STORE_API_URL}/remove-coupon`;
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Cart operation failed' }));
      return NextResponse.json(error, { status: response.status });
    }

    const cart = await response.json();
    const nextResponse = NextResponse.json(cart);
    return handleWCResponse(response, nextResponse);
  } catch (error) {
    console.error('Cart POST error:', error);
    return NextResponse.json(
      { error: 'Cart operation failed' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Clear cart
export async function DELETE(request: NextRequest) {
  try {
    const headers = await getWCHeaders(request);
    
    // WooCommerce doesn't have a clear cart endpoint, so we remove all items
    const cartResponse = await fetch(STORE_API_URL, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!cartResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
    }

    const cart = await cartResponse.json();
    
    // Remove each item
    for (const item of cart.items) {
      await fetch(`${STORE_API_URL}/remove-item`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ key: item.key }),
        cache: 'no-store',
      });
    }

    // Fetch updated cart
    const updatedResponse = await fetch(STORE_API_URL, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    const updatedCart = await updatedResponse.json();
    const nextResponse = NextResponse.json(updatedCart);
    return handleWCResponse(updatedResponse, nextResponse);
  } catch (error) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}
