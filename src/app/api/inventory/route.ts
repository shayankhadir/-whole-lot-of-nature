import { NextRequest, NextResponse } from 'next/server';
import { WooCommerceService } from '@/lib/services/woocommerceService';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Fetch all products from WooCommerce
    const products = await WooCommerceService.getProducts(100);

    // Calculate statistics
    const stats = {
      total_products: products.length,
      in_stock: products.filter((p) => p.in_stock && p.stock_quantity > 5).length,
      out_of_stock: products.filter((p) => !p.in_stock || p.stock_quantity === 0).length,
      low_stock: products.filter((p) => p.in_stock && p.stock_quantity > 0 && p.stock_quantity <= 5).length,
      last_synced: new Date().toISOString(),
    };

    // Format products for inventory display
    const inventoryProducts = products.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      stock_quantity: p.stock_quantity,
      in_stock: p.in_stock,
      price: p.price,
      categories: p.categories,
      image_url: p.images?.[0]?.src,
    }));

    return NextResponse.json({
      success: true,
      products: inventoryProducts,
      stats,
    });
  } catch (error) {
    console.error('Inventory API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch inventory',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
