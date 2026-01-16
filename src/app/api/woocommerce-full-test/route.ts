import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const results = {
    timestamp: new Date().toISOString(),
    environment: {
      WORDPRESS_URL: process.env.WORDPRESS_URL,
      WORDPRESS_API_URL: process.env.WORDPRESS_API_URL,
      WC_CONSUMER_KEY: process.env.WC_CONSUMER_KEY ? '***' + process.env.WC_CONSUMER_KEY.slice(-4) : 'MISSING',
      WC_CONSUMER_SECRET: process.env.WC_CONSUMER_SECRET ? '***' + process.env.WC_CONSUMER_SECRET.slice(-4) : 'MISSING',
    },
    tests: {} as Record<string, any>
  };

  try {
    // Test 1: Direct WooCommerce API call
    console.log('[TEST 1] Attempting direct WooCommerce API call...');
    
    const wpUrl = process.env.WORDPRESS_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://admin.wholelotofnature.com';
    const consumerKey = process.env.WC_CONSUMER_KEY || '';
    const consumerSecret = process.env.WC_CONSUMER_SECRET || '';
    
    if (!consumerKey || !consumerSecret) {
      results.tests.credentials_check = {
        status: 'FAILED',
        message: 'Missing WooCommerce credentials'
      };
    } else {
      // Build OAuth signature
      const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
      
      const productsUrl = `${wpUrl}/wp-json/wc/v3/products?per_page=5&status=publish`;
      
      console.log(`Calling: ${productsUrl}`);
      console.log(`Auth header: Basic ${auth.slice(0, 20)}...`);
      
      const response = await fetch(productsUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        }
      });

      results.tests.direct_api_call = {
        status: response.status,
        statusText: response.statusText,
        url: productsUrl,
        headers: {
          'content-type': response.headers.get('content-type'),
          'x-wp-total': response.headers.get('x-wp-total'),
        }
      };

      const data = await response.json();
      
      if (!response.ok) {
        results.tests.direct_api_call.error = data;
        console.error('[TEST 1] ERROR:', data);
      } else {
        results.tests.direct_api_call.productsCount = Array.isArray(data) ? data.length : 0;
        results.tests.direct_api_call.firstProduct = Array.isArray(data) && data.length > 0 ? {
          id: data[0].id,
          name: data[0].name,
          slug: data[0].slug,
          sku: data[0].sku,
          price: data[0].price,
          stock_status: data[0].stock_status,
          status: data[0].status
        } : null;
      }
    }

    // Test 2: Check WooCommerce REST API availability
    console.log('[TEST 2] Checking WooCommerce REST API...');
    try {
      const wpUrl = process.env.WORDPRESS_URL || 'https://admin.wholelotofnature.com';
      const apiCheck = await fetch(`${wpUrl}/wp-json/wc/v3`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64')}`
        }
      });
      
      results.tests.api_availability = {
        status: apiCheck.status,
        statusText: apiCheck.statusText
      };
    } catch (e) {
      results.tests.api_availability = {
        error: e instanceof Error ? e.message : String(e)
      };
    }

    // Test 3: Check categories
    console.log('[TEST 3] Fetching categories...');
    try {
      const wpUrl = process.env.WORDPRESS_URL || 'https://admin.wholelotofnature.com';
      const auth = Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64');
      
      const catResponse = await fetch(`${wpUrl}/wp-json/wc/v3/products/categories?per_page=5`, {
        headers: {
          'Authorization': `Basic ${auth}`
        }
      });
      
      const catData = await catResponse.json();
      results.tests.categories = {
        status: catResponse.status,
        count: Array.isArray(catData) ? catData.length : 0,
        categories: Array.isArray(catData) ? catData.map((c: any) => ({ id: c.id, name: c.name, slug: c.slug })) : []
      };
    } catch (e) {
      results.tests.categories = {
        error: e instanceof Error ? e.message : String(e)
      };
    }

  } catch (error) {
    results.tests.overall_error = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    };
  }

  return NextResponse.json(results, { status: 200 });
}
