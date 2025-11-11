import { NextResponse } from 'next/server';
import { WooCommerceService } from '@/lib/services/woocommerceService';

export async function GET() {
  try {
    const connectionTest = await WooCommerceService.testConnection();
    
    return NextResponse.json({
      success: connectionTest.success,
      message: connectionTest.message,
      data: connectionTest.data,
      environment: {
        wordpress_url: process.env.WORDPRESS_URL,
        has_consumer_key: !!process.env.WC_CONSUMER_KEY,
        has_consumer_secret: !!process.env.WC_CONSUMER_SECRET,
      }
    });
  } catch (error) {
    console.error('WooCommerce test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to test WooCommerce connection',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}