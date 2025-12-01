# Google Ads Integration Guide

## Overview
This guide explains how to integrate Google Ads (AdSense and Google Ads conversion tracking) into your Whole Lot of Nature e-commerce website.

## Prerequisites
- Google Account
- Website verified with Google Search Console
- Active Google AdSense or Google Ads account

## Step 1: Google AdSense Setup

### 1.1 Create Google AdSense Account
1. Go to [https://www.google.com/adsense](https://www.google.com/adsense)
2. Sign up with your Google account
3. Enter your website URL: `https://wholelotofnature.com`
4. Complete the application form
5. Wait for approval (typically 1-3 days for Indian websites)

### 1.2 Get Your AdSense Client ID
1. Once approved, log in to AdSense dashboard
2. Go to **Account** → **Account information**
3. Find your **Publisher ID** (format: `ca-pub-XXXXXXXXXXXXXXXX`)
4. Copy this ID

### 1.3 Add AdSense to Your Website
1. Create/edit `.env.local` file in your project root:
```bash
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
```

2. The code is already integrated in `src/app/layout.tsx`:
```typescript
{/* Google AdSense */}
{process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID ? (
  <Script
    async
    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}`}
    crossOrigin="anonymous"
    strategy="afterInteractive"
  />
) : null}
```

3. Deploy your changes to production
4. Wait 24-48 hours for Google to verify the code

## Step 2: Create Ad Units

### 2.1 Display Ads (Recommended Placements)
Create ad units in your AdSense dashboard:

**Homepage Ads:**
- **Above the fold banner**: 728x90 or responsive
- **Sidebar**: 300x600 (below hero section)
- **In-feed ad**: Between product sections

**Product Pages:**
- **Right sidebar**: 300x250 or 300x600
- **Below product description**: Responsive horizontal
- **Related products section**: Native in-feed ads

**Blog/SEO Pages:**
- **Top of content**: Responsive horizontal
- **Mid-content**: 336x280 or responsive
- **Sidebar**: 300x600
- **End of article**: Responsive

### 2.2 Create Ad Component
Create `/src/components/ads/GoogleAd.tsx`:

```typescript
'use client';

import { useEffect } from 'react';

interface GoogleAdProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export default function GoogleAd({ 
  slot, 
  format = 'auto', 
  responsive = true,
  style = { display: 'block' },
  className = ''
}: GoogleAdProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  if (!process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID) {
    return null;
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive.toString()}
    />
  );
}
```

### 2.3 Example Usage
```tsx
import GoogleAd from '@/components/ads/GoogleAd';

// In your page component
<div className="my-8">
  <GoogleAd 
    slot="1234567890" 
    format="horizontal"
    className="text-center"
  />
</div>
```

## Step 3: Google Ads Conversion Tracking

### 3.1 Set Up Google Ads Account
1. Go to [https://ads.google.com](https://ads.google.com)
2. Create a new account or sign in
3. Set up your first campaign (Shopping or Search)

### 3.2 Install Conversion Tracking
1. In Google Ads dashboard, go to **Tools & Settings** → **Conversions**
2. Click **+ New conversion action**
3. Select **Website**
4. Choose conversion type:
   - **Purchase** (for completed orders)
   - **Add to cart**
   - **View product**
   - **Lead** (for newsletter signups)

### 3.3 Get Conversion Tracking Code
1. Copy the **Google tag ID** (format: `AW-XXXXXXXXX`)
2. Copy the **Conversion ID** for each action

### 3.4 Add to Environment Variables
```bash
# .env.local
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL=xxx-xxxx
NEXT_PUBLIC_GOOGLE_ADS_ADD_TO_CART_LABEL=yyy-yyyy
```

### 3.5 Implement Conversion Tracking
Add to `src/app/layout.tsx`:

```typescript
{/* Google Ads Conversion Tracking */}
{process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ? (
  <>
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}`}
      strategy="afterInteractive"
    />
    <Script id="google-ads-init" strategy="afterInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}');
      `}
    </Script>
  </>
) : null}
```

### 3.6 Track Conversions
Create `/src/lib/analytics/googleAds.ts`:

```typescript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const trackPurchase = (transactionId: string, value: number, currency = 'INR') => {
  if (typeof window !== 'undefined' && window.gtag && process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL) {
    window.gtag('event', 'conversion', {
      'send_to': `${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}/${process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL}`,
      'transaction_id': transactionId,
      'value': value,
      'currency': currency
    });
  }
};

export const trackAddToCart = (value: number, items: any[]) => {
  if (typeof window !== 'undefined' && window.gtag && process.env.NEXT_PUBLIC_GOOGLE_ADS_ADD_TO_CART_LABEL) {
    window.gtag('event', 'conversion', {
      'send_to': `${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}/${process.env.NEXT_PUBLIC_GOOGLE_ADS_ADD_TO_CART_LABEL}`,
      'value': value,
      'currency': 'INR',
      'items': items
    });
  }
};
```

## Step 4: Best Practices

### 4.1 Ad Placement Guidelines
- **Don't oversaturate**: Maximum 3 ads per page
- **Above the fold**: Only 1 ad
- **Mobile**: Use responsive ad units
- **User experience**: Ensure ads don't interfere with navigation

### 4.2 Policy Compliance
- Never click your own ads
- Don't place ads on empty/low-value pages
- Ensure content complies with AdSense policies
- Maintain ad-to-content ratio (more content than ads)

### 4.3 Performance Optimization
- Use lazy loading for below-fold ads
- Implement responsive ad units
- Test different ad formats and placements
- Monitor page speed impact

### 4.4 Privacy & GDPR
- Add cookie consent banner
- Update privacy policy to mention ads
- Implement GDPR-compliant ad serving for EU visitors

## Step 5: Testing

### 5.1 Test Mode
Google provides test ad units:
```
Test Publisher ID: ca-pub-3940256099942544
Test Ad Slot: 1234567890
```

### 5.2 Verification
1. Deploy to production
2. Visit your website
3. Check browser console for errors
4. Verify ads appear (after approval)
5. Check AdSense dashboard for impressions

## Step 6: Monitoring

### 6.1 AdSense Reports
- **Home**: Overview of earnings
- **Reports**: Detailed performance metrics
- **Optimization**: Get suggestions from Google

### 6.2 Key Metrics
- **RPM** (Revenue per 1000 impressions)
- **CTR** (Click-through rate)
- **CPC** (Cost per click)
- **Viewability**: Percentage of ads viewed

### 6.3 Google Ads Dashboard
- Track conversion rates
- Monitor cost per acquisition
- Optimize campaigns based on performance

## Troubleshooting

### Ads Not Showing
1. Check if AdSense account is approved
2. Verify environment variable is set
3. Check browser console for errors
4. Ensure ad blocker is disabled
5. Wait 24-48 hours after code implementation

### Low Revenue
1. Improve ad placement
2. Increase traffic quality
3. Optimize content for higher CPM keywords
4. Test different ad formats
5. Enable auto ads feature

### Policy Violations
1. Review AdSense policy center
2. Remove problematic content
3. Submit for re-review
4. Implement necessary changes

## Resources

- [Google AdSense Help Center](https://support.google.com/adsense)
- [Google Ads Help](https://support.google.com/google-ads)
- [AdSense Policies](https://support.google.com/adsense/answer/48182)
- [Conversion Tracking Guide](https://support.google.com/google-ads/answer/1722022)

## Support

For implementation support:
- Email: info@wholelotofnature.com
- Check Google AdSense forums
- Contact Google AdSense support

---

**Note**: Ensure compliance with all Google policies and local regulations when implementing ads.
