import { NextRequest, NextResponse } from 'next/server';
import { WooCommerceService } from '@/lib/services/woocommerceService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const wpUrl = process.env.WORDPRESS_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL;
    const hasKey = !!process.env.WC_CONSUMER_KEY;
    const hasSecret = !!process.env.WC_CONSUMER_SECRET;

    console.log('[WooCommerce Debug]', {
      wordPressUrl: wpUrl,
      hasWooCommerceKey: hasKey,
      hasWooCommerceSecret: hasSecret,
      nodeEnv: process.env.NODE_ENV
    });

    // Try to fetch products
    try {
      const products = await WooCommerceService.getProducts(5);
      return NextResponse.json({
        success: true,
        message: 'WooCommerce connection successful',
        productsFetched: products.length,
        firstProduct: products[0] || null,
        config: {
          wordPressUrl: wpUrl,
          hasWooCommerceKey: hasKey,
          hasWooCommerceSecret: hasSecret
        }
      });
    } catch (fetchError) {
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch products',
        error: fetchError instanceof Error ? fetchError.message : 'Unknown error',
        config: {
          wordPressUrl: wpUrl,
          hasWooCommerceKey: hasKey,
          hasWooCommerceSecret: hasSecret,
          nodeEnv: process.env.NODE_ENV
        }
      });
    }
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
