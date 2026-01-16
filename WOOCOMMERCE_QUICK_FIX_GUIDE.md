# Quick Fix Guide - WooCommerce Products Display Issue

## 🔴 CRITICAL FIX #1: Remove Stock Status Filter from Featured Products

**File:** `src/lib/services/woocommerceService.ts`  
**Lines:** 707-720  
**Change Required:** Remove `stock_status: 'instock'` filter

### Before:
```typescript
static async getFeaturedProducts(limit: number = 8): Promise<WooCommerceProduct[]> {
  try {
    const response = await WooCommerce.get('products', {
      featured: true,
      per_page: limit,
      status: 'publish',
      stock_status: 'instock'  // ❌ THIS LINE
    });
```

### After:
```typescript
static async getFeaturedProducts(limit: number = 8): Promise<WooCommerceProduct[]> {
  try {
    const response = await WooCommerce.get('products', {
      featured: true,
      per_page: limit,
      status: 'publish'
    });
```

**Impact:** Featured products will now display even if temporarily out of stock

---

## 🟠 HIGH PRIORITY FIX #2: Add Error Display to AllProductsShowcase Component

**File:** `src/components/sections/AllProductsShowcase.tsx`  
**Lines:** 15-35

### Changes:
Add error state and display error message to user

```tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingCart, Heart, Eye } from 'lucide-react';
import { Product } from '@/types/product';
import { DEMO_PRODUCTS } from '@/data/demoCatalog';
import { getDisplayPrice, getOriginalPrice, isOnSale } from '@/lib/utils/pricing';
import { useCartStore } from '@/stores/cartStore';

const FALLBACK_PRODUCTS = DEMO_PRODUCTS;

export default function AllProductsShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  // ADD THIS
  const { addItem } = useCartStore();

  useEffect(() => {
    fetch('/api/products?limit=12')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length) {
          setProducts(data.data);
          setError(null);  // CLEAR ERROR
        } else {
          const errorMsg = data.error || data.message || 'No products available';
          console.warn('[Products] API returned error:', errorMsg);
          setError(errorMsg);  // SET ERROR
          setProducts(FALLBACK_PRODUCTS);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('[Products] Fetch failed:', err);
        setError('Failed to load products. Please refresh the page.');
        setProducts(FALLBACK_PRODUCTS);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-4 bg-[#0d3512]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-[#12501a]/40 rounded-2xl mb-4 backdrop-blur-md" />
                <div className="h-4 bg-[#12501a]/40 rounded mb-2 backdrop-blur-md" />
                <div className="h-3 bg-[#12501a]/40 rounded w-2/3 backdrop-blur-md" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ADD ERROR DISPLAY HERE
  if (error) {
    return (
      <section className="py-20 px-4 bg-[#0d3512]">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/30 border border-red-600 rounded-2xl p-6 text-center">
            <p className="text-red-200 font-semibold mb-2">⚠️ Unable to Load Products</p>
            <p className="text-red-300 text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    // ... rest of component
  );
}
```

---

## 🟠 HIGH PRIORITY FIX #3: Improve API Error Response

**File:** `src/app/api/products/route.ts`  
**Lines:** 60-80  

### Change the catch block:

```typescript
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const slug = searchParams.get('slug');
    const slugs = searchParams.get('slugs');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const perPage = searchParams.get('per_page') ? parseInt(searchParams.get('per_page')!) : undefined;
    const excludeId = searchParams.get('exclude') ? parseInt(searchParams.get('exclude')!) : undefined;
    const relatedTo = searchParams.get('related_to') ? parseInt(searchParams.get('related_to')!) : undefined;

    let products;
    const productLimit = perPage || limit;

    console.log('[Products API] Request:', {
      slug,
      category,
      search,
      hasWooCommerceConfig: !!(process.env.WC_CONSUMER_KEY && process.env.WC_CONSUMER_SECRET)
    });

    if (relatedTo) {
      products = await WooCommerceService.getRelatedProducts(relatedTo, productLimit || 4);
    } else if (slugs) {
      const slugList = slugs.split(',').map(s => s.trim());
      const responses = await Promise.all(
        slugList.map(s => WooCommerceService.getProductBySlug(s))
      );
      products = responses.filter(p => p !== null);
    } else if (slug) {
      const product = await WooCommerceService.getProductBySlug(slug);
      products = product ? [product] : [];
    } else if (search) {
      products = await WooCommerceService.searchProducts(search, productLimit);
    } else if (tag) {
      products = await WooCommerceService.getProductsByTag(tag, productLimit);
    } else if (category) {
      const isNumeric = /^\d+$/.test(category);
      if (isNumeric) {
        const categoryId = parseInt(category);
        products = await WooCommerceService.getProducts(productLimit || 100);
        products = products.filter(p => p.categories.some(c => c.id === categoryId));
      } else {
        products = await WooCommerceService.getProductsByCategory(category, productLimit);
      }
    } else {
      products = await WooCommerceService.getProducts(productLimit);
    }

    if (excludeId && products) {
      products = products.filter(p => p.id !== excludeId);
    }

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    });

  } catch (error) {
    // IMPROVED ERROR HANDLING:
    let statusCode = 500;
    let errorType = 'FETCH_FAILED';
    let errorMsg = 'Failed to fetch products';
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Detect specific error types
    if (errorMessage.includes('credentials') || errorMessage.includes('CRITICAL')) {
      statusCode = 401;
      errorType = 'AUTHENTICATION_ERROR';
      errorMsg = 'WooCommerce authentication failed. Check API credentials.';
    } else if (errorMessage.includes('404')) {
      statusCode = 404;
      errorType = 'NOT_FOUND';
      errorMsg = 'WooCommerce endpoint not found';
    } else if (errorMessage.includes('timeout')) {
      statusCode = 504;
      errorType = 'TIMEOUT';
      errorMsg = 'Request to WooCommerce timed out';
    }
    
    const hasKey = !!process.env.WC_CONSUMER_KEY;
    const hasSecret = !!process.env.WC_CONSUMER_SECRET;
    const wpUrl = process.env.WORDPRESS_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL;
    
    console.error('[Products API] Error:', {
      error: errorMessage,
      type: errorType,
      hasWooCommerceKey: hasKey,
      hasWooCommerceSecret: hasSecret,
      wordPressUrl: wpUrl,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorType,
        message: errorMsg,
        details: {
          hasWooCommerceKey: hasKey,
          hasWooCommerceSecret: hasSecret,
          wordPressUrl: wpUrl,
          nodeEnv: process.env.NODE_ENV
        }
      },
      { status: statusCode }
    );
  }
}
```

---

## 🟡 MEDIUM PRIORITY FIX #4: Add Logging to WooCommerceService

**File:** `src/lib/services/woocommerceService.ts`  
**Lines:** 340-360  

### Add detailed logging:

```typescript
static async getProducts(limit?: number): Promise<WooCommerceProduct[]> {
  try {
    if (!WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
      const errorMsg = '[CRITICAL] WooCommerce credentials missing!';
      console.error(errorMsg, {
        hasKey: !!WC_CONSUMER_KEY,
        hasSecret: !!WC_CONSUMER_SECRET,
        url: WORDPRESS_URL,
        env: process.env.NODE_ENV
      });
      throw new Error(errorMsg);
    }

    console.log('[WooCommerce] Fetching products...', {
      url: WORDPRESS_URL,
      hasKey: !!WC_CONSUMER_KEY,
      hasSecret: !!WC_CONSUMER_SECRET,
      per_page: limit || 100,
      timestamp: new Date().toISOString()
    });
    
    const response = await WooCommerce.get('products', {
      per_page: limit || 100,
      status: 'publish'
    });

    const raw: unknown = response.data;
    const list = Array.isArray(raw) ? (raw as WCRawProduct[]) : [];
    
    console.log(`[WooCommerce SUCCESS] Fetched ${list.length} products`, {
      ids: list.slice(0, 5).map(p => p.id),  // Show first 5 IDs
      timestamp: new Date().toISOString()
    });
    
    return list.map(this.transformWooCommerceProduct);
  } catch (error: unknown) {
    const e = error as { response?: { status?: number; data?: unknown }; message?: string };
    
    console.error('[WooCommerce ERROR]', {
      message: e.message,
      status: e.response?.status,
      credentialsSet: !!(WC_CONSUMER_KEY && WC_CONSUMER_SECRET),
      url: WORDPRESS_URL,
      timestamp: new Date().toISOString()
    });

    if (e.response?.status === 401) {
      console.error('[WooCommerce] 401 Unauthorized - Invalid OAuth credentials');
    }
    
    throw error;
  }
}
```

---

## 🟢 VERIFICATION STEPS

After applying fixes:

1. **Restart Next.js Dev Server**
   ```bash
   npm run dev
   ```

2. **Check Console Logs**
   ```
   Look for: [WooCommerce Service Init] ✓ SET
   Should NOT show: ⚠️  CRITICAL credentials are missing
   ```

3. **Test API Endpoint**
   ```
   Open: http://localhost:3000/api/products
   Should return: { "success": true, "data": [...], "count": N }
   ```

4. **Visit Shop Page**
   ```
   Open: http://localhost:3000/shop
   Should display: Real products from WooCommerce
   Should NOT display: Error message
   ```

5. **Check Browser Console (F12)**
   ```
   Look for: [WooCommerce SUCCESS] Fetched X products
   Should NOT show: Failed to fetch products
   ```

---

## 📋 Deployment Checklist

- [ ] Applied Fix #1 (stock_status removal)
- [ ] Applied Fix #2 (error display in AllProductsShowcase)
- [ ] Applied Fix #3 (improved API error handling)
- [ ] Applied Fix #4 (logging in WooCommerceService)
- [ ] Restarted dev server
- [ ] Checked console for errors
- [ ] Tested /api/products endpoint
- [ ] Tested /shop page displays real products
- [ ] Tested featured section on homepage
- [ ] No red errors in browser console
- [ ] Committed changes to git
- [ ] Ready for production deployment

---

## 🆘 Still Not Working?

If products still don't display after fixes:

1. **Check WooCommerce is actually working:**
   ```bash
   curl -X GET "https://admin.wholelotofnature.com/wp-json/wc/v3/products?per_page=1" \
     -u "ck_7c14b9262866f37bee55394c53c727cf4a6c987f:cs_25c1e29325113145d0c13913007cc1a92d965bce"
   ```
   Should return at least 1 product

2. **Verify credentials in .env:**
   ```bash
   grep "WC_CONSUMER" .env
   ```
   Should show non-empty values

3. **Check server logs:**
   ```bash
   npm run dev 2>&1 | grep -E "WooCommerce|ERROR|CRITICAL"
   ```

4. **Open browser DevTools (F12):**
   - Go to Console tab
   - Look for error messages
   - Go to Network tab
   - Filter for "products"
   - Check if request succeeded or failed

5. **Check WordPress WooCommerce:**
   - Admin → WooCommerce → Products
   - Verify at least 1 product exists
   - Product should be Published (not Draft/Pending)

---

**Last Updated:** January 16, 2026  
**Status:** Ready for Implementation
