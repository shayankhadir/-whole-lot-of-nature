# WooCommerce Product Content Automation

Use this guide whenever you need to refresh short descriptions or attach quick cross-sell recommendations for existing WooCommerce products directly from the headless toolkit.

## What the script does
- Rebuilds the **short description** (`short_description`) for every product fetched via the REST API (defaults to 100 items per run).
- Applies a **category-aware template** so Plants, Soil, Aquatic, Wellness, and default goods all receive consistent copy.
- Injects a small HTML block: intro paragraph + `<ul class="product-features-list">` with bold labels/emojis so Woo storefront cards look rich without manual edits.
- Auto-links common **cross-sells** (potting mix + fertilizer) to all plant products so upsell slots are never empty.

## Requirements
- `.env.local` (or `.env`) must expose:
  - `WORDPRESS_URL`
  - `WC_CONSUMER_KEY`
  - `WC_CONSUMER_SECRET`
- WooCommerce REST API keys need `read/write` scope.
- Node 18+ (project already pins this via `.nvmrc` / tooling).
- Optional but recommended: take a DB backup before first big run.

## Running the automation
```bash
npm run woo:enhance-content
```
This command executes `scripts/enhance-product-content.ts` via `tsx` so TypeScript runs without a build step.

### Command flow
1. Loads env vars with `dotenv` (regular + `.env.local`).
2. Pulls up to 100 products via `wc/v3/products`.
3. Determines the correct template from the category names (case-insensitive).
4. Builds the new short description HTML snippet.
5. Adds cross-sell IDs (if the product is a plant and matches the helper items).
6. Issues a `PUT /products/:id` call per product.

## Safety + verification
- **Idempotent copy**: Running multiple times simply reapplies the template, so it is safe after catalog updates.
- **Rate limiting**: WooCommerce usually allows 100 req/min with these bursts, but if you have >100 products set `per_page` or chunk the logic before expanding.
- **Preview**: spot-check a product (Plants → Product → Short description) immediately after the script runs to confirm the HTML block renders.
- **Styling**: ensure your Woo theme includes CSS for `.product-features-list li` if you want tighter spacing (add once in WP > Appearance > Customize > Additional CSS).
- **Rollback**: restore from backup or manually tweak the short description inside WP if a specific product needs custom copy.

## Extending templates
- Update `DESCRIPTIONS` inside `scripts/enhance-product-content.ts` to add more categories or tweak copy/emojis.
- To add richer logic (e.g., custom bullets per tag), modify `getCategoryContent`—it receives the full category array so you can branch on `slug`, `id`, etc.
- Need different cross-sells? Change the finder logic near the top of the script or map by category.

## Quick checklist
- [ ] Confirm env vars in `.env.local`.
- [ ] Optional: back up Woo DB (or export products CSV).
- [ ] Run `npm run woo:enhance-content`.
- [ ] Spot-check 2–3 products in WP admin.
- [ ] Add CSS for `.product-features-list` if theme lacks list styling.

That’s it—product cards now have consistent marketing copy and cross-sells without hand editing.
