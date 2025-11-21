# Environment Variable Status — Whole Lot of Nature

_Last updated: 21 Nov 2025_

> Store all secrets inside your hosting provider (Vercel → Project Settings → Environment Variables for `preview` + `production`) and in the WordPress `.env` used for WooCommerce. Never commit `.env` files to git.

| Area | Variable | Required For | Status | Notes |
| --- | --- | --- | --- | --- |
| WordPress / WooCommerce | `NEXT_PUBLIC_WORDPRESS_URL` | Frontend routing, deep links | **Pending** | Use canonical `https://wholelotofnature.com`. |
|  | `WORDPRESS_URL` | Server-side REST calls | **Pending** | Same as above; include protocol. |
|  | `WORDPRESS_SITE_URL` | Redirect helpers | **Pending** | Optional fallback for redirects. |
|  | `WC_CONSUMER_KEY` | WooCommerce REST auth | **Pending** | Generate read/write key in WooCommerce → Advanced → REST API. |
|  | `WC_CONSUMER_SECRET` | WooCommerce REST auth | **Pending** | Store with the key above. |
|  | `WORDPRESS_USER` | Scripts + publisher agent | **Pending** | Application password user; never reuse raw admin password. |
|  | `WORDPRESS_PASSWORD` | Scripts + publisher agent | **Pending** | Application password token. |
|  | `WORDPRESS_API_URL` | Content scripts | **Pending** | Usually `https://wholelotofnature.com/wp-json`. |
| CDN / Public URLs | `NEXT_PUBLIC_SITE_URL` | SEO metadata + email links | **Pending** | Set to public marketing domain. |
| Analytics & Pixels | `NEXT_PUBLIC_GA_ID` | GA4 tracking | Optional | Provided by Google Analytics property. |
|  | `NEXT_PUBLIC_FB_PIXEL_ID` | Meta pixel events | Optional | Provided by Meta Business Manager. |
| Auth | `NEXTAUTH_SECRET` | NextAuth session crypto | **Pending** | Generate via `openssl rand -base64 32`. |
|  | `GOOGLE_CLIENT_ID` | Google OAuth | Optional | Needed only if enabling Google login. |
|  | `GOOGLE_CLIENT_SECRET` | Google OAuth | Optional | Pair with ID. |
|  | `FACEBOOK_CLIENT_ID` | Facebook OAuth | Optional | Populate when enabling FB login. |
|  | `FACEBOOK_CLIENT_SECRET` | Facebook OAuth | Optional | Pair with ID. |
| Email & Marketing | `RESEND_API_KEY` | Transactional + automation emails | **Pending** | Required for Social Auto-Poster summaries + onboarding flows. |
|  | `MARKETING_EMAIL_FROM` | Sender identity | Optional | Format `Whole Lot of Nature <hello@domain.com>`. |
|  | `EMAIL_SERVER_HOST`, `EMAIL_SERVER_PORT`, `EMAIL_SERVER_USER`, `EMAIL_SERVER_PASSWORD` | SMTP fallback | Optional | Only needed if you prefer SMTP over Resend. |
| Agents / Automations | `PUBLISH_INTERVAL`, `MAX_POSTS_PER_INTERVAL`, `AGENT_PUBLISH_STRATEGY` | Growth + marketing agents | Optional | Add when you want to tune cadence. |
|  | `AUTOMATION_SECRET_TOKEN` | Secures cron + social auto-poster endpoint | **Pending** | Shared secret for `/api/agents/social-auto-poster`. |
|  | `SOCIAL_AUTOMATION_RECIPIENT` | Email destination for auto-poster plans | Optional | Where the schedule emails will land. |
|  | `PLANTSY_DEFAULT_EMAIL` | Future escalation (optional) | Optional | Use when you want Plantsy to CC experts. |
|  | `GROWTH_AGENT_WEBHOOK` | Growth agent callbacks | Optional | Only if pushing updates elsewhere. |
| Payments | `PAYU_MERCHANT_KEY` | PayU plugin | **Pending** | Add inside WordPress `.env` + plugin settings. See `docs/PAYU_INTEGRATION.md`. |
|  | `PAYU_MERCHANT_SALT` | PayU plugin | **Pending** | Same as above; rotate when switching environments. |
|  | `PAYU_AUTH_HEADER` | PayU API | Optional | Needed for server-side verification. |
| Social API | `YOUTUBE_API_KEY`, `YOUTUBE_CHANNEL_ID` | Video embeds + agents | Optional | Already referenced in plan. |
|  | `INSTAGRAM_BASIC_DISPLAY_TOKEN` | Instagram agent | Optional | Needed if you want to auto-fetch IG media. |

## How to keep this document accurate
1. Update the **Status** column (`Pending`, `Set`, or `Rotating`) every time you add secrets to the hosting provider.
2. Mirror values between local `.env.local` (development) and Vercel envs (Preview + Production) so your builds behave the same.
3. Rotate sensitive keys (PayU, WooCommerce) quarterly and immediately when someone leaves the team.
4. Share this file read-only with collaborators so they know which credentials are still outstanding.
