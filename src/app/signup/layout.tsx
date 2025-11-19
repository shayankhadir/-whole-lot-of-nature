import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

export const metadata = buildPageMetadata({
  title: 'Join Whole Lot of Nature',
  description: 'Create your Whole Lot of Nature profile to unlock curated drops, loyalty perks, and VIP care reminders.',
  path: '/signup',
});

export default function SignupLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
