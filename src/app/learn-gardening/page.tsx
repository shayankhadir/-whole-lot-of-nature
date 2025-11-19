import { redirect } from 'next/navigation';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

export const metadata = buildPageMetadata({
  title: 'Learn Gardening | Whole Lot of Nature',
  description: 'Our gardening lessons now live on the Whole Lot of Nature blog. You will be redirected automatically.',
  path: '/learn-gardening',
  robots: {
    index: false,
    follow: true,
  },
});

export default function Page() {
  redirect('/blog');
}