# VERCEL ENVIRONMENT VARIABLES - PRODUCTION SETUP CHECKLIST

## CRITICAL: These variables MUST be set in Vercel Dashboard, NOT in .env files

### 1. WooCommerce REST API Credentials (REQUIRED)
```
WC_CONSUMER_KEY=ck_7c14b9262866f37bee55394c53c727cf4a6c987f
WC_CONSUMER_SECRET=cs_25c1e29325113145d0c13913007cc1a92d965bce
```

### 2. WordPress URLs (REQUIRED)
```
WORDPRESS_URL=https://admin.wholelotofnature.com
```

### 3. Frontend URLs (REQUIRED)
```
NEXT_PUBLIC_SITE_URL=https://wholelotofnature.com
NEXT_PUBLIC_API_URL=https://admin.wholelotofnature.com/wp-json
NEXT_PUBLIC_WORDPRESS_URL=https://admin.wholelotofnature.com
```

### 4. NextAuth Configuration (REQUIRED)
```
NEXTAUTH_URL=https://wholelotofnature.com
NEXTAUTH_SECRET=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
```

### 5. Payment Integration - Cashfree (IF USING)
```
CASHFREE_APP_ID=your_app_id
CASHFREE_SECRET_KEY=your_secret_key
CASHFREE_ENV=production
```

### 6. Email Service - Resend (IF USING)
```
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=orders@wholelotofnature.com
```

### 7. Analytics (OPTIONAL)
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## HOW TO ADD THESE TO VERCEL:

1. Go to https://vercel.com/dashboard
2. Select your project "whole-lot-of-nature"
3. Click "Settings" → "Environment Variables"
4. Add each variable above:
   - Name (left field)
   - Value (right field)
   - Select: "Production" 
5. Click "Save"
6. Trigger a redeploy by pushing a commit or clicking "Redeploy"

## VERIFICATION:

After setting all variables:
1. Go to https://wholelotofnature.com/api/products
2. You should see a JSON response with products (not a 500 error)
3. Check Vercel Function Logs for any errors

## DO NOT:

❌ Keep .env.local in the repository
❌ Set variables in .env files and expect them to work in Vercel
❌ Use .env.production - only use Vercel dashboard
❌ Commit secrets to git

## CURRENT STATUS:

The code is configured correctly to read from:
- `process.env.WC_CONSUMER_KEY` (Vercel env)
- `process.env.WC_CONSUMER_SECRET` (Vercel env)
- `process.env.WORDPRESS_URL` (Vercel env)

The products API will fail with a 500 error if these are NOT set in Vercel dashboard.
