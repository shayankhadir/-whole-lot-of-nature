import { redirect } from 'next/navigation';

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
