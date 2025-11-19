import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

export const metadata = buildPageMetadata({
  title: 'Sign In | Whole Lot of Nature',
  description: 'Log into Whole Lot of Nature to access saved carts, rewards, concierge plant care, and faster checkout.',
  path: '/auth/signin',
});

export default function SignInLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
