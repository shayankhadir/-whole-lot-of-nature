import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

export const metadata = buildPageMetadata({
  title: 'Wishlist | Whole Lot of Nature',
  description: 'Save your favorite plants, soil systems, and botanicals so you can return and check out when you are ready.',
  path: '/wishlist',
});

export default function WishlistLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
