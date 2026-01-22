import { NextResponse } from 'next/server';
import { woocommerceClient as woocommerce } from '@/lib/services/woocommerceService';
import { cacheKey, CACHE_TTL, withCache } from '@/lib/cache/memoryCache';

// Enable ISR with 10-minute revalidation (categories change less frequently)
export const revalidate = 600;
export const runtime = 'nodejs';

type WCCategory = {
  id: number;
  name: string;
  slug: string;
  parent: number;
  count?: number;
  description?: string;
  image?: unknown;
};

export async function GET() {
  try {
    // Use in-memory cache for categories
    const categories = await withCache(cacheKey.categories(), CACHE_TTL.CATEGORIES, async () => {
      const response = await woocommerce.get('products/categories', {
        per_page: 100,
        hide_empty: true,
      });

      const raw: unknown = response.data;
      const list = Array.isArray(raw) ? (raw as WCCategory[]) : [];
      return list
        .filter(cat => cat.name !== 'Uncategorized' && cat.slug !== 'uncategorized')
        .map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          parent: cat.parent,
          count: cat.count ?? 0,
          description: cat.description ?? '',
          image: cat.image ?? null,
        }));
    });

    const response = NextResponse.json({
      success: true,
      data: categories,
    });

    // Cache for 5 minutes
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return response;

  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch categories',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}