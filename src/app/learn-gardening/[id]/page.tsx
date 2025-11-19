import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  return buildPageMetadata({
    title: 'Learn Gardening Lesson | Whole Lot of Nature',
    description: 'Individual lesson pages now redirect to the Whole Lot of Nature blog archive.',
    path: `/learn-gardening/${params.id}`,
    robots: {
      index: false,
      follow: true,
    },
  });
}

export default function Page() {
  redirect('/blog');
}