# Vercel Environment Variables Setup Guide

## ⚠️ Critical: WooCommerce API Configuration

The website requires **WooCommerce REST API credentials** to display products. Without these, the site will show an error when users click on products.

### Required Environment Variables for Vercel

Add these to your **Vercel Project Settings → Environment Variables**:

#### 1. **WooCommerce Credentials** (REQUIRED)
```
WORDPRESS_URL=https://admin.wholelotofnature.com
WC_CONSUMER_KEY=ck_your_key_here
WC_CONSUMER_SECRET=cs_your_secret_here
```

**Get these from:**
- Go to WordPress Admin: `https://admin.wholelotofnature.com/wp-admin`
- Navigate to: **WooCommerce → Settings → Advanced → REST API**
- Create new credentials with **Read** and **Write** permissions
- Copy the Consumer Key and Secret

#### 2. **Authentication** (REQUIRED)
```
NEXTAUTH_SECRET=your-super-secret-key
NEXTAUTH_URL=https://wholelotofnature.com
```

#### 3. **Payment Processing** (REQUIRED)
```
CASHFREE_APP_ID=your_app_id
CASHFREE_APP_SECRET=your_app_secret
CASHFREE_WEBHOOK_SECRET=your_webhook_secret
```

#### 4. **Public URLs** (REQUIRED)
```
NEXT_PUBLIC_WORDPRESS_URL=https://wholelotofnature.com
NEXT_PUBLIC_API_URL=https://wholelotofnature.com/wp-json
NEXT_PUBLIC_SITE_URL=https://wholelotofnature.com
```

#### 5. **Admin** (OPTIONAL)
```
ADMIN_SECRET_KEY=your_admin_secret_key
ADMIN_EMAIL=admin@wholelotofnature.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id
```

---

## ✅ How to Set Environment Variables in Vercel

1. Go to **Vercel Dashboard** → Your Project
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: Variable name (e.g., `WORDPRESS_URL`)
   - **Value**: The actual value
   - **Select environments**: Choose `Production`, `Preview`, and `Development`
4. Click **Save**
5. **Redeploy** your project for changes to take effect

---

## 🔍 Troubleshooting: "Internal Server Error" on Product Pages

**Symptom:** Product pages show "Internal Server Error" when you click on a product

**Cause:** Missing or incorrect WooCommerce credentials

**Solution:**
1. Check Vercel environment variables are set correctly
2. Verify `WC_CONSUMER_KEY` and `WC_CONSUMER_SECRET` are not empty
3. Check that credentials have **Read** permissions in WooCommerce
4. Redeploy the project: `git push` (auto-deploys to Vercel)
5. Check Vercel deployment logs for detailed errors

---

## 📝 Local Development

For local development, create a `.env.local` file in the project root:

```
WORDPRESS_URL=https://admin.wholelotofnature.com
WC_CONSUMER_KEY=your_key
WC_CONSUMER_SECRET=your_secret
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_WORDPRESS_URL=https://wholelotofnature.com
NEXT_PUBLIC_API_URL=https://wholelotofnature.com/wp-json
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Then run: `npm run dev`

---

## 🚨 Important Notes

- **Never commit** `.env.local` or any file with secrets
- Always use `.env.example` as a template
- `WC_CONSUMER_KEY` and `WC_CONSUMER_SECRET` are **server-side only** and won't be available to the browser
- Public URLs should have `NEXT_PUBLIC_` prefix
- After updating environment variables in Vercel, **redeploy** the project

---

## 📞 Support

If you're getting product page errors:
1. Check Vercel logs: `Vercel Dashboard → Deployments → Click latest → Functions → Logs`
2. Look for WooCommerce API errors
3. Verify credentials format matches exactly

