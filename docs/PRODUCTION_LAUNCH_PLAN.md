# Production Launch Plan

> **Architecture context**: WordPress + WooCommerce remain the source of truth for products, orders, accounts, and structured CMS content. The Next.js frontend (App Router) consumes that data through REST (and WooCommerce) endpoints and deploys via static + dynamic rendering. All production readiness work must keep WordPress as the CMS and respect WooCommerce configuration limits.

---

## ✅ Priority To‑Do Tracker

| Status | Owner | Task |
| --- | --- | --- |
| [ ] | WP Admin | **Assign accurate weights** to every product (`Products → Edit → Shipping → Weight`). Use kg with one decimal precision so weight-based fees can trigger. _New helper: `npm run woo:weights` (see `docs/WOOCOMMERCE_SHIPPING_AUTOMATION.md`)._ |
| [ ] | WP Admin | **Create centralized tags** (Herbal plant, Vastu plant, Pet-safe, Air-Purifying, etc.) under `Products → Tags` and bulk-assign for SEO + filters. _Script above also seeds evergreen tags automatically._ |
| [ ] | WP Admin | **Shipping logic** (India zone):
  1. Base flat rate ₹79 (orders < ₹999)
  2. Free shipping method with `min_amount=999`
   3. Weight rule (>5kg) adds ₹29 surcharge even when free shipping qualifies (requires weight-based shipping plugin or custom snippet). _See new snippet in `docs/WOOCOMMERCE_SHIPPING_AUTOMATION.md`._ |
| [ ] | WP Admin / DevOps | **Indian Post tracking**: add tracking meta field + automate email/SMS/WhatsApp notifications when order status becomes `completed`. |
| [ ] | Frontend Dev | **Account experience**: NextAuth-protected `/account` dashboard (orders, addresses) now live. Add order detail view, downloads, and ensure Woo customer sync for all users. |
| [ ] | WP Admin | **PayU integration**: install WooCommerce PayU plugin, add Merchant Key/Salt, enable Test Mode, run sandbox → live test. |
| [ ] | DevOps | **CI/CD + Edge caching**: ensure `main` deploys automatically (Vercel/Netlify). Enable ISR/SSG where possible + CDN caching headers. |
| [ ] | SEO | **Page meta + schema audit**: confirm every key route (`/shop`, `/about`, `/combos`, `/faq`, `/blog/[slug]`, etc.) sets `metadata` + JSON-LD. |
| [x] | Eng | **Agents**: wire `Plant Doctor (Plantsy)` chat entrypoint and Social Auto-Poster cron + queue. _Plantsy widget + `/api/agents/plantsy` + `/plantsy` hub + `/api/agents/social-auto-poster` cron-ready endpoint now live._ |
| [ ] | QA | **Responsive sweep**: run Percy/Loki or manual device lab for hero, carousels, popups, floating dock.

---

## WooCommerce Shipping Configuration

1. **Weights**: Products → Quick Edit (or bulk edit) → add weight (kg). Use heuristics: small potted plant 0.5kg, medium 1.5kg, soil bags 3kg, etc. _Automation available via `npm run woo:weights` (dry-run first) — see `docs/WOOCOMMERCE_SHIPPING_AUTOMATION.md`._
2. **Shipping Zone (India)**:
   - Method A: *Flat Rate* ₹79, no conditions → rename to "Standard Shipping (< ₹999)".
   - Method B: *Free Shipping* with `min_amount = 999` → rename to "Free Green Shipping".
3. **Weight Surcharge** (`> 5kg`):
   - Option 1 (recommended): install **"Weight Based Shipping for WooCommerce"**. Rule: `5kg - any` cost ₹29, `stop further = false` so it stacks with Free Shipping vetting.
   - Option 2: add the snippet in `docs/WOOCOMMERCE_SHIPPING_AUTOMATION.md` via `Code Snippets` plugin hooking `woocommerce_cart_calculate_fees` to detect total weight and order subtotal.
4. **Testing**: create draft products at 4kg + ₹1,049 to ensure surcharge triggers.

---

## Product Tags & Filters

- Maintain canonical tag taxonomy (e.g., Herbal Plant, Medicinal, Vastu, Pet Safe, Low Light, Fast Growing, Air Purifying, Aquatic). Document tag definitions in Notion.
- Bulk apply via Products list → checkboxes → Bulk Edit → Add new tags.
- Frontend: expose filters in `/shop` once WordPress tags are consistent (GraphQL or REST `tags` field already available via WooCommerceService).

---

## Order Tracking Workflow (India Post)

1. Add meta box `tracking_number` + `carrier` via plugin (e.g., **WooCommerce Shipment Tracking**).
2. Hook `woocommerce_order_status_completed` to send email/SMS/WhatsApp message containing India Post tracking link `https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/TrackConsignment.aspx?consignment={tracking}`.
3. Frontend `/track-order` page should accept order ID + email and display status using Woo REST `/orders/{id}`.

---

## Account Area

- Current `/account` simply links to WP `my-account`. Options:
  1. Embed WordPress page inside a secure iframe (needs shared auth cookie).
  2. Prefer: call WooCommerce REST (`/customers/{id}` + `/orders?customer=`) and render in Next.js, while redirecting unauthenticated users to NextAuth login.
- Ensure customers can view orders, downloads, addresses, saved payment methods, and tracking numbers.

---

## PayU Integration

1. Install **WooCommerce PayU (India)** plugin.
2. Obtain Merchant Key, Salt, Auth Header from PayU dashboard.
3. WooCommerce → Settings → Payments → PayU → Enable test mode.
4. Configure webhook/response URL to your WordPress domain `/wc-api/WC_Gateway_Payu/`.
5. Test card with PayU sandbox, then switch to live keys and re-test.

> Detailed sandbox + go-live instructions live in `docs/PAYU_INTEGRATION.md`.

---

## Deployment & Performance

- Use Vercel/Netlify for CI → each push to `main` triggers build. Configure preview builds for feature branches.
- Enable **Incremental Static Regeneration** for content pages (Next.js). For WooCommerce-dependent routes, cache API responses in `WooCommerceService` (already uses fallback) and add SWR on client.
- CDN: use Vercel Edge or Cloudflare in front of WordPress for images/API caching.

---

## Agents & Automations

### Existing
- **Growth / Marketing Automation Agent** orchestrates competitor scan → SEO → landing pages.
- **Design Audit Agent** ensures UI consistency.

### New (added in this update)
1. **🌱 Plantsy – Plant Doctor Agent** (`src/lib/agents/plantsyAgent.ts`)
   - Pulls latest WooCommerce products and descriptions.
   - Light-weight RAG scoring to answer care questions, suggest relevant products + blog posts, and output confidence + recommended actions.
   - Live via `/api/agents/plantsy`, floating launcher, and `/plantsy` landing page.
2. **📸 Social Media Auto-Poster Agent** (`src/lib/agents/socialAutoPosterAgent.ts`)
   - Fetches new products + blog posts, generates Instagram/Facebook captions, hashtags, asset suggestions, and schedule slots.
   - Provides normalized payload you can push to Buffer/Later/Meta Graph API. Cron-ready endpoint: `/api/agents/social-auto-poster` (guard with `AUTOMATION_SECRET_TOKEN`).

### Latest progress (21 Nov 2025)
- ✅ Plantsy chat widget deployed globally + dedicated landing page.
- ✅ `npm run woo:weights` script seeds weights/tags automatically (dry-run flag supported).
- ✅ Cron-safe Social Auto-Poster endpoint emails the schedule when `SOCIAL_AUTOMATION_RECIPIENT` is set.
- ✅ `/account` now renders WooCommerce data (orders, addresses) for authenticated users via `AccountDashboard`.
- ✅ CI pipeline (`.github/workflows/ci.yml`) runs lint → build → smoke on Node 20 with caching headers enforced in `next.config.js`.
- ✅ Responsive QA helper `npm run qa:responsive` captures Playwright screenshots for top routes.
- 📄 New docs: `docs/ENVIRONMENT_VARIABLES.md`, `docs/WOOCOMMERCE_SHIPPING_AUTOMATION.md`, `docs/CI_CD_PLAYBOOK.md`, `docs/RESPONSIVE_QA_PLAN.md`, `docs/PAYU_INTEGRATION.md`.
- 🔄 Still outstanding: WooCommerce UI configuration (weights verification, shipping zone setup), Indian Post notifications, PayU credentials, `/account` order detail/downloads, front-end SEO audit, and production responsive sweep.

### Next steps
- Add cron / scheduler (e.g., Vercel Cron + Supabase table) to run Social Auto-Poster daily and enqueue posts.
- Build Plantsy chat endpoint + UI widget (floating button or `/plantsy` route).

---

## Secrets & API Keys (Production)

| Area | Env Var | Notes |
| --- | --- | --- |
| **WordPress / WooCommerce** | `NEXT_PUBLIC_WORDPRESS_URL`, `WORDPRESS_SITE_URL` | Base URL for REST + front-end redirects. |
|  | `WC_CONSUMER_KEY`, `WC_CONSUMER_SECRET` | WooCommerce REST credentials. |
|  | `WORDPRESS_USERNAME`, `WORDPRESS_PASSWORD` | Admin account / application password for publisher agents. |
| **Google / Analytics** | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | For NextAuth Google provider. |
|  | `YOUTUBE_API_KEY`, `YOUTUBE_CHANNEL_ID` | Used by media embeds & agents. |
| **Email / Marketing** | `RESEND_API_KEY` | Transactional + marketing emails. |
|  | `MARKETING_EMAIL_FROM` | Sender identity (e.g., `Whole Lot of Nature <hello@...>`). |
|  | `EMAIL_SERVER_HOST`, `EMAIL_SERVER_PORT`, `EMAIL_SERVER_USER`, `EMAIL_SERVER_PASSWORD` | Optional SMTP fallback. |
| **Auth / Security** | `NEXTAUTH_SECRET` | Generate via `openssl rand -base64 32`. |
|  | `NEXT_PUBLIC_SITE_URL` | Public domain for SEO + callbacks. |
|  | `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET` | Required if enabling Facebook login. |
| **Agents** | `PUBLISH_INTERVAL`, `MAX_POSTS_PER_INTERVAL`, `AGENT_PUBLISH_STRATEGY` | Tunes automation cadence. |

> Store secrets in your hosting provider (Vercel Environment Variables, Netlify Build Variables, etc.). Never commit `.env` to git.

---

## Risks & Bottlenecks

- **Shipping logic** still manual—must be configured in WooCommerce; frontend cannot enforce surcharges reliably.
- **Account dashboard QA** pending—now renders Woo data but still needs download + tracking tabs tested with real users.
- **PayU configuration** pending credentials; cash-on-delivery fallback only.
- **Order tracking** automation not built—India Post integration is manual.
- **Tags/weights** still missing, preventing accurate filters + shipping costs.
- **CI/CD secrets**: GitHub Actions now enforces lint/build; ensure GitHub/Vercel environment variables stay in sync.
- **Secret management**: confirm all required env vars exist in production environment.

---

## Suggested Automation Enhancements

1. **Indian Post webhook lambda**: small serverless function that, given tracking number, hits India Post API daily and updates Woo order notes.
2. **Performance budget bot**: script to run Lighthouse CI on every PR to ensure Core Web Vitals pass before merging.
3. **Content freshness check**: scheduled agent that flags blog posts older than 120 days for refresh.

---

Keep this document updated as items move from ☐ to ☑. Once every row in the tracker is complete, you are ready for a confident production release.
