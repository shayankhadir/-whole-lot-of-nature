# Headless WordPress Deployment Guide
## Next.js Frontend + WordPress Backend on Hostinger

### Overview
You're setting up a **headless WordPress** architecture where:
- **Backend**: WordPress with WooCommerce at `https://wholelotofnature.com` (already set up)
- **Frontend**: Next.js app (this project) will serve as the customer-facing website
- **Data Flow**: Next.js fetches data from WordPress via REST API and GraphQL

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     YOUR DOMAIN                          │
│              https://wholelotofnature.com                │
└─────────────────────────────────────────────────────────┘
                          │
                          ├── Option 1: Use subdomain
                          │   ├── https://wholelotofnature.com (Next.js Frontend)
                          │   └── https://admin.wholelotofnature.com (WordPress Admin)
                          │
                          └── Option 2: Use subfolder
                              ├── https://wholelotofnature.com (Next.js Frontend)
                              └── https://wholelotofnature.com/wp-admin (WordPress Admin)
```

---

## Step 1: Configure WordPress Backend (Already Done ✅)

Your WordPress is already set up at `https://wholelotofnature.com` with:
- ✅ WooCommerce installed
- ✅ Products configured
- ✅ GraphQL endpoint active (`/graphql`)
- ✅ REST API endpoints available

### Additional WordPress Configuration

1. **Install Required Plugins** (if not already installed):
   ```
   - WPGraphQL (for GraphQL API)
   - WPGraphQL for WooCommerce (for product data)
   - WPGraphQL CORS (for cross-origin requests)
   ```

2. **Enable CORS in WordPress**:
   Add to your WordPress `wp-config.php` or use a plugin:
   ```php
   // Add before "That's all, stop editing!"
   header("Access-Control-Allow-Origin: *");
   header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
   header("Access-Control-Allow-Headers: Content-Type, Authorization");
   ```

3. **Set WordPress URL Structure**:
   - Go to Settings → General
   - **WordPress Address (URL)**: `https://wholelotofnature.com/wp`
   - **Site Address (URL)**: `https://wholelotofnature.com`
   - This keeps WordPress in a subfolder

---

## Step 2: Deployment Options for Next.js Frontend

### **Option A: Vercel (Recommended - Easiest)**

#### Advantages:
- ✅ Free for personal/commercial use
- ✅ Automatic deployments from GitHub
- ✅ Built-in CDN and edge caching
- ✅ Serverless functions included
- ✅ Easy environment variable management
- ✅ Custom domain support
- ✅ Automatic HTTPS

#### Steps:

1. **Push Code to GitHub**:
   ```powershell
   cd "C:\Users\USER\Documents\whole lot of nature\Whole lot of nature\whole-lot-of-nature"
   
   # Initialize git if not already done
   git init
   git add .
   git commit -m "Initial commit - Headless WordPress Next.js frontend"
   
   # Create GitHub repo and push
   git remote add origin https://github.com/YOUR_USERNAME/wholelotofnature-frontend.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Add Environment Variables:
     ```
     WORDPRESS_API_URL=https://wholelotofnature.com/wp-json/wp/v2
     WORDPRESS_GRAPHQL_URL=https://wholelotofnature.com/graphql
     WORDPRESS_USERNAME=your_wp_username
     WORDPRESS_APP_PASSWORD=your_app_password
     WC_CONSUMER_KEY=ck_your_key
     WC_CONSUMER_SECRET=cs_your_secret
     NEXT_PUBLIC_SITE_URL=https://wholelotofnature.com
     ```
   - Click "Deploy"

3. **Connect Your Domain**:
   - In Vercel Dashboard → Settings → Domains
   - Add `wholelotofnature.com`
   - Vercel will provide DNS records
   - Update DNS in Hostinger:
     - Type: `A Record`
     - Name: `@`
     - Value: `76.76.21.21` (Vercel's IP)
     - Or use CNAME: `cname.vercel-dns.com`

4. **Move WordPress to Subdomain** (Recommended):
   In Hostinger:
   - Create subdomain: `admin.wholelotofnature.com`
   - Point subdomain to your WordPress installation
   - Update WordPress URLs to `https://admin.wholelotofnature.com`
   - Update environment variables in Vercel to use new subdomain

---

### **Option B: Hostinger VPS/Business Hosting (Your Current Host)**

#### Advantages:
- ✅ Everything in one place
- ✅ Full control over server
- ✅ No additional hosting costs
- ✅ Can use Node.js on Hostinger

#### Requirements:
- Hostinger Business or VPS plan with Node.js support
- SSH access to server
- Node.js 18+ installed

#### Steps:

1. **Check Node.js Support**:
   ```bash
   # SSH into your Hostinger server
   ssh your_username@your_server_ip
   
   # Check Node.js version
   node --version
   # Should be 18+
   ```

2. **Build Your Next.js App**:
   ```powershell
   cd "C:\Users\USER\Documents\whole lot of nature\Whole lot of nature\whole-lot-of-nature"
   
   # Build for production
   npm run build
   ```

3. **Upload to Hostinger**:
   Using FTP/SFTP (FileZilla, WinSCP):
   - Upload entire project folder to: `/home/username/nextjs-app/`
   - Upload `.next` folder (build output)
   - Upload `node_modules` OR run `npm install` on server
   - Upload `package.json`, `package-lock.json`
   - Upload `.env.local` with your environment variables

4. **Configure Node.js Application in Hostinger**:
   - Login to hPanel (Hostinger control panel)
   - Go to "Advanced" → "Node.js"
   - Click "Create Application"
   - Settings:
     - Node.js version: 18+
     - Application mode: Production
     - Application root: `/home/username/nextjs-app`
     - Application startup file: `npm start`
     - Environment variables: Add all from `.env.local`

5. **Configure Nginx/Apache**:
   Create reverse proxy in Hostinger (via hPanel or .htaccess):
   
   **.htaccess** (if using Apache):
   ```apache
   RewriteEngine On
   
   # Redirect WordPress admin to /wp
   RewriteRule ^wp-admin/(.*) /wp/wp-admin/$1 [L]
   RewriteRule ^wp-includes/(.*) /wp/wp-includes/$1 [L]
   RewriteRule ^wp-content/(.*) /wp/wp-content/$1 [L]
   
   # Proxy all other requests to Next.js
   RewriteCond %{REQUEST_URI} !^/wp
   RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
   ```

6. **Start Next.js App**:
   ```bash
   # SSH into server
   cd /home/username/nextjs-app
   
   # Install dependencies
   npm install --production
   
   # Start with PM2 (process manager)
   npm install -g pm2
   pm2 start npm --name "nextjs-app" -- start
   pm2 save
   pm2 startup
   ```

---

### **Option C: Netlify (Alternative to Vercel)**

Very similar to Vercel setup:
1. Push code to GitHub
2. Connect Netlify to GitHub
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add environment variables
5. Connect custom domain

---

## Step 3: Update Next.js Configuration

Update your `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['wholelotofnature.com', 'admin.wholelotofnature.com', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wholelotofnature.com',
      },
      {
        protocol: 'https',
        hostname: 'admin.wholelotofnature.com',
      },
    ],
  },
  env: {
    WORDPRESS_API_URL: process.env.WORDPRESS_API_URL,
    WORDPRESS_GRAPHQL_URL: process.env.WORDPRESS_GRAPHQL_URL,
  },
  // For ISR (Incremental Static Regeneration)
  async rewrites() {
    return [
      {
        source: '/graphql',
        destination: 'https://admin.wholelotofnature.com/graphql',
      },
      {
        source: '/wp-json/:path*',
        destination: 'https://admin.wholelotofnature.com/wp-json/:path*',
      },
    ];
  },
}

module.exports = nextConfig
```

---

## Step 4: DNS Configuration in Hostinger

### For Vercel Deployment:

1. Login to Hostinger
2. Go to Domains → Manage
3. Select `wholelotofnature.com`
4. DNS/Name Servers
5. Add/Update Records:

```
# Main domain points to Vercel (Next.js)
Type: A
Name: @
Value: 76.76.21.21
TTL: 14400

# WordPress admin subdomain
Type: A
Name: admin
Value: YOUR_HOSTINGER_SERVER_IP
TTL: 14400

# WWW subdomain
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 14400
```

### For Hostinger Deployment:
Keep current DNS pointing to Hostinger server.

---

## Step 5: WordPress Permalinks & CORS

1. **WordPress Permalinks**:
   - Settings → Permalinks
   - Choose "Post name" structure
   - Save

2. **Install WPGraphQL CORS Plugin**:
   ```
   Plugins → Add New → Search "WPGraphQL CORS"
   Install & Activate
   ```

3. **Configure CORS**:
   - GraphQL → Settings → CORS
   - Add allowed origins:
     - `https://wholelotofnature.com`
     - `http://localhost:3000` (for development)

---

## Step 6: Test the Setup

1. **Test WordPress API**:
   ```bash
   # Test REST API
   curl https://wholelotofnature.com/wp-json/wp/v2/posts
   
   # Test GraphQL
   curl -X POST https://wholelotofnature.com/graphql \
     -H "Content-Type: application/json" \
     -d '{"query":"{ posts { nodes { title } } }"}'
   ```

2. **Test Next.js Build**:
   ```powershell
   npm run build
   npm start
   # Visit http://localhost:3000
   ```

3. **Test WooCommerce Products**:
   Visit: `https://wholelotofnature.com/shop`
   Should display products from WordPress

---

## Step 7: Continuous Deployment

### With Vercel/Netlify:
- Every `git push` to main branch automatically deploys
- Preview deployments for pull requests
- Rollback to previous versions easily

### With Hostinger:
Set up GitHub Actions for auto-deployment:

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Hostinger

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Hostinger
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          password: ${{ secrets.PASSWORD }}
          source: ".next,package.json,package-lock.json"
          target: "/home/username/nextjs-app/"
      
      - name: Restart Application
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          password: ${{ secrets.PASSWORD }}
          script: |
            cd /home/username/nextjs-app
            npm install --production
            pm2 restart nextjs-app
```

---

## Recommended Architecture (Final Setup)

```
┌─────────────────────────────────────────────────────────┐
│              https://wholelotofnature.com               │
│                   (Next.js Frontend)                    │
│                    Hosted on Vercel                     │
└─────────────────────────────────────────────────────────┘
                          │
                          │ API Calls
                          ▼
┌─────────────────────────────────────────────────────────┐
│         https://admin.wholelotofnature.com              │
│                 (WordPress Backend)                     │
│              Hosted on Hostinger                        │
│                                                          │
│  - WordPress Admin                                      │
│  - WooCommerce                                          │
│  - GraphQL API (/graphql)                               │
│  - REST API (/wp-json)                                  │
│  - Product Images                                       │
│  - Blog Content                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Summary: My Recommendation

**Best Setup for You:**

1. **Frontend**: Deploy Next.js to **Vercel** (free, fast, reliable)
2. **Backend**: Keep WordPress on **Hostinger** at subdomain `admin.wholelotofnature.com`
3. **Domain**: 
   - `wholelotofnature.com` → Next.js (Vercel)
   - `admin.wholelotofnature.com` → WordPress (Hostinger)

**Why This Setup?**
- ✅ Best performance (Vercel's global CDN)
- ✅ Free hosting for frontend
- ✅ Automatic deployments
- ✅ Keep using your Hostinger plan for WordPress
- ✅ Separate admin from customer-facing site
- ✅ Easy to manage and scale

---

## Next Steps

1. **Choose deployment option** (I recommend Vercel)
2. **Create GitHub repository** for your code
3. **Move WordPress to subdomain** (admin.wholelotofnature.com)
4. **Update environment variables** in your project
5. **Deploy to Vercel**
6. **Update DNS records** in Hostinger
7. **Test everything**

Would you like me to help you with any specific step? I can:
- Create the GitHub repository structure
- Configure the deployment settings
- Update your Next.js config files
- Help with DNS setup
- Test the WordPress API connections

Let me know which deployment option you prefer and I'll guide you through it!
