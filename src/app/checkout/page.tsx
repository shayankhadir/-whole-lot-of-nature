import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function CheckoutRedirect() {
  // Your checkout URL is at https://wholelotofnature.com/checkout
  const checkoutUrl = 'https://wholelotofnature.com/checkout';
  redirect(checkoutUrl);
}
