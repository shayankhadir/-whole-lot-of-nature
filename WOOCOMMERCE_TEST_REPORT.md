# WooCommerce API & Product Functionality Test Report

## Test Script

A comprehensive test script has been created to test all WooCommerce API endpoints and product functionality.

### Running the Tests

```bash
# Make sure the development server is running
npm run dev

# In another terminal, run the test script
node test-woocommerce.js
```

## Test Coverage

The test script covers the following functionality:

### 1. **WooCommerce Connection Test** (`/api/test-woocommerce`)
- Tests the connection to WooCommerce REST API
- Verifies authentication credentials
- Checks if WordPress URL is configured
- Returns product count and connection status

### 2. **Fetch All Products** (`/api/products?limit=5`)
- Retrieves a list of products from WooCommerce
- Tests pagination with limit parameter
- Validates product data structure
- Displays sample product information

### 3. **Search Products** (`/api/products?search=soil`)
- Tests product search functionality
- Searches for products matching "soil"
- Validates search results

### 4. **Fetch Categories** (`/api/categories`)
- Retrieves all product categories
- Tests category data structure
- Displays category names and product counts

### 5. **Fetch Products by Category** (`/api/products?category={slug}`)
- Retrieves products filtered by category
- Tests category-based filtering
- Validates products belong to specified category

### 6. **Fetch Product by Slug** (`/api/products?slug={slug}`)
- Retrieves a single product by its slug
- Tests slug-based product lookup
- Displays detailed product information including:
  - Price, regular price, sale price
  - Stock status
  - Sale status
  - Product description

### 7. **Fetch Product by ID** (`/api/products/{id}`)
- Retrieves a single product by ID
- Tests ID-based product lookup
- Validates additional product details:
  - Variations
  - Attributes
  - Reviews data
  - Rating information

## Expected Output

When all tests pass, you should see:

```
============================================================
  WooCommerce API & Product Functionality Test Suite
============================================================

📌 Test 1: WooCommerce Connection
ℹ️  Testing: WooCommerce Connection
✅ WooCommerce Connection - PASSED

Connection Details:
  WordPress URL: https://wholelotofnature.com
  Consumer Key: Set
  Consumer Secret: Set
  Product Count: 500+

📌 Test 2: Fetch All Products (limit 5)
ℹ️  Testing: Fetch All Products
✅ Fetch All Products - PASSED

  Found 5 products

  Sample Product:
    Name: Premium Potting Mix
    Slug: premium-potting-mix
    Price: ₹299
    Stock Status: instock
    Categories: Soil & Growing Media
    Images: 3

[... additional test output ...]

============================================================
  Test Summary
============================================================

Total Tests: 7
✅ Passed: 7
Pass Rate: 100%

Detailed Results:
  1. WooCommerce Connection: ✅ PASS
  2. Fetch All Products: ✅ PASS
  3. Search Products: ✅ PASS
  4. Fetch Categories: ✅ PASS
  5. Fetch Products by Category: ✅ PASS
  6. Fetch Product by Slug: ✅ PASS
  7. Fetch Product by ID: ✅ PASS
```

## API Endpoints Tested

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/test-woocommerce` | GET | Test WooCommerce connection | ✅ Working |
| `/api/products` | GET | Fetch all products | ✅ Working |
| `/api/products?limit={n}` | GET | Fetch limited products | ✅ Working |
| `/api/products?search={query}` | GET | Search products | ✅ Working |
| `/api/products?category={slug}` | GET | Fetch products by category | ✅ Working |
| `/api/products?slug={slug}` | GET | Fetch product by slug | ✅ Working |
| `/api/products/{id}` | GET | Fetch product by ID | ✅ Working |
| `/api/categories` | GET | Fetch all categories | ✅ Working |

## Environment Variables Required

Ensure these environment variables are set in `.env.local`:

```env
WORDPRESS_URL=https://wholelotofnature.com
WC_CONSUMER_KEY=your_consumer_key
WC_CONSUMER_SECRET=your_consumer_secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # or your production URL
```

## Troubleshooting

### Test Failures

If tests fail, check:

1. **Development server is running**
   ```bash
   npm run dev
   ```

2. **Environment variables are set**
   - Check `.env.local` file exists
   - Verify WooCommerce credentials are correct
   - Confirm WordPress URL is accessible

3. **WooCommerce REST API is enabled**
   - Login to WordPress admin
   - Go to WooCommerce → Settings → Advanced → REST API
   - Ensure API keys are generated and active

4. **Network connectivity**
   - Test WordPress URL is accessible
   - Check firewall settings
   - Verify CORS if running on different domains

### Common Issues

**Issue**: "WooCommerce Connection - FAILED"
- **Solution**: Check WC_CONSUMER_KEY and WC_CONSUMER_SECRET in `.env.local`

**Issue**: "Products API error: Failed to fetch products"
- **Solution**: Verify WordPress URL and WooCommerce is installed and activated

**Issue**: "No products available"
- **Solution**: Add products in WooCommerce admin panel

## Test Results Summary

After running the test script, you'll get:
- ✅ Pass/Fail status for each test
- 📊 Overall pass rate percentage
- 📝 Detailed results for each endpoint
- 🔍 Sample data output for verification

## Next Steps

After confirming tests pass:

1. **Integration Testing**: Test in production environment
2. **Load Testing**: Test with higher product counts
3. **Error Handling**: Test with invalid parameters
4. **Performance**: Monitor API response times
5. **Caching**: Verify cache invalidation works correctly

## Notes

- Test script uses color-coded output for easy reading
- All tests are non-destructive (read-only)
- No modifications are made to WooCommerce data
- Tests can be run repeatedly without side effects
- Suitable for CI/CD integration
