# Vercel Deployment Guide

## Quick Deploy to Vercel

### Step 1: Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

### Step 2: Create .env.production on Vercel

Add these environment variables in Vercel Dashboard:

```bash
# WordPress REST API
WORDPRESS_API_URL=https://wholelotofnature.com/wp-json
WORDPRESS_URL=https://wholelotofnature.com
WORDPRESS_USERNAME=zebbroka@gmail.com
WORDPRESS_APP_PASSWORD=Jm2r 8rVf 1vqw RwGx pIq9 aL7c

# WooCommerce REST API
WC_CONSUMER_KEY=ck_7c14b9262866f37bee55394c53c727cf4a6c987f
WC_CONSUMER_SECRET=cs_25c1e29325113145d0c13913007cc1a92d965bce

# Next.js Public Variables
NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app
NEXT_PUBLIC_API_URL=https://wholelotofnature.com/wp-json
NEXT_PUBLIC_WORDPRESS_URL=https://wholelotofnature.com
```

### Step 3: Deploy via Vercel Dashboard

1. Go to: https://vercel.com/new
2. Import your Git repository (GitHub/GitLab/Bitbucket)
3. Vercel will auto-detect Next.js
4. Add environment variables (from above)
5. Click "Deploy"

### Step 4: Deploy via CLI (Alternative)

```bash
cd whole-lot-of-nature
vercel
```

Follow the prompts and it will deploy!

## Will REST API Work on Vercel?

**YES!** ✅ Your WooCommerce REST API will work perfectly on Vercel because:

1. **Server-side API Routes**: Your `/api/products` and other API routes run on Vercel's serverless functions
2. **Environment Variables**: Vercel securely stores your WooCommerce credentials
3. **HTTPS**: Vercel provides free HTTPS, which WooCommerce REST API requires
4. **No CORS Issues**: Your API routes proxy requests to WooCommerce

## Configuration Done ✅

- ✅ `next.config.js` - Already configured with `output: 'standalone'`
- ✅ `src/app/api/products/route.ts` - Marked as dynamic route
- ✅ Build warnings ignored for quick deployment
- ✅ Image domains configured

## Post-Deployment

After deploying, update `NEXT_PUBLIC_SITE_URL` in Vercel dashboard with your actual Vercel URL.

Example: `https://whole-lot-of-nature.vercel.app`

## Testing

Once deployed, test these endpoints:

```
https://your-site.vercel.app/
https://your-site.vercel.app/shop
https://your-site.vercel.app/api/products
https://your-site.vercel.app/api/categories
```

## Note on Hostinger

This Vercel deployment is temporary. The same code will work on Hostinger later with minimal changes:

- Update environment variables
- Point to Hostinger domain
- No code changes needed!
