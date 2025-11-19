import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

const CATEGORY_TITLES: Record<number, string> = {
  1: 'Growing Tips',
  2: 'Organic Gardening',
  3: 'Sustainability',
  4: 'Community Stories',
};

const CATEGORY_DESCRIPTIONS: Record<number, string> = {
  1: 'Expert propagation, soil, and care guides for resilient indoor and outdoor plants.',
  2: 'Chemical-free gardening frameworks, composting, and regenerative soil practices.',
  3: 'Climate-positive gardening workflows, water stewardship, and zero-waste routines.',
  4: 'Stories from the Whole Lot of Nature community and the makers behind our botanicals.',
};

type LayoutParams = {
  params: { categoryId: string };
};

export function generateMetadata({ params }: LayoutParams): Metadata {
  const categoryId = Number(params.categoryId);
  const title = CATEGORY_TITLES[categoryId] || 'Whole Lot of Nature Blog';
  const description = CATEGORY_DESCRIPTIONS[categoryId] || 'Browse curated gardening stories from Whole Lot of Nature.';

  return buildPageMetadata({
    title: `${title} Articles | Whole Lot of Nature Blog`,
    description,
    path: `/blog/old-categoryId-backup/${params.categoryId}`,
    type: 'article',
  });
}

export default function LegacyBlogCategoryLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
