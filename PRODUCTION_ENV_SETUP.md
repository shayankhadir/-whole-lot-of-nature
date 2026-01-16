# Production Readiness - Environment Variable Setup

## ✅ Status: Configuration Files Updated

### Critical Fixes Applied

1. **TypeScript Compiler** - Added `forceConsistentCasingInFileNames: true` to tsconfig.json
2. **CORS Security** - Removed wildcard `Access-Control-Allow-Origin: *` from next.config.js
3. **Middleware** - Created proper CORS middleware in `/src/middleware.ts` with domain whitelisting
4. **Environment Validation** - Created `/src/lib/env.ts` with startup validation
5. **Prisma Integration** - Updated `/src/lib/prisma.ts` to validate environment on server startup

---

## 📋 Required Environment Variables for Vercel

**Copy these to your Vercel project settings → Settings → Environment Variables**

### Database (CRITICAL)
```
DATABASE_URL=mysql://[user]:[password]@[host]:3306/[database]
SHADOW_DATABASE_URL=mysql://[user]:[password]@[host]:3306/[database]
```

### Authentication (CRITICAL)
```
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=https://wholelotofnature.com
```

### WordPress/WooCommerce (CRITICAL)
```
WORDPRESS_API_URL=https://admin.wholelotofnature.com/wp-json
WORDPRESS_URL=https://admin.wholelotofnature.com
WC_CONSUMER_KEY=ck_your_key_here
WC_CONSUMER_SECRET=cs_your_secret_here
WORDPRESS_USERNAME=your_email@example.com
WORDPRESS_APP_PASSWORD=your_app_password
```

### Frontend URLs (RECOMMENDED)
```
NEXT_PUBLIC_SITE_URL=https://wholelotofnature.com
NEXT_PUBLIC_API_URL=https://admin.wholelotofnature.com/wp-json
NEXT_PUBLIC_WORDPRESS_URL=https://admin.wholelotofnature.com
```

### Payments - Cashfree (RECOMMENDED)
```
CASHFREE_APP_ID=your_app_id
CASHFREE_SECRET_KEY=your_secret_key
CASHFREE_MODE=production
NEXT_PUBLIC_CASHFREE_MODE=production
```

### Email Service - Resend (OPTIONAL)
```
RESEND_API_KEY=re_your_api_key
EMAIL_FROM=orders@wholelotofnature.com
```

### Instagram Integration (OPTIONAL)
```
INSTAGRAM_APP_ID=your_app_id
INSTAGRAM_APP_SECRET=your_app_secret
INSTAGRAM_ACCESS_TOKEN=your_access_token
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_account_id
```

### Cron Jobs & Webhooks (OPTIONAL)
```
CRON_SECRET=your_cron_secret
ADMIN_SECRET_KEY=your_admin_secret
REVALIDATE_SECRET=your_revalidate_secret
```

### AI Services (OPTIONAL)
```
ANTHROPIC_API_KEY=your_api_key
PERPLEXITY_API_KEY=your_api_key
OPENAI_API_KEY=your_api_key
```

### Analytics (OPTIONAL)
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GSC_VERIFICATION=your_verification_code
```

---

## 🔒 Security Changes

### What Changed:
1. ✅ Removed wildcard CORS (`*`) - Now restricted to specific domains
2. ✅ Added security headers to all API responses
3. ✅ Created environment validation at startup
4. ✅ Added database connection verification
5. ✅ Ensured `.env*` files are properly ignored in git

### Domains Whitelisted (in middleware.ts):
- `https://wholelotofnature.com`
- `https://www.wholelotofnature.com`
- `https://admin.wholelotofnature.com`
- `http://localhost:3000` (dev only)
- `http://localhost:3001` (dev only)

---

## 🚀 Deployment Checklist

### Before Deploying to Vercel:

- [ ] Set DATABASE_URL and SHADOW_DATABASE_URL in Vercel
- [ ] Set NEXTAUTH_SECRET and NEXTAUTH_URL
- [ ] Set WordPress/WooCommerce credentials (WC_CONSUMER_KEY, WC_CONSUMER_SECRET)
- [ ] Set Cashfree credentials (if payments enabled)
- [ ] Set RESEND_API_KEY (if email reset needed)
- [ ] Verify all .env files are in .gitignore
- [ ] Run `npm run build` locally to test for errors
- [ ] Check that no errors appear in build output related to missing env vars

### After Deploying to Vercel:

- [ ] Check Vercel logs for any startup errors
- [ ] Test an API endpoint: `curl https://wholelotofnature.com/api/products`
- [ ] Test WooCommerce sync: `curl -X POST https://wholelotofnature.com/api/cron/sync-products`
- [ ] Monitor Vercel analytics for 500 errors
- [ ] Check database connection logs in Vercel

---

## 🔍 Debugging Production Issues

### If REST API is still not working:

1. **Check Vercel Logs:**
   ```bash
   vercel logs --prod
   ```

2. **Check which environment variables are actually set:**
   - Go to Vercel → Project → Settings → Environment Variables
   - Verify all critical variables are present

3. **Test Database Connection:**
   - Check DATABASE_URL format: `mysql://user:pass@host:3306/db`
   - Verify user/password/host are correct
   - Check that the host/IP is accessible from Vercel

4. **Common Issues:**
   - ❌ Missing DATABASE_URL → Prisma won't initialize
   - ❌ Wrong WC_CONSUMER_KEY/SECRET → WooCommerce API calls fail
   - ❌ Wrong WORDPRESS_API_URL → All product/order syncs fail
   - ❌ CORS blocking → Frontend can't reach API
   - ❌ Expired Instagram token → Social automation fails

---

## 📝 Local Development Setup

### Create `.env.local` (NEVER commit this):
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

### Verify setup:
```bash
npm run dev
# Open http://localhost:3000/api/products in browser
# Should return product data (not 500 error)
```

---

## ✅ All Files Updated

- [x] tsconfig.json - Added forceConsistentCasingInFileNames
- [x] next.config.js - Removed wildcard CORS
- [x] src/middleware.ts - Created CORS and security middleware
- [x] src/lib/env.ts - Created environment validation
- [x] src/lib/prisma.ts - Added startup validation
- [x] .gitignore - Verified .env* is ignored

**Next Step:** Deploy to Vercel with the environment variables set above.
