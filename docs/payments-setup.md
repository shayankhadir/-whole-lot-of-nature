# Payments Setup Options

You have two reliable paths to enable payments quickly:

## Option A: Use WooCommerce Checkout (Recommended for speed)
- Keep products and checkout on WordPress/WooCommerce.
- The Next.js site handles browsing, cart UI, and then redirects to your WooCommerce `/checkout`.
- Pros: Uses your existing PayU Woo plugin, taxes/shipping/coupons are native, less engineering.
- Cons: Checkout UX is on WordPress; cross-domain cart syncing requires a bridge if you want server-side carts.

### Steps
1. Ensure WooCommerce + PayU plugin are configured and testable on WordPress.
2. Create a dedicated Checkout page on WP: `/checkout`.
3. From Next.js, on “Buy Now” or “Checkout”, redirect users to `/checkout`.
4. (Optional) Use Woo REST to pre-create a cart / checkout session for tighter integration.

## Option B: Direct PayU Integration in Next.js (Advanced)
- Build a Next.js API route that creates PayU orders and returns a payment form or redirect URL.
- Pros: Full control over checkout UX; fewer context switches.
- Cons: More engineering effort; maintain PCI best practices and server secrets.

### Steps
1. Get PayU merchant key/secret and test sandbox.
2. Create server routes: `/api/payments/payu/create` and `/api/payments/payu/verify`.
3. Render a payment form or redirect to PayU; verify signature in webhook/return route.
4. On success, create WooCommerce order via REST for inventory/tax reporting.

## Environment Variables (Woo REST)
- `WP_BASE_URL` (e.g., https://yourwordpress.com)
- `WC_CONSUMER_KEY`
- `WC_CONSUMER_SECRET`

## Notes
- For fastest launch, use Option A and polish the WP checkout theme.
- We’ve added a coupon UI on the Next.js cart; wire it to Woo REST when keys are available for live validation.
