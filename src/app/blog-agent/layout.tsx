import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

export const metadata = buildPageMetadata({
  title: 'Marketing Automation Lab | Whole Lot of Nature',
  description: 'Internal console for trend tracking, blog generation, and campaign automation workflows.',
  path: '/blog-agent',
  robots: {
    index: false,
    follow: false,
  },
});

export default function BlogAgentLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
