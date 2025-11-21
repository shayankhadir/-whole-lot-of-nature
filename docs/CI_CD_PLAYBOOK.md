# CI/CD Playbook

This repository now ships with a hardened pipeline at `.github/workflows/ci.yml`. Use this guide to understand every stage and the knobs you can tweak before launch.

## Pipeline overview

| Stage | What happens | Required secrets |
| --- | --- | --- |
| Install | `npm install` with npm cache | none |
| Lint | `npm run lint` (Next.js + ESLint) | none |
| Build | `npm run build` (fails on TS/ESLint errors per `next.config.js`) | none |
| Start | Boots production server on port 3000 | none |
| Smoke | `npm run test:smoke` hits `/api/products/:id` & `/api/reviews` | `WC_CONSUMER_KEY/SECRET` etc. already required locally |

## Required environment variables

Configure these in GitHub → Repository → Settings → Secrets and variables → Actions:

- `NEXT_PUBLIC_WORDPRESS_URL`
- `WORDPRESS_URL`
- `WC_CONSUMER_KEY`
- `WC_CONSUMER_SECRET`
- Any other secrets referenced by `WooCommerceService` or agents (`RESEND_API_KEY`, analytics IDs, etc.)

Without them the smoke test will fallback to sample data, but builds will still succeed.

## Caching + performance

- Static assets (`/_next/static`) cache for one year via `next.config.js` headers.
- Runtime routes default to `stale-while-revalidate` caching so Vercel edge nodes stay warm.
- CI sets `NEXT_TELEMETRY_DISABLED=1` to avoid noisy logs.

## Local verification

```
npm run lint
npm run build
PORT=3000 npm run start &
npx wait-on http://localhost:3000
BASE_URL=http://localhost:3000 npm run test:smoke
```

Stop the server afterwards with `pkill -f "next start"` (macOS/Linux) or `Stop-Process` on Windows.

## Rollback plan

1. Revert the offending commit locally and push to `main` (CI verifies before deploy).
2. Vercel keeps previous deployments; use the dashboard to promote the last green build.
3. Clear CDN cache if a stale asset persists (`vercel deploy --prod --force`).

Keep this document updated when you add new workflows (e.g., Percy, Lighthouse CI, content publishing bots).
