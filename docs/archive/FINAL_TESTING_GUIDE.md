# 🎯 FINAL TESTING GUIDE - Critical Systems Check

**Build Status:** ✅ PASSING  
**Last Deploy:** January 18, 2026  
**Commit:** `f943e2d`  

---

## 🚨 CRITICAL SYSTEMS TO TEST

### 1. CART SYSTEM (PRIMARY ISSUE)

#### What You Should See:
```
✅ Product page loads
✅ Product shows: [Quantity dropdown] [Add to Cart button]
✅ Click "Add to Cart"
✅ Cart sidebar slides in from right
✅ Item appears in cart
✅ Quantity selector works (+/- buttons)
✅ Remove button works
```

#### What's Working:
- ✅ WooCommerce Store API connected
- ✅ Cart endpoint at `/api/cart` 
- ✅ CartService properly calling API
- ✅ Zustand store persists cart
- ✅ Cart UI components display correctly

#### Test URL:
```
https://www.wholelotofnature.com/shop
```

#### If Cart Fails:
```
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors when clicking "Add to Cart"
4. Common errors:
   - "Cannot read property 'addItem'" → Cart service not loaded
   - "POST /api/cart 401" → Auth issue with WooCommerce
   - "POST /api/cart 500" → Server error (check Vercel logs)
```

---

### 2. PRODUCT STOCK STATUS

#### What You Should See:
```
✅ All products show "Add to Cart" button (not "Out of Stock")
✅ Quantity selector enabled
✅ Can select quantity 1-10
✅ Button says "Add to Cart" (not disabled)
```

#### If Showing "Out of Stock":
```
1. This means: product.in_stock = false
2. WooCommerce is returning: stock_status: 'outofstock'
3. Check WooCommerce dashboard:
   - Log into: https://www.wholelotofnature.com/wp-admin
   - Go to Products
   - Check "Stock Status" for each product
   - Should be: "In stock"
```

#### Expected Product Data:
```javascript
{
  id: 123,
  name: "Product Name",
  price: "29.99",
  in_stock: true,           // ← This should be TRUE
  stock_quantity: 10,        // ← Quantity available
  stock_status: "instock"    // ← Should be "instock"
}
```

---

### 3. ACCOUNT & LOGIN SYSTEM

#### Test URLs:
```
📍 Sign Up:      https://www.wholelotofnature.com/auth/signup
📍 Sign In:      https://www.wholelotofnature.com/auth/signin
📍 Forgot Pass:  https://www.wholelotofnature.com/auth/forgot-password
📍 Profile:      https://www.wholelotofnature.com/account/profile
📍 Orders:       https://www.wholelotofnature.com/account/orders
```

#### What You Should See:
```
✅ Sign Up page loads with email/password fields
✅ Sign In page has email/password and "Sign in with Google"
✅ Create account works
✅ Login works
✅ Session persists after refresh
✅ Profile page shows user info
✅ Orders page shows order history
```

#### If Login Fails:
```
1. Check Vercel Environment Variables:
   ✅ NEXTAUTH_SECRET is set? (should be long random string)
   ✅ NEXTAUTH_URL is set? (should be https://www.wholelotofnature.com)
   
2. Check Database:
   - NextAuth uses database for sessions
   - Check DATABASE_URL in Vercel settings
   - Database should have users table
   
3. In browser DevTools:
   - Go to Application → Cookies
   - Should see: next-auth.session-token
   - If not there, session creation failed
   
4. Common Issues:
   - "unable to connect to database" → Missing DATABASE_URL
   - "Invalid credentials" → User not created or wrong password
   - "email already exists" → Account already created
```

---

### 4. EMAIL SYSTEM (RESEND)

#### Test Email Sending:
```
1. Go to https://www.wholelotofnature.com/auth/signup
2. Create new account
3. Check your email inbox in 30 seconds
4. Should receive: "Verify your email"
5. Click verification link
6. Account should be activated
```

#### Test Password Reset:
```
1. Go to https://www.wholelotofnature.com/auth/forgot-password
2. Enter your email
3. Check inbox for "Reset password" email
4. Click reset link
5. Set new password
6. Try logging in with new password
```

#### If Emails Don't Arrive:
```
1. Check spam/junk folder
2. Check Resend dashboard:
   https://resend.com → Emails section
3. Look for failed emails
4. Common issues:
   - "Invalid domain" → Email configured wrong in Resend
   - "Rate limited" → Too many requests
   - "Invalid recipient" → Email address formatted wrong
```

#### Resend Status:
```
✅ API Key Added: re_bf3Y32jD_3ontoZ7J9xtnuYxvhy3N6xow
✅ Email templates configured
✅ From: noreply@wholelotofnature.com
```

---

### 5. PAYMENT SYSTEM (CASHFREE)

#### Test Payment Flow:
```
1. Add product to cart
2. Click "Proceed to Checkout"
3. Enter shipping address
4. Choose payment method: Card or UPI
5. Click "Pay Now"
6. Should redirect to Cashfree
7. Complete test payment
8. Should return to confirmation page
9. Email receipt should arrive
```

#### Cashfree Test Credentials:
```
✅ App ID: Added
✅ Secret Key: Added
✅ Mode: Test (for testing)
✅ Mode: Production (for live)

Test Card (if in test mode):
- Card: 4111111111111111
- CVV: 123
- Expiry: Any future date
```

#### If Payment Fails:
```
1. Check Cashfree dashboard:
   https://merchant.cashfree.com
2. Look at "Transactions"
3. See if payment attempt logged
4. Common errors:
   - "Invalid merchant" → App ID/Secret wrong
   - "Amount mismatch" → Cart total doesn't match
   - "Timeout" → Network issue (try again)
```

#### Payment Status Check:
```
✅ CASHFREE_APP_ID: Added to Vercel
✅ CASHFREE_SECRET_KEY: Added to Vercel  
✅ Webhook: Configured in /api/payments/cashfree/webhook
✅ Webhook URL: https://www.wholelotofnature.com/api/payments/cashfree/webhook
```

---

### 6. ANALYTICS (GOOGLE ANALYTICS)

#### Test Analytics:
```
1. Visit website: https://www.wholelotofnature.com
2. Wait 5-10 minutes
3. Go to: Google Analytics 4 Dashboard
4. Check "Real-time" section
5. You should see yourself as active user
6. Click around the site, check events tracked
```

#### Tracking Should Show:
```
✅ Page views
✅ User sessions
✅ Click events
✅ Form submissions
✅ E-commerce events (add to cart, purchase)
```

#### If Nothing Shows:
```
1. Check analytics code is in pages
2. Verify GA Measurement ID is correct:
   G-GTNKXBTF7P
3. Give it more time (real-time has delay)
4. Check in: GA Dashboard → Admin → Data Streams
```

#### Analytics Status:
```
✅ NEXT_PUBLIC_GA_MEASUREMENT_ID: G-GTNKXBTF7P
✅ Tracking installed in: _app.tsx
✅ Events configured in cartStore and checkout
```

---

## 📋 COMPLETE TEST CHECKLIST

### Phase 1: Basic Functionality (5 min)
- [ ] Website loads at https://www.wholelotofnature.com
- [ ] Products visible on /shop page
- [ ] Product images load correctly
- [ ] No console errors in DevTools

### Phase 2: Cart System (10 min)
- [ ] Can add product to cart
- [ ] Cart sidebar appears
- [ ] Item visible in cart
- [ ] Quantity selector works
- [ ] Can remove item from cart
- [ ] Cart persists after refresh
- [ ] Empty cart button works

### Phase 3: Authentication (10 min)
- [ ] Sign up page loads
- [ ] Can create new account
- [ ] Verification email arrives
- [ ] Can verify email
- [ ] Can sign in with account
- [ ] Profile page shows user info
- [ ] Can logout

### Phase 4: Checkout (10 min)
- [ ] Cart → "Proceed to Checkout" button
- [ ] Checkout page loads
- [ ] Address form works
- [ ] Can select shipping method
- [ ] Can select payment method
- [ ] Payment button appears

### Phase 5: Payment (10 min)
- [ ] Click "Pay" or "Complete Order"
- [ ] Redirects to Cashfree
- [ ] Can enter payment details
- [ ] Payment processes
- [ ] Redirects back to confirmation page
- [ ] Confirmation email arrives

### Phase 6: Advanced (5 min)
- [ ] Can browse categories
- [ ] Search functionality works
- [ ] Blog page loads
- [ ] Contact form works
- [ ] Footer links work

---

## 🔍 TROUBLESHOOTING GUIDE

### Issue: "Add to Cart" Does Nothing
```
SOLUTION:
1. Open DevTools (F12) → Console
2. Click "Add to Cart"
3. Look for JavaScript error
4. Report the error message

Likely causes:
- CartService not initialized
- WooCommerce API key missing
- Cart endpoint not responding
```

### Issue: All Products "Out of Stock"
```
SOLUTION:
1. Go to: https://www.wholelotofnature.com/wp-admin
2. Go to Products section
3. Edit first product
4. Check "Stock Status" dropdown
5. Should say "In Stock"
6. Save and refresh site

If still "Out of Stock":
- Check WooCommerce API is returning stock_status correctly
- Run: curl https://www.wholelotofnature.com/api/products
- Look for "in_stock": true in response
```

### Issue: Can't Login
```
SOLUTION:
1. Check account was created (got signup email?)
2. Verify email address (click link in email)
3. Try "Forgot Password" to reset
4. Check Vercel Environment Variables set:
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL
   - DATABASE_URL

If still broken:
- Check Vercel logs for database connection errors
- Verify database has users table
```

### Issue: No Emails Arriving
```
SOLUTION:
1. Check spam/junk folder
2. Check Resend dashboard: https://resend.com
3. Look for failed emails
4. Check sender email set correctly: noreply@wholelotofnature.com

If emails showing as failed:
- Domain may not be verified
- Check Resend dashboard → Domains → Verify domain
```

### Issue: Payment Fails
```
SOLUTION:
1. Check Cashfree keys added to Vercel:
   - CASHFREE_APP_ID
   - CASHFREE_SECRET_KEY
2. Use test credentials first
3. Check test card: 4111111111111111
4. Try again (sometimes timeout)

If still failing:
- Check Cashfree dashboard → Transactions
- See if payment was attempted
- Read error message from Cashfree
```

---

## 🛠️ VERCEL ENVIRONMENT VARIABLES CHECKLIST

Go to: https://vercel.com → Your Project → Settings → Environment Variables

**Should have:**
```
✅ NEXTAUTH_SECRET      (long random string)
✅ NEXTAUTH_URL         (https://www.wholelotofnature.com)
✅ DATABASE_URL         (postgres:// or mysql://)
✅ RESEND_API_KEY       (re_xxxxxxxxxxxxx)
✅ CASHFREE_APP_ID      (xxxxxxxxxx)
✅ CASHFREE_SECRET_KEY  (xxxxxxxxxx)
✅ NEXT_PUBLIC_GA_MEASUREMENT_ID (G-xxxxxxxxxx)
```

**Missing variables will cause:**
- Auth to fail → Can't login
- Email to fail → No verification emails
- Payment to fail → Can't complete purchase
- Analytics to fail → No tracking

---

## 📞 WHEN TO REPORT A BUG

Report an issue if you find:
1. ❌ Cart not adding items
2. ❌ All products showing out of stock
3. ❌ Can't create account
4. ❌ Can't login to existing account
5. ❌ Email not arriving
6. ❌ Payment page not loading
7. ❌ JavaScript error in console
8. ❌ 404 or 500 error on any page

**When reporting, include:**
- Exact URL you were on
- What you clicked
- What you expected to happen
- What actually happened
- Screenshot or error message
- Browser console error (if any)

---

## ✅ SIGN-OFF

**By:** Claude AI  
**Date:** January 18, 2026  
**Status:** All systems ready for testing  
**Last Commit:** f943e2d  

**NEXT STEP:** Run through the complete test checklist above and report any failures!
"