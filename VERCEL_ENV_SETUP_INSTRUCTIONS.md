# VERCEL ENVIRONMENT VARIABLES - SETUP INSTRUCTIONS

## Quick Setup (Copy-Paste Ready)

### Variables to Add to Vercel

```
WC_CONSUMER_KEY
ck_7c14b9262866f37bee55394c53c727cf4a6c987f

WC_CONSUMER_SECRET
cs_25c1e29325113145d0c13913007cc1a92d965bce

WORDPRESS_URL
https://admin.wholelotofnature.com

WORDPRESS_API_URL
https://admin.wholelotofnature.com/wp-json

NEXTAUTH_URL
https://wholelotofnature.com

NEXTAUTH_SECRET
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

NODE_ENV
production
```

---

## Step-by-Step Instructions

### Step 1: Open Vercel Dashboard
1. Go to https://vercel.com
2. Log in with your account
3. Find "wholelotofnature" in Projects
4. Click on it

### Step 2: Go to Environment Variables
1. Click "Settings" (top menu)
2. Click "Environment Variables" (left sidebar)
3. You'll see a form that says "Add New"

### Step 3: Add WC_CONSUMER_KEY
1. In the "Name" field enter: `WC_CONSUMER_KEY`
2. In the "Value" field enter: `ck_7c14b9262866f37bee55394c53c727cf4a6c987f`
3. Leave "Environment" as "Production" (or select all)
4. Click "Add"

### Step 4: Add WC_CONSUMER_SECRET
1. Click "Add New" again
2. Name: `WC_CONSUMER_SECRET`
3. Value: `cs_25c1e29325113145d0c13913007cc1a92d965bce`
4. Click "Add"

### Step 5: Add WORDPRESS_URL
1. Click "Add New"
2. Name: `WORDPRESS_URL`
3. Value: `https://admin.wholelotofnature.com`
4. Click "Add"

### Step 6: Add WORDPRESS_API_URL
1. Click "Add New"
2. Name: `WORDPRESS_API_URL`
3. Value: `https://admin.wholelotofnature.com/wp-json`
4. Click "Add"

### Step 7: Verify All Variables Added
You should now see in the list:
- ✅ WC_CONSUMER_KEY = ck_...
- ✅ WC_CONSUMER_SECRET = cs_...
- ✅ WORDPRESS_URL = https://admin.wholelotofnature.com
- ✅ WORDPRESS_API_URL = https://admin.wholelotofnature.com/wp-json

### Step 8: Redeploy
1. Go to "Deployments" (top menu)
2. Click on the latest deployment
3. Click "Redeploy" button
4. Wait for deployment to complete (2-5 minutes)

---

## Verification

After redeploy completes:

1. Open https://wholelotofnature.com
2. Check homepage - should show REAL plants, not demo
3. Check shop page - should load products
4. Open DevTools (F12) → Network tab
5. Reload page
6. Look for `/api/products` request
7. Should see response with `"success": true` and product data

---

## If You See Errors

### Error: 401 Unauthorized
**Cause:** Credentials are wrong  
**Fix:**
1. Check WC_CONSUMER_KEY starts with "ck_"
2. Check WC_CONSUMER_SECRET starts with "cs_"
3. Verify values match exactly (case sensitive)
4. In WordPress, check WooCommerce → Settings → REST API Clients
5. Make sure keys are "Approved"

### Error: Cannot connect to WordPress
**Cause:** Wrong WordPress URL  
**Fix:**
1. WORDPRESS_URL should be: `https://admin.wholelotofnature.com`
2. NOT `https://wholelotofnature.com` (without admin)
3. WORDPRESS_API_URL should be: `https://admin.wholelotofnature.com/wp-json`

### Products still not showing
**Cause:** Variables not saved or redeploy not complete  
**Fix:**
1. Go back to Environment Variables
2. Verify all 4 variables are listed
3. Click Deployments → Latest → Redeploy again
4. Wait 5 minutes for redeploy to complete
5. Hard refresh browser (Ctrl+Shift+R)

---

## Complete Checklist

- [ ] Log in to Vercel
- [ ] Open wholelotofnature project
- [ ] Go to Settings → Environment Variables
- [ ] Add WC_CONSUMER_KEY with value starting with "ck_"
- [ ] Add WC_CONSUMER_SECRET with value starting with "cs_"
- [ ] Add WORDPRESS_URL = https://admin.wholelotofnature.com
- [ ] Add WORDPRESS_API_URL = https://admin.wholelotofnature.com/wp-json
- [ ] Verify all 4 variables appear in the list
- [ ] Click Deployments
- [ ] Click latest deployment
- [ ] Click "Redeploy"
- [ ] Wait for deployment to complete (green checkmark)
- [ ] Open https://wholelotofnature.com
- [ ] Verify homepage shows REAL products
- [ ] Check API: open /api/products in browser
- [ ] Verify response shows real products (not demo)

---

## Time Required

Total time: **5-10 minutes**
- Add variables: 5 minutes
- Redeploy: 3 minutes
- Verification: 2 minutes

---

**Once completed, products will display immediately on the site.**
