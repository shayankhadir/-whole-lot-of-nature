# Vercel Deployment Guide - Whole Lot of Nature

## ✅ REST API Will Work on Vercel!

Yes, your WooCommerce REST API will work perfectly on Vercel because:
- ✅ WordPress is hosted separately (wholelotofnature.com)
- ✅ Next.js just makes API calls to WordPress
- ✅ No server-side dependencies needed
- ✅ All API routes are edge-compatible

---

## 🚀 Quick Deployment Steps

### Option 1: Deploy via Vercel Dashboard (EASIEST)

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Sign up with GitHub (or email)

2. **Import Your Project**
   - Click "Add New Project"
   - Choose "Import Git Repository"
   - Or upload your project folder directly

3. **Configure Project**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (auto-set)
   - Output Directory: `.next` (auto-set)

4. **Add Environment Variables**
   Copy these into Vercel:
   ```
   WORDPRESS_API_URL=https://wholelotofnature.com/wp-json
   WORDPRESS_URL=https://wholelotofnature.com
   WC_CONSUMER_KEY=ck_7c14b9262866f37bee55394c53c727cf4a6c987f
   WC_CONSUMER_SECRET=cs_25c1e29325113145d0c13913007cc1a92d965bce
   NEXT_PUBLIC_API_URL=https://wholelotofnature.com/wp-json
   NEXT_PUBLIC_WORDPRESS_URL=https://wholelotofnature.com
   ```

5. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Get your live URL!

---

### Option 2: Deploy via Vercel CLI (FASTER)

```powershell
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from your project directory)
cd "c:\Users\USER\Documents\whole lot of nature\Whole lot of nature\whole-lot-of-nature"
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? whole-lot-of-nature
# - Directory? ./
# - Override settings? No

# Your site will be live in 2-3 minutes!
```

---

## 🔐 Environment Variables Setup

### Required Variables for Vercel:

| Variable | Value | Purpose |
|----------|-------|---------|
| `WORDPRESS_API_URL` | `https://wholelotofnature.com/wp-json` | WordPress REST API endpoint |
| `WORDPRESS_URL` | `https://wholelotofnature.com` | WordPress base URL |
| `WC_CONSUMER_KEY` | `ck_7c14b9262866f37bee55394c53c727cf4a6c987f` | WooCommerce authentication |
| `WC_CONSUMER_SECRET` | `cs_25c1e29325113145d0c13913007cc1a92d965bce` | WooCommerce authentication |
| `NEXT_PUBLIC_API_URL` | `https://wholelotofnature.com/wp-json` | Public API URL |
| `NEXT_PUBLIC_WORDPRESS_URL` | `https://wholelotofnature.com` | Public WordPress URL |

### Optional Variables:
| Variable | Value |
|----------|-------|
| `WORDPRESS_USERNAME` | `zebbroka@gmail.com` |
| `WORDPRESS_APP_PASSWORD` | `Jm2r 8rVf 1vqw RwGx pIq9 aL7c` |
| `INSTAGRAM_APP_ID` | `1824242505131163` |
| `INSTAGRAM_APP_SECRET` | `697d402f5317e6db29b39175158d5b10` |

---

## 📋 Pre-Deployment Checklist

### Before Deploying:
- [x] WordPress is accessible at wholelotofnature.com
- [x] WooCommerce REST API is working
- [x] All products are categorized
- [x] All products have prices
- [x] Environment variables are ready
- [x] `vercel.json` configuration created
- [ ] Test local build: `npm run build`

---

## 🧪 Test Local Build First

```powershell
# Build your project locally
npm run build

# If build succeeds, you're ready to deploy!
# If build fails, fix errors first
```

---

## 🌐 After Deployment

### Your Site Will Be Available At:
- **Vercel URL**: `https://whole-lot-of-nature.vercel.app`
- **Custom Domain**: You can add later if needed

### What Will Work:
✅ All 40 products displayed
✅ Category filtering
✅ Product details pages
✅ Prices and descriptions
✅ WooCommerce REST API calls
✅ Product search
✅ Cart functionality (client-side)

### What Needs WordPress Admin:
⚠️ Checkout (uses WooCommerce)
⚠️ Order management (uses WooCommerce)
⚠️ Product updates (use WordPress admin)

---

## 🔄 Continuous Deployment

Once deployed, Vercel will:
- ✅ Auto-deploy on every Git push
- ✅ Generate preview URLs for branches
- ✅ Provide build logs
- ✅ Monitor performance

---

## 💡 Pro Tips

### 1. Custom Domain (Optional)
```
# After deployment, add custom domain in Vercel dashboard
Settings → Domains → Add Domain
```

### 2. Update WordPress CORS
Add your Vercel URL to WordPress CORS settings:
```php
// In wp-config.php, update CORS to include Vercel URL
header("Access-Control-Allow-Origin: https://whole-lot-of-nature.vercel.app");
```

### 3. Performance
Vercel automatically:
- ✅ Optimizes images
- ✅ Caches static assets
- ✅ Uses CDN globally
- ✅ Compresses responses

### 4. Environment Variables
Update in Vercel Dashboard:
```
Project Settings → Environment Variables → Add
```

---

## 🚨 Troubleshooting

### Build Fails?
```powershell
# Check for errors
npm run build

# Common fixes:
npm install
npm run lint -- --fix
```

### API Not Working?
- Check environment variables are set in Vercel
- Verify WordPress CORS headers
- Check WooCommerce API keys are correct

### Images Not Loading?
- Verify `next.config.js` has WordPress domain
- Check image URLs in products
- Ensure WordPress images are accessible

---

## 📞 Deployment Support

### Vercel Documentation:
- Next.js on Vercel: https://vercel.com/docs/frameworks/nextjs
- Environment Variables: https://vercel.com/docs/environment-variables
- Custom Domains: https://vercel.com/docs/custom-domains

### Your Project Files:
- Configuration: `vercel.json` ✅ Created
- Environment: `.env.local` (don't commit this!)
- Build settings: `package.json`

---

## 🎯 Quick Start Commands

```powershell
# Option 1: CLI Deployment
npm install -g vercel
vercel login
vercel

# Option 2: Push to GitHub and import to Vercel
git init
git add .
git commit -m "Initial commit"
git push origin main
# Then import from Vercel dashboard
```

---

## ✅ Ready to Deploy!

**Recommended Method**: Vercel CLI for fastest deployment

```powershell
# Run this now:
npm install -g vercel
vercel login
vercel
```

Your site will be live in 2-3 minutes! 🚀

---

**Note**: This is for temporary team review. For final production on Hostinger, we'll migrate later with all settings preserved.
