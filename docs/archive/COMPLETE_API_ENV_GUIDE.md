# 🎯 Complete API & Environment Variables Setup Guide

## ✅ Status
- **Products Display:** ✅ WORKING (WooCommerce configured)
- **Site Loads:** ✅ WORKING
- **Basic Structure:** ✅ READY

---

## 📋 Environment Variables by Priority

### 🔴 TIER 1: CRITICAL (Site won't work without these)

#### WooCommerce - Products Display
```env
NEXT_PUBLIC_WORDPRESS_URL=https://admin.wholelotofnature.com
WC_CONSUMER_KEY=ck_your_key_here
WC_CONSUMER_SECRET=cs_your_secret_here
WORDPRESS_URL=https://admin.wholelotofnature.com
```
**Status:** ✅ Already Set  
**Get From:** WordPress Admin → WooCommerce → Settings → Advanced → REST API Consumers

---

#### Authentication (NextAuth)
```env
NEXTAUTH_SECRET=generate_random_string_with_openssl
NEXTAUTH_URL=https://www.wholelotofnature.com
```
**Status:** ⚠️ CHECK in Vercel  
**Generate:** `openssl rand -base64 32`  
**Used For:** User login/signup, account management

---

### 🟠 TIER 2: IMPORTANT (Features need these to work)

#### Email Service - Resend (Password Reset, Order Confirmations)
```env
RESEND_API_KEY=re_your_api_key_here
MARKETING_EMAIL_FROM=hello@wholelotofnature.com
```
**Status:** ⚠️ CHECK  
**Get From:** https://resend.com → Settings → API Keys  
**Used For:** Password resets, order confirmations, marketing emails  
**Features Affected:** "Forgot Password", email notifications

---

#### Payment Gateway - Cashfree (Checkout)
```env
CASHFREE_APP_ID=your_app_id
CASHFREE_SECRET_KEY=your_secret_key
CASHFREE_MODE=sandbox  # Use 'sandbox' for testing, 'production' for live
NEXT_PUBLIC_CASHFREE_MODE=sandbox
```
**Status:** ❌ OPTIONAL (site works without, but checkout won't process payments)  
**Get From:** https://dashboard.cashfree.com → Developers → API Keys  
**Used For:** Processing payments during checkout  
**Features Affected:** Checkout page, payment processing

---

#### Analytics & Tracking
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=XXXXXXXXXXXXXXX
```
**Status:** ⚠️ OPTIONAL (nice to have)  
**Get From:**
- Google Analytics: https://analytics.google.com
- Facebook Pixel: https://business.facebook.com/pixels
**Used For:** Tracking user behavior, marketing insights

---

### 🟡 TIER 3: NICE-TO-HAVE (Advanced features)

#### AI Recommendations
```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
```
**Status:** ❌ OPTIONAL  
**Get From:** https://console.anthropic.com/  
**Used For:** AI-powered product recommendations  
**Features Affected:** Product recommendation engine

---

#### Instagram Integration
```env
INSTAGRAM_ACCESS_TOKEN=your_token
INSTAGRAM_USER_ID=your_user_id
```
**Status:** ❌ OPTIONAL  
**Get From:** Meta Business Suite → Settings → Instagram  
**Used For:** Auto-posting to Instagram, Instagram content  
**Features Affected:** Instagram automation, social media feeds

---

#### Admin & Security
```env
ADMIN_SECRET_KEY=your_admin_secret_random_string
ADMIN_EMAIL=admin@wholelotofnature.com
CRON_SECRET=your_cron_secret_for_scheduled_tasks
```
**Status:** ⚠️ CHECK  
**Used For:** Admin route protection, scheduled tasks, notifications

---

#### AI Content Providers (Backup)
```env
OPENAI_API_KEY=sk_your_key
PERPLEXITY_API_KEY=pplx_your_key
```
**Status:** ❌ OPTIONAL (Backup for AI features)  
**Used For:** Blog generation, content creation if ANTHROPIC not available

---

#### Database
```env
DATABASE_URL=postgresql://...
```
**Status:** ✅ Likely already set (Prisma uses this)  
**Used For:** User accounts, order history, loyalty points

---

---

## 🎯 Quick Setup Checklist

### Step 1: Verify TIER 1 is Set in Vercel ✅
```
□ NEXT_PUBLIC_WORDPRESS_URL
□ WC_CONSUMER_KEY  
□ WC_CONSUMER_SECRET
□ WORDPRESS_URL
□ NEXTAUTH_SECRET
□ NEXTAUTH_URL
```

### Step 2: Add TIER 2 (One at a time)
```
□ RESEND_API_KEY (for email/password reset)
□ CASHFREE_APP_ID, CASHFREE_SECRET_KEY (if you want checkout)
□ GA tracking IDs (optional but recommended)
□ FB Pixel ID (optional but recommended)
```

### Step 3: Add TIER 3 (Advanced, as needed)
```
□ ADMIN_SECRET_KEY
□ ADMIN_EMAIL
□ CRON_SECRET
□ ANTHROPIC_API_KEY (if using AI)
□ INSTAGRAM tokens (if automating social)
```

---

## 📱 What Each Feature Needs

| Feature | Required Env Vars | Status |
|---------|------------------|--------|
| **View Products** | WC_CONSUMER_KEY, WC_CONSUMER_SECRET, WORDPRESS_URL | ✅ WORKING |
| **User Accounts** | NEXTAUTH_SECRET, NEXTAUTH_URL | ⚠️ CHECK |
| **Login/Signup** | NEXTAUTH_SECRET, NEXTAUTH_URL, Google OAuth (optional) | ⚠️ CHECK |
| **Forgot Password** | RESEND_API_KEY, MARKETING_EMAIL_FROM | ❌ NEEDS SETUP |
| **Checkout** | CASHFREE_APP_ID, CASHFREE_SECRET_KEY | ❌ OPTIONAL |
| **Payment Processing** | CASHFREE_* vars (payment mode) | ❌ OPTIONAL |
| **Order Emails** | RESEND_API_KEY | ❌ NEEDS SETUP |
| **Analytics Tracking** | NEXT_PUBLIC_GA_ID, NEXT_PUBLIC_FB_PIXEL_ID | ⚠️ OPTIONAL |
| **AI Recommendations** | ANTHROPIC_API_KEY | ❌ OPTIONAL |
| **Blog Generation** | ANTHROPIC_API_KEY or OPENAI_API_KEY | ❌ OPTIONAL |
| **Instagram Auto-Post** | INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_USER_ID | ❌ OPTIONAL |
| **Admin Panel** | ADMIN_SECRET_KEY, ADMIN_EMAIL | ⚠️ CHECK |

---

## 🔧 How to Add Env Vars to Vercel

1. Go to: **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Click **"Add New"**
3. Enter: Name (e.g., `RESEND_API_KEY`), Value (your actual key)
4. Select: **Production** (and Preview if you want testing)
5. Click **Save**
6. **REDEPLOY** - Go to Deployments → Click latest → **Redeploy**
7. Wait 2-3 minutes for new deployment

---

## 📊 Current Feature Support Matrix

```
✅ = Works
⚠️ = Partially works / Needs config
❌ = Not working / Needs API key

HOME PAGE
✅ Hero section
✅ Featured products
✅ Product cards with images
✅ Categories
⚠️ Analytics tracking (needs GA setup)

SHOP PAGE
✅ Browse all products
✅ Filter by category
✅ Product grid display
✅ Product details view
⚠️ Related products (AI-powered needs ANTHROPIC_API_KEY)
❌ Product reviews (depends on database)

BLOG
✅ Blog posts display
✅ Blog categories
✅ Search blog posts
❌ Blog generation (needs ANTHROPIC_API_KEY)

USER ACCOUNT
⚠️ Login/Signup (NEXTAUTH needs setup)
⚠️ Password reset (needs RESEND_API_KEY)
⚠️ Order history (needs WooCommerce sync)
❌ Loyalty points (needs full setup)

CHECKOUT
❌ Payment processing (needs CASHFREE keys)
⚠️ Shipping calculation
❌ Order confirmation email (needs RESEND_API_KEY)

ADMIN PANEL
⚠️ Access control (needs ADMIN_SECRET_KEY)
❌ Email campaigns (needs RESEND_API_KEY)
❌ Analytics dashboard (needs GA setup)
❌ Content automation (needs ANTHROPIC_API_KEY)

MARKETING
❌ Instagram auto-posting (needs Instagram tokens)
❌ Email automation (needs RESEND_API_KEY)
❌ SMS (not implemented)
```

---

## 🚀 Recommended Setup Order

### Phase 1: Core (2-3 hours)
1. ✅ Verify WooCommerce vars (DONE)
2. Verify NEXTAUTH_SECRET and NEXTAUTH_URL
3. Add RESEND_API_KEY for emails

**Result:** Users can login, reset password, receive emails

### Phase 2: Payment (1-2 hours)
4. Add CASHFREE keys
5. Test checkout flow

**Result:** Real checkout/payments work

### Phase 3: Analytics (30 mins)
6. Add Google Analytics IDs
7. Add Facebook Pixel

**Result:** Tracking user behavior

### Phase 4: AI & Automation (1-2 hours)
8. Add ANTHROPIC_API_KEY
9. Add Instagram tokens

**Result:** AI recommendations, social automation

---

## 🐛 Known Issues & Fixes

### Issue: "Forgot Password" not sending emails
**Fix:** Add `RESEND_API_KEY` and redeploy

### Issue: Checkout page shows error
**Fix:** Add `CASHFREE_APP_ID` and `CASHFREE_SECRET_KEY` and redeploy

### Issue: Products not showing recommendations
**Fix:** Add `ANTHROPIC_API_KEY` (optional, site works without it)

### Issue: Account login not working
**Fix:** Verify `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are set

---

## ✨ Next Steps for YOU

1. **Check Vercel Settings** - Which TIER 1 vars are actually set?
2. **Add Tier 2 Emails** - Get RESEND_API_KEY (free tier available)
3. **Setup Payment** - Add CASHFREE keys if you want payments to work
4. **Test Features** - Test login, password reset, checkout
5. **Add Analytics** - Google Analytics for tracking
6. **Optional AI** - Anthropic key for smart recommendations

---

**Total Setup Time: 2-4 hours**  
**Cost: $0 if using free tiers + your domain costs**
