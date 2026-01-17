# 🚀 VERCEL ENVIRONMENT VARIABLES - SETUP GUIDE

**CRITICAL:** These variables MUST be set in Vercel for WooCommerce to work in production.

## ⚠️ WHY THIS IS NEEDED

Your `node_modules/.env` file has WooCommerce credentials, but:
- ❌ Local `.env` doesn't deploy to Vercel
- ❌ Vercel needs variables explicitly set in dashboard
- ❌ Without these, API calls return 401 Unauthorized
- ❌ 401 errors trigger silent fallback to demo products

## ✅ THE FIX: Add These to Vercel

### **STEP 1: Go to Vercel Dashboard**
1. Visit: https://vercel.com/dashboard
2. Select project: `wholelotofnature`
3. Click: **Settings** (top menu)
4. Click: **Environment Variables** (left sidebar)

### **STEP 2: Add 4 Critical Variables**

Copy-paste each variable name and value exactly:

#### **Variable #1: WC_CONSUMER_KEY**
```
Name:  WC_CONSUMER_KEY
Value: ck_7c14b9262866f37bee55394c53c727cf4a6c987f
Environments: ☑ Production  ☑ Preview  ☑ Development
```
Click **Save**

---

#### **Variable #2: WC_CONSUMER_SECRET**
```
Name:  WC_CONSUMER_SECRET
Value: cs_25c1e29325113145d0c13913007cc1a92d965bce
Environments: ☑ Production  ☑ Preview  ☑ Development
```
Click **Save**

---

#### **Variable #3: WORDPRESS_URL**
```
Name:  WORDPRESS_URL
Value: https://admin.wholelotofnature.com
Environments: ☑ Production  ☑ Preview  ☑ Development
```
Click **Save**

---

#### **Variable #4: WORDPRESS_API_URL**
```
Name:  WORDPRESS_API_URL
Value: https://admin.wholelotofnature.com/wp-json
Environments: ☑ Production  ☑ Preview  ☑ Development
```
Click **Save**

---

### **STEP 3: Redeploy**

After adding variables:
1. Go to **Deployments** tab
2. Click the latest deployment
3. Click **Redeploy**
4. Wait ~3 minutes for deployment to complete

---

### **STEP 4: Verify**

Visit your site: https://www.wholelotofnature.com

You should see:
- ✅ Real WooCommerce products on /shop
- ✅ Featured products on homepage
- ✅ No demo plants - real products from WordPress

---

## 🔍 HOW TO VERIFY IT WORKED

### **In Browser Console (F12 → Console):**
```javascript
// Should show success message
"[WooCommerce SUCCESS] Fetched 12 products"
```

### **In Network Tab (F12 → Network):**
```javascript
// Request to: /api/products
// Response status: 200
// Response body:
{
  "success": true,
  "data": [
    {
      "id": 123,
      "name": "Organic Potting Mix",
      "price": "250",
      ...
    }
  ],
  "count": 12
}
```

### **Visual Check:**
- Homepage hero section shows real products
- /shop page shows real products
- Each product has real data (name, price, image)
- No "DEMO_PRODUCTS" visible

---

## ⚡ TROUBLESHOOTING

### **Problem: Still Showing Demo Products**

**Check 1: Variables Set Correctly?**
1. Go back to Vercel Settings → Environment Variables
2. Verify all 4 variables are there
3. Check values are EXACTLY as shown above (no spaces, no typos)

**Check 2: Redeployed After Adding Variables?**
1. Go to Deployments
2. Click latest deployment
3. Click "Redeploy"
4. Wait for it to complete

**Check 3: Browser Cache**
1. Open DevTools (F12)
2. Right-click refresh button → "Empty cache and hard refresh"
3. Or press: `Ctrl+Shift+Delete`

**Check 4: Check API Directly**
1. Open: https://www.wholelotofnature.com/api/products
2. If you see `"error": "AUTHENTICATION_ERROR"` → Variables not set
3. If you see real products → Credentials working!

---

## 📊 WHAT EACH VARIABLE DOES

| Variable | Purpose | Example |
|----------|---------|---------|
| `WC_CONSUMER_KEY` | OAuth key for WooCommerce | `ck_7c14b...` |
| `WC_CONSUMER_SECRET` | OAuth secret for WooCommerce | `cs_25c1...` |
| `WORDPRESS_URL` | Base URL of WordPress admin | `https://admin.wholelotofnature.com` |
| `WORDPRESS_API_URL` | REST API endpoint | `https://admin.wholelotofnature.com/wp-json` |

---

## 🔐 SECURITY NOTE

These credentials allow **READ-ONLY** access to WooCommerce products via REST API. They:
- ✅ Can read products, categories, orders
- ❌ Cannot create/modify products
- ❌ Cannot access sensitive data
- ✅ Are safe to use in production

---

## 📝 EXPECTED RESULTS AFTER SETUP

### **Before Setup** ❌
```
1. Visit wholelotofnature.com
2. See: "Monstera Deliciosa", "Snake Plant" (demo products)
3. API returns: 401 Unauthorized
4. Products aren't from your WordPress database
```

### **After Setup** ✅
```
1. Visit wholelotofnature.com
2. See: Real products from WordPress
   - "Organic Potting Mix"
   - "Succulent Collection"
   - "Neem Oil Spray"
   (Whatever you added to WooCommerce)
3. API returns: 200 OK with real product data
4. All products from your WordPress database
```

---

## ⏱️ EXPECTED TIMELINE

- Setup environment variables: **2 minutes**
- Redeploy: **3 minutes**
- Cache clear: **1 minute**
- **Total: ~6 minutes to full fix**

---

## ❓ FREQUENTLY ASKED QUESTIONS

**Q: Do I need to change .env.local?**
A: No. Local `.env` is correct. Only Vercel production needs setup.

**Q: Will this break anything?**
A: No. These are read-only credentials for fetching products.

**Q: How long until it works?**
A: After redeploy completes (~3 min), refresh your browser.

**Q: What if variables show in dashboard but still don't work?**
A: Vercel needs to rebuild after adding variables. Click "Redeploy".

**Q: Can I use the same credentials for staging?**
A: Yes. Set all 4 variables for Production, Preview, and Development environments.

---

**Status:** Ready to implement. Takes ~6 minutes total.  
**Next Action:** Follow STEP 1-4 above in Vercel dashboard.

---

*Last updated: January 17, 2026 - For wholelotofnature.com*
