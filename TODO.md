# WooCommerce Integration Fix

## Issue Identified
The WooCommerce connection is failing because the `WORDPRESS_URL` environment variable is set to `https://www.admin.wholelotofnature.com`, which doesn't resolve (ENOTFOUND error).

## Solution Required
Update the `WORDPRESS_URL` environment variable in your `.env.local` file from:
```
WORDPRESS_URL=https://admin.wholelotofnature.com
```

To:
```
WORDPRESS_URL=https://wholelotofnature.com
```

## Steps to Complete
1. Open `.env.local` file
2. Change `WORDPRESS_URL=https://www.admin.wholelotofnature.com` to `WORDPRESS_URL=https://wholelotofnature.com`
3. Save the file
4. Restart your development server
5. Run `node test-woocommerce-connection.js` to verify the connection works

## Code Changes Made
- Updated the fallback URL in `src/lib/services/woocommerceService.ts` from `https://admin.wholelotofnature.com` to `https://wholelotofnature.com` (this only applies when env var is not set)

## Testing
After updating the environment variable, run the test script to confirm the connection works.
