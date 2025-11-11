# Headless WordPress + Next.js Setup Guide

## What You've Just Set Up

Your Next.js app is now configured to work as a **headless frontend** for your WordPress backend. This means:

- **WordPress (Backend):** Manages all content, products, and blogs at `https://wholelotofnature.com`
- **Next.js (Frontend):** Displays your content with custom design and functionality
- **GraphQL API:** Connects the two systems for fast, efficient data fetching

---

## Required WordPress Plugins

To make this work, you need to install these plugins in your WordPress admin:

### 1. **WPGraphQL** (Required)
- Go to: WordPress Admin → Plugins → Add New
- Search for: **WPGraphQL**
- Install and Activate
- This creates the GraphQL endpoint: `https://wholelotofnature.com/graphql`

### 2. **WPGraphQL for WooCommerce (WooGraphQL)** (Required for products)
- Search for: **WPGraphQL WooCommerce**
- Install and Activate
- This exposes your WooCommerce products via GraphQL

### 3. **WPGraphQL CORS** (Recommended)
- Search for: **WPGraphQL CORS**
- Install and Activate
- Allows your Next.js app to fetch data from WordPress

---

## What's Been Created

### 1. **GraphQL Client** (`src/lib/graphql.ts`)
Functions to interact with WordPress:
- `fetchBlogPosts()` - Get all blog posts
- `fetchPostBySlug(slug)` - Get a single post
- `fetchProducts()` - Get all WooCommerce products
- `fetchProductBySlug(slug)` - Get a single product
- `createBlogPost({ title, content })` - Create a new blog post

### 2. **Blog Pages**
- `/blog` - Lists all blog posts from WordPress
- `/blog/[slug]` - Displays individual blog posts

### 3. **Environment Variables** (`.env.local`)
```
WORDPRESS_GRAPHQL_URL=https://wholelotofnature.com/graphql
WORDPRESS_API_URL=https://wholelotofnature.com/wp-json/wp/v2
WORDPRESS_USERNAME=zebbroka@gmail.com
WORDPRESS_APP_PASSWORD=Jm2r 8rVf 1vqw RwGx pIq9 aL7c
```

---

## How to Use This Setup

### Fetch Blog Posts in Any Component
```tsx
import { fetchBlogPosts } from '@/lib/graphql';

const posts = await fetchBlogPosts();
```

### Fetch Products
```tsx
import { fetchProducts } from '@/lib/graphql';

const products = await fetchProducts();
```

### Create a Blog Post Programmatically
```tsx
import { createBlogPost } from '@/lib/graphql';

await createBlogPost({
  title: 'My New Post',
  content: '<p>This is the content</p>'
});
```

---

## Hosting Options

### **Option 1: Vercel (Recommended - Free)**
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign up
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard
5. Deploy!
6. Point your domain to Vercel

**Pros:**
- Free tier available
- Automatic deployments on git push
- Built-in CDN and optimizations
- Perfect for Next.js

### **Option 2: Netlify**
1. Similar to Vercel
2. Free tier available
3. Great for static sites

### **Option 3: Your WordPress Hosting (Limited)**
You can export Next.js as static HTML and upload to WordPress hosting, but you'll lose:
- API routes
- Server-side rendering
- Dynamic features

**To export:**
```bash
npm run build
npm run export
```
Upload the `out` folder to your WordPress hosting.

---

## Next Steps

1. **Install WordPress Plugins** (WPGraphQL, WPGraphQL WooCommerce)
2. **Test the Blog Page:** Visit `/blog` on your Next.js app
3. **Update Product Fetching:** Replace WooCommerce REST API with GraphQL in your shop page
4. **Deploy to Vercel:** Host your frontend separately from WordPress

---

## WordPress Configuration Checklist

✅ Install WPGraphQL plugin
✅ Install WPGraphQL WooCommerce plugin
✅ Enable Application Passwords (Users → Profile)
✅ Set permalinks to "Post name" (Settings → Permalinks)
✅ Test GraphQL endpoint: `https://wholelotofnature.com/graphql`

---

## Troubleshooting

### GraphQL endpoint returns 404
- Make sure WPGraphQL plugin is installed and activated
- Check permalinks are set to "Post name"

### CORS errors
- Install "WPGraphQL CORS" plugin
- Or add this to your WordPress `.htaccess`:
```apache
Header set Access-Control-Allow-Origin "*"
```

### Authentication errors
- Verify Application Password is correct
- Check username is your WordPress email

---

## Support

Your setup is complete! The Next.js app now pulls blog posts and products from WordPress via GraphQL.

To see it in action:
1. Install the WordPress plugins
2. Run: `npm run dev`
3. Visit: `http://localhost:3000/blog`
