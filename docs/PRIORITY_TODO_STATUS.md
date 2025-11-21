# Priority Readiness Tracker — Nov 21, 2025

| Task | Owner | Status | What shipped in this commit | Remaining work |
| --- | --- | --- | --- | --- |
| Product weights & tags | WP Admin + Dev | 🚧 Script ready | Added `npm run woo:weights` automation + preset tag logic. | Run script (dry-run first), review outliers, and lock values inside WooCommerce. |
| Shipping logic | WP Admin | 🚧 Docs ready | `docs/WOOCOMMERCE_SHIPPING_AUTOMATION.md` + `npm run woo:shipping:simulate` CLI to verify surcharge math before editing Woo. | Configure zone + snippet in WordPress, then smoke-test orders. |
| Account experience | Frontend Dev | 🚧 Dashboard live | `/account` now renders a Woo-backed dashboard (orders, addresses) via `AccountDashboard`. | QA with authenticated customers and add order detail/deep links if needed. |
| PayU integration | WP Admin | 💤 Pending | New guide `docs/PAYU_INTEGRATION.md` with sandbox/go-live steps + env vars. | Install PayU plugin, add Merchant Key/Salt env vars, run sandbox + live transactions. |
| CI/CD + Edge caching | DevOps | ✅ Pipeline active | Added `.github/workflows/ci.yml`, enforced strict builds, and documented `docs/CI_CD_PLAYBOOK.md`. | Wire Vercel deploy hooks + add env vars to GitHub secrets. |
| Responsive QA sweep | QA | 🚧 Automation ready | `npm run qa:responsive` (Playwright screenshots) + `docs/RESPONSIVE_QA_PLAN.md`. | Run script against staging/prod and log issues in Linear/Percy. |

## How to use this tracker
1. Update the **Status** emoji once each owner finishes their part (✅ Done, 🚧 In progress, 💤 Not started).
2. Reference the linked docs/scripts before duplicating work.
3. When a row hits ✅, reflect it inside `docs/PRODUCTION_LAUNCH_PLAN.md`.
