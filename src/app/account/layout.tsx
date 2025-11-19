import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

export const metadata = buildPageMetadata({
  title: 'Account Sign In & Orders | Whole Lot of Nature',
  description:
    'Securely access your Whole Lot of Nature account to review orders, track deliveries, and manage membership preferences.',
  path: '/account',
});

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
