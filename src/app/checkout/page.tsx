import { redirect } from 'next/navigation';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Secure Checkout | Whole Lot of Nature',
  description: 'Complete your plant purchase with our secure checkout. Fast delivery across Bangalore. Expert packaging ensures your plants arrive healthy.',
  openGraph: {
    title: 'Secure Checkout | Whole Lot of Nature',
    description: 'Complete your plant purchase with our secure checkout. Fast delivery across Bangalore. Expert packaging ensures your plants arrive healthy.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
    url: 'https://wholelotofnature.com/checkout',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Secure Checkout | Whole Lot of Nature',
    description: 'Complete your plant purchase with our secure checkout. Fast delivery across Bangalore. Expert packaging ensures your plants arrive healthy.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://wholelotofnature.com/checkout',
  },
};



export const dynamic = 'force-dynamic';

export default function CheckoutRedirect() {
  // Your checkout URL is at https://wholelotofnature.com/checkout
  const checkoutUrl = 'https://wholelotofnature.com/checkout';
  redirect(checkoutUrl);
}
