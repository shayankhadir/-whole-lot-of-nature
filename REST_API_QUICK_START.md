# REST API Setup - Quick Start Guide

You're switching from GraphQL to REST API - great choice! Here's exactly what to do next.

---

## ✅ What I've Done For You

1. ✅ Created comprehensive REST API guide: `HEADLESS_WORDPRESS_REST_API.md`
2. ✅ Created new API service files:
   - `src/lib/api/wordpress.ts` - WordPress posts, pages, media
   - `src/lib/api/woocommerce.ts` - Products, categories, orders
3. ✅ Updated environment variables in `.env.local` and `.env.production`
4. ✅ Created test file: `test-rest-api.ts`

---

## 🎯 What You Need To Do Now

### Step 1: Configure WordPress for Local Development

1. **Login to WordPress Admin**
   - Go to: https://wholelotofnature.com/wp-admin

2. **Update Site URLs** (Settings → General)
   ```
   WordPress Address (URL): https://wholelotofnature.com
   Site Address (URL): http://localhost:3000
   ```
   
   **What this does:**
   - `WordPress Address` = Where WordPress files are installed (your domain)
   - `Site Address` = Where your Next.js frontend runs (localhost during development)
   
3. **Save Changes**
   - You might get logged out - that's normal
   - Login again at: https://wholelotofnature.com/wp-admin

### Step 2: Enable CORS (Allow Next.js to call WordPress)

**Option A: Via Plugin** (Easier)
1. Install plugin: "WP REST API Controller"
2. Enable CORS for all origins during development

**Option B: Manual** (Recommended)
1. Go to Hostinger File Manager
2. Navigate to your WordPress installation folder (usually `public_html`)
3. Edit `wp-config.php`
4. Add this code BEFORE the line `/* That's all, stop editing! */`:

```php
// Enable CORS for REST API (Development Only - Insecure for Production)
add_action('rest_api_init', function() {
    // Allow any origin during development
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce");
    header("Access-Control-Allow-Credentials: true");
}, 15);

// Handle preflight requests
add_action('init', function() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        status_header(200);
        exit();
    }
});
```

5. Save file

**For Production Later:** Change `*` to your domain:
```php
header("Access-Control-Allow-Origin: https://wholelotofnature.com");
```

### Step 3: Test REST API

Open these URLs in your browser to test:

**WordPress Posts:**
```
https://wholelotofnature.com/wp-json/wp/v2/posts
```

**WooCommerce Products:**
```
https://wholelotofnature.com/wp-json/wc/v3/products?consumer_key=ck_7c14b9262866f37bee55394c53c727cf4a6c987f&consumer_secret=cs_25c1e29325113145d0c13913007cc1a92d965bce
```

**WooCommerce Categories:**
```
https://wholelotofnature.com/wp-json/wc/v3/products/categories?consumer_key=ck_7c14b9262866f37bee55394c53c727cf4a6c987f&consumer_secret=cs_25c1e29325113145d0c13913007cc1a92d965bce
```

You should see JSON data returned. If you see errors, check the troubleshooting section below.

### Step 4: Optional - Install Headless Mode Plugin

This plugin disables the WordPress frontend (themes) and keeps only the admin and REST API.

1. Go to: Plugins → Add New
2. Search: "Headless Mode"
3. Install and Activate
4. Configure: Redirect frontend to `http://localhost:3000` (during development)

**Benefits:**
- Cleaner separation of concerns
- WordPress serves only data (REST API)
- Next.js handles all frontend rendering
- No theme conflicts

---

## 🧪 Testing Locally

Once you've configured WordPress, test the REST API:

```powershell
cd "C:\Users\USER\Documents\whole lot of nature\Whole lot of nature\whole-lot-of-nature"

# Start dev server
npm run dev
```

Visit: http://localhost:3000

**Check that:**
- ✅ Shop page shows products from WooCommerce
- ✅ Blog page shows posts from WordPress
- ✅ Product images load correctly
- ✅ No CORS errors in browser console (F12)

---

## 🔄 Switching Between Dev and Production

### Development Mode (What you're doing now)
```
WordPress Admin URLs:
- WordPress Address: https://wholelotofnature.com
- Site Address: http://localhost:3000

Next.js runs on: localhost:3000
WordPress serves: REST API + Admin
```

### Production Mode (When deploying)
```
WordPress Admin URLs:
- WordPress Address: https://admin.wholelotofnature.com
- Site Address: https://wholelotofnature.com

Next.js runs on: wholelotofnature.com (Hostinger)
WordPress serves: REST API + Admin at subdomain
```

**To switch:** Just update the URLs in WordPress Settings → General

---

## 📝 Next Steps After WordPress Setup

Once WordPress is configured and REST API is working:

### 1. Remove GraphQL (optional cleanup)
```powershell
# Remove GraphQL packages
npm uninstall graphql graphql-request

# Delete old files
Remove-Item src\lib\graphql.ts
Remove-Item test-graphql.js
```

### 2. Update Components
I'll help you update all components to use the new REST API functions instead of GraphQL.

### 3. Test Everything
Make sure all features work with REST API:
- Product listing
- Product details
- Categories
- Search
- Blog posts
- Images

### 4. Deploy to Hostinger
Once everything works locally, deploy using the Hostinger guide.

---

## 🆘 Troubleshooting

### "REST API returns 404"
**Solution:** 
- Check permalinks: Settings → Permalinks → Post name → Save Changes
- Verify WordPress is installed at the URL you're using

### "CORS Error in console"
**Solution:**
- Add CORS headers to wp-config.php (Step 2 above)
- Or install WP REST API Controller plugin

### "WooCommerce API returns 401 Unauthorized"
**Solution:**
- Verify consumer key and secret are correct
- Check WooCommerce → Settings → Advanced → REST API
- Make sure API key has Read or Read/Write permissions

### "Products not showing"
**Solution:**
- Make sure you have products published in WooCommerce
- Check product status is "Publish" not "Draft"
- Test the API endpoint directly in browser

### "Images not loading"
**Solution:**
- Update `next.config.js` to include WordPress domain in image domains
- Check image URLs in WordPress media library

---

## 📚 Files to Reference

1. **Complete REST API Guide:** `HEADLESS_WORDPRESS_REST_API.md`
2. **WordPress API Functions:** `src/lib/api/wordpress.ts`
3. **WooCommerce API Functions:** `src/lib/api/woocommerce.ts`
4. **Environment Variables:** `.env.local` (development) and `.env.production` (production)
5. **Hostinger Deployment:** `HOSTINGER_DEPLOYMENT.md`

---

## 💬 Let Me Know When...

Tell me when you've:
1. ✅ Updated WordPress Site URLs in admin
2. ✅ Added CORS headers to wp-config.php
3. ✅ Tested REST API endpoints (they return JSON)

Then I'll help you:
- Update all components to use REST API
- Remove GraphQL code
- Test everything locally
- Deploy to Hostinger

---

**Current Status:** ⏳ Waiting for you to configure WordPress

**Next Step:** Update WordPress URLs in admin (5 minutes)

---

Created: October 20, 2025
REST API: WordPress + WooCommerce
Purpose: Headless WordPress with Next.js frontend
