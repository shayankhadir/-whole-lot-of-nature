## Whole Lot of Nature

Production-ready Next.js storefront that syncs with WooCommerce/WordPress, Prisma, and new email-intelligence workflows for contact + newsletter submissions.

## Development Quickstart

1. `npm install`
2. Copy `.env.example` (or create `.env.local`) and fill in the variables listed below.
3. `npx prisma generate`
4. `npm run dev` → open `http://localhost:3000`

> **Note:** Prisma migrations require valid credentials for the managed MySQL instance defined in `DATABASE_URL`.

## Required Environment Variables

Store sensitive values in `.env.local` (never commit). Minimum configuration:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Full Prisma-compatible MySQL connection string. Needed before running any migration (`npx prisma migrate dev --name add_email_intelligence`). |
| `RESEND_API_KEY` | Enables transactional emails for contact/newsletter submissions. Without it, the API logs instead of sending. |
| `MARKETING_EMAIL_FROM` | Display name + email for outbound messages (e.g., `"Whole Lot of Nature" <store@wholelotofnature.com>`). |
| `BUSINESS_EMAIL` | Fallback destination for submission alerts if `MARKETING_EMAIL_FROM` not set. |
| `AGENT_PUBLISH_STRATEGY` | Controls automation cadence (`scheduled`, `immediate`, or `manual`) for the Supervisor + intelligence agents. |
| `WORDPRESS_SITE_URL` | Base URL for the WordPress dashboard (used by automation agents). |
| `WORDPRESS_URL` / `WORDPRESS_API_URL` | Canonical REST endpoint (`https://site.com/wp-json`). |
| `WORDPRESS_USERNAME` | WordPress user with permissions to publish posts + manage WooCommerce. |
| `WORDPRESS_PASSWORD` or `WORDPRESS_APP_PASSWORD` | Matching credential/app password for the above user. |
| `WC_CONSUMER_KEY` / `WC_CONSUMER_SECRET` | WooCommerce API keys with read/write scope for storefront sync. |
| `NEXT_PUBLIC_SITE_URL` | Public origin used when generating absolute URLs in emails/SEO metadata. |

Other integrations already wired in the repo (Google/Facebook auth, Instagram, Perplexity, GA, FB Pixel, etc.) remain optional unless those features are needed.

## Running Prisma Migrations

```bash
npx prisma migrate dev --name add_email_intelligence
```

If you see `P1000 Authentication failed`, update `DATABASE_URL` with the correct host, database, username, and password, then rerun the command.

## Email Submission API

Both the Contact and Newsletter forms submit to `/api/email/submit`, which triggers:

1. Storage via Prisma + the Email Intelligence Agent.
2. Notification email through Resend (requires the env vars above).
3. User-facing success/error states handled client-side.

Once `RESEND_API_KEY` and sender info are configured, no extra code changes are required.
