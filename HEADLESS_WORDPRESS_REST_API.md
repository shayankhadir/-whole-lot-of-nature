# Headless WordPress with REST API - Complete Guide

## 🎯 Why REST API is Better

✅ **Advantages of REST API over GraphQL:**
- Native to WordPress - no extra plugins needed
- WooCommerce has full REST API support built-in
- Simpler setup and maintenance
- Better caching support
- Easier debugging
- More documentation and community support
- Works with standard WordPress authentication

---

## 🔌 The Headless WordPress CMS Plugin

**Plugin:** "Headless Mode" or "WPGraphQL" alternatives

**Best Plugin for Headless:** 
- **Frontity** (Framework + Plugin)
- **WP REST API - Custom Endpoints**
- **Simply Static** (for static exports)
- **Headless Mode** (Disables front-end, keeps REST API)

**Recommended: Headless Mode Plugin**
- Disables WordPress frontend themes
- Keeps REST API active
- Redirects front-end to your Next.js app
- Maintains admin access

---

## 📋 WordPress Setup for REST API

### Step 1: Install Required Plugins

1. **Login to WordPress Admin**
   - https://wholelotofnature.com/wp-admin

2. **Install Headless Mode Plugin**
   ```
   Plugins → Add New → Search "Headless Mode"
   Install and Activate
   ```

3. **Install JWT Authentication (for secure API)**
   ```
   Search: "JWT Authentication for WP REST API"
   Install and Activate
   ```

4. **Enable REST API (Usually enabled by default)**
   - No plugin needed - WordPress has REST API built-in
   - WooCommerce REST API is also built-in

---

## 🔧 WordPress Configuration

### Step 2: Configure URLs for Development

**For LOCAL development (Next.js on localhost:3000):**

1. **Go to:** Settings → General
2. **Set URLs:**
   ```
   WordPress Address (URL): http://localhost/wordpress
   Site Address (URL): http://localhost:3000
   ```
   OR if WordPress is at your domain:
   ```
   WordPress Address (URL): https://wholelotofnature.com
   Site Address (URL): http://localhost:3000
   ```

**Important:** 
- `WordPress Address` = Where WordPress files are installed
- `Site Address` = Where your Next.js frontend runs

### Step 3: Enable CORS for REST API

**Method 1: Using Plugin**
- Install "WP REST API Controller"
- Enable CORS for your Next.js domain

**Method 2: Manual (wp-config.php)** - Recommended

Add this to `wp-config.php` (before "That's all"):

```php
// Enable CORS for REST API
add_action('rest_api_init', function() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce");
    header("Access-Control-Allow-Credentials: true");
}, 15);

// Handle preflight requests
add_action('init', function() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        status_header(200);
        exit();
    }
});
```

**For Production:** Change `*` to your specific domain:
```php
header("Access-Control-Allow-Origin: https://wholelotofnature.com");
```

### Step 4: Permalinks Setup

1. **Go to:** Settings → Permalinks
2. **Select:** Post name (recommended for clean URLs)
3. **Save Changes**

This enables clean REST API endpoints like:
```
/wp-json/wp/v2/posts
/wp-json/wc/v3/products
```

---

## 🔑 WooCommerce REST API Keys

### Step 5: Generate API Keys

1. **Go to:** WooCommerce → Settings → Advanced → REST API
2. **Click:** "Add Key"
3. **Configure:**
   - Description: "Next.js Frontend"
   - User: Your admin user
   - Permissions: Read/Write (or Read only for security)
4. **Save and copy:**
   - Consumer Key: `ck_xxxxx`
   - Consumer Secret: `cs_xxxxx`

✅ **You already have these:**
```
Consumer Key: ck_7c14b9262866f37bee55394c53c727cf4a6c987f
Consumer Secret: cs_25c1e29325113145d0c13913007cc1a92d965bce
```

---

## 🔄 Environment Configuration

### Step 6: Update .env.local for REST API

Create/Update `.env.local`:

```env
# ==============================================
# WORDPRESS REST API CONFIGURATION
# ==============================================

# Development (Local WordPress)
WORDPRESS_API_URL=https://wholelotofnature.com/wp-json
WORDPRESS_URL=https://wholelotofnature.com

# WooCommerce REST API
WC_CONSUMER_KEY=ck_7c14b9262866f37bee55394c53c727cf4a6c987f
WC_CONSUMER_SECRET=cs_25c1e29325113145d0c13913007cc1a92d965bce

# Authentication (if needed)
WORDPRESS_USERNAME=zebbroka@gmail.com
WORDPRESS_APP_PASSWORD=your_app_password_here

# Frontend URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=https://wholelotofnature.com/wp-json

# Image optimization
NEXT_PUBLIC_WORDPRESS_URL=https://wholelotofnature.com
```

### Step 7: Production Environment (.env.production)

```env
# ==============================================
# PRODUCTION CONFIGURATION
# ==============================================

# Production WordPress (Subdomain)
WORDPRESS_API_URL=https://admin.wholelotofnature.com/wp-json
WORDPRESS_URL=https://admin.wholelotofnature.com

# WooCommerce REST API (same keys)
WC_CONSUMER_KEY=ck_7c14b9262866f37bee55394c53c727cf4a6c987f
WC_CONSUMER_SECRET=cs_25c1e29325113145d0c13913007cc1a92d965bce

# Frontend URL (Production)
NEXT_PUBLIC_SITE_URL=https://wholelotofnature.com
NEXT_PUBLIC_API_URL=https://admin.wholelotofnature.com/wp-json

# Image optimization
NEXT_PUBLIC_WORDPRESS_URL=https://admin.wholelotofnature.com
```

---

## 📡 REST API Endpoints Reference

### WordPress Posts
```javascript
// Get all posts
GET /wp-json/wp/v2/posts

// Get single post
GET /wp-json/wp/v2/posts/{id}

// Get post by slug
GET /wp-json/wp/v2/posts?slug={slug}

// Get posts by category
GET /wp-json/wp/v2/posts?categories={category_id}

// Search posts
GET /wp-json/wp/v2/posts?search={search_term}
```

### WordPress Pages
```javascript
// Get all pages
GET /wp-json/wp/v2/pages

// Get page by slug
GET /wp-json/wp/v2/pages?slug={slug}
```

### WordPress Media
```javascript
// Get all media
GET /wp-json/wp/v2/media

// Get media by ID
GET /wp-json/wp/v2/media/{id}
```

### WooCommerce Products
```javascript
// Get all products
GET /wp-json/wc/v3/products

// Get single product
GET /wp-json/wc/v3/products/{id}

// Get product by slug
GET /wp-json/wc/v3/products?slug={slug}

// Get products by category
GET /wp-json/wc/v3/products?category={category_id}

// Get featured products
GET /wp-json/wc/v3/products?featured=true

// Get products on sale
GET /wp-json/wc/v3/products?on_sale=true

// Search products
GET /wp-json/wc/v3/products?search={search_term}
```

### WooCommerce Categories
```javascript
// Get all categories
GET /wp-json/wc/v3/products/categories

// Get category by ID
GET /wp-json/wc/v3/products/categories/{id}

// Get category by slug
GET /wp-json/wc/v3/products/categories?slug={slug}
```

### WooCommerce Orders
```javascript
// Get orders (requires authentication)
GET /wp-json/wc/v3/orders

// Create order
POST /wp-json/wc/v3/orders
```

---

## 💻 Code Implementation

### Step 8: Update API Service Files

**File: `src/lib/api/wordpress.ts`** (New REST API service)

```typescript
// WordPress REST API Service
const API_URL = process.env.WORDPRESS_API_URL || process.env.NEXT_PUBLIC_API_URL;

export interface Post {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  featured_media: number;
  categories: number[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
    }>>;
  };
}

export async function getPosts(limit: number = 10): Promise<Post[]> {
  try {
    const res = await fetch(
      `${API_URL}/wp/v2/posts?per_page=${limit}&_embed`,
      {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch posts: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(
      `${API_URL}/wp/v2/posts?slug=${slug}&_embed`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch post: ${res.statusText}`);
    }

    const posts = await res.json();
    return posts[0] || null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function getPages(): Promise<Post[]> {
  try {
    const res = await fetch(
      `${API_URL}/wp/v2/pages?_embed`,
      {
        next: { revalidate: 3600 }, // Pages change less often
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch pages: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
}
```

**File: `src/lib/api/woocommerce.ts`** (Enhanced WooCommerce service)

```typescript
// WooCommerce REST API Service
import crypto from 'crypto';

const WC_URL = process.env.WORDPRESS_URL || '';
const WC_KEY = process.env.WC_CONSUMER_KEY || '';
const WC_SECRET = process.env.WC_CONSUMER_SECRET || '';

export interface Product {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  type: string;
  status: string;
  featured: boolean;
  catalog_visibility: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  virtual: boolean;
  downloadable: boolean;
  downloads: any[];
  download_limit: number;
  download_expiry: number;
  external_url: string;
  button_text: string;
  tax_status: string;
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: number | null;
  stock_status: string;
  backorders: string;
  backorders_allowed: boolean;
  backordered: boolean;
  sold_individually: boolean;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  shipping_required: boolean;
  shipping_taxable: boolean;
  shipping_class: string;
  shipping_class_id: number;
  reviews_allowed: boolean;
  average_rating: string;
  rating_count: number;
  related_ids: number[];
  upsell_ids: number[];
  cross_sell_ids: number[];
  parent_id: number;
  purchase_note: string;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  images: Array<{
    id: number;
    date_created: string;
    date_modified: string;
    src: string;
    name: string;
    alt: string;
  }>;
  attributes: Array<{
    id: number;
    name: string;
    position: number;
    visible: boolean;
    variation: boolean;
    options: string[];
  }>;
  default_attributes: any[];
  variations: number[];
  grouped_products: number[];
  menu_order: number;
  meta_data: any[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  display: string;
  image: {
    id: number;
    src: string;
    name: string;
    alt: string;
  } | null;
  menu_order: number;
  count: number;
}

// Generate OAuth signature for WooCommerce
function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>
): string {
  const paramString = Object.keys(params)
    .sort()
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');

  const baseString = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(paramString)}`;
  
  return crypto
    .createHmac('sha256', WC_SECRET)
    .update(baseString)
    .digest('base64');
}

// Build authenticated URL
function buildAuthenticatedURL(endpoint: string, params: Record<string, any> = {}): string {
  const url = `${WC_URL}/wp-json/wc/v3${endpoint}`;
  
  const authParams: Record<string, string> = {
    consumer_key: WC_KEY,
    consumer_secret: WC_SECRET,
    ...params,
  };

  const queryString = Object.keys(authParams)
    .map(key => `${key}=${encodeURIComponent(authParams[key])}`)
    .join('&');

  return `${url}?${queryString}`;
}

export async function getProducts(params: {
  per_page?: number;
  page?: number;
  search?: string;
  category?: string;
  featured?: boolean;
  on_sale?: boolean;
  orderby?: string;
  order?: 'asc' | 'desc';
} = {}): Promise<Product[]> {
  try {
    const url = buildAuthenticatedURL('/products', {
      per_page: params.per_page || 10,
      page: params.page || 1,
      ...(params.search && { search: params.search }),
      ...(params.category && { category: params.category }),
      ...(params.featured !== undefined && { featured: params.featured }),
      ...(params.on_sale !== undefined && { on_sale: params.on_sale }),
      ...(params.orderby && { orderby: params.orderby }),
      ...(params.order && { order: params.order }),
    });

    const res = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const url = buildAuthenticatedURL('/products', { slug });

    const res = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch product: ${res.statusText}`);
    }

    const products = await res.json();
    return products[0] || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function getProductById(id: number): Promise<Product | null> {
  try {
    const url = buildAuthenticatedURL(`/products/${id}`);

    const res = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch product: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function getCategories(params: {
  per_page?: number;
  hide_empty?: boolean;
} = {}): Promise<Category[]> {
  try {
    const url = buildAuthenticatedURL('/products/categories', {
      per_page: params.per_page || 100,
      hide_empty: params.hide_empty !== false,
    });

    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Categories change less often
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  return getProducts({
    per_page: limit,
    featured: true,
  });
}

export async function getOnSaleProducts(limit: number = 8): Promise<Product[]> {
  return getProducts({
    per_page: limit,
    on_sale: true,
  });
}

export async function searchProducts(query: string, limit: number = 20): Promise<Product[]> {
  return getProducts({
    per_page: limit,
    search: query,
  });
}
```

---

## 🔄 Migration from GraphQL to REST API

### Step 9: Remove GraphQL Dependencies

1. **Remove GraphQL packages:**
```powershell
cd "C:\Users\USER\Documents\whole lot of nature\Whole lot of nature\whole-lot-of-nature"
npm uninstall graphql graphql-request
```

2. **Delete GraphQL files:**
   - Delete: `src/lib/graphql.ts`
   - Delete: `test-graphql.js`

3. **Update imports across the codebase:**
   - Replace GraphQL imports with REST API imports
   - Update all components using GraphQL

---

## ✅ Testing REST API

### Step 10: Test Endpoints

**Test in browser or PowerShell:**

```powershell
# Test WordPress Posts
curl https://wholelotofnature.com/wp-json/wp/v2/posts

# Test WooCommerce Products
curl "https://wholelotofnature.com/wp-json/wc/v3/products?consumer_key=ck_7c14b9262866f37bee55394c53c727cf4a6c987f&consumer_secret=cs_25c1e29325113145d0c13913007cc1a92d965bce"

# Test Categories
curl "https://wholelotofnature.com/wp-json/wc/v3/products/categories?consumer_key=ck_7c14b9262866f37bee55394c53c727cf4a6c987f&consumer_secret=cs_25c1e29325113145d0c13913007cc1a92d965bce"

# Test single product
curl "https://wholelotofnature.com/wp-json/wc/v3/products/123?consumer_key=YOUR_KEY&consumer_secret=YOUR_SECRET"
```

---

## 📝 URL Switching Workflow

### Development Mode (Local)
```
WordPress Admin Settings:
- WordPress Address: https://wholelotofnature.com
- Site Address: http://localhost:3000

.env.local:
- WORDPRESS_URL=https://wholelotofnature.com
- NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production Mode (Deployed)
```
WordPress Admin Settings:
- WordPress Address: https://admin.wholelotofnature.com
- Site Address: https://wholelotofnature.com

.env.production:
- WORDPRESS_URL=https://admin.wholelotofnature.com
- NEXT_PUBLIC_SITE_URL=https://wholelotofnature.com
```

---

## 🎯 Benefits of This Approach

✅ **No GraphQL complexity** - Just REST  
✅ **Native WordPress/WooCommerce** - Built-in support  
✅ **Better caching** - Standard HTTP caching works  
✅ **Easier debugging** - Test in browser directly  
✅ **More examples** - Tons of REST API documentation  
✅ **Simpler deployment** - No plugin dependencies  
✅ **Environment switching** - Easy URL changes  

---

## 📌 Next Steps

1. ✅ Configure WordPress URLs for development
2. ✅ Enable CORS in wp-config.php
3. ✅ Test REST API endpoints
4. ✅ Create new API service files
5. ✅ Update all components to use REST API
6. ✅ Remove GraphQL dependencies
7. ✅ Test locally with localhost
8. ✅ Deploy and switch to production URLs

---

**Created:** October 20, 2025  
**API Type:** REST (WordPress + WooCommerce)  
**Authentication:** Consumer Key/Secret  
**Environment:** Development & Production ready
