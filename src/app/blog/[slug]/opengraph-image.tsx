/* eslint-disable */
// This file uses inline styles for Next.js OG image generation on the edge runtime
// @ts-nocheck
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
        <div tw="h-full w-full flex flex-col items-center justify-center bg-[#0d3512] text-[#daf2d0]">
          <div tw="text-[60px] font-bold">Whole Lot of Nature</div>
          <div tw="text-[30px] mt-5">Blog • Plant Care Tips & Guides</div>
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
      <div tw="h-full w-full flex bg-[#0d3512]">
        {/* Background Image with Overlay */}
        {featuredImage && (
          <div tw="absolute inset-0 flex">
            <img
              src={featuredImage}
              alt=""
              tw="w-full h-full object-cover opacity-30"
            />
          </div>
        )}

        {/* Content */}
        <div tw="relative w-full h-full flex flex-col justify-between p-[60px]">
          {/* Top: Brand & Category */}
          <div tw="flex items-center justify-between">
            <div tw="text-[24px] text-[#86efbe] font-bold uppercase tracking-[3px]">
              Whole Lot of Nature
            </div>
            <div tw="px-6 py-2.5 bg-[#22c55e] text-white rounded-full text-[18px] font-bold">
              Blog
            </div>
          </div>

          {/* Center: Title */}
          <div tw="flex flex-col justify-center flex-1 py-10">
            <div tw="text-[56px] font-bold text-[#daf2d0] leading-tight">
              {title}
            </div>
          </div>

          {/* Bottom: Author & Date */}
          <div tw="flex items-center gap-5 text-[#daf2d0]">
            {/* Author Avatar Placeholder */}
            <div tw="w-[50px] h-[50px] rounded-full bg-[#22c55e] flex items-center justify-center text-[24px] font-bold text-white">
              {authorName.charAt(0).toUpperCase()}
            </div>
            <div tw="flex flex-col">
              <div tw="text-[20px] font-bold">{authorName}</div>
              <div tw="text-[16px] text-[#86efbe]">{date}</div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
