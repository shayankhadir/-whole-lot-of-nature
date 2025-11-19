import { NextResponse } from 'next/server';
import { woocommerceClient as woocommerce } from '@/lib/services/woocommerceService';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type WCTag = {
  id: number;
  name: string;
  slug: string;
  count?: number;
  description?: string;
};

export async function GET() {
  try {
    const response = await woocommerce.get('products/tags', {
      per_page: 100,
      orderby: 'count',
      order: 'desc',
      hide_empty: true,
    });

    const raw: unknown = response.data;
    const list = Array.isArray(raw) ? (raw as WCTag[]) : [];
    const tags = list.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      count: tag.count ?? 0,
      description: tag.description ?? '',
    }));

    return NextResponse.json({
      success: true,
      data: tags,
    });

  } catch (error) {
    console.error('Tags API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch tags',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
