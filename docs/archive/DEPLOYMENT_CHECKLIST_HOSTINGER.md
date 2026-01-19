# Hostinger Deployment - Quick Checklist

Use this checklist as you deploy. Check off each item as you complete it.

---

## 📦 Phase 1: WordPress Backend Setup

### Move WordPress to Subdomain
- [ ] Login to Hostinger hPanel (https://hpanel.hostinger.com)
- [ ] Create subdomain: `admin.wholelotofnature.com`
- [ ] Update WordPress URLs in Settings → General
- [ ] Test login at: https://admin.wholelotofnature.com/wp-admin

### Install WordPress Plugins
- [ ] Install WPGraphQL plugin
- [ ] Install WPGraphQL for WooCommerce plugin  
- [ ] Install WPGraphQL CORS plugin (or configure manually)
- [ ] Activate all plugins

### Configure CORS
- [ ] Add CORS headers to wp-config.php OR
- [ ] Configure WPGraphQL CORS plugin settings
- [ ] Add allowed origin: `https://wholelotofnature.com`

### Test WordPress APIs
- [ ] Test REST API: https://admin.wholelotofnature.com/wp-json/wp/v2/posts
- [ ] Test GraphQL: https://admin.wholelotofnature.com/graphql
- [ ] Test WooCommerce: https://admin.wholelotofnature.com/wp-json/wc/v3/products

✅ **Checkpoint:** All APIs working ✓

---

## 🚀 Phase 2: Next.js Setup on Hostinger

### Enable Node.js
- [ ] Go to Hostinger: Advanced → Node.js
- [ ] Click "Create Application"
- [ ] Application Mode: Production
- [ ] Node.js Version: 18.x or 20.x
- [ ] Application Root: `/public_html/next-app`
- [ ] Application URL: `wholelotofnature.com`
- [ ] Startup File: `server.js`
- [ ] Note the port number assigned: _______

### Prepare Local Files
- [ ] Update `.env.production` with subdomain URLs
- [ ] Clean previous builds: `Remove-Item -Recurse -Force .next`
- [ ] Run production build: `npm run build`
- [ ] Verify build completes successfully
- [ ] Copy .env.production to .env

### Get FTP Access
- [ ] Get FTP credentials from Hostinger (Files → FTP Accounts)
- [ ] FTP Host: _______________________
- [ ] FTP Username: _______________________
- [ ] FTP Password: _______________________
- [ ] Download FileZilla or use File Manager

✅ **Checkpoint:** Build ready, FTP access confirmed ✓

---

## 📤 Phase 3: Upload Files

### Connect to Hostinger
- [ ] Open FileZilla or Hostinger File Manager
- [ ] Connect to your FTP account
- [ ] Navigate to `/public_html/next-app/` folder

### Upload Files (Check as uploaded)
- [ ] `.next` folder (entire folder - YOUR BUILD)
- [ ] `public` folder (static assets)
- [ ] `package.json`
- [ ] `package-lock.json`
- [ ] `next.config.js`
- [ ] `server.js`
- [ ] `.env` (renamed from .env.production)

### Install Dependencies

**Option A: Upload node_modules**
- [ ] Upload entire `node_modules` folder (takes 30-60 mins)

**Option B: Install via SSH** (Recommended)
- [ ] Enable SSH in Hostinger (Advanced → SSH Access)
- [ ] Connect: `ssh username@wholelotofnature.com`
- [ ] Navigate: `cd public_html/next-app`
- [ ] Install: `npm install --production`
- [ ] Wait for completion

✅ **Checkpoint:** All files uploaded ✓

---

## ⚙️ Phase 4: Configure Routing

### Update .htaccess
- [ ] Navigate to `/public_html/` in File Manager
- [ ] Find or create `.htaccess` file
- [ ] Copy content from `.htaccess.template`
- [ ] Update port number (if not 3000)
- [ ] Save file

### Verify Configuration
- [ ] Subdomain routes to WordPress: admin.wholelotofnature.com
- [ ] Main domain will route to Next.js: wholelotofnature.com
- [ ] Static files served correctly

✅ **Checkpoint:** Routing configured ✓

---

## ▶️ Phase 5: Start Application

### Start Node.js App

**Via Hostinger hPanel:**
- [ ] Go to: Advanced → Node.js
- [ ] Find your application
- [ ] Click "Manage"
- [ ] Click "Start Application"
- [ ] Status shows: "Running" ✅

**Via SSH (Alternative):**
- [ ] Connect via SSH
- [ ] Navigate: `cd public_html/next-app`
- [ ] Start: `pm2 start server.js --name wholelotofnature`
- [ ] Save: `pm2 save`
- [ ] Check status: `pm2 status`

### Monitor Logs
- [ ] Check for errors: `pm2 logs wholelotofnature`
- [ ] Verify no startup errors
- [ ] Application listening on correct port

✅ **Checkpoint:** Application running ✓

---

## 🌐 Phase 6: DNS Configuration (if needed)

### Check Current DNS
- [ ] Go to: Hostinger → Domains → wholelotofnature.com → DNS
- [ ] Verify A record points to Hostinger server

### Add/Update Records
- [ ] Main domain A record:
  ```
  Type: A
  Name: @
  Points to: [Hostinger IP]
  ```
    - [       hh] Subdomain A record:
  ```
  Type: A  
  Name: admin
  Points to: [Hostinger IP]
  ```
- [ ] Save changes
- [ ] Wait for DNS propagation (up to 48 hours)

✅ **Checkpoint:** DNS configured ✓

---

## ✅ Phase 7: Testing

### Test Main Frontend (Next.js)
Visit: https://wholelotofnature.com

- [ ] Homepage loads with green theme
- [ ] YouTube video embeds and plays
- [ ] Instagram feed displays
- [ ] Navigation menu works
- [ ] Shop page loads
- [ ] Products display with images
- [ ] Product details open
- [ ] Add to cart works
- [ ] Cart page functional
- [ ] Mobile responsive
- [ ] No console errors

### Test WordPress Admin (Backend)
Visit: https://admin.wholelotofnature.com/wp-admin

- [ ] Login page loads
- [ ] Can login successfully
- [ ] Dashboard accessible
- [ ] Products visible in WooCommerce → Products
- [ ] Can edit products
- [ ] GraphQL endpoint works: /graphql

### Test API Connections
- [ ] Open frontend in browser
- [ ] Open Developer Tools (F12)
- [ ] Check Network tab for API calls
- [ ] Verify products load from WordPress API
- [ ] No CORS errors in console
- [ ] Images load correctly

### Performance Check
- [ ] Page load speed acceptable (< 3 seconds)
- [ ] Images optimized and load quickly
- [ ] No JavaScript errors
- [ ] SSL certificate working (https://)
- [ ] Mobile performance good

✅ **Checkpoint:** All tests passing ✓

---

## 🔒 Phase 8: Security & Optimization

### Security
- [ ] HTTPS enabled (SSL certificate active)
- [ ] Strong passwords for WordPress admin
- [ ] Install WordPress security plugin (Wordfence)
- [ ] Limit login attempts
- [ ] Hide WordPress version
- [ ] Disable file editing in WordPress

### Backups
- [ ] Install UpdraftPlus plugin
- [ ] Configure automatic backups
- [ ] Test backup restoration
- [ ] Store backups off-site (Google Drive/Dropbox)

### Performance
- [ ] Install WordPress caching plugin (W3 Total Cache)
- [ ] Enable browser caching
- [ ] Enable object caching
- [ ] Optimize images in WordPress
- [ ] Enable Gzip compression

✅ **Checkpoint:** Secured and optimized ✓

---

## 📈 Phase 9: Post-Deployment

### Analytics & SEO
- [ ] Set up Google Analytics
- [ ] Add to Google Search Console
- [ ] Submit sitemap: wholelotofnature.com/sitemap.xml
- [ ] Verify robots.txt
- [ ] Set up meta descriptions
- [ ] Configure social media sharing

### Business Setup
- [ ] Configure payment gateways (Stripe/PayPal)
- [ ] Set up shipping rates in WooCommerce
- [ ] Configure tax settings
- [ ] Test checkout process end-to-end
- [ ] Set up order notification emails
- [ ] Add privacy policy page
- [ ] Add terms and conditions

### Content
- [ ] Add real product images
- [ ] Write product descriptions
- [ ] Create blog posts
- [ ] Update about page
- [ ] Add contact information
- [ ] Set up contact form

✅ **Checkpoint:** Site ready for customers ✓

---

## 🎉 Deployment Complete!

**Your site is now live!**

- **Frontend:** https://wholelotofnature.com
- **Admin:** https://admin.wholelotofnature.com/wp-admin

---

## 📝 Important Information to Save

### FTP Credentials
- Host: _______________________
- Username: _______________________
- Password: _______________________

### SSH Credentials  
- Host: _______________________
- Username: _______________________
- Password: _______________________

### WordPress Admin
- URL: https://admin.wholelotofnature.com/wp-admin
- Username: zebbroka@gmail.com
- Password: _______________________

### Node.js Application
- Path: /public_html/next-app
- Port: _______________________
- Startup: server.js

---

## 🆘 Quick Troubleshooting

### Site shows WordPress instead of Next.js
- Check .htaccess configuration
- Verify Node.js app is running
- Check port number in proxy settings

### Products not loading
- Test API: https://admin.wholelotofnature.com/wp-json/wc/v3/products
- Check CORS configuration
- Verify environment variables

### Application not starting
- Check PM2 logs: `pm2 logs wholelotofnature`
- Verify node_modules installed
- Check server.js exists
- Restart: `pm2 restart wholelotofnature`

### Images not loading
- Check next.config.js image domains
- Verify images exist in WordPress
- Check file permissions

---

## 🔄 Updating the Site

### Update Content (WordPress)
1. Login to WordPress admin
2. Edit products/posts
3. Changes appear automatically on frontend

### Update Code (Next.js)
1. Make changes locally
2. Run `npm run build`
3. Upload new `.next` folder via FTP
4. Restart application: `pm2 restart wholelotofnature`

---

## 📞 Support Contacts

- **Hostinger Support:** 24/7 chat in hPanel
- **WordPress.org Forums:** https://wordpress.org/support/
- **WooCommerce Support:** https://woocommerce.com/support/

---

**Last Updated:** October 18, 2025
**Deployment Date:** _______________
**Deployed By:** _______________

Good luck! 🌿🚀
