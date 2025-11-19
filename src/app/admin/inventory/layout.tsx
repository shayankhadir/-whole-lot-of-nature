import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

export const metadata = buildPageMetadata({
  title: 'Inventory Control Console | Whole Lot of Nature',
  description: 'Internal dashboard for syncing WooCommerce products, watching low-stock alerts, and managing fulfillment buffers.',
  path: '/admin/inventory',
  robots: {
    index: false,
    follow: false,
  },
});

export default function InventoryLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
