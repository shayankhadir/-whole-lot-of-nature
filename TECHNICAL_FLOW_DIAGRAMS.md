# WooCommerce Products Display - Technical Flow Diagrams

## Current System Flow (With Issues)

### ❌ Current Broken Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER VISITS /shop PAGE                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
        ┌────────────────────────────────────────┐
        │ AllProductsShowcase Component Mounts   │
        │ (sets loading=true)                    │
        └─────────────┬──────────────────────────┘
                      │
                      ▼
        ┌────────────────────────────────────────┐
        │ Fetch: /api/products?limit=12          │
        └─────────────┬──────────────────────────┘
                      │
                      ▼
        ┌────────────────────────────────────────┐
        │ API Route: src/app/api/products/       │
        │ (NextJS Server)                        │
        └─────────────┬──────────────────────────┘
                      │
                      ▼
        ┌────────────────────────────────────────┐
        │ WooCommerceService.getProducts()       │
        └─────────────┬──────────────────────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
         ▼                         ▼
    ✓ Credentials       HTTP GET to WooCommerce
      Present          /wp-json/wc/v3/products
         │                         │
         │                         ▼
         │              ┌─────────────────────────┐
         │              │ WooCommerce REST API    │
         │              │ (Hostinger Server)      │
         │              └──────────┬──────────────┘
         │                         │
         │         ┌───────────────┴────────────────┐
         │         │                                │
         │         ▼                                ▼
         │   ✓ OAuth Auth OK            ❌ OAuth Auth FAILS (401)
         │   ✓ API Working              ❌ API returns error
         │   ✓ Returns Products         
         │         │                                │
         │         ▼                                ▼
         │   ┌─────────────────┐         ┌──────────────────────┐
         │   │ JSON Response:  │         │ Error caught by API  │
         │   │ { data: [...] } │         │ returns 500          │
         │   └────────┬────────┘         └──────────┬───────────┘
         │            │                             │
         └────────────┼─────────────────────────────┘
                      │
                      ▼
        ┌────────────────────────────────────────┐
        │ Frontend receives response             │
        └─────────────┬──────────────────────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
         ▼                         ▼
    Success Response    Error Response
    { success: true }   { success: false,
      data: [...]         error: "..." }
         │                         │
         ▼                         ▼
    Show Real           ❌ Silently catches error
    Products            ❌ Falls back to DEMO
         │              ❌ NO ERROR MESSAGE
         │              ❌ User thinks it works
         │                         │
         └────────────┬────────────┘
                      │
                      ▼
        ┌────────────────────────────────────────┐
        │ Display Products on /shop              │
        │ Real: ✓                                │
        │ Demo: ❌ (but user doesn't know!)      │
        └────────────────────────────────────────┘
```

---

## 🔴 CRITICAL ISSUE: Featured Products Filter

### Featured Products Method

```
┌─────────────────────────────────────────────────┐
│ WooCommerceService.getFeaturedProducts()        │
└────────────┬────────────────────────────────────┘
             │
             ▼
  ┌──────────────────────────────────┐
  │ Query WooCommerce API:           │
  │                                  │
  │ GET /products with filters:      │
  │  - featured: true ✓              │
  │  - status: 'publish' ✓           │
  │  - stock_status: 'instock' ❌    │
  │                                  │
  └──────────────┬───────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
    ▼                         ▼
Featured Product       Featured Product
IN STOCK              OUT OF STOCK
🟢 RETURNS             ❌ FILTERED OUT
   ID: 1, 2, 3           ID: 4, 5, 6
   3 products            0 products

PROBLEM: Featured products that are temporarily
out of stock are hidden from your featured carousel!

Result: Empty featured section or demo products
```

### Current getFeaturedProducts Code:
```typescript
static async getFeaturedProducts(limit: number = 8) {
  const response = await WooCommerce.get('products', {
    featured: true,           // Show featured
    per_page: limit,          // Limit results
    status: 'publish',        // Only published
    stock_status: 'instock'   // ❌ ONLY IN-STOCK
  });
  // ...
}
```

### Fixed Code:
```typescript
static async getFeaturedProducts(limit: number = 8) {
  const response = await WooCommerce.get('products', {
    featured: true,           // Show featured
    per_page: limit,          // Limit results
    status: 'publish'         // Only published
    // ✓ Removed stock_status filter
  });
  // ...
}
```

---

## 🟠 HIGH PRIORITY ISSUE: Silent Error Fallback

### Current Component Behavior (Bad)

```
┌─────────────────────────────────────────────┐
│ Component: AllProductsShowcase              │
└────────────┬────────────────────────────────┘
             │
             ▼
  fetch('/api/products')
             │
    ┌────────┴─────────┐
    │                  │
    ▼                  ▼
Success              Error
    │                  │
    ▼                  ▼
Got data?         Catches error
    │                  │
    ├─ YES: Use it     │
    │                  ▼
    │           setProducts(DEMO)
    │           ❌ NO ERROR MSG
    │           ❌ User sees demo
    │           ❌ User doesn't know
    │           ❌ Debugging impossible
    │                  │
    └──────────┬───────┘
               │
               ▼
      Display Products
      ⚠️  Could be REAL or DEMO
         User can't tell difference!
```

### What the Code Currently Does:

```tsx
useEffect(() => {
  fetch('/api/products?limit=12')
    .then(res => res.json())
    .then(data => {
      if (data.success && data.data?.length) {
        setProducts(data.data);  // ✓ Works
      } else {
        setProducts(FALLBACK_PRODUCTS);  // ❌ Silently fails
      }
    })
    .catch(err => {
      console.error('Failed:', err);  // Logs to console
      setProducts(FALLBACK_PRODUCTS);  // ❌ Still no UI message
    });
}, []);

// User sees demo products with NO INDICATION OF ERROR
```

### Fixed Component Behavior (Good)

```
┌─────────────────────────────────────────────┐
│ Component: AllProductsShowcase              │
└────────────┬────────────────────────────────┘
             │
             ▼
  fetch('/api/products')
             │
    ┌────────┴─────────┐
    │                  │
    ▼                  ▼
Success              Error
    │                  │
    ▼                  ▼
setProducts(data)  setError(msg)
setError(null)     setProducts(DEMO)
    │                  │
    └──────────┬───────┘
               │
               ▼
      Render products
           OR
      Render error
      ✓ User knows what's wrong!
      ✓ Can debug issue
      ✓ Clear action (refresh/retry)
```

### Fixed Code:

```tsx
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  fetch('/api/products?limit=12')
    .then(res => res.json())
    .then(data => {
      if (data.success && data.data?.length) {
        setProducts(data.data);
        setError(null);  // ✓ Clear error
      } else {
        const msg = data.error || 'No products available';
        setError(msg);   // ✓ Show error
        setProducts(FALLBACK_PRODUCTS);
      }
    })
    .catch(err => {
      setError('Failed to load: ' + err.message);  // ✓ Show error
      setProducts(FALLBACK_PRODUCTS);
    });
}, []);

// Render:
{error && <ErrorBanner>{error}</ErrorBanner>}
{!error && <ProductsGrid>{products}</ProductsGrid>}
```

---

## Data Flow: How Products Get Fetched

### Step-by-Step Process

```
1. User Action
   └─ Click /shop link
                 │
2. Page Renders
   └─ useEffect runs
                 │
3. Fetch Triggered
   ├─ URL: /api/products?limit=12
   ├─ Method: GET
   └─ No body
                 │
4. Next.js API Route Processes
   ├─ File: src/app/api/products/route.ts
   ├─ Check: query params
   ├─ Call: WooCommerceService.getProducts()
   └─ Return: JSON response
                 │
5. WooCommerceService Executes
   ├─ Check: credentials exist
   ├─ Log: "Attempting to fetch..."
   ├─ HTTP: GET to /wp-json/wc/v3/products
   ├─ Params: { per_page: 12, status: 'publish' }
   └─ Response: WooCommerce API
                 │
6. WooCommerce Server (Hostinger)
   ├─ Auth: Check OAuth credentials
   ├─ Query: Get products matching filters
   ├─ Return: JSON array of products
   └─ Status: 200 OK or error
                 │
7. Response Back to Next.js API
   ├─ Parse: JSON data
   ├─ Transform: Map to app types
   ├─ Return: { success: true, data: [...] }
   └─ Status: 200
                 │
8. Frontend Receives Response
   ├─ Parse: JSON.parse()
   ├─ Check: success flag
   ├─ Render: Products or error
   └─ UI: Display products
                 │
9. User Sees
   ├─ Real Products: If API worked ✓
   ├─ Demo Products: If API failed ❌
   └─ Error Message: If error display added ✓
```

---

## Authentication Flow

### OAuth Query String Authentication (Current Method)

```
WooCommerceRestApi Client
         │
         ├─ URL: https://admin.wholelotofnature.com
         ├─ Key: ck_7c14b9262866f37bee55394c53c727cf4a6c987f
         ├─ Secret: cs_25c1e29325113145d0c13913007cc1a92d965bce
         └─ QueryStringAuth: true (adds credentials to URL)
                 │
                 ▼
    GET /wp-json/wc/v3/products?
        oauth_consumer_key=ck_7c14...
        &oauth_consumer_secret=cs_25c1...
        &oauth_timestamp=1234567890
        &oauth_nonce=abc123
        &oauth_signature=xyz789
                 │
                 ▼
    WooCommerce Verifies:
    ✓ Key exists
    ✓ Secret matches
    ✓ Signature is valid
    ✓ Request is not tampered
                 │
    ├─ Valid: Return products
    └─ Invalid: Return 401 Unauthorized
```

### If Auth Fails (401 Error):

```
Response: 401 Unauthorized
          ↓
Next.js API catches error
          ↓
Error logged to server console:
  "[WooCommerce AUTH ERROR] 401 - Invalid credentials"
          ↓
API returns 500 with error message
          ↓
Frontend receives error
          ↓
Currently: Silently shows demo
Should be: Shows error message to user
```

---

## Pagination Issue (If You Have 100+ Products)

### Current Implementation (No Pagination)

```
Request: GET /api/products?limit=50
         │
         ▼
getProducts(limit: 50)
         │
         ▼
WooCommerce API Query:
{
  per_page: 50,
  status: 'publish'
  // No page parameter!
}
         │
         ▼
Returns: First 50 products
         │
         ├─ Product #1 ✓
         ├─ Product #2 ✓
         ├─ ...
         ├─ Product #50 ✓
         │
         ├─ Product #51 ❌ NOT FETCHED
         ├─ Product #52 ❌ NOT FETCHED
         └─ Product #100 ❌ NOT FETCHED

Result: Products 51-100 are invisible!
```

### With Pagination Fix

```
Request: GET /api/products?limit=50&page=2
         │
         ▼
getProducts(limit: 50, page: 2)
         │
         ▼
WooCommerce API Query:
{
  per_page: 50,
  page: 2,  // ✓ Added!
  status: 'publish'
}
         │
         ▼
Returns: Products 51-100
         │
         ├─ Product #51 ✓
         ├─ Product #52 ✓
         ├─ ...
         └─ Product #100 ✓

Result: All products can be fetched!
```

---

## Environment Variable Fallback Chain

### Current Implementation

```
Code tries to use:
  process.env.WORDPRESS_URL
        ↓
   If not set, uses:
  process.env.NEXT_PUBLIC_WORDPRESS_URL
        ↓
   If not set, uses:
  Hardcoded: 'https://admin.wholelotofnature.com'

Current .env Status:
✓ WORDPRESS_URL is set
✓ NEXT_PUBLIC_WORDPRESS_URL is set
✓ Both have same value

Risk: If they differ, frontend/backend disagree on API endpoint!
```

---

## Summary: Issues vs Solutions

| Issue | Current Behavior | Impact | Fix |
|-------|-----------------|--------|-----|
| **Stock Status Filter** | Featured products hidden if out-of-stock | Featured carousel empty | Remove filter |
| **Silent Fallback** | API errors show demo with no message | User thinks it works | Show error UI |
| **Error Propagation** | Backend errors logged on server only | Impossible to debug | Send error details |
| **Pagination** | Only first 100 products | Missing products | Add page param |
| **Logging** | No frontend visibility | Can't troubleshoot | Add console logs |
| **Env Variables** | Redundant but correct | Could cause issues | Unify names |

---

## Checklist: How to Know It's Fixed

✅ **Featured Products Method**
- [ ] Removed `stock_status: 'instock'` filter
- [ ] Featured products display regardless of stock

✅ **Error Display**
- [ ] Added error state to components
- [ ] Error messages display when API fails
- [ ] User can see what went wrong

✅ **API Improvements**
- [ ] Improved error handling in routes
- [ ] Specific error types returned
- [ ] Better server-side logging

✅ **Testing**
- [ ] Restart dev server
- [ ] Check console for `[WooCommerce SUCCESS]`
- [ ] /shop displays real products
- [ ] Featured section shows featured products
- [ ] No red errors in browser console

✅ **Verification**
- [ ] Real products ≠ demo products
- [ ] Can identify products by ID/name
- [ ] Database reflects what's shown

---

**Diagrams Generated:** January 16, 2026  
**For Implementation Guide:** See WOOCOMMERCE_QUICK_FIX_GUIDE.md
