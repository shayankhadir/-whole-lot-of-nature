# WooCommerce WordPress Integration Setup Guide

## 1. WordPress WooCommerce Setup

### Install and Configure WooCommerce
1. **Install WooCommerce Plugin**
   - Go to WordPress Admin → Plugins → Add New
   - Search for "WooCommerce"
   - Install and activate the plugin

2. **Generate API Keys**
   - Go to WooCommerce → Settings → Advanced → REST API
   - Click "Add Key"
   - Set Description: "Next.js Frontend"
   - User: Select admin user
   - Permissions: Read/Write
   - Click "Generate API Key"
   - Copy Consumer Key and Consumer Secret

### Configure Your Products
1. **Add Products**
   - Go to Products → Add New
   - Set product name, description, short description
   - Set regular price and sale price (in rupees)
   - Add product images
   - Set categories
   - Set stock status and quantity

2. **Create Categories**
   - Go to Products → Categories
   - Add categories like: Plants, Pots, Tools, Soil & Fertilizers, Decor

## 2. Next.js Configuration

### Environment Variables
Update your `.env.local` file:
```
WORDPRESS_URL=https://wholelotofnature.com
WC_CONSUMER_KEY=your_consumer_key_here
WC_CONSUMER_SECRET=your_consumer_secret_here
```

### Currency Configuration
The app is now configured to display prices in Indian Rupees (₹).

## 3. API Endpoints Available

- `GET /api/products` - Get all products
- `GET /api/products/[id]` - Get single product
- `GET /api/categories` - Get all categories

## 4. Product Data Structure

Your WordPress products should have:
- **name**: Product title
- **description**: Full product description (HTML)
- **short_description**: Brief description (HTML)
- **regular_price**: Original price in rupees
- **sale_price**: Discounted price (optional)
- **price**: Current selling price
- **images**: Array of product images
- **categories**: Product categories
- **stock_quantity**: Available stock
- **in_stock**: Stock status boolean
- **slug**: URL-friendly product name

## 5. Features Implemented

### Pricing
- ✅ Indian Rupee (₹) formatting
- ✅ Sale price support with strikethrough original price
- ✅ Discount percentage calculation
- ✅ "OUT OF STOCK" badges

### Quick View Modal
- ✅ Product images with thumbnail navigation
- ✅ Proper HTML description rendering
- ✅ Price display with sale information
- ✅ Categories display
- ✅ Stock status
- ✅ Add to cart button

### Shop Page
- ✅ Product filtering by category
- ✅ Price range filtering (based on actual product prices)
- ✅ Sorting by price and name
- ✅ Responsive product grid

## 6. Troubleshooting

### If prices don't show:
1. Check if products have `regular_price` set in WordPress
2. Ensure WooCommerce API keys have read permissions
3. Check browser console for API errors

### If images don't show:
1. Ensure product images are properly uploaded in WordPress
2. Check image URLs in API response
3. Verify image permissions on your WordPress server

### If categories don't load:
1. Create categories in WordPress: Products → Categories
2. Assign products to categories
3. Check API endpoint: `/api/categories`

## 7. Next Steps

To complete the integration:
1. Test all API endpoints with your WordPress data
2. Add more products and categories in WordPress
3. Configure payment gateway in WooCommerce
4. Set up shipping options
5. Add customer accounts and order management