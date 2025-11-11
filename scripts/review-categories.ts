#!/usr/bin/env node

/**
 * Script to review current product categorizations
 * Usage: npx ts-node scripts/review-categories.ts
 */

// @ts-ignore - CJS import in TS
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

// @ts-ignore
const WooCommerce = new WooCommerceRestApi.default({
  url: process.env.WORDPRESS_URL || 'https://wholelotofnature.com',
  consumerKey: process.env.WC_CONSUMER_KEY || '',
  consumerSecret: process.env.WC_CONSUMER_SECRET || '',
  version: 'wc/v3',
  queryStringAuth: true
});

interface WCProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  stock_status: string;
  categories: Array<{ id: number; name: string; slug: string }>;
  date_created: string;
}

/**
 * Fetch all products from WooCommerce
 */
async function fetchAllProducts(): Promise<WCProduct[]> {
  console.log('📦 Fetching products from WooCommerce...\n');
  
  try {
    let page = 1;
    let allProducts: WCProduct[] = [];
    let hasMore = true;
    
    while (hasMore) {
      const response = await WooCommerce.get('products', {
        per_page: 100,
        page: page,
        status: 'publish',
        orderby: 'date',
        order: 'desc'
      });
      
      const products = response.data as WCProduct[];
      allProducts = [...allProducts, ...products];
      
      console.log(`   Fetched page ${page}: ${products.length} products`);
      
      // Check if there are more pages
      const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1', 10);
      hasMore = page < totalPages;
      page++;
    }
    
    console.log(`\n✅ Total products fetched: ${allProducts.length}\n`);
    return allProducts;
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🔍 Product Category Review\n');
  console.log('='.repeat(80));
  console.log('\n');
  
  // Fetch all products
  const products = await fetchAllProducts();
  
  // Sort by date created (newest first)
  products.sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime());
  
  console.log('📋 PRODUCT LIST (Sorted by newest first):\n');
  console.log('='.repeat(80));
  console.log('\n');
  
  // Group by category
  const categoryGroups: Map<string, WCProduct[]> = new Map();
  const uncategorized: WCProduct[] = [];
  
  products.forEach(product => {
    if (product.categories.length === 0) {
      uncategorized.push(product);
    } else {
      product.categories.forEach(cat => {
        if (!categoryGroups.has(cat.name)) {
          categoryGroups.set(cat.name, []);
        }
        categoryGroups.get(cat.name)!.push(product);
      });
    }
  });
  
  // Display by category
  console.log('📊 PRODUCTS BY CATEGORY:\n');
  
  Array.from(categoryGroups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([categoryName, categoryProducts]) => {
      console.log(`\n📁 ${categoryName} (${categoryProducts.length} products)`);
      console.log('-'.repeat(80));
      
      categoryProducts.forEach((product, index) => {
        const date = new Date(product.date_created).toLocaleDateString();
        const price = product.sale_price || product.regular_price || product.price;
        const stock = product.stock_status === 'instock' ? '✅' : '❌';
        
        console.log(`\n${index + 1}. ${product.name}`);
        console.log(`   ID: ${product.id} | Price: ₹${price} | Stock: ${stock} | Added: ${date}`);
        
        if (product.short_description) {
          const desc = product.short_description.replace(/<[^>]*>/g, '').substring(0, 100);
          console.log(`   ${desc}${desc.length === 100 ? '...' : ''}`);
        }
      });
    });
  
  if (uncategorized.length > 0) {
    console.log(`\n\n⚠️  UNCATEGORIZED PRODUCTS (${uncategorized.length}):`);
    console.log('-'.repeat(80));
    
    uncategorized.forEach((product, index) => {
      const date = new Date(product.date_created).toLocaleDateString();
      const price = product.sale_price || product.regular_price || product.price;
      
      console.log(`\n${index + 1}. ${product.name}`);
      console.log(`   ID: ${product.id} | Price: ₹${price} | Added: ${date}`);
      
      if (product.short_description) {
        const desc = product.short_description.replace(/<[^>]*>/g, '').substring(0, 150);
        console.log(`   ${desc}${desc.length === 150 ? '...' : ''}`);
      }
    });
  }
  
  // Summary
  console.log('\n\n' + '='.repeat(80));
  console.log('\n📊 SUMMARY:\n');
  console.log(`   Total Products: ${products.length}`);
  console.log(`   Total Categories: ${categoryGroups.size}`);
  console.log(`   Uncategorized Products: ${uncategorized.length}`);
  
  // Find newest products (last 10)
  console.log('\n\n🆕 NEWEST PRODUCTS (Last 10 added):\n');
  console.log('='.repeat(80));
  
  products.slice(0, 10).forEach((product, index) => {
    const date = new Date(product.date_created).toLocaleDateString();
    const categories = product.categories.map(c => c.name).join(', ') || 'No category';
    const price = product.sale_price || product.regular_price || product.price;
    
    console.log(`\n${index + 1}. ${product.name}`);
    console.log(`   ID: ${product.id} | Categories: ${categories}`);
    console.log(`   Price: ₹${price} | Added: ${date}`);
  });
  
  console.log('\n\n✅ Review complete!\n');
}

// Run the script
main().catch(error => {
  console.error('\n❌ Script failed:', error);
  process.exit(1);
});
