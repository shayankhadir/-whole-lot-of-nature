/**
 * API Route: List Blog Posts
 * Endpoint: GET /api/blog/list
 * Returns all blog posts from WordPress
 */

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

const DEFAULT_WORDPRESS_URL = 'https://admin.wholelotofnature.com';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(Number(searchParams.get('page') ?? '1'), 1);
    const perPage = Math.min(Math.max(Number(searchParams.get('perPage') ?? '20'), 1), 100);
    const status = searchParams.get('status') ?? 'publish';
    const searchTerm = searchParams.get('search') ?? undefined;
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const slug = searchParams.get('slug');

    const siteUrl = (process.env.WORDPRESS_SITE_URL || process.env.WORDPRESS_URL || DEFAULT_WORDPRESS_URL).replace(/\/$/, '');
    const baseUrl = `${siteUrl}/wp-json/wp/v2`;
    const username = process.env.WORDPRESS_USERNAME;
    const password = process.env.WORDPRESS_PASSWORD || process.env.WORDPRESS_APP_PASSWORD?.replace(/ /g, '');

    const hasAuth = Boolean(username && password);
    const authHeader = hasAuth ? `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}` : undefined;

    const params: Record<string, string | number | boolean | undefined> = {
      per_page: perPage,
      page,
      status: hasAuth ? status : undefined,
      search: searchTerm,
      categories: category || undefined,
      tags: tag || undefined,
      slug: slug || undefined,
      _embed: true,
  context: 'view',
    };

    const response = await axios.get(`${baseUrl}/posts`, {
      params,
      headers: authHeader
        ? {
            Authorization: authHeader,
          }
        : undefined,
    });

    const posts = Array.isArray(response.data)
      ? response.data.map((post: {
          id: number;
          title: { rendered: string };
          slug: string;
          excerpt: { rendered: string };
          status: string;
          date: string;
          modified: string;
          link: string;
          categories: number[];
          tags: number[];
          featured_media: number;
          _embedded?: {
            'wp:featuredmedia'?: Array<{ source_url: string }>;
            author?: Array<{ name: string }>;
          };
        }) => ({
          id: post.id,
          title: post.title?.rendered ?? '',
          slug: post.slug,
          excerpt: post.excerpt?.rendered ?? '',
          status: post.status,
          date: post.date,
          modified: post.modified,
          link: post.link,
          categories: post.categories ?? [],
          tags: post.tags ?? [],
          featured_media: post.featured_media,
          featured_image_url: post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null,
          author: post._embedded?.author?.[0]?.name ?? null,
        }))
      : [];

    return NextResponse.json({
      success: true,
      posts,
      pagination: {
        page,
        perPage,
        total: Number(response.headers['x-wp-total'] ?? posts.length),
        totalPages: Number(response.headers['x-wp-totalpages'] ?? 1),
      },
      filters: {
        status,
        search: searchTerm ?? null,
        category: category ?? null,
        tag: tag ?? null,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error('Error fetching posts:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorDetails = (error as any).response?.data;
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}
