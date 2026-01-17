import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      WORDPRESS_URL: process.env.WORDPRESS_URL || 'NOT SET',
      WORDPRESS_API_URL: process.env.WORDPRESS_API_URL || 'NOT SET',
      WC_CONSUMER_KEY_SET: !!process.env.WC_CONSUMER_KEY,
      WC_CONSUMER_SECRET_SET: !!process.env.WC_CONSUMER_SECRET,
    },
    tests: {}
  };

  const wpUrl = process.env.WORDPRESS_URL;
  const key = process.env.WC_CONSUMER_KEY;
  const secret = process.env.WC_CONSUMER_SECRET;

  // Test 1: Check if credentials exist
  if (!key || !secret) {
    return NextResponse.json({
      ...results,
      error: 'CRITICAL: Credentials not set in environment',
      details: {
        keyExists: !!key,
        secretExists: !!secret,
        wpUrl: wpUrl
      }
    });
  }

  // Test 2: Try to fetch products with basic auth
  try {
    const auth = Buffer.from(`${key}:${secret}`).toString('base64');
    const url = `${wpUrl}/wp-json/wc/v3/products?per_page=1&status=publish`;

    console.log('[DEBUG] Fetching from:', url);
    console.log('[DEBUG] Auth header set:', !!auth);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'User-Agent': 'WholelotOfNature-Debug'
      }
    });

    console.log('[DEBUG] Response status:', response.status);

    const data = await response.json().catch(() => null);

    results.tests.direct_fetch = {
      url: url,
      status: response.status,
      statusText: response.statusText,
      headers: {
        'content-type': response.headers.get('content-type'),
        'x-wp-total': response.headers.get('x-wp-total'),
        'x-wp-totalpages': response.headers.get('x-wp-totalpages')
      },
      dataReceived: !!data,
      dataIsArray: Array.isArray(data),
      dataLength: Array.isArray(data) ? data.length : 0,
      firstItem: Array.isArray(data) && data.length > 0 ? {
        id: data[0].id,
        name: data[0].name,
        status: data[0].status
      } : null,
      fullResponse: response.ok && data ? data : null,
      error: !response.ok ? data : null
    };

    if (!response.ok) {
      results.tests.direct_fetch.diagnosis = `API returned ${response.status}. This means credentials may be wrong or API is not accessible.`;
    }

  } catch (error) {
    results.tests.direct_fetch = {
      error: error instanceof Error ? error.message : String(error),
      type: error instanceof Error ? error.name : typeof error
    };
  }

  // Test 3: Try using WooCommerce service
  try {
    const { WooCommerceService } = await import('@/lib/services/woocommerceService');
    const products = await WooCommerceService.getProducts(1);
    results.tests.service_call = {
      success: true,
      count: products.length,
      firstProduct: products.length > 0 ? {
        id: products[0].id,
        name: products[0].name
      } : null
    };
  } catch (error) {
    results.tests.service_call = {
      error: error instanceof Error ? error.message : String(error)
    };
  }

  return NextResponse.json(results);
}
