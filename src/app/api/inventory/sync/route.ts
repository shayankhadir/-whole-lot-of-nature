import { NextRequest, NextResponse } from 'next/server';
import { WooCommerceService } from '@/lib/services/woocommerceService';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    console.log('Starting inventory sync from WordPress/WooCommerce...');

    // Fetch all products from WooCommerce
    const products = await WooCommerceService.getProducts(100);

    if (!products || products.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No products found in WooCommerce',
        },
        { status: 404 }
      );
    }

    console.log(`✅ Synced ${products.length} products from WooCommerce`);

    // Calculate statistics
    const stats = {
      total_products: products.length,
      in_stock: products.filter((p) => p.in_stock && p.stock_quantity > 5).length,
      out_of_stock: products.filter((p) => !p.in_stock || p.stock_quantity === 0).length,
      low_stock: products.filter((p) => p.in_stock && p.stock_quantity > 0 && p.stock_quantity <= 5).length,
      synced_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${products.length} products from WordPress`,
      stats,
      products_count: products.length,
    });
  } catch (error) {
    console.error('Inventory sync error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sync inventory',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
