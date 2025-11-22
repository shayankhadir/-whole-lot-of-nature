import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

/**
 * On-Demand Revalidation API Route
 * 
 * Triggered by WooCommerce webhooks when products are updated
 * 
 * Setup in WooCommerce:
 * 1. Go to WooCommerce → Settings → Advanced → Webhooks
 * 2. Create webhook with:
 *    - Topic: product.updated or product.created
 *    - Delivery URL: https://yoursite.com/api/revalidate
 *    - Secret: Match REVALIDATE_SECRET env variable
 *    - Payload: {"path": "/products/{{slug}}", "tag": "products"}
 * 
 * Usage:
 * POST /api/revalidate
 * Headers: x-revalidate-secret: your-secret-key
 * Body: { "path": "/products/product-slug", "tag": "products" }
 */
export async function POST(request: NextRequest) {
  try {
    // Verify secret to prevent unauthorized revalidation
    const secret = request.headers.get('x-revalidate-secret');
    const expectedSecret = process.env.REVALIDATE_SECRET;

    if (!expectedSecret) {
      console.error('REVALIDATE_SECRET not configured in environment variables');
      return NextResponse.json(
        { error: 'Revalidation not configured' },
        { status: 500 }
      );
    }

    if (secret !== expectedSecret) {
      console.error('Invalid revalidation secret');
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { path, tag, paths, tags } = body;

    const revalidated: string[] = [];

    // Revalidate specific path(s)
    if (path) {
      await revalidatePath(path);
      revalidated.push(`path: ${path}`);
      console.log(`Revalidated path: ${path}`);
    }

    if (paths && Array.isArray(paths)) {
      for (const p of paths) {
        await revalidatePath(p);
        revalidated.push(`path: ${p}`);
        console.log(`Revalidated path: ${p}`);
      }
    }

    // Revalidate by tag(s)
    if (tag) {
      await revalidateTag(tag);
      revalidated.push(`tag: ${tag}`);
      console.log(`Revalidated tag: ${tag}`);
    }

    if (tags && Array.isArray(tags)) {
      for (const t of tags) {
        await revalidateTag(t);
        revalidated.push(`tag: ${t}`);
        console.log(`Revalidated tag: ${t}`);
      }
    }

    // If no specific path/tag provided, revalidate common routes
    if (!path && !paths && !tag && !tags) {
      await revalidatePath('/shop');
      await revalidatePath('/products');
      await revalidateTag('products');
      revalidated.push('Default routes: /shop, /products');
      console.log('Revalidated default product routes');
    }

    return NextResponse.json({
      success: true,
      revalidated,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error revalidating',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for testing revalidation (development only)
 */
export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'GET endpoint only available in development' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  const tag = searchParams.get('tag');

  if (!path && !tag) {
    return NextResponse.json(
      { error: 'Provide ?path=/your-path or ?tag=your-tag' },
      { status: 400 }
    );
  }

  try {
    if (path) {
      await revalidatePath(path);
      return NextResponse.json({ success: true, revalidated: `path: ${path}` });
    }

    if (tag) {
      await revalidateTag(tag);
      return NextResponse.json({ success: true, revalidated: `tag: ${tag}` });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Revalidation failed', message: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
