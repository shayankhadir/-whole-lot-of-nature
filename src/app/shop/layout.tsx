import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

export const metadata = buildPageMetadata({
  title: 'Shop Plants, Soil & Botanical Goods | Whole Lot of Nature',
  description: 'Browse living plants, aquatic ecosystems, organic soil mixes, and herbal care crafted by Whole Lot of Nature.',
  path: '/shop',
  type: 'website',
});

export default function ShopLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
