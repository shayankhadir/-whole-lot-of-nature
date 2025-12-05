import { redirect } from 'next/navigation';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Account | Whole Lot of Nature',
  description: 'Manage your account, view orders, track deliveries, and update your preferences. Your personal gardening dashboard at Whole Lot of Nature.',
  openGraph: {
    title: 'My Account | Whole Lot of Nature',
    description: 'Manage your account, view orders, track deliveries, and update your preferences. Your personal gardening dashboard at Whole Lot of Nature.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
    url: 'https://wholelotofnature.com/account',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Account | Whole Lot of Nature',
    description: 'Manage your account, view orders, track deliveries, and update your preferences. Your personal gardening dashboard at Whole Lot of Nature.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://wholelotofnature.com/account',
  },
};



export const dynamic = 'force-dynamic';

/**
 * Account Page - Redirects to WooCommerce My Account
 * 
 * This simplifies account management by leveraging WooCommerce's built-in
 * account features (orders, downloads, addresses, payment methods, tracking).
 */
export default function AccountPage() {
  // Redirect to WooCommerce my-account page
  const wpAccountUrl = process.env.WORDPRESS_URL || 'https://admin.wholelotofnature.com';
  redirect(`${wpAccountUrl}/my-account`);
}
