import { NextRequest, NextResponse } from 'next/server';
import { WooCommerceService } from '@/lib/services/woocommerceService';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const slug = searchParams.get('slug');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const perPage = searchParams.get('per_page') ? parseInt(searchParams.get('per_page')!) : undefined;
    const excludeId = searchParams.get('exclude') ? parseInt(searchParams.get('exclude')!) : undefined;
    const relatedTo = searchParams.get('related_to') ? parseInt(searchParams.get('related_to')!) : undefined;

    let products;
    const productLimit = perPage || limit;

    if (relatedTo) {
      // Fetch related products using the dedicated service method
      products = await WooCommerceService.getRelatedProducts(relatedTo, productLimit || 4);
    } else if (slug) {
      // Fetch single product by slug directly to ensure we include unpublished/out-of-stock entries
      const product = await WooCommerceService.getProductBySlug(slug);
      products = product ? [product] : [];
    } else if (search) {
      products = await WooCommerceService.searchProducts(search, productLimit);
    } else if (category) {
      // Category can be either a slug or an ID
      const isNumeric = /^\d+$/.test(category);
      if (isNumeric) {
        // It's a category ID - fetch products by category ID
        const categoryId = parseInt(category);
        products = await WooCommerceService.getProducts(productLimit || 100);
        products = products.filter(p => p.categories.some(c => c.id === categoryId));
      } else {
        // It's a category slug
        products = await WooCommerceService.getProductsByCategory(category, productLimit);
      }
    } else {
      products = await WooCommerceService.getProducts(productLimit);
    }

    // Exclude a specific product ID if requested (useful for related products)
    if (excludeId && products) {
      products = products.filter(p => p.id !== excludeId);
    }

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    });

  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}