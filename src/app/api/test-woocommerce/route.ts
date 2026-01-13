import { NextResponse } from 'next/server';
import { WooCommerceService } from '@/lib/services/woocommerceService';

export async function GET() {
  try {
    console.log('Testing WooCommerce connection from API route...');

    // Test the connection
    const testResult = await WooCommerceService.testConnection();

    if (testResult.success) {
      // Try to fetch a few products
      const products = await WooCommerceService.getProducts(5);

      return NextResponse.json({
        success: true,
        message: 'WooCommerce connection successful',
        productsCount: products.length,
        sampleProducts: products.slice(0, 2).map(p => ({
          id: p.id,
          name: p.name,
          price: p.price
        }))
      });
    } else {
      return NextResponse.json({
        success: false,
        message: testResult.message,
        error: testResult.data
      }, { status: 500 });
    }
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: (error as Error).message
    }, { status: 500 });
  }
}
