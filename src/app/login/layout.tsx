import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

export const metadata = buildPageMetadata({
  title: 'Login | Whole Lot of Nature',
  description: 'Sign in to resume shopping, access concierge care resources, and manage Whole Lot of Nature subscriptions.',
  path: '/login',
});

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
