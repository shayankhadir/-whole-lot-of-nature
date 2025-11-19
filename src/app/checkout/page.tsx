import { redirect } from 'next/navigation';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

export const dynamic = 'force-dynamic';

export const metadata = buildPageMetadata({
  title: 'Checkout | Whole Lot of Nature',
  description: 'Secure checkout for Whole Lot of Nature plants, soil systems, and botanical essentials.',
  path: '/checkout',
  robots: {
    index: false,
    follow: false,
  },
});

export default function CheckoutRedirect() {
  // Your checkout URL is at https://wholelotofnature.com/checkout
  const checkoutUrl = 'https://wholelotofnature.com/checkout';
  redirect(checkoutUrl);
}
