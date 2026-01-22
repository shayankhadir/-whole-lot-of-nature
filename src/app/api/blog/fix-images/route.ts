/**
 * Fix blog posts with missing images by adding featured images and hero image blocks.
 */

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

function verifyAdmin(request: NextRequest): boolean {
  const adminKey = request.headers.get('x-admin-key');
  return adminKey === process.env.ADMIN_SECRET_KEY;
}

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const limit = Math.min(Math.max(Number(body.limit || 10), 1), 30);

    const siteUrl = (process.env.WORDPRESS_SITE_URL || process.env.WORDPRESS_URL || '').replace(/\/$/, '');
    const username = process.env.WORDPRESS_USERNAME;
    const password = process.env.WORDPRESS_PASSWORD || process.env.WORDPRESS_APP_PASSWORD?.replace(/ /g, '');

    if (!siteUrl || !username || !password) {
      return NextResponse.json({ success: false, error: 'WordPress credentials missing' }, { status: 400 });
    }

    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
    const baseUrl = `${siteUrl}/wp-json/wp/v2`;

    const response = await axios.get(`${baseUrl}/posts`, {
      params: { per_page: limit, status: 'publish', _embed: true },
      headers: { Authorization: authHeader },
    });

    const posts: Array<{ id: number; title: { rendered: string }; content: { rendered: string }; featured_media: number }> = response.data;

    const results: Array<{ id: number; updated: boolean; reason?: string }> = [];

    for (const post of posts) {
      const hasFeatured = post.featured_media && post.featured_media !== 0;
      const hasImage = /<img\s/i.test(post.content?.rendered || '');

      if (hasFeatured && hasImage) {
        results.push({ id: post.id, updated: false, reason: 'Already has image' });
        continue;
      }

      const titleText = post.title?.rendered?.replace(/<[^>]*>/g, '') || 'plant care';
      const imageUrl = `https://source.unsplash.com/1200x800/?${encodeURIComponent(titleText)}`;

      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const uploadResponse = await axios.post(
        `${baseUrl}/media`,
        imageResponse.data,
        {
          headers: {
            Authorization: authHeader,
            'Content-Type': 'image/jpeg',
            'Content-Disposition': `attachment; filename="${titleText.replace(/[^a-z0-9]/gi, '-')}.jpg"`,
          },
        }
      );

      const mediaId = uploadResponse.data.id;
      const mediaUrl = uploadResponse.data.source_url;

      let updatedContent = post.content?.rendered || '';
      if (!hasImage) {
        const heroBlock = `<figure class="wp-block-image"><img src="${mediaUrl}" alt="${titleText}" /></figure>`;
        updatedContent = `${heroBlock}\n${updatedContent}`;
      }

      await axios.post(
        `${baseUrl}/posts/${post.id}`,
        { content: updatedContent, featured_media: mediaId },
        { headers: { Authorization: authHeader } }
      );

      results.push({ id: post.id, updated: true });
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('[Blog Fix Images] Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update blog images' }, { status: 500 });
  }
}
