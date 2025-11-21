# WooCommerce Shipping Automation Guide

Use this handbook to finish the three priority items blocking checkout accuracy: product weights, stepped shipping fees, and India Post tracking alerts.

## 1. Product weight classes

1. Install **Product Bulk Editor** (optional) or run the new script:
   ```bash
   # Preview without saving
   DRY_RUN=true npm run woo:weights

   # Apply updates to live WooCommerce
   npm run woo:weights
   ```
2. The script infers weights + evergreen SEO tags using categories:
   - Soil mixes, compost, fertilizers → **3.5 kg**
   - Aquatic plants & pond life → **2.1 kg**
   - Indoor foliage, herbs, apothecary → **1.2 kg**
   - Outdoor shrubs / native plants → **1.8 kg**
   - Succulents & cacti → **0.4 kg**
   - Miniatures, decor, digital goods → **0.2 kg**
3. Review edge cases manually (oversized planters, combo bundles) and override inside WooCommerce → Product → Shipping tab.

> **Tip:** keep every product weight to one decimal place so the surcharge logic stays consistent.

### Validate shipping math locally

Use the CLI simulator before editing Woo settings:

```
npm run woo:shipping:simulate -- --subtotal=1049 --weight=6
```

The output mirrors the rules below so you can screenshot results for the operations team.

## 2. Shipping rules (India zone)

### Flat rate + free shipping
1. WooCommerce → Settings → Shipping → Zones → **India**.
2. Add/rename methods:
   - `Flat Rate` → label **Standard Shipping (< ₹999)** with cost `79`.
   - `Free Shipping` → label **Free Green Shipping** and set `Minimum order amount` to `999`.

### Weight surcharge snippet
Add this snippet via the **Code Snippets** plugin or your child theme’s `functions.php` to stack a ₹29 fee when cart weight exceeds 5 kg.

```php
add_action('woocommerce_cart_calculate_fees', function () {
    if (is_admin() && !defined('DOING_AJAX')) {
        return;
    }

    $threshold_kg = 5;
    $surcharge = 29;
    $cart_weight = WC()->cart->get_cart_contents_weight();

    if ($cart_weight > $threshold_kg) {
        WC()->cart->add_fee(__('Heavy Order Handling', 'whole-lot-of-nature'), $surcharge, true, 'standard');
    }
}, 20);
```

Test matrix:
- Cart ₹800 / 3 kg → ₹79 only
- Cart ₹1200 / 4 kg → ₹0 (free shipping)
- Cart ₹1049 / 6 kg → ₹29 surcharge (even with free shipping)

## 3. India Post tracking automation

1. Install **WooCommerce Shipment Tracking** (or similar) to add tracking fields on order edit.
2. Add this automation to notify customers when status becomes `completed`:

```php
add_action('woocommerce_order_status_completed', function ($order_id) {
    $order = wc_get_order($order_id);
    if (!$order) {
        return;
    }

    $tracking_number = $order->get_meta('_tracking_number');
    if (!$tracking_number) {
        return;
    }

    $tracking_url = sprintf('https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/TrackConsignment.aspx?consignment=%s', urlencode($tracking_number));

    $message = sprintf(
        "Hi %s, your order #%s is on the way. Track it here: %s",
        $order->get_billing_first_name(),
        $order->get_order_number(),
        $tracking_url
    );

    // Email
    wc_mail($order->get_billing_email(), 'Your Whole Lot of Nature order is on the way', $message);

    // WhatsApp / SMS providers can hook here if needed
}, 10, 1);
```

3. Optional: create a WordPress cron event that checks the India Post API daily and updates order notes for proactive customer support.

## 4. QA checklist

- [ ] Run `npm run woo:weights` in dry mode and confirm the console output looks sane.
- [ ] Spot-check at least one product per category in WooCommerce to ensure weights populated.
- [ ] Place two staging orders (light + heavy) to ensure free shipping behaves as expected.
- [ ] Trigger an order completion with a dummy tracking code to verify email copy and link structure.
- [ ] Document any manual overrides in Notion so the automation script can be updated later.

Once these steps are complete, update the Production Launch Plan tracker to reflect the ✅ status for weights, tags, and shipping logic.
