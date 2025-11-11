# Hostinger Deployment Guide - Complete Walkthrough

This guide will help you deploy your Next.js frontend on Hostinger while keeping WordPress as the backend.

---

## 🎯 Overview

**What we're doing:**
- **Main domain** (`wholelotofnature.com`) → Next.js Frontend (customer-facing site)
- **Subdomain** (`admin.wholelotofnature.com`) → WordPress Backend (admin panel & API)

**Benefits:**
- Single hosting provider (Hostinger)
- Keep existing WordPress products/posts
- Modern frontend with Next.js
- Easy to manage everything in one place

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:
- [x] Hostinger Business hosting plan
- [x] Domain: wholelotofnature.com active
- [x] WordPress installed with WooCommerce
- [x] Production build completed (✅ Done!)
- [ ] FTP credentials from Hostinger
- [ ] SSH access enabled (optional but recommended)

---

## Step 1: Prepare WordPress Backend (Move to Subdomain)

### 1.1 Create Subdomain in Hostinger

1. **Login to Hostinger hPanel**
   - Go to: https://hpanel.hostinger.com
   - Login with your credentials

2. **Navigate to Domains**
   - Click on "Domains" in the sidebar
   - Click on `wholelotofnature.com`

3. **Create Subdomain**
   - Click "Subdomains" tab
   - Click "+ Create Subdomain"
   - Subdomain: `admin`
   - Full domain will be: `admin.wholelotofnature.com`
   - Document Root: Point to your current WordPress folder (usually `public_html`)
   - Click "Create"

### 1.2 Update WordPress Site URLs

1. **Login to WordPress Admin**
   - Go to: https://wholelotofnature.com/wp-admin
   - Login with your credentials

2. **Update Site URLs**
   - Go to: Settings → General
   - Change both URLs to subdomain:
     ```
     WordPress Address (URL): https://admin.wholelotofnature.com
     Site Address (URL): https://admin.wholelotofnature.com
     ```
   - Click "Save Changes"
   - **Note:** You'll be logged out after saving

3. **Login Again at New URL**
   - Go to: https://admin.wholelotofnature.com/wp-admin
   - Login with same credentials
   - Verify site is working

### 1.3 Install Required WordPress Plugins

1. **Install WPGraphQL**
   - Go to: Plugins → Add New
   - Search: "WPGraphQL"
   - Install and Activate

2. **Install WPGraphQL for WooCommerce**
   - Search: "WPGraphQL WooCommerce"
   - Install and Activate

3. **Install WPGraphQL CORS**
   - Search: "WPGraphQL CORS"
   - Install and Activate
   - Or manually add CORS headers (see Step 1.4)

### 1.4 Enable CORS in WordPress

**Method 1: Using Plugin**
1. Go to: GraphQL → Settings
2. Add allowed origin: `https://wholelotofnature.com`
3. Save settings

**Method 2: Manual (wp-config.php)**
1. Go to Hostinger File Manager
2. Navigate to `public_html`
3. Edit `wp-config.php`
4. Add before `/* That's all, stop editing! */`:

```php
// Enable CORS for Next.js frontend
header("Access-Control-Allow-Origin: https://wholelotofnature.com");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
```

5. Save file

### 1.5 Test WordPress API

Test in browser or use PowerShell:

```powershell
# Test REST API
curl https://admin.wholelotofnature.com/wp-json/wp/v2/posts

# Test GraphQL
curl -X POST https://admin.wholelotofnature.com/graphql `
  -H "Content-Type: application/json" `
  -d '{"query":"{ posts { nodes { title } } }"}'

# Test WooCommerce
curl "https://admin.wholelotofnature.com/wp-json/wc/v3/products?consumer_key=YOUR_KEY&consumer_secret=YOUR_SECRET"
```

✅ **Checkpoint:** WordPress should now be accessible at `admin.wholelotofnature.com`

---

## Step 2: Set Up Node.js on Hostinger

### 2.1 Enable Node.js in hPanel

1. **Navigate to Advanced**
   - In Hostinger hPanel
   - Click "Advanced" in sidebar
   - Click "Node.js"

2. **Create Node.js Application**
   - Click "+ Create Application"
   - **Application Mode:** Production
   - **Node.js Version:** 18.x or later (20.x recommended)
   - **Application Root:** `/public_html/next-app` (or any folder name you prefer)
   - **Application URL:** Select `wholelotofnature.com` (main domain)
   - **Application Startup File:** `server.js` (we'll create this)
   - Click "Create"

3. **Note the Application Details**
   - Note the application path
   - Note the port number (usually 3000 or auto-assigned)

### 2.2 Update Environment Variables in .env.local

Before uploading, update your local `.env.local` file with production URLs:

```env
# WordPress Backend URLs (Subdomain)
WORDPRESS_API_URL=https://admin.wholelotofnature.com/wp-json/wp/v2
WORDPRESS_GRAPHQL_URL=https://admin.wholelotofnature.com/graphql
WORDPRESS_URL=https://admin.wholelotofnature.com

# WooCommerce API
WC_CONSUMER_KEY=ck_7c14b9262866f37bee55394c53c727cf4a6c987f
WC_CONSUMER_SECRET=cs_25c1e29325113145d0c13913007cc1a92d965bce

# Frontend URL (Main Domain)
NEXT_PUBLIC_SITE_URL=https://wholelotofnature.com
NEXT_PUBLIC_BASE_URL=https://wholelotofnature.com

# WordPress Admin
WORDPRESS_USERNAME=zebbroka@gmail.com
WORDPRESS_APP_PASSWORD=your_app_password_here

# Instagram (optional)
INSTAGRAM_APP_ID=1824242505131163
INSTAGRAM_APP_SECRET=697d402f5317e6db29b39175158d5b10
```

---

## Step 3: Build for Production

### 3.1 Clean Build

Run these commands on your local computer:

```powershell
cd "C:\Users\USER\Documents\whole lot of nature\Whole lot of nature\whole-lot-of-nature"

# Clean previous builds
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# Install dependencies (if needed)
npm install

# Build for production
npm run build
```

✅ **Verify:** Build completes without errors

### 3.2 Create Production Environment File

Create `.env.production` file (copy from .env.local):

```powershell
Copy-Item .env.local .env.production
```

Edit `.env.production` to use production URLs (subdomain for WordPress).

---

## Step 4: Create Server File for Hostinger

### 4.1 Create server.js

Create a new file `server.js` in your project root:

```javascript
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// Create Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
```

Save this file.

### 4.2 Update package.json Scripts

Ensure your `package.json` has:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "node server.js",
    "lint": "next lint"
  }
}
```

---

## Step 5: Upload Files to Hostinger

### 5.1 Get FTP Credentials

1. In Hostinger hPanel
2. Go to: Files → FTP Accounts
3. Note your FTP credentials:
   - **Host:** (usually ftp.wholelotofnature.com)
   - **Username:** your_username
   - **Password:** your_password
   - **Port:** 21

### 5.2 Connect via FTP (Using FileZilla)

**Download FileZilla:**
- https://filezilla-project.org/download.php?type=client
- Install and open

**Connect:**
1. Host: `ftp.wholelotofnature.com` (or your FTP host)
2. Username: your FTP username
3. Password: your FTP password
4. Port: 21
5. Click "Quickconnect"

### 5.3 Upload Required Files

**Navigate to your Node.js application folder** (e.g., `/public_html/next-app`)

**Upload these folders/files:**

1. ✅ `.next` folder (entire folder - this is your build)
2. ✅ `public` folder (all static assets)
3. ✅ `node_modules` folder (or install on server - see 5.4)
4. ✅ `package.json`
5. ✅ `package-lock.json`
6. ✅ `next.config.js`
7. ✅ `server.js`
8. ✅ `.env.production` (rename to `.env` on server)

**DO NOT upload:**
- ❌ `src` folder (not needed, already compiled in .next)
- ❌ `.git` folder
- ❌ `node_modules` (optional - can install on server)
- ❌ `.env.local`

### 5.4 Install Dependencies on Server (Alternative to Uploading node_modules)

**Option A: Upload node_modules** (Easier but slower)
- Upload entire `node_modules` folder via FTP
- This can take 30-60 minutes

**Option B: Install on Server** (Faster, recommended)

1. **Enable SSH in Hostinger**
   - Go to: Advanced → SSH Access
   - Enable SSH
   - Note SSH credentials

2. **Connect via SSH** (using PowerShell or PuTTY)
   ```powershell
   ssh username@wholelotofnature.com
   # Enter password when prompted
   ```

3. **Navigate to application folder**
   ```bash
   cd public_html/next-app
   ```

4. **Install dependencies**
   ```bash
   npm install --production
   ```

---

## Step 6: Configure Routing (.htaccess)

### 6.1 Create/Edit .htaccess in public_html

We need to route main domain traffic to Next.js, while keeping WordPress on subdomain.

1. **Via File Manager:**
   - Go to Hostinger Files → File Manager
   - Navigate to `public_html`
   - Edit `.htaccess` (create if doesn't exist)

2. **Add this configuration:**

```apache
# .htaccess for wholelotofnature.com (Main Domain)

# Enable RewriteEngine
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # IMPORTANT: Don't redirect if accessing subdomain (admin.wholelotofnature.com)
    # This ensures WordPress admin still works
    RewriteCond %{HTTP_HOST} ^admin\.wholelotofnature\.com [NC]
    RewriteRule ^ - [L]

    # Don't redirect WordPress admin or wp-json for main domain
    # (in case some WordPress files are still needed)
    RewriteCond %{REQUEST_URI} ^/wp-admin [NC,OR]
    RewriteCond %{REQUEST_URI} ^/wp-login.php [NC,OR]
    RewriteCond %{REQUEST_URI} ^/wp-json [NC]
    RewriteRule ^ - [L]

    # Serve static files directly from Next.js public folder
    RewriteCond %{REQUEST_URI} ^/_next/ [NC,OR]
    RewriteCond %{REQUEST_URI} \.(jpg|jpeg|png|gif|svg|css|js|ico|woff|woff2|ttf|eot)$ [NC]
    RewriteCond %{DOCUMENT_ROOT}/next-app/public%{REQUEST_URI} -f
    RewriteRule ^(.*)$ /next-app/public/$1 [L]

    # Proxy all other requests to Next.js server
    # Replace PORT with your Node.js application port (usually 3000)
    RewriteCond %{REQUEST_URI} !^/next-app/
    RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
</IfModule>

# Enable proxy
<IfModule mod_proxy.c>
    ProxyPreserveHost On
    ProxyPass /next-app !
    ProxyPass /_next http://localhost:3000/_next
    ProxyPassReverse /_next http://localhost:3000/_next
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
```

**⚠️ Important:** Replace `3000` with your actual Node.js application port from Step 2.1

3. **Save the file**

---

## Step 7: Start the Application

### 7.1 Using Hostinger Node.js Manager

1. **Go to Node.js in hPanel**
2. **Find your application**
3. **Click "Manage"**
4. **Start Application:**
   - Click "Run npm install" (if not done)
   - Click "Start Application"
   - Application should show as "Running"

### 7.2 Using SSH (Alternative)

```bash
# Navigate to app folder
cd public_html/next-app

# Start application with PM2 (process manager)
pm2 start server.js --name "wholelotofnature"

# Save PM2 process list
pm2 save

# Set PM2 to start on boot
pm2 startup
```

### 7.3 Verify Application is Running

```bash
# Check if app is running
pm2 status

# View logs
pm2 logs wholelotofnature

# Check if port is listening
netstat -tulpn | grep :3000
```

---

## Step 8: Update DNS (if needed)

If your domain is already pointing to Hostinger, you're good!

If not, update DNS:

1. **Login to Hostinger hPanel**
2. **Go to Domains → wholelotofnature.com → DNS**
3. **Ensure A record points to Hostinger:**
   ```
   Type: A
   Name: @
   Points to: [Your Hostinger Server IP]
   TTL: 14400
   ```

4. **Add subdomain A record:**
   ```
   Type: A
   Name: admin
   Points to: [Same Hostinger Server IP]
   TTL: 14400
   ```

5. **Wait for DNS propagation** (up to 24-48 hours)

---

## Step 9: Test Everything!

### 9.1 Test Main Domain (Next.js Frontend)

Visit: https://wholelotofnature.com

**Verify:**
- ✅ Homepage loads with green theme
- ✅ YouTube video displays
- ✅ Instagram embed shows
- ✅ Shop page shows products
- ✅ Product images load
- ✅ Navigation works
- ✅ Mobile responsive

### 9.2 Test WordPress Admin (Backend)

Visit: https://admin.wholelotofnature.com/wp-admin

**Verify:**
- ✅ Login page loads
- ✅ Can login successfully
- ✅ Dashboard accessible
- ✅ Products visible in WooCommerce
- ✅ Posts visible

### 9.3 Test API Connections

**From Next.js Frontend:**
1. Check browser console for errors
2. Verify products load on shop page
3. Check blog posts display (if using)

**Direct API Tests:**
```powershell
# Test WooCommerce
curl "https://admin.wholelotofnature.com/wp-json/wc/v3/products?consumer_key=ck_7c14b9262866f37bee55394c53c727cf4a6c987f&consumer_secret=cs_25c1e29325113145d0c13913007cc1a92d965bce"

# Test GraphQL
curl -X POST https://admin.wholelotofnature.com/graphql `
  -H "Content-Type: application/json" `
  -d '{"query":"{ products { nodes { name } } }"}'
```

---

## Step 10: Monitoring & Maintenance

### 10.1 Check Application Logs

**Via SSH:**
```bash
# PM2 logs
pm2 logs wholelotofnature

# View last 100 lines
pm2 logs wholelotofnature --lines 100

# Error logs only
pm2 logs wholelotofnature --err
```

**Via Hostinger:**
- Files → File Manager
- Navigate to: `public_html/next-app`
- Check for error logs

### 10.2 Restart Application

**Via Hostinger hPanel:**
1. Node.js → Manage Application
2. Click "Restart"

**Via SSH:**
```bash
pm2 restart wholelotofnature
```

### 10.3 Update Application

When you make changes:

1. **Build locally:**
   ```powershell
   npm run build
   ```

2. **Upload new .next folder** via FTP (overwrite old one)

3. **Restart application** (see 10.2)

---

## Troubleshooting

### Issue: Site shows 404 or WordPress login

**Solution:**
- Check .htaccess configuration
- Ensure Node.js app is running
- Verify proxy settings point to correct port

### Issue: Products not showing

**Solution:**
- Check WooCommerce API credentials in .env
- Verify CORS headers in WordPress
- Test API endpoints directly
- Check browser console for errors

### Issue: Images not loading

**Solution:**
- Update `next.config.js` to include image domains:
  ```javascript
  images: {
    domains: [
      'admin.wholelotofnature.com',
      'wholelotofnature.com',
      'images.unsplash.com'
    ],
  }
  ```
- Rebuild and reupload

### Issue: Application crashes

**Solution:**
- Check PM2 logs: `pm2 logs`
- Verify all environment variables are set
- Check Node.js version compatibility
- Restart application

### Issue: CORS errors in console

**Solution:**
- Verify CORS headers in WordPress wp-config.php
- Install WPGraphQL CORS plugin
- Check allowed origins match exactly

---

## Performance Optimization

### Enable Caching in WordPress

1. Install caching plugin (W3 Total Cache or WP Super Cache)
2. Enable object caching
3. Enable browser caching

### Optimize Next.js

Already optimized in build! Next.js automatically:
- ✅ Minifies JavaScript
- ✅ Optimizes images
- ✅ Code splitting
- ✅ Static generation where possible

### Monitor Performance

- Use Hostinger Analytics
- Enable error logging
- Monitor PM2 stats: `pm2 monit`

---

## Security Checklist

- [x] HTTPS enabled (SSL certificate)
- [ ] Change default WordPress admin URL
- [ ] Use strong passwords
- [ ] Install WordPress security plugin (Wordfence)
- [ ] Regular backups enabled
- [ ] Update WordPress, plugins, and themes regularly
- [ ] Limit login attempts
- [ ] Disable directory browsing

---

## Backup Strategy

### WordPress Backup

1. **Install UpdraftPlus plugin**
2. Configure automatic backups
3. Store backups in Google Drive or Dropbox

### Next.js Backup

Your code is safe in:
- Local computer
- Consider using GitHub for version control

---

## Cost Summary

**Current Hostinger Business Plan:** $3-9/month
- Includes: Hosting, SSL, Email, Domain

**No additional costs!** ✅

---

## Next Steps After Deployment

1. **Set up Google Analytics**
2. **Configure Google Search Console**
3. **Submit sitemap**: wholelotofnature.com/sitemap.xml
4. **Set up email notifications**
5. **Configure shipping rates in WooCommerce**
6. **Add payment gateways** (Stripe, PayPal)
7. **Test checkout process**
8. **Create content** (blog posts, products)

---

## Support

**Need help?**

- **Hostinger Support:** 24/7 live chat in hPanel
- **WordPress Forums:** https://wordpress.org/support/
- **Next.js Docs:** https://nextjs.org/docs

---

## Quick Command Reference

```powershell
# Local development
npm run dev              # Start dev server
npm run build           # Build for production
npm start               # Start production server

# On Hostinger (via SSH)
pm2 start server.js     # Start app
pm2 stop wholelotofnature    # Stop app
pm2 restart wholelotofnature # Restart app
pm2 logs wholelotofnature    # View logs
pm2 status              # Check status
```

---

## ✅ Deployment Complete!

If you've followed all steps, your site should now be live at:
- **Frontend:** https://wholelotofnature.com (Next.js)
- **Backend:** https://admin.wholelotofnature.com (WordPress)

Congratulations! 🎉🌿

---

**Created:** October 18, 2025
**Last Updated:** October 18, 2025
