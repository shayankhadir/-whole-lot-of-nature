import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

export const metadata = buildPageMetadata({
  title: 'Create an Account | Whole Lot of Nature',
  description: 'Sign up for tailored plant recommendations, member-only combos, and delivery updates from Whole Lot of Nature.',
  path: '/auth/signup',
});

export default function AuthSignupLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
