# 🚀 PRODUCTION READINESS TODO LIST
**Created:** November 2024
**Last Updated:** Auto-generated from comprehensive requirements analysis
**Website:** wholelotofnature.com
**Architecture:** Next.js Frontend + WordPress/WooCommerce Backend

---

## 📊 PRIORITY LEVELS
- 🔴 **CRITICAL** - Must complete before launch
- 🟠 **HIGH** - Important for full functionality
- 🟡 **MEDIUM** - Enhances user experience
- 🟢 **LOW** - Nice to have improvements

---

## ✅ COMPLETED
- [x] Admin dashboard with agent run buttons
- [x] Agent naming corrected (Plantsy = AI Chatbot, Business Growth = Lead Gen)
- [x] Hero text color fixed for readability (changed from #A8D5BA to white/emerald-200)
- [x] Policy pages text color fixed (refund-policy, privacy-policy)
- [x] TrendAgentDashboard colors updated
- [x] Google Ads tracking utility created
- [x] Google Search Console setup guide created
- [x] Competitor optimization guide created
- [x] Products API enhanced (per_page, related_to, exclude params)
- [x] GitHub repository synced and pushed
- [x] Plantsy chat widget deployed globally
- [x] Social Auto-Poster endpoint ready

---

## 🔴 CRITICAL - E-Commerce & Payments

### Order Flow & Checkout
- [ ] **Test complete checkout flow** - Cart → Checkout → Payment → Confirmation
- [ ] **PayU integration** - Install WooCommerce PayU plugin, configure credentials
  - [ ] Add Merchant Key and Salt from PayU dashboard
  - [ ] Enable Test Mode first
  - [ ] Configure webhook URL: `/wc-api/WC_Gateway_Payu/`
  - [ ] Test with sandbox, then switch to live
  - Docs: `docs/PAYU_INTEGRATION.md`
- [ ] **Cash on Delivery** - Ensure COD option is enabled as fallback
- [ ] **Test payment success/failure flows**
- [ ] **Order confirmation page** - Verify user sees thank you page

### Order Emails & Notifications
- [ ] **WooCommerce Email Setup** - In WP Admin → WooCommerce → Settings → Emails
  - [ ] New Order (Admin notification)
  - [ ] Processing Order (Customer)
  - [ ] Order Complete (Customer)
  - [ ] Refund notification
- [ ] **Email template branding** - Add logo, brand colors to WooCommerce emails
- [ ] **Verify SMTP/email delivery** - Test emails reach inbox (not spam)
- [ ] **Resend API key** - Configure `RESEND_API_KEY` for transactional emails

### Cart & Products
- [ ] **Cart persistence** - Test cart survives page refresh
- [ ] **Add to cart from all entry points** - ProductCard, Shop page, Product detail
- [ ] **Quantity limits** - Respect max stock quantity
- [ ] **Out of stock handling** - Display status, disable add to cart
- [ ] **Related products** - Display on product detail pages
- [ ] **Product images** - All products have images loading correctly

---

## 🔴 CRITICAL - WooCommerce Configuration (WordPress Admin)

### Product Setup
- [ ] **Product weights** - Add accurate weights to all products (kg)
  - Run: `npm run woo:weights` (dry-run first)
  - Docs: `docs/WOOCOMMERCE_SHIPPING_AUTOMATION.md`
- [ ] **Product tags** - Create and assign tags:
  - Herbal Plant, Medicinal, Vastu, Pet Safe, Low Light
  - Fast Growing, Air Purifying, Aquatic, Indoor, Outdoor
- [ ] **Stock management** - Enable "Manage stock" for all products
- [ ] **Product descriptions** - Ensure all have proper descriptions for SEO

### Shipping Configuration
- [ ] **Shipping Zone (India)** - Create/configure in WooCommerce → Settings → Shipping
  - Method A: Flat Rate ₹79 (orders < ₹999)
  - Method B: Free Shipping (min_amount = ₹999)
- [ ] **Weight surcharge** - Add ₹29 for orders > 5kg
  - Option: Install "Weight Based Shipping for WooCommerce"
  - OR: Add custom snippet (see `docs/WOOCOMMERCE_SHIPPING_AUTOMATION.md`)
- [ ] **Test shipping calculations** - Create test order with various weights

### Tax Settings
- [ ] **GST configuration** - Enable tax for India
- [ ] **Tax display** - Prices inclusive or exclusive of tax

---

## 🟠 HIGH - User Experience & Functionality

### Account Dashboard
- [ ] **Order history view** - `/account` shows past orders
- [ ] **Order detail page** - Individual order breakdown
- [ ] **Address management** - Edit billing/shipping addresses
- [ ] **Saved payment methods** - If PayU supports
- [ ] **Downloads** - Digital products download section
- [ ] **Tracking numbers** - Display India Post tracking

### Order Tracking
- [ ] **India Post tracking** - Add meta field in WooCommerce
  - Install "WooCommerce Shipment Tracking" plugin
  - Hook `woocommerce_order_status_completed` for notifications
- [ ] **Track order page** - `/track-order` accepts order ID + email
- [ ] **SMS/WhatsApp notifications** - Optional: shipping updates

### Cart Features
- [ ] **Free shipping progress bar** - Show how much more for free shipping
- [ ] **Coupon codes** - Test coupon application
- [ ] **Remove item** - Verify remove from cart works
- [ ] **Quantity update** - +/- buttons work correctly

---

## 🟠 HIGH - SEO & Indexing

### Google Setup
- [ ] **Google Search Console** - Verify site ownership
  - Add property for wholelotofnature.com
  - Submit sitemap: `/sitemap.xml`
  - Docs: `docs/GOOGLE_SEARCH_CONSOLE_SETUP.md`
- [ ] **Google Analytics** - Verify GA4 tracking installed
- [ ] **Google Ads** - Configure conversion tracking
  - Use: `src/lib/analytics/googleAds.ts`
  - Track: page_view, add_to_cart, purchase

### On-Page SEO
- [ ] **Meta tags audit** - Every page has unique title + description
  - `/shop`, `/about`, `/combos`, `/faq`, `/blog/[slug]`
- [ ] **JSON-LD Schema** - Product schema, Organization schema
- [ ] **Robots.txt** - Verify correct configuration
- [ ] **Sitemap** - Auto-generated at `/sitemap.xml`
- [ ] **Open Graph tags** - Social sharing images and descriptions
- [ ] **Canonical URLs** - Prevent duplicate content

### Performance
- [ ] **Image optimization** - WebP format, lazy loading
- [ ] **Core Web Vitals** - LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] **CDN caching** - Configure Vercel Edge or Cloudflare

---

## 🟡 MEDIUM - Design & UI

### Mobile Responsiveness
- [ ] **Hero section** - Test on all screen sizes
- [ ] **Product grid** - 1 column mobile, 2-3 tablet, 4 desktop
- [ ] **Cart sidebar** - Full screen on mobile
- [ ] **Navigation menu** - Mobile hamburger menu works
- [ ] **Forms** - Checkout form usable on mobile
- [ ] **Touch targets** - Buttons minimum 44x44px

### Visual Consistency
- [x] **Text contrast** - Light text on dark backgrounds (fixed #A8D5BA issue)
- [ ] **Loading states** - Show spinners/skeletons during data fetch
- [ ] **Error states** - Graceful error messages
- [ ] **Empty states** - Cart empty, no products found, etc.

### Interactive Elements
- [ ] **Floating Plantsy widget** - Test chat functionality
- [ ] **Newsletter popup** - Form submits successfully
- [ ] **Contact form** - `/contact` form works, emails sent
- [ ] **Testimonial slider** - Smooth animation

---

## 🟡 MEDIUM - Agents & Automation

### Agent Testing
- [ ] **Plantsy AI Chatbot** - Test product recommendations
- [ ] **Business Growth Agent** - Lead generation flows
- [ ] **Trend Agent** - Content automation
- [ ] **Inventory Sync Agent** - WooCommerce sync

### Automations
- [ ] **Social Media Auto-Poster** - Test cron endpoint
  - Configure: `SOCIAL_AUTOMATION_RECIPIENT` email
- [ ] **Email campaigns** - Newsletter sends working
- [ ] **Blog auto-publishing** - Test trend agent posts

---

## 🟢 LOW - Enhancement & Nice-to-Have

### Additional Features
- [ ] **Wishlist** - Save products for later
- [ ] **Product comparison** - Compare features
- [ ] **Recently viewed** - Show browsing history
- [ ] **Reviews system** - Customer reviews on products
- [ ] **Gift cards** - Optional for future

### Analytics & Insights
- [ ] **Conversion funnel** - Track drop-off points
- [ ] **Heatmaps** - Hotjar or similar
- [ ] **A/B testing** - Landing page variants

---

## 🔧 ENVIRONMENT VARIABLES CHECKLIST

Required in Vercel/production environment:

```env
# WordPress/WooCommerce
NEXT_PUBLIC_WORDPRESS_URL=https://admin.wholelotofnature.com
WORDPRESS_SITE_URL=https://admin.wholelotofnature.com
WC_CONSUMER_KEY=ck_xxxxxxx
WC_CONSUMER_SECRET=cs_xxxxxxx
WORDPRESS_USERNAME=your_username
WORDPRESS_PASSWORD=your_app_password

# Authentication
NEXTAUTH_SECRET=generate_with_openssl
NEXTAUTH_URL=https://wholelotofnature.com
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email
RESEND_API_KEY=re_xxxxxxx
MARKETING_EMAIL_FROM=Whole Lot of Nature <hello@wholelotofnature.com>

# Site
NEXT_PUBLIC_SITE_URL=https://wholelotofnature.com

# Agents
AUTOMATION_SECRET_TOKEN=your_secret
SOCIAL_AUTOMATION_RECIPIENT=owner@email.com
```

---

## 📋 TESTING CHECKLIST

### Before Launch
1. [ ] Full checkout with PayU test mode
2. [ ] Order confirmation email received
3. [ ] Tracking number updates work
4. [ ] Account page shows orders
5. [ ] Mobile responsive check (iPhone, Android)
6. [ ] All images loading correctly
7. [ ] No console errors in browser
8. [ ] Forms submit correctly (contact, newsletter)
9. [ ] Cart updates across pages

### After Launch (Monitoring)
1. [ ] Google Search Console - no critical errors
2. [ ] Uptime monitoring (UptimeRobot/Vercel)
3. [ ] Error logging (Sentry or Vercel logs)
4. [ ] Weekly backup verification
5. [ ] SSL certificate valid

---

## 📚 Related Documentation

- `docs/PRODUCTION_LAUNCH_PLAN.md` - Detailed launch plan
- `docs/PAYU_INTEGRATION.md` - Payment gateway setup
- `docs/WOOCOMMERCE_SHIPPING_AUTOMATION.md` - Shipping configuration
- `docs/GOOGLE_SEARCH_CONSOLE_SETUP.md` - SEO setup
- `docs/COMPETITOR_OPTIMIZATION_GUIDE.md` - Marketing strategy
- `PRIORITY_1_ECOMMERCE_TESTING.md` - E-commerce test cases

---

## 🎯 QUICK START (Do These First)

1. **WooCommerce Emails** - Enable all order notifications in WP Admin
2. **PayU Test Mode** - Install plugin and test checkout
3. **Google Search Console** - Submit sitemap
4. **Product Weights** - Run weight automation script
5. **Mobile Test** - Check shop and cart on phone

---

*Generated by comprehensive analysis of project requirements and previous chat history.*
