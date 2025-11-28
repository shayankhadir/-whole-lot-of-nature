# 🔧 Hostinger Environment Variables Setup for Next.js

**Framework:** Next.js  
**Method:** SSH + .env.local file  
**Status:** Ready to configure

---

## ❌ What Hostinger Suggested Won't Work for Next.js

Hostinger's suggestion to use `.htaccess` is for **PHP sites**. Your project is **Next.js (Node.js)**, which requires environment variables to be set differently.

For Next.js on Node.js, you have **2 OPTIONS**:

---

## ✅ OPTION 1: .env.local File (RECOMMENDED - EASIEST)

### What it is:
A file in your project root that contains all environment variables. Next.js automatically reads it.

### How to set it up:

#### **STEP 1: SSH into Hostinger**
```bash
ssh -p 65002 u951576049@46.28.45.97
# Password: Wholelotofnature@123
```

#### **STEP 2: Navigate to your project**
```bash
cd /home/u951576049/public_html
```

#### **STEP 3: Create .env.local file**
```bash
nano .env.local
```

#### **STEP 4: Paste all 19 environment variables**

Copy and paste this ENTIRE block:

```bash
# AI/Content
PERPLEXITY_API_KEY=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

# WordPress Core
WORDPRESS_API_URL=https://admin.wholelotofnature.com/wp-json
WORDPRESS_URL=https://admin.wholelotofnature.com
WORDPRESS_SITE_URL=https://admin.wholelotofnature.com
WORDPRESS_USERNAME=zebbroka@gmail.com
WORDPRESS_APP_PASSWORD=Jm2r 8rVf 1vqw RwGx pIq9 aL7c

# WooCommerce
WC_CONSUMER_KEY=ck_7c14b9262866f37bee55394c53c727cf4a6c987f
WC_CONSUMER_SECRET=cs_25c1e29325113145d0c13913007cc1a92d965bce

# Frontend URLs - CHANGE TO YOUR DOMAIN!
NEXT_PUBLIC_SITE_URL=https://wholelotofnature.com
NEXT_PUBLIC_API_URL=https://admin.wholelotofnature.com/wp-json
NEXT_PUBLIC_WORDPRESS_URL=https://admin.wholelotofnature.com

# Instagram
INSTAGRAM_ACCESS_TOKEN=EAAZA7I46ApJsBP1NOqmyZCodaue1J39iqIrZBfnt2SLc6lfSYgSzAFhzCteOz99xjDx2racR9KmEK8DWIEPpQ1aXTyYTV7rvvqbJGZAr6QoeqpTfhQsf8CnrNFCWfThEuk5F8VxyIdBWt15lWZC6amZC6rXsOaxb0zstQIkg8BCfM2aejm2N1Qa93SUrGOGc3zG2fH31cXGn6iRQjlpH74qnygEpYKkOeUXUbkVC5OR39lJSm1sDqjwSHFNKZBfnvOs6PGtgGitPHWEHiQCOJya
INSTAGRAM_BUSINESS_ACCOUNT_ID=852065054661900
INSTAGRAM_APP_ID=1824242505131163
INSTAGRAM_APP_SECRET=697d402f5317e6db29b39175158d5b10

# System/Security
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
REVALIDATE_SECRET=a7f3c8e9d2b1f4e6a9c3b8d1e4f7a2c5b8e9d0f1a2b3c4d5e6f7a8b9c0d1e2

# SEO
NEXT_PUBLIC_GSC_VERIFICATION=6tuH6YnXi1idUfoqCATuz4a05rpWhoPqX5YXO7jW74U
```

#### **STEP 5: Save the file**
```
Press: Ctrl + X
Then: Y (for Yes)
Then: Enter (to confirm filename)
```

✅ **File created successfully!**

#### **STEP 6: Verify it was created**
```bash
cat .env.local
```

Should show all 19 variables.

---

## ✅ OPTION 2: .env.production File (ALTERNATIVE)

If you want to keep development and production separate:

```bash
nano .env.production
```

Paste the same variables, then save.

Next.js will automatically use this for production builds.

---

## 🔄 DEPLOYMENT STEPS (After setting environment variables)

Once `.env.local` is created:

```bash
# 1. Ensure you're in the right directory
cd /home/u951576049/public_html

# 2. Install PM2 globally (if not already installed)
npm install -g pm2

# 3. Build your application
npm run build

# 4. Start the application with PM2
pm2 start npm --name "whole-lot-of-nature" -- start

# 5. Save PM2 configuration
pm2 save
pm2 startup

# 6. View the running app
pm2 logs whole-lot-of-nature
```

---

## ⚠️ CRITICAL SECURITY NOTES

### For Production (.env.local):
- ✅ **DO NOT commit** `.env.local` to git (add to `.gitignore`)
- ✅ Keep file **private** (permissions 600)
- ✅ Only put on Hostinger server
- ✅ Restart app after changes

### Check file permissions:
```bash
ls -la .env.local
# Should show: -rw------- (600 permissions)
```

If needed, fix permissions:
```bash
chmod 600 .env.local
```

---

## 🧪 VERIFY ENVIRONMENT VARIABLES WORK

After deployment, check if variables are loaded:

```bash
# Check if app started
pm2 status

# View logs
pm2 logs whole-lot-of-nature

# Test API connection
curl http://localhost:3000
```

Look for any errors mentioning undefined variables.

---

## 📋 QUICK CHECKLIST

- [ ] SSH into Hostinger
- [ ] Navigate to `/home/u951576049/public_html`
- [ ] Create `.env.local` with `nano .env.local`
- [ ] Paste all 19 variables
- [ ] Save file (Ctrl+X, Y, Enter)
- [ ] Verify with `cat .env.local`
- [ ] Run `npm run build`
- [ ] Start with `pm2 start npm --name "whole-lot-of-nature" -- start`
- [ ] Check logs: `pm2 logs whole-lot-of-nature`
- [ ] Visit domain in browser

---

## 🆘 TROUBLESHOOTING

### Variables not loading?
```bash
# Restart the application
pm2 restart whole-lot-of-nature

# Check logs
pm2 logs whole-lot-of-nature

# Verify .env.local exists and has content
cat .env.local
```

### Permission denied on .env.local?
```bash
chmod 600 .env.local
pm2 restart whole-lot-of-nature
```

### Still getting undefined variables?
```bash
# Check if file is in the right location
pwd  # Should be: /home/u951576049/public_html

# List files
ls -la | grep env

# Should show: .env.local
```

### Build fails?
```bash
# Clean and rebuild
rm -rf .next
npm run build

# Check for errors
npm run build 2>&1 | tail -20
```

---

## 📊 EXPECTED BEHAVIOR

**After setting up .env.local:**

```
✅ npm run build completes with 0 errors
✅ PM2 shows application "online"
✅ https://wholelotofnature.com loads
✅ API calls to WordPress work
✅ Instagram feed displays
✅ Products load correctly
✅ No console errors
✅ No env variable warnings
```

---

## 🎯 SUMMARY

| Task | Command | Time |
|------|---------|------|
| SSH in | `ssh -p 65002 u951576049@46.28.45.97` | 1 min |
| Create .env.local | `nano .env.local` | 2 min |
| Paste variables | (Copy from above) | 1 min |
| Build | `npm run build` | 2-3 min |
| Start PM2 | `pm2 start npm --name "whole-lot-of-nature" -- start` | 1 min |
| Verify | `pm2 logs whole-lot-of-nature` | 1 min |
| **Total** | | **~10 minutes** |

---

## 💡 KEY DIFFERENCES FROM HOSTINGER'S SUGGESTION

| Aspect | Hostinger's Suggestion | What You Actually Need |
|--------|------------------------|------------------------|
| File Type | .htaccess (PHP) | .env.local (Node.js) |
| Framework | PHP/Laravel | Next.js |
| Location | Root directory | Project root |
| Automatic Loading | ❌ Manual parsing | ✅ Next.js auto-loads |
| Security | Via .htaccess headers | Via file permissions (600) |
| Restart Needed | Apache restart | PM2 restart |

---

**Ready to set up your environment variables? SSH in and follow Option 1! 🚀**
