import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

export const metadata = buildPageMetadata({
  title: 'Shopping Cart | Whole Lot of Nature',
  description: 'Review your botanical selections, adjust quantities, and continue to Whole Lot of Nature checkout with confidence.',
  path: '/cart',
});

export default function CartLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
