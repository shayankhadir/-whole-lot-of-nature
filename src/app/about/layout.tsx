import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

export const metadata = buildPageMetadata({
  title: 'About Whole Lot of Nature | Soil-First Botanical Studio',
  description:
    'Discover our soil-first philosophy, sustainable sourcing standards, and the team bringing regenerative gardening experiences to life in India.',
  path: '/about',
});

export default function AboutLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
