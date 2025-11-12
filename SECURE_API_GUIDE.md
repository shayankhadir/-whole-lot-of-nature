# Whole Lot of Nature - Secure API Integration Guide
## React Components → Next.js API Routes → WooCommerce

**Security:** WooCommerce API keys remain server-side only ✅

---

## Architecture Overview

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  React          │      │  Next.js API     │      │  WooCommerce    │
│  Components     │─────▶│  Routes          │─────▶│  REST API       │
│  (Client-Side)  │      │  (Server-Side)   │      │  (External)     │
└─────────────────┘      └──────────────────┘      └─────────────────┘
     Fetch from              Uses secret keys           Returns data
     /api/products           safely hidden
```

**✅ Secure:** Keys never exposed to browser  
**✅ Fast:** Server-side caching possible  
**✅ Flexible:** Can add custom logic/transformations

---

## Your Existing API Endpoints

### 1. Products API
**File:** `src/app/api/products/route.ts`

**Endpoint:** `GET /api/products`

**Query Parameters:**
- `?category={id}` - Filter by category
- `?search={query}` - Search products
- `?limit={number}` - Limit results

**Usage in React:**
```typescript
// Fetch all products
const response = await fetch('/api/products');
const data = await response.json();
const products = data.data; // Array of products

// Fetch by category
const response = await fetch('/api/products?category=15');

// Search products
const response = await fetch('/api/products?search=succulent');

// Limit results
const response = await fetch('/api/products?limit=12');
```

### 2. Single Product API
**File:** `src/app/api/products/[id]/route.ts`

**Endpoint:** `GET /api/products/{id-or-slug}`

**Usage:**
```typescript
// By ID
const response = await fetch('/api/products/123');

// By slug
const response = await fetch('/api/products/aloe-vera-plant');

const data = await response.json();
const product = data.data;
```

### 3. Categories API
**File:** `src/app/api/categories/route.ts`

**Endpoint:** `GET /api/categories`

**Usage:**
```typescript
const response = await fetch('/api/categories');
const data = await response.json();
const categories = data.data;
```

---

## React Component Examples

### ProductCard Component

```typescript
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  sale_price?: string;
  regular_price: string;
  images: Array<{ src: string; alt: string }>;
  categories: Array<{ name: string }>;
  in_stock: boolean;
}

export function ProductCard({ product }: { product: Product }) {
  const displayPrice = product.sale_price || product.price;
  const hasDiscount = !!product.sale_price;

  return (
    <div className="group relative">
      {/* Card Container - Glass Morphism */}
      <div className="bg-[#2C2C2C] rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_24px_rgba(46,125,50,0.2)]">
        
        {/* Image Container */}
        <Link href={`/shop/${product.slug}`}>
          <div className="relative aspect-square bg-[#F8F9FA] p-4">
            {product.images[0] && (
              <Image
                src={product.images[0].src}
                alt={product.images[0].alt || product.name}
                fill
                className="object-contain transition-transform duration-400 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                loading="lazy"
              />
            )}
            
            {/* Wishlist Icon */}
            <button 
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-[#2E7D32] hover:text-white transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart className="w-5 h-5" />
            </button>

            {/* Badge */}
            {hasDiscount && (
              <div className="absolute top-4 left-4 bg-[#C4B17C] text-[#1A1A1A] px-3 py-1 rounded text-sm font-semibold">
                Sale
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          {product.categories[0] && (
            <p className="text-xs uppercase text-white/50 mb-2 tracking-wider">
              {product.categories[0].name}
            </p>
          )}

          {/* Product Name */}
          <Link href={`/shop/${product.slug}`}>
            <h3 className="text-white text-lg font-semibold mb-2 line-clamp-2 hover:text-[#66BB6A] transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[#2E7D32] text-2xl font-bold">
              ₹{displayPrice}
            </span>
            {hasDiscount && (
              <span className="text-white/50 line-through text-sm">
                ₹{product.regular_price}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            disabled={!product.in_stock}
            className={`
              w-full py-3 rounded-full font-medium transition-all duration-200
              ${product.in_stock 
                ? 'bg-[#2E7D32] text-white hover:scale-105 hover:shadow-[0_4px_16px_rgba(46,125,50,0.4)]' 
                : 'bg-white/10 text-white/50 cursor-not-allowed'
              }
            `}
          >
            {product.in_stock ? (
              <span className="flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </span>
            ) : (
              'Out of Stock'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
```

### ProductGrid Component

```typescript
'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from './ProductGridSkeleton';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  sale_price?: string;
  regular_price: string;
  images: Array<{ src: string; alt: string }>;
  categories: Array<{ name: string }>;
  in_stock: boolean;
}

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <ProductGridSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-400 mb-4">Error loading products</p>
          <p className="text-white/70 text-sm mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="bg-[#2E7D32] text-white px-6 py-2 rounded-full hover:scale-105 transition-transform"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/70">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### ProductGridSkeleton (Loading State)

```typescript
export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-[#2C2C2C] rounded-lg overflow-hidden animate-pulse">
          {/* Image skeleton */}
          <div className="aspect-square bg-white/10" />
          
          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            <div className="h-3 bg-white/10 rounded w-1/3" />
            <div className="h-5 bg-white/10 rounded" />
            <div className="h-5 bg-white/10 rounded w-2/3" />
            <div className="h-8 bg-white/10 rounded w-1/2" />
            <div className="h-12 bg-white/10 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Filtered ProductGrid with Categories

```typescript
'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';

export function FilteredProductGrid() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  async function fetchCategories() {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }

  async function fetchProducts() {
    try {
      setLoading(true);
      const url = selectedCategory 
        ? `/api/products?category=${selectedCategory}`
        : '/api/products';
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Category Filter */}
      <div className="mb-8 flex gap-3 flex-wrap">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-6 py-2 rounded-full transition-all ${
            selectedCategory === null
              ? 'bg-[#2E7D32] text-white'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          All Products
        </button>
        {categories.map((cat: any) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-6 py-2 rounded-full transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#2E7D32] text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {loading ? (
        <ProductGridSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Custom Hook for Products

Create reusable hooks for cleaner code:

```typescript
// src/hooks/useProducts.ts
import { useState, useEffect } from 'react';

interface UseProductsOptions {
  category?: string;
  search?: string;
  limit?: number;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [options.category, options.search, options.limit]);

  async function fetchProducts() {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.category) params.set('category', options.category);
      if (options.search) params.set('search', options.search);
      if (options.limit) params.set('limit', options.limit.toString());

      const url = `/api/products${params.toString() ? `?${params}` : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, refetch: fetchProducts };
}

// Usage
function MyComponent() {
  const { data: products, loading, error } = useProducts({ category: '15' });
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <ProductGrid products={products} />;
}
```

---

## Environment Variables (Secure Setup)

**Your `.env.local` is correct** - keys stay server-side:

```bash
# Server-side only (Next.js API routes can access these)
WC_CONSUMER_KEY=ck_7c14b9262866f37bee55394c53c727cf4a6c987f
WC_CONSUMER_SECRET=cs_25c1e29325113145d0c13913007cc1a92d965bce
WORDPRESS_API_URL=https://wholelotofnature.com/wp-json

# Client-side safe (prefixed with NEXT_PUBLIC_)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=/api  # Your own API, not WooCommerce directly
```

**Rule:** Never prefix sensitive keys with `NEXT_PUBLIC_` - they'll be exposed to browsers!

---

## Error Handling Best Practices

```typescript
async function fetchWithRetry(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
}
```

---

## SEO & Performance

### Image Optimization
```typescript
<Image
  src={product.images[0].src}
  alt={product.name}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
  loading="lazy"
  quality={85}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQ..." // Optional blur placeholder
/>
```

### JSON-LD for Product Pages
```typescript
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "{product.name}",
  "image": "{product.images[0].src}",
  "description": "{product.description}",
  "sku": "{product.id}",
  "brand": {
    "@type": "Brand",
    "name": "Whole Lot of Nature"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INR",
    "price": "{product.price}",
    "availability": "https://schema.org/InStock"
  }
}
</script>
```

---

## Testing Your API

### Test in Browser Console (Frontend)
```javascript
// Test products API
fetch('/api/products')
  .then(r => r.json())
  .then(console.log);

// Test single product
fetch('/api/products/aloe-vera-plant')
  .then(r => r.json())
  .then(console.log);

// Test categories
fetch('/api/categories')
  .then(r => r.json())
  .then(console.log);
```

### Test in Terminal (Backend)
```bash
# Test your Next.js API locally
curl http://localhost:3000/api/products

# Test WooCommerce directly (server-side only!)
curl "https://wholelotofnature.com/wp-json/wc/v3/products?consumer_key=YOUR_KEY&consumer_secret=YOUR_SECRET"
```

---

## Security Checklist

- ✅ API keys in `.env.local` (not `.env`)
- ✅ No `NEXT_PUBLIC_` prefix on sensitive keys
- ✅ All WooCommerce calls in `/api` routes (server-side)
- ✅ React components call `/api/products` (not WooCommerce directly)
- ✅ `.env.local` in `.gitignore`
- ✅ Different keys for production (set in Vercel dashboard)

---

## Summary

**Your current architecture is already correct and secure!** 

Just build React components that call:
- `/api/products` - Your secure Next.js API
- `/api/categories` - Your secure categories endpoint
- `/api/products/{slug}` - Single product endpoint

The WooCommerce keys stay hidden server-side where they belong. 🔒✅
