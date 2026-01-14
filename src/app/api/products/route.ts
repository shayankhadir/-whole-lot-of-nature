import { NextRequest, NextResponse } from 'next/server';
import { WooCommerceService } from '@/lib/services/woocommerceService';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const slug = searchParams.get('slug');
    const slugs = searchParams.get('slugs'); // New parameter for multiple slugs
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const perPage = searchParams.get('per_page') ? parseInt(searchParams.get('per_page')!) : undefined;
    const excludeId = searchParams.get('exclude') ? parseInt(searchParams.get('exclude')!) : undefined;
    const relatedTo = searchParams.get('related_to') ? parseInt(searchParams.get('related_to')!) : undefined;

    let products;
    const productLimit = perPage || limit;

    // Log the request
    console.log('[Products API] Request:', {
      slug,
      category,
      search,
      hasWooCommerceConfig: !!(process.env.WC_CONSUMER_KEY && process.env.WC_CONSUMER_SECRET)
    });

    if (relatedTo) {
      // Fetch related products using the dedicated service method
      products = await WooCommerceService.getRelatedProducts(relatedTo, productLimit || 4);
    } else if (slugs) {
      // Fetch multiple products by slugs
      const slugList = slugs.split(',').map(s => s.trim());
      // We'll fetch all products (or a large batch) and filter by slug because WC API doesn't support multiple slugs directly efficiently
      // Alternatively, we can make parallel requests here on the server side which is faster than client side
      const responses = await Promise.all(
        slugList.map(s => WooCommerceService.getProductBySlug(s))
      );
      products = responses.filter(p => p !== null);
    } else if (slug) {
      // Fetch single product by slug directly to ensure we include unpublished/out-of-stock entries
      const product = await WooCommerceService.getProductBySlug(slug);
      products = product ? [product] : [];
    } else if (search) {
      products = await WooCommerceService.searchProducts(search, productLimit);
    } else if (tag) {
      products = await WooCommerceService.getProductsByTag(tag, productLimit);
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const hasKey = !!process.env.WC_CONSUMER_KEY;
    const hasSecret = !!process.env.WC_CONSUMER_SECRET;
    const wpUrl = process.env.WORDPRESS_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL;
    
    console.error('[Products API] Error:', {
      error: errorMessage,
      hasWooCommerceKey: hasKey,
      hasWooCommerceSecret: hasSecret,
      wordPressUrl: wpUrl,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products',
        message: errorMessage,
        details: {
          hasWooCommerceKey: hasKey,
          hasWooCommerceSecret: hasSecret,
          wordPressUrl: wpUrl,
          nodeEnv: process.env.NODE_ENV
        }
      },
      { status: 500 }
    );
  }
}