# Deployment Guide for Whole Lot of Nature Website

## Your Domain: wholelotofnature.com

You have several deployment options. I'll guide you through the **recommended option** and alternatives.

---

## 🚀 RECOMMENDED: Deploy to Vercel (Easiest & Free)

Vercel is made by the creators of Next.js and offers the best performance for Next.js apps.

### Step 1: Prepare Your Code

1. **Create a GitHub Repository** (if you haven't already)
   ```bash
   # In your project directory
   git init
   git add .
   git commit -m "Initial commit - Ready for deployment"
   ```

2. **Push to GitHub**
   - Go to github.com and create a new repository
   - Name it "whole-lot-of-nature"
   - Run these commands:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/whole-lot-of-nature.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** with your GitHub account
3. **Import Your Repository**:
   - Click "Add New" → "Project"
   - Select your "whole-lot-of-nature" repository
   - Click "Import"

4. **Configure Build Settings**:
   ```
   Framework Preset: Next.js
   Build Command: npm run build
   Output Directory: .next (auto-detected)
   Install Command: npm install
   ```

5. **Add Environment Variables**:
   Click "Environment Variables" and add:
   ```
   WORDPRESS_API_URL=https://wholelotofnature.com/wp-json/wp/v2
   WORDPRESS_GRAPHQL_URL=https://wholelotofnature.com/graphql
   WORDPRESS_USERNAME=zebbroka@gmail.com
   WORDPRESS_APP_PASSWORD=Jm2r 8rVf 1vqw RwGx pIq9 aL7c
   WORDPRESS_URL=https://wholelotofnature.com
   WC_CONSUMER_KEY=ck_7c14b9262866f37bee55394c53c727cf4a6c987f
   WC_CONSUMER_SECRET=cs_25c1e29325113145d0c13913007cc1a92d965bce
   INSTAGRAM_APP_ID=1824242505131163
   INSTAGRAM_APP_SECRET=697d402f5317e6db29b39175158d5b10
   ```

6. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - You'll get a URL like: `whole-lot-of-nature.vercel.app`

### Step 3: Connect Your Custom Domain

1. **In Vercel Dashboard**:
   - Go to your project
   - Click "Settings" → "Domains"
   - Add your domain: `wholelotofnature.com`

2. **Update Your DNS Settings** (at your domain registrar):
   
   **Option A: Use Vercel DNS (Recommended)**
   - Vercel will provide nameservers
   - Update your domain's nameservers to Vercel's
   
   **Option B: Use CNAME Record**
   - Add a CNAME record:
     ```
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     ```
   - Add an A record for root domain:
     ```
     Type: A
     Name: @
     Value: 76.76.21.21
     ```

3. **Wait for DNS Propagation** (10-60 minutes)

4. **SSL Certificate**: Vercel automatically provisions SSL (HTTPS) for free!

---

## 🎯 ALTERNATIVE 1: Deploy to Netlify

Similar to Vercel, also free tier available:

1. Go to https://netlify.com
2. Connect your GitHub repository
3. Build settings:
   ```
   Build command: npm run build
   Publish directory: .next
   ```
4. Add environment variables (same as above)
5. Deploy and connect custom domain

---

## 🎯 ALTERNATIVE 2: Deploy to Your Own VPS/Hosting

If you have cPanel hosting or a VPS, you'll need Node.js support.

### Requirements:
- Node.js 18+ installed
- PM2 or similar process manager
- Nginx or Apache for reverse proxy

### Steps:

1. **Build the project locally**:
   ```bash
   npm run build
   ```

2. **Upload files to your server**:
   - Upload entire project folder via FTP/SFTP
   - Or use Git to clone on server

3. **On your server, install dependencies**:
   ```bash
   cd /path/to/your/project
   npm install --production
   ```

4. **Create .env.local** on server with your environment variables

5. **Start the application**:
   ```bash
   # Using PM2 (recommended)
   pm2 start npm --name "whole-lot-of-nature" -- start
   pm2 save
   pm2 startup
   ```

6. **Configure Nginx reverse proxy**:
   ```nginx
   server {
       listen 80;
       server_name wholelotofnature.com www.wholelotofnature.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **Install SSL certificate**:
   ```bash
   sudo certbot --nginx -d wholelotofnature.com -d www.wholelotofnature.com
   ```

---

## 🎯 ALTERNATIVE 3: Deploy to DigitalOcean App Platform

1. Go to https://cloud.digitalocean.com
2. Create new App
3. Connect GitHub repository
4. Choose "Next.js" as framework
5. Add environment variables
6. Deploy (starts at $5/month)

---

## ⚡ Quick Comparison

| Platform | Cost | Ease | Performance | Best For |
|----------|------|------|-------------|----------|
| **Vercel** | Free tier generous | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Next.js apps |
| **Netlify** | Free tier good | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Static sites |
| **Own VPS** | $5-20/mo | ⭐⭐ | ⭐⭐⭐ | Full control |
| **DigitalOcean** | $5+/mo | ⭐⭐⭐ | ⭐⭐⭐⭐ | Scalability |

---

## 📝 Pre-Deployment Checklist

- [ ] All environment variables documented
- [ ] Build succeeds locally (`npm run build`)
- [ ] No console errors in production build
- [ ] WordPress API endpoints are accessible
- [ ] Images and assets load correctly
- [ ] Mobile responsive design tested
- [ ] SSL certificate will be configured
- [ ] DNS records ready to update

---

## 🔧 Current Status Check

Your WordPress backend is already at: **https://wholelotofnature.com**
- GraphQL endpoint: ✅ Working
- WooCommerce API: ✅ Working
- Blog posts: ✅ Working

Your frontend needs to be deployed separately to work with your domain.

---

## 🚦 Recommended Path

**For you, I recommend Vercel because:**
1. ✅ Free and generous limits
2. ✅ Automatic SSL certificate
3. ✅ Perfect for Next.js
4. ✅ Automatic deployments on git push
5. ✅ Global CDN for fast loading worldwide
6. ✅ Easy custom domain setup
7. ✅ No server maintenance needed

---

## 📞 Need Help?

After you choose your deployment method, I can:
1. Help fix any build errors
2. Guide you through DNS configuration
3. Optimize your deployment settings
4. Set up automatic deployments

**What would you like to do?**
1. Deploy to Vercel (Recommended)
2. Deploy to your existing hosting
3. Something else

Let me know and I'll guide you through the specific steps!
