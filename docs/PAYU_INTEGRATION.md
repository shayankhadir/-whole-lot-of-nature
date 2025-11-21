# PayU Integration Guide

Follow these steps to enable UPI/cards inside WooCommerce with zero-downtime testing.

## 1. Prerequisites

- PayU Business account with Test + Production credentials.
- WordPress admin + SFTP access.
- Sandbox card numbers from PayU docs.

## 2. Install plugin

1. WordPress Dashboard → Plugins → Add New → search **"PayU India"** (official plugin) or upload the ZIP from PayU.
2. Activate the plugin and verify it adds a payment gateway under WooCommerce → Settings → Payments.

## 3. Configure credentials

WooCommerce → Settings → Payments → **PayU**:

| Field | Value |
| --- | --- |
| Merchant Key | `PAYU_MERCHANT_KEY` |
| Merchant Salt | `PAYU_MERCHANT_SALT` |
| Auth Header | `PAYU_AUTH_HEADER` (if PayU provided for APIs) |
| Success URL | `https://wholelotofnature.com/wc-api/WC_Gateway_Payu/` |
| Failure URL | Same as success or custom thank-you page |
| Test Mode | Enabled until you finish sandbox checks |

Store the values in two places:

1. WordPress `.env` (if using Bedrock or similar) or inside `wp-config.php` constants.
2. Vercel/Netlify environment variables (for any future server-side validation):
   - `PAYU_MERCHANT_KEY`
   - `PAYU_MERCHANT_SALT`
   - `PAYU_AUTH_HEADER`

## 4. Sandbox runbook

1. Enable **Test Mode** inside the PayU gateway.
2. Place an order on staging with a low-priced product.
3. Use the sandbox card (e.g., `5123456789012346`, expiry `05/30`, CVV `123`, OTP `123456`).
4. Confirm WooCommerce order status flips to *processing* and that PayU dashboard registers the transaction.
5. Issue a refund from WooCommerce and verify PayU dashboard reflects it.

Record screenshots of each step for compliance.

## 5. Go-live checklist

- Disable Test Mode and paste production credentials.
- Update webhook URL on the PayU dashboard to `https://wholelotofnature.com/wc-api/WC_Gateway_Payu/`.
- Place a ₹1 test order with UPI (self) to confirm funds settle.
- Update `docs/ENVIRONMENT_VARIABLES.md` status from **Pending** → **Set**.
- Inform accounting to reconcile PayU payouts with WooCommerce orders.

## 6. Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Security Error` on checkout | Ensure server time matches IST and that Merchant Key/Salt are correct. |
| Orders stay in `pending payment` | PayU IPN blocked—whitelist PayU IPs or confirm webhook URL. |
| Double charges | Enable PayU duplicate-check setting and ensure Woo order numbers remain unique. |

Escalate to PayU support with the `mihpayid` (returned in webhook payloads) if payments fail silently.
