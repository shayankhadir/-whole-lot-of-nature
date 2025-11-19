import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

const toTitle = (slug: string) =>
  slug
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');

type LayoutParams = {
  params: { slug: string };
};

export function generateMetadata({ params }: LayoutParams): Metadata {
  const readableTitle = toTitle(params.slug);
  return buildPageMetadata({
    title: `${readableTitle} | Whole Lot of Nature Blog`,
    description: `Read ${readableTitle} on the Whole Lot of Nature journal for actionable plant care lessons and sustainable gardening ideas.`,
    path: `/blog/${params.slug}`,
    type: 'article',
  });
}

export default function BlogPostLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
