// This file uses inline styles for Next.js OG image generation on the edge runtime
// Linter warnings for inline styles in edge functions are acceptable
// @ts-nocheck
/* no-inline-styles */
import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/lib/api/wordpress';

export const runtime = 'edge';

export const alt = 'Blog Article';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  let post = null;
  
  try {
    post = await getPostBySlug(params.slug);
  } catch {
    post = null;
  }

  if (!post) {
    // Fallback OG image
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0d3512',
            color: '#daf2d0',
          }}
        >
          <div style={{ fontSize: 60, fontWeight: 'bold' }}>Whole Lot of Nature</div>
          <div style={{ fontSize: 30, marginTop: 20 }}>Blog • Plant Care Tips & Guides</div>
        </div>
      ),
      { ...size }
    );
  }

  const title = post.title.rendered.replace(/<[^>]+>/g, '');
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const authorName = post._embedded?.author?.[0]?.name || 'Whole Lot of Nature';
  const date = new Date(post.date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          backgroundColor: '#0d3512',
        }}
      >
        {/* Background Image with Overlay */}
        {featuredImage && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
            }}
          >
            <img
              src={featuredImage}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.3,
              }}
            />
          </div>
        )}

        {/* Content */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 60,
          }}
        >
          {/* Top: Brand & Category */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontSize: 24,
                color: '#86efbe',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: 3,
              }}
            >
              Whole Lot of Nature
            </div>
            <div
              style={{
                padding: '10px 24px',
                backgroundColor: '#22c55e',
                color: 'white',
                borderRadius: 50,
                fontSize: 18,
                fontWeight: 'bold',
              }}
            >
              Blog
            </div>
          </div>

          {/* Center: Title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
              paddingTop: 40,
              paddingBottom: 40,
            }}
          >
            <div
              style={{
                fontSize: 56,
                fontWeight: 'bold',
                color: '#daf2d0',
                lineHeight: 1.2,
                maxWidth: '100%',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {title}
            </div>
          </div>

          {/* Bottom: Author & Date */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              color: '#daf2d0',
            }}
          >
            {/* Author Avatar Placeholder */}
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                backgroundColor: '#22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              {authorName.charAt(0).toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 20, fontWeight: 'bold' }}>{authorName}</div>
              <div style={{ fontSize: 16, color: '#86efbe' }}>{date}</div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
