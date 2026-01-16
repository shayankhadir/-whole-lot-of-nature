import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const results: any = {
    timestamp: new Date().toISOString(),
    environment: {
      WORDPRESS_URL: process.env.WORDPRESS_URL || 'NOT SET',
      WC_CONSUMER_KEY: process.env.WC_CONSUMER_KEY ? '***SET***' : 'NOT SET',
      WC_CONSUMER_SECRET: process.env.WC_CONSUMER_SECRET ? '***SET***' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV
    },
    tests: {},
    errors: []
  };

  try {
    const wpUrl = process.env.WORDPRESS_URL || 'https://admin.wholelotofnature.com';
    const consumerKey = process.env.WC_CONSUMER_KEY;
    const consumerSecret = process.env.WC_CONSUMER_SECRET;

    // Check credentials
    if (!consumerKey || !consumerSecret) {
      results.tests.credentials_check = {
        status: 'FAILED',
        hasKey: !!consumerKey,
        hasSecret: !!consumerSecret
      };
      return NextResponse.json(results);
    }

    results.tests.credentials_check = { status: 'OK' };

    // Test 1: Basic WordPress check
    try {
      const wpResponse = await fetch(`${wpUrl}/wp-json/`);
      results.tests.wordpress_ping = {
        status: wpResponse.status,
        ok: wpResponse.ok
      };
    } catch (e) {
      results.errors.push(`WordPress ping failed: ${e instanceof Error ? e.message : String(e)}`);
      results.tests.wordpress_ping = { status: 'ERROR' };
    }

    // Test 2: Direct WooCommerce API call
    try {
      const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
      const productsUrl = `${wpUrl}/wp-json/wc/v3/products?per_page=5&status=publish`;

      const response = await fetch(productsUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        }
      });

      results.tests.direct_api_call = {
        status: response.status,
        ok: response.ok,
        contentType: response.headers.get('content-type'),
        xWpTotal: response.headers.get('x-wp-total'),
      };

      let data;
      try {
        data = await response.json();
      } catch (parseErr) {
        results.tests.direct_api_call.parseError = parseErr instanceof Error ? parseErr.message : 'Failed to parse JSON';
        data = null;
      }

      if (response.ok && data) {
        const productsArray = Array.isArray(data) ? data : [];
        results.tests.direct_api_call.productsCount = productsArray.length;
        
        if (productsArray.length > 0) {
          results.tests.direct_api_call.firstProduct = {
            id: productsArray[0].id,
            name: productsArray[0].name
          };
        } else {
          results.tests.direct_api_call.message = 'No products found in WooCommerce';
        }
      } else if (!response.ok && data) {
        results.tests.direct_api_call.errorData = data;
      }
    } catch (fetchError: unknown) {
      results.errors.push(`API call failed: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`);
      results.tests.direct_api_call = { status: 'ERROR' };
    }

    return NextResponse.json(results);
  } catch (error: unknown) {
    return NextResponse.json(
      { 
        error: 'Endpoint error',
        message: error instanceof Error ? error.message : String(error),
        errors: [error instanceof Error ? error.message : String(error)]
      },
      { status: 500 }
    );
  }
}
