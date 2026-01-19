# 🧪 Website Testing & Functionality Checklist

## ✅ Currently Working Features

### Homepage
- [x] Hero section loads
- [x] Featured products display
- [x] Category showcase
- [x] Blog preview section
- [x] Navigation bar works

### Shop Page  
- [x] Product grid displays
- [x] Product cards show images & prices
- [x] Filter by category works
- [x] Sort options available
- [x] Product detail page loads

### Blog
- [x] Blog list displays
- [x] Blog categories work
- [x] Individual post pages load
- [x] Blog search works

---

## ⚠️ Features That Need Setup (API Keys Required)

### 1. User Accounts & Authentication
**Status:** ⚠️ Partially working (needs testing)  
**Required Env Vars:**
- `NEXTAUTH_SECRET` ✓ (should be set)
- `NEXTAUTH_URL` ✓ (should be set)
- `GOOGLE_CLIENT_ID` (optional - for Google login)
- `GOOGLE_CLIENT_SECRET` (optional - for Google login)

**To Test:**
1. Go to: https://www.wholelotofnature.com/login
2. Try signing up with email
3. Try logging in
4. Try "Forgot Password"

**Expected Issues:**
- Login might work (local auth)
- Password reset will fail (needs `RESEND_API_KEY`)
- Google login will fail (needs Google OAuth creds)

---

### 2. Email Service (Password Reset, Order Emails)
**Status:** ❌ NOT WORKING  
**Required Env Vars:**
- `RESEND_API_KEY` ❌ (MISSING - You need to add this)
- `MARKETING_EMAIL_FROM` (optional)

**What Breaks Without It:**
- Forgot password emails won't send
- Order confirmation emails won't send  
- Marketing emails won't work

**How to Fix:**
1. Go to https://resend.com/
2. Sign up (free tier available)
3. Get API key from Settings
4. Add to Vercel as `RESEND_API_KEY`
5. Redeploy

**Time to Fix:** 10 minutes

---

### 3. Payment & Checkout
**Status:** ❌ PARTIALLY WORKING  
**Required Env Vars:**
- `CASHFREE_APP_ID` ❌ (MISSING)
- `CASHFREE_SECRET_KEY` ❌ (MISSING)  
- `CASHFREE_MODE` (sandbox or production)
- `NEXT_PUBLIC_CASHFREE_MODE`

**What Breaks Without It:**
- Checkout page will show error
- Payment processing won't work
- Users can add to cart but can't pay

**How to Fix:**
1. Go to https://merchant.cashfree.com/
2. Sign up and verify
3. Go to Developers → API Keys
4. Copy App ID and Secret Key
5. Add to Vercel
6. Redeploy

**Time to Fix:** 15-30 minutes

---

### 4. Analytics & Tracking
**Status:** ⚠️ OPTIONAL (site works without)  
**Required Env Vars:**
- `NEXT_PUBLIC_GA_ID` (Google Analytics)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_FB_PIXEL_ID` (Facebook Pixel)

**What Breaks Without It:**
- Google Analytics tracking won't work
- Facebook Pixel won't track events
- You won't see user behavior data

**How to Fix:**
1. Google Analytics:
   - Go to https://analytics.google.com
   - Create/find your property
   - Get Measurement ID (G-XXXXXXX)
   - Add as `NEXT_PUBLIC_GA_MEASUREMENT_ID`

2. Facebook Pixel:
   - Go to https://business.facebook.com/
   - Go to Events Manager
   - Get Pixel ID
   - Add as `NEXT_PUBLIC_FB_PIXEL_ID`

3. Redeploy

**Time to Fix:** 20 minutes

---

### 5. AI Features (Recommendations, Blog Generation)
**Status:** ⚠️ OPTIONAL (site works without)  
**Required Env Vars:**
- `ANTHROPIC_API_KEY` ❌ (MISSING)

**What Breaks Without It:**
- AI product recommendations won't show
- Blog generation won't work
- Smart content features disabled

**How to Fix:**
1. Go to https://console.anthropic.com/
2. Sign up and get API key
3. Add as `ANTHROPIC_API_KEY` to Vercel
4. Redeploy

**Time to Fix:** 5 minutes

---

### 6. Social Media Automation (Instagram)
**Status:** ❌ NOT WORKING (OPTIONAL)  
**Required Env Vars:**
- `INSTAGRAM_ACCESS_TOKEN`
- `INSTAGRAM_USER_ID`
- `INSTAGRAM_APP_ID`
- `INSTAGRAM_APP_SECRET`

**How to Fix:**
- Requires Meta Business approval
- Integrate with Meta Graph API
- More complex setup

**Skip For Now:** This is optional, focus on core features

---

## 🔍 Quick Feature Test Checklist

### Phase 1: Core Shopping (5 mins)
- [ ] Visit https://www.wholelotofnature.com
- [ ] Can you see products?
- [ ] Can you click on a product?
- [ ] Do product details load?
- [ ] Can you add to cart?

### Phase 2: User Accounts (5 mins)
- [ ] Go to /login page
- [ ] Try signup (check if email works)
- [ ] Try login
- [ ] Try "Forgot Password"
- [ ] Check if email was received

### Phase 3: Blog (3 mins)
- [ ] Go to /blog
- [ ] Click on a post
- [ ] Can you read the blog?
- [ ] Does blog search work?

### Phase 4: Checkout (5 mins)
- [ ] Add item to cart
- [ ] Go to checkout
- [ ] Try entering payment info
- [ ] Does payment process?

### Phase 5: Admin (3 mins)
- [ ] Try accessing /admin
- [ ] Can you see admin dashboard?
- [ ] Can you access settings?

---

## 📊 Functionality Status by Priority

| Feature | Status | Issue | Priority |
|---------|--------|-------|----------|
| **View Products** | ✅ WORKING | None | DONE |
| **Product Details** | ✅ WORKING | None | DONE |
| **Add to Cart** | ✅ WORKING | None | DONE |
| **User Signup** | ⚠️ PARTIAL | Might need NextAuth debug | HIGH |
| **User Login** | ⚠️ PARTIAL | Might need NextAuth debug | HIGH |
| **Password Reset** | ❌ BROKEN | Needs RESEND_API_KEY | HIGH |
| **Checkout** | ❌ BROKEN | Needs CASHFREE keys | HIGH |
| **Payments** | ❌ BROKEN | Needs CASHFREE setup | HIGH |
| **Order Emails** | ❌ BROKEN | Needs RESEND_API_KEY | MEDIUM |
| **Analytics** | ❌ NOT SET | Needs GA/FB setup | MEDIUM |
| **Blog Generation** | ❌ BROKEN | Needs ANTHROPIC key | LOW |
| **AI Recommendations** | ❌ BROKEN | Needs ANTHROPIC key | LOW |
| **Instagram Posting** | ❌ BROKEN | Needs setup | LOW |

---

## 🎯 Recommended Testing Order

### Today (30 mins)
1. ✅ Verify products show on shop page
2. ✅ Verify product details load
3. ⚠️ Test user login/signup
4. ❌ Test password reset (will fail - add RESEND_API_KEY)

### Tomorrow (1 hour)  
5. ❌ Add RESEND_API_KEY, test password reset
6. ❌ Add CASHFREE keys, test checkout
7. Add Google Analytics
8. Add Facebook Pixel

### Next Week (Advanced)
9. Setup ANTHROPIC key for AI features
10. Setup Instagram automation
11. Fine-tune messaging and branding

---

## 🚨 Critical Issues to Fix First

### Issue #1: Account Creation/Login
**Severity:** HIGH  
**Impact:** Users can't create accounts

**Fix Steps:**
1. Verify `NEXTAUTH_SECRET` is set in Vercel
2. Verify `NEXTAUTH_URL` is set to: `https://www.wholelotofnature.com`
3. Check if signup page works
4. If not, check browser console for errors

---

### Issue #2: Forgot Password Not Working
**Severity:** HIGH  
**Impact:** Users can't reset passwords

**Fix Steps:**
1. Add `RESEND_API_KEY` to Vercel
2. Add `MARKETING_EMAIL_FROM` (optional, but recommended)
3. Redeploy
4. Test password reset at: /auth/forgot-password

---

### Issue #3: Checkout Errors
**Severity:** HIGH  
**Impact:** Users can't pay

**Fix Steps:**
1. Add `CASHFREE_APP_ID` to Vercel
2. Add `CASHFREE_SECRET_KEY` to Vercel
3. Add `NEXT_PUBLIC_CASHFREE_MODE=sandbox` (for testing)
4. Redeploy
5. Test checkout flow

---

## ✨ What to Prioritize

**Focus On (Will have biggest impact):**
1. ✅ Products (DONE) ← Revenue driver
2. 👤 User Accounts (NEXT) ← Needed for orders
3. 💳 Payments (NEEDED) ← Actually makes money
4. 📧 Emails (NEEDED) ← Customer communication
5. 📊 Analytics (NICE) ← Business intelligence

**Skip For Now:**
- Blog generation (too early)
- Instagram automation (can wait)
- Loyalty program (advanced feature)
- Advanced AI features (can add later)

---

## 📝 Notes

- Build succeeds ✅
- No critical errors in code ✅
- Only linting warnings (can ignore) ⚠️
- Missing API keys (you need to add these) ❌
