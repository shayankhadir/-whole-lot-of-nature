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
    title: `${readableTitle} | Whole Lot of Nature Shop`,
    description: `Explore ${readableTitle} from Whole Lot of Nature with concierge care, artisanal soil mixes, and fast insured delivery in India.`,
    path: `/shop/${params.slug}`,
    type: 'product',
  });
}

export default function ShopProductLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
