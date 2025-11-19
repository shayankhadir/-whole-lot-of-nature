import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

export const metadata = buildPageMetadata({
  title: 'Plant Combos & Bundles | Whole Lot of Nature',
  description: 'Shop curated plant bundles that pair foliage, soil systems, and planters for effortless styling and better value.',
  path: '/combos',
});

export default function CombosLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
