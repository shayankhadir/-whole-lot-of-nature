import { redirect } from 'next/navigation';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gardening Classes & Workshops | Whole Lot of Nature',
  description: 'Join our gardening workshops and classes in Bangalore. Learn plant care, sustainable gardening, and create your own urban garden with expert guidance.',
  openGraph: {
    title: 'Gardening Classes & Workshops | Whole Lot of Nature',
    description: 'Join our gardening workshops and classes in Bangalore. Learn plant care, sustainable gardening, and create your own urban garden with expert guidance.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
    url: 'https://wholelotofnature.com/learn-gardening',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gardening Classes & Workshops | Whole Lot of Nature',
    description: 'Join our gardening workshops and classes in Bangalore. Learn plant care, sustainable gardening, and create your own urban garden with expert guidance.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://wholelotofnature.com/learn-gardening',
  },
};



export default function Page() {
  redirect('/blog');
}