import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const results: any = {
      timestamp: new Date().toISOString(),
      environment: {
        WORDPRESS_URL: process.env.WORDPRESS_URL || 'NOT SET',
        WORDPRESS_API_URL: process.env.WORDPRESS_API_URL || 'NOT SET',
        WC_CONSUMER_KEY: process.env.WC_CONSUMER_KEY ? '***SET***' : 'NOT SET',
        WC_CONSUMER_SECRET: process.env.WC_CONSUMER_SECRET ? '***SET***' : 'NOT SET',
        NODE_ENV: process.env.NODE_ENV
      },
      tests: {} as Record<string, any>
    };

    // Get environment variables
    const wpUrl = process.env.WORDPRESS_URL || 'https://admin.wholelotofnature.com';
    const consumerKey = process.env.WC_CONSUMER_KEY || '';
    const consumerSecret = process.env.WC_CONSUMER_SECRET || '';

    results.environment.WORDPRESS_URL = wpUrl;
    
    if (!consumerKey || !consumerSecret) {
      results.tests.credentials_check = {
        status: 'FAILED',
        message: 'Missing WooCommerce credentials',
        hasKey: !!consumerKey,
        hasSecret: !!consumerSecret
      };
      return NextResponse.json(results);
    }

    results.tests.credentials_check = {
      status: 'OK',
      message: 'Credentials present',
      hasKey: true,
      hasSecret: true
    };

    try {
      // Test 1: Direct WooCommerce API call
      console.log('[TEST 1] Attempting to fetch products...');
      
      const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
      const productsUrl = `${wpUrl}/wp-json/wc/v3/products?per_page=5&status=publish`;

      console.log(`Calling: ${productsUrl}`);

      const response = await fetch(productsUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        }
      });

      console.log(`Response status: ${response.status}`);

      results.tests.direct_api_call = {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: {
          'content-type': response.headers.get('content-type'),
          'x-wp-total': response.headers.get('x-wp-total'),
        }
      };

      const data = await response.json();
      
      if (!response.ok) {
        results.tests.direct_api_call.error = data;
        results.tests.direct_api_call.message = 'API returned error';
      } else {
        const productsArray = Array.isArray(data) ? data : [];
        results.tests.direct_api_call.productsCount = productsArray.length;
        
        if (productsArray.length > 0) {
          results.tests.direct_api_call.firstProduct = {
            id: productsArray[0].id,
            name: productsArray[0].name,
            slug: productsArray[0].slug,
            sku: productsArray[0].sku,
            price: productsArray[0].price,
            stock_status: productsArray[0].stock_status,
            status: productsArray[0].status,
            image: productsArray[0].images?.[0]?.src
          };
        } else {
          results.tests.direct_api_call.message = 'No products found in WooCommerce';
        }
      }

    } catch (fetchError: unknown) {
      console.error('[TEST 1] Fetch error:', fetchError);
      results.tests.direct_api_call = {
        status: 'ERROR',
        message: fetchError instanceof Error ? fetchError.message : String(fetchError)
      };
    }

    // Test 2: Check if WordPress is responding
    try {
      console.log('[TEST 2] Checking WordPress availability...');
      const wpResponse = await fetch(`${wpUrl}/wp-json/`);
      
      results.tests.wordpress_check = {
        status: wpResponse.status,
        reachable: wpResponse.ok
      };
    } catch (e: unknown) {
      results.tests.wordpress_check = {
        error: e instanceof Error ? e.message : 'Unknown error',
        reachable: false
      };
    }

    return NextResponse.json(results);

  } catch (error: unknown) {
    console.error('[ENDPOINT ERROR]', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Endpoint error',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
