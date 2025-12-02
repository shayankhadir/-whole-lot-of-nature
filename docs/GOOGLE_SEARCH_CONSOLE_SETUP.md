# Google Search Console Setup Guide

## Quick Setup Steps

### 1. Verify Site Ownership

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "Add Property"
3. Choose "URL prefix" and enter: `https://wholelotofnature.com`
4. Select **HTML tag** verification method
5. Copy the verification code (just the content value)
6. Add to your `.env.local`:
   ```
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_verification_code
   ```
7. Redeploy to Vercel
8. Return to Search Console and click "Verify"

### 2. Submit Sitemap

1. In Search Console, go to **Sitemaps** in the left sidebar
2. Enter: `sitemap.xml`
3. Click "Submit"

Your sitemap is auto-generated at: `https://wholelotofnature.com/sitemap.xml`

### 3. Request Indexing

For important pages, request immediate indexing:

1. Go to **URL Inspection** in Search Console
2. Enter the page URL
3. Click "Request Indexing"

Priority pages to index:
- `/` (Homepage)
- `/shop` (Shop page)
- `/about` (About page)
- `/blog` (Blog page)
- Individual product pages

### 4. Monitor Performance

Check these reports regularly:
- **Performance**: Search queries, clicks, impressions
- **Coverage**: Indexed pages, errors
- **Core Web Vitals**: Page speed metrics
- **Mobile Usability**: Mobile-friendly issues

## Google Ads Setup

### 1. Create Google Ads Account

1. Go to [Google Ads](https://ads.google.com)
2. Create a new account or sign in
3. Get your Conversion ID (format: AW-XXXXXXXXXX)

### 2. Set Up Conversion Tracking

1. In Google Ads, go to **Tools & Settings** > **Conversions**
2. Click **+ New conversion action**
3. Choose **Website**
4. Set up these conversions:

| Conversion | Category | Value |
|------------|----------|-------|
| Purchase | Purchase | Use actual value |
| Add to Cart | Add to cart | ₹100 (estimated) |
| Begin Checkout | Begin checkout | ₹200 (estimated) |
| Lead Form | Lead | ₹50 (estimated) |

5. Get the conversion labels for each action

### 3. Add to Environment Variables

```env
# Google Ads Configuration
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXXX
NEXT_PUBLIC_GADS_PURCHASE_LABEL=XXXXXXXXXX
NEXT_PUBLIC_GADS_ADD_TO_CART_LABEL=XXXXXXXXXX
NEXT_PUBLIC_GADS_CHECKOUT_LABEL=XXXXXXXXXX
NEXT_PUBLIC_GADS_LEAD_LABEL=XXXXXXXXXX
```

### 4. Test Conversions

Use Google Tag Assistant to verify:
1. Install [Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. Visit your site
3. Perform test conversions
4. Verify in Google Ads > Conversions

## Tracking Implementation

The tracking is already integrated in:
- `src/lib/analytics/googleAds.ts` - Tracking utilities
- `src/app/layout.tsx` - Global gtag setup

### Usage in Components

```typescript
import { trackPurchase, trackAddToCart, trackBeginCheckout } from '@/lib/analytics/googleAds';

// Track add to cart
trackAddToCart(product.id, product.name, product.price);

// Track checkout
trackBeginCheckout(cartItems, totalValue);

// Track purchase
trackPurchase(orderId, orderTotal);
```

## SEO Checklist

### Technical SEO ✅
- [x] Sitemap.xml generated automatically
- [x] Robots.txt configured
- [x] Meta tags on all pages
- [x] Open Graph tags
- [x] Twitter cards
- [x] Canonical URLs
- [x] JSON-LD structured data

### Content SEO
- [ ] Target keywords in page titles
- [ ] Meta descriptions (150-160 chars)
- [ ] H1 tags on every page
- [ ] Image alt text
- [ ] Internal linking

### Performance
- [ ] Core Web Vitals passing
- [ ] Mobile-friendly
- [ ] Fast loading (<3s)
- [ ] Compressed images

## Support

For issues with tracking or verification, check:
1. Browser console for errors
2. Google Tag Assistant
3. Google Search Console coverage report
