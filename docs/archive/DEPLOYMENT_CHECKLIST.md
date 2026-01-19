# Quick Start Checklist - Headless WordPress Deployment

## Pre-Deployment Checklist

### WordPress Backend (Hostinger) ✓
- [x] WordPress installed at https://wholelotofnature.com
- [x] WooCommerce installed and configured
- [ ] WPGraphQL plugin installed
- [ ] WPGraphQL for WooCommerce plugin installed
- [ ] WPGraphQL CORS plugin installed
- [ ] WordPress URL moved to subdomain (admin.wholelotofnature.com)
- [ ] CORS headers configured
- [ ] REST API tested
- [ ] GraphQL API tested

### Next.js Frontend (Your Computer)
- [x] Project built successfully (`npm run build`)
- [ ] Environment variables configured in `.env.local`
- [ ] Git repository initialized
- [ ] Code pushed to GitHub
- [ ] Images optimized
- [ ] All API endpoints tested locally

---

## Deployment Steps (Recommended: Vercel)

### 1. Prepare WordPress Backend

```bash
# 1. Create subdomain in Hostinger hPanel
- Domain: admin.wholelotofnature.com
- Point to: Same WordPress installation folder

# 2. Update WordPress URLs
- Go to: Settings → General
- WordPress Address: https://admin.wholelotofnature.com
- Site Address: https://admin.wholelotofnature.com
- Save Changes

# 3. Install Required Plugins
- WPGraphQL
- WPGraphQL for WooCommerce  
- WPGraphQL CORS
```

### 2. Update Environment Variables

Update `.env.local`:
```env
WORDPRESS_API_URL=https://admin.wholelotofnature.com/wp-json/wp/v2
WORDPRESS_GRAPHQL_URL=https://admin.wholelotofnature.com/graphql
WORDPRESS_USERNAME=your_username
WORDPRESS_APP_PASSWORD=your_app_password
WC_CONSUMER_KEY=ck_your_key
WC_CONSUMER_SECRET=cs_your_secret
NEXT_PUBLIC_SITE_URL=https://wholelotofnature.com
```

### 3. Push to GitHub

```powershell
cd "C:\Users\USER\Documents\whole lot of nature\Whole lot of nature\whole-lot-of-nature"

# Initialize git
git init
git add .
git commit -m "Initial commit - Headless WordPress frontend"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/wholelotofnature-frontend.git
git branch -M main
git push -u origin main
```

### 4. Deploy to Vercel

```
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Import your repository
5. Framework Preset: Next.js (auto-detected)
6. Root Directory: ./
7. Build Command: npm run build
8. Output Directory: .next
9. Install Command: npm install

10. Add Environment Variables:
   - Click "Environment Variables"
   - Add all variables from .env.local
   - Save

11. Click "Deploy"
```

### 5. Configure Custom Domain in Vercel

```
1. In Vercel Dashboard → Settings → Domains
2. Add domain: wholelotofnature.com
3. Add domain: www.wholelotofnature.com
4. Vercel provides DNS records
```

### 6. Update DNS in Hostinger

```
Login to Hostinger → Domains → wholelotofnature.com → DNS

Add/Update these records:

1. Main domain (A Record):
   Type: A
   Name: @
   Value: 76.76.21.21
   TTL: 14400

2. WWW subdomain (CNAME):
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 14400

3. Admin subdomain (keep existing):
   Type: A
   Name: admin
   Value: [Your Hostinger Server IP]
   TTL: 14400

Save changes and wait 24-48 hours for DNS propagation.
```

---

## Testing Checklist

### Test WordPress API
```bash
# Test REST API
curl https://admin.wholelotofnature.com/wp-json/wp/v2/posts

# Test GraphQL
curl -X POST https://admin.wholelotofnature.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ posts { nodes { title } } }"}'

# Test WooCommerce Products
curl https://admin.wholelotofnature.com/wp-json/wc/v3/products \
  -u "consumer_key:consumer_secret"
```

### Test Next.js Deployment
- [ ] Homepage loads (https://wholelotofnature.com)
- [ ] Shop page displays products
- [ ] Blog page shows WordPress posts
- [ ] Product images load correctly
- [ ] Add to cart works
- [ ] Checkout process functional
- [ ] Instagram/YouTube embeds work
- [ ] Contact form submits
- [ ] Mobile responsive design works

---

## Troubleshooting

### CORS Errors
**Problem**: API requests blocked by CORS
**Solution**: 
1. Install WPGraphQL CORS plugin
2. Add allowed origin: https://wholelotofnature.com
3. Or add to WordPress wp-config.php:
```php
header("Access-Control-Allow-Origin: https://wholelotofnature.com");
```

### Images Not Loading
**Problem**: WordPress images not displaying
**Solution**: Update `next.config.js`:
```javascript
images: {
  domains: ['admin.wholelotofnature.com', 'wholelotofnature.com'],
}
```

### Build Fails on Vercel
**Problem**: Build errors during deployment
**Solution**:
1. Check build logs in Vercel
2. Test build locally: `npm run build`
3. Fix TypeScript errors
4. Ensure all environment variables are set

### Products Not Showing
**Problem**: Shop page empty
**Solution**:
1. Verify WooCommerce REST API is enabled
2. Check API credentials in environment variables
3. Test API endpoint directly
4. Check WordPress permalink structure

---

## Post-Deployment Tasks

- [ ] Test all pages and features
- [ ] Configure Google Analytics
- [ ] Set up Search Console
- [ ] Configure email notifications
- [ ] Set up backup system
- [ ] Enable caching in WordPress
- [ ] Configure CDN for images
- [ ] Set up monitoring (Vercel Analytics)
- [ ] Update robots.txt
- [ ] Submit sitemap to search engines

---

## Maintenance

### Updating Content
- Edit products/posts in WordPress admin: https://admin.wholelotofnature.com/wp-admin
- Changes appear on frontend automatically (with ISR/caching)

### Updating Frontend Code
```powershell
# Make changes to code
git add .
git commit -m "Description of changes"
git push

# Vercel automatically deploys new version
```

### Backup Strategy
1. **WordPress**: Use Hostinger's backup or plugin (UpdraftPlus)
2. **Next.js Code**: Backed up in GitHub automatically
3. **Database**: Schedule regular MySQL dumps

---

## Cost Breakdown

**Current Setup:**
- Hostinger Business Hosting: $3-9/month (you already have this)
- Vercel Pro (optional): Free tier available, $20/month for pro features
- Domain: ~$10-15/year (you already have this)

**Total Additional Cost: $0** (using free tiers)

---

## Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **WPGraphQL Docs**: https://www.wpgraphql.com/docs
- **WooCommerce API**: https://woocommerce.github.io/woocommerce-rest-api-docs/

---

## Need Help?

If you encounter issues:
1. Check Vercel deployment logs
2. Check WordPress error logs (Hostinger → File Manager → error_log)
3. Test API endpoints individually
4. Review CORS configuration
5. Verify DNS propagation: https://dnschecker.org

Let me know which step you're on and I can help you through it!
