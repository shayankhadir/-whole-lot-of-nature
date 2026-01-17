# IMPLEMENTATION GUIDE - WooCommerce Integration Fix

## Quick Start (5 minutes)

### Step 1: Add Vercel Environment Variables (CRITICAL)
1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your project (wholelotofnature)
3. Go to Settings → Environment Variables
4. Add these variables:

```
WC_CONSUMER_KEY=ck_7c14b9262866f37bee55394c53c727cf4a6c987f
WC_CONSUMER_SECRET=cs_25c1e29325113145d0c13913007cc1a92d965bce
WORDPRESS_URL=https://admin.wholelotofnature.com
WORDPRESS_API_URL=https://admin.wholelotofnature.com/wp-json
```

5. Click "Save" for each variable
6. Redeploy: Click "Deployments" → latest → "Redeploy"

### Step 2: Remove .env.production File

In VS Code Terminal:
```powershell
cd "c:\Users\USER\Documents\whole lot of nature\Whole lot of nature\whole-lot-of-nature"
Remove-Item .env.production
echo ".env.production" >> .gitignore
git add .gitignore
git commit -m "Remove .env.production - use Vercel env vars instead"
git push
```

### Step 3: Code Changes (Already Applied)

The following files have been updated automatically:

1. ✅ `.env.example` - Fixed WordPress URLs (admin subdomain)
2. ✅ `src/lib/services/woocommerceService.ts` - Added error throwing
3. ✅ `src/app/api/products/route.ts` - Improved error messages
4. ✅ `src/components/home/PremiumFeaturedShowcase.tsx` - Added error visibility

### Step 4: Test Local

```powershell
npm run dev

# In browser: http://localhost:3000/api/products
# Should return products with success: true
```

### Step 5: Deploy

```powershell
git add .
git commit -m "Fix: WooCommerce integration - add error handling and env consolidation"
git push

# Vercel will auto-deploy. Wait for success.
# Check: https://wholelotofnature.com
```

---

## What Was Fixed

### Problem 1: Multiple .env Files (CRITICAL)
**Was:** .env.production missing WC_CONSUMER_KEY/SECRET  
**Now:** Only using .env (local) + Vercel environment variables (production)

### Problem 2: Silent Errors (HIGH)
**Was:** API errors caught and fallback to demo products without warning  
**Now:** Error messages shown to users on homepage

### Problem 3: Poor Error Messages (MEDIUM)
**Was:** Generic "Unknown error" messages  
**Now:** Specific error types (AUTHENTICATION_ERROR, CONNECTION_ERROR, etc.) with detailed debugging info

---

## Verification Checklist

- [ ] Vercel environment variables set (WC_CONSUMER_KEY, WC_CONSUMER_SECRET)
- [ ] .env.production file deleted
- [ ] Test /api/products endpoint returns real products
- [ ] Homepage shows real products (not DEMO_PRODUCTS)
- [ ] Error messages appear if API fails
- [ ] Deployment successful on Vercel
- [ ] Shop page loads products correctly
- [ ] Product details page works

---

## If It Still Doesn't Work

### Check 1: Verify Credentials in Vercel
```
Settings → Environment Variables → Look for WC_CONSUMER_KEY
```
Should show the key starting with "ck_"

### Check 2: Check Server Logs
```
Vercel → Deployments → Latest → Function Logs
Look for "[WooCommerce Service Init]" message
```

Should show:
```
[WooCommerce Service Init] {
  hasKey: true,
  hasSecret: true,
  url: 'https://admin.wholelotofnature.com'
}
```

### Check 3: Test API Directly
```powershell
curl https://wholelotofnature.com/api/products
```

Should return `"success": true` with product data

### Check 4: Check WordPress REST API
```powershell
curl https://admin.wholelotofnature.com/wp-json/wc/v3/products \
  -u "ck_7c14b9262866f37bee55394c53c727cf4a6c987f:cs_25c1e29325113145d0c13913007cc1a92d965bce"
```

If 401 → Credentials are wrong  
If 200 → WordPress API working

---

## Files Modified

1. `.env.example` - Updated with correct URLs
2. `src/lib/services/woocommerceService.ts` - Error throwing on missing credentials
3. `src/app/api/products/route.ts` - Better error messages and status codes
4. `src/components/home/PremiumFeaturedShowcase.tsx` - Error visibility

## No Breaking Changes

All changes are backward compatible. Existing code continues to work, but with better error handling and visibility.

---

## Need More Help?

**Check logs:**
- Local: Terminal where `npm run dev` runs
- Production: Vercel → Deployments → Function Logs

**Test endpoint:**
- Local: `http://localhost:3000/api/products?limit=3`
- Production: `https://wholelotofnature.com/api/products?limit=3`

**Debug database:**
- The products ARE in WooCommerce (WordPress)
- The API SHOULD work if credentials are set
- If API fails, check:
  1. WC_CONSUMER_KEY/SECRET in Vercel ✓
  2. WORDPRESS_URL points to admin subdomain ✓
  3. WordPress REST API is enabled ✓
