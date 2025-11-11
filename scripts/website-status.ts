#!/usr/bin/env node

/**
 * Website Status Report - Complete overview of your e-commerce site
 * Usage: npx ts-node scripts/website-status.ts
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

async function main() {
  console.log('\n');
  console.log('═'.repeat(80));
  console.log('  🌿 WHOLE LOT OF NATURE - WEBSITE STATUS REPORT');
  console.log('═'.repeat(80));
  console.log('\n');
  
  try {
    // Fetch products
    console.log('📊 Fetching data from WooCommerce...\n');
    
    const [productsRes, categoriesRes] = await Promise.all([
      WooCommerce.get('products', { per_page: 100, status: 'publish' }),
      WooCommerce.get('products/categories', { per_page: 100 })
    ]);
    
    const products = productsRes.data;
    const categories = categoriesRes.data;
    
    // Analysis
    const totalProducts = products.length;
    const categorizedProducts = products.filter((p: any) => p.categories.length > 0).length;
    const uncategorizedProducts = totalProducts - categorizedProducts;
    const inStockProducts = products.filter((p: any) => p.stock_status === 'instock').length;
    const outOfStockProducts = totalProducts - inStockProducts;
    const productsWithImages = products.filter((p: any) => p.images.length > 0).length;
    const productsWithoutPrice = products.filter((p: any) => !p.price || p.price === '').length;
    
    // Category breakdown
    const categoryCount = new Map();
    products.forEach((product: any) => {
      product.categories.forEach((cat: any) => {
        categoryCount.set(cat.name, (categoryCount.get(cat.name) || 0) + 1);
      });
    });
    
    // Date analysis
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentProducts = products.filter((p: any) => new Date(p.date_created) > lastWeek).length;
    
    // Display Report
    console.log('═'.repeat(80));
    console.log('  📦 PRODUCT INVENTORY');
    console.log('═'.repeat(80));
    console.log('');
    console.log(`  Total Products:              ${totalProducts}`);
    console.log(`  ✅ In Stock:                  ${inStockProducts} (${Math.round(inStockProducts/totalProducts*100)}%)`);
    console.log(`  ❌ Out of Stock:              ${outOfStockProducts} (${Math.round(outOfStockProducts/totalProducts*100)}%)`);
    console.log('');
    console.log('═'.repeat(80));
    console.log('  📁 CATEGORIZATION STATUS');
    console.log('═'.repeat(80));
    console.log('');
    console.log(`  Total Categories:            ${categories.length}`);
    console.log(`  ✅ Categorized Products:      ${categorizedProducts} (${Math.round(categorizedProducts/totalProducts*100)}%)`);
    console.log(`  ⚠️  Uncategorized Products:   ${uncategorizedProducts} (${Math.round(uncategorizedProducts/totalProducts*100)}%)`);
    console.log('');
    
    if (uncategorizedProducts === 0) {
      console.log('  🎉 EXCELLENT! All products are properly categorized!');
    }
    
    console.log('');
    console.log('═'.repeat(80));
    console.log('  📊 TOP CATEGORIES');
    console.log('═'.repeat(80));
    console.log('');
    
    const sortedCategories = Array.from(categoryCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    sortedCategories.forEach(([name, count], index) => {
      const bar = '█'.repeat(Math.ceil(count / 2));
      console.log(`  ${(index + 1).toString().padStart(2)}. ${name.padEnd(35)} ${count.toString().padStart(3)} ${bar}`);
    });
    
    console.log('');
    console.log('═'.repeat(80));
    console.log('  🖼️  CONTENT QUALITY');
    console.log('═'.repeat(80));
    console.log('');
    console.log(`  Products with Images:        ${productsWithImages} (${Math.round(productsWithImages/totalProducts*100)}%)`);
    console.log(`  Products without Images:     ${totalProducts - productsWithImages} (${Math.round((totalProducts - productsWithImages)/totalProducts*100)}%)`);
    console.log(`  Products with Pricing:       ${totalProducts - productsWithoutPrice} (${Math.round((totalProducts - productsWithoutPrice)/totalProducts*100)}%)`);
    console.log(`  Products without Pricing:    ${productsWithoutPrice} (${Math.round(productsWithoutPrice/totalProducts*100)}%)`);
    console.log('');
    
    console.log('═'.repeat(80));
    console.log('  📅 RECENT ACTIVITY');
    console.log('═'.repeat(80));
    console.log('');
    console.log(`  Products added in last 7 days:   ${recentProducts}`);
    console.log('');
    
    // Health Score
    let healthScore = 100;
    if (uncategorizedProducts > 0) healthScore -= 20;
    if (outOfStockProducts > totalProducts * 0.3) healthScore -= 15;
    if (productsWithoutPrice > 0) healthScore -= 15;
    if (productsWithImages < totalProducts * 0.9) healthScore -= 10;
    
    console.log('═'.repeat(80));
    console.log('  🏆 WEBSITE HEALTH SCORE');
    console.log('═'.repeat(80));
    console.log('');
    
    const healthBar = '█'.repeat(Math.ceil(healthScore / 2.5));
    const healthStatus = healthScore >= 90 ? '🟢 EXCELLENT' : 
                        healthScore >= 70 ? '🟡 GOOD' : 
                        healthScore >= 50 ? '🟠 FAIR' : '🔴 NEEDS ATTENTION';
    
    console.log(`  Score: ${healthScore}/100  ${healthBar}  ${healthStatus}`);
    console.log('');
    
    console.log('═'.repeat(80));
    console.log('  ⚡ RECOMMENDATIONS');
    console.log('═'.repeat(80));
    console.log('');
    
    const recommendations = [];
    
    if (uncategorizedProducts > 0) {
      recommendations.push(`  ⚠️  Categorize ${uncategorizedProducts} remaining products`);
    } else {
      recommendations.push('  ✅ Product categorization is complete');
    }
    
    if (productsWithoutPrice > 0) {
      recommendations.push(`  ⚠️  Add prices to ${productsWithoutPrice} products`);
    } else {
      recommendations.push('  ✅ All products have pricing');
    }
    
    if (productsWithImages < totalProducts) {
      recommendations.push(`  ⚠️  Add images to ${totalProducts - productsWithImages} products`);
    } else {
      recommendations.push('  ✅ All products have images');
    }
    
    if (outOfStockProducts > 0) {
      recommendations.push(`  ℹ️  Update stock for ${outOfStockProducts} out-of-stock products`);
    }
    
    recommendations.forEach(rec => console.log(rec));
    console.log('');
    
    console.log('═'.repeat(80));
    console.log('  🔗 QUICK LINKS');
    console.log('═'.repeat(80));
    console.log('');
    console.log('  WordPress Admin:     https://wholelotofnature.com/wp-admin');
    console.log('  Products:            https://wholelotofnature.com/wp-admin/edit.php?post_type=product');
    console.log('  Categories:          https://wholelotofnature.com/wp-admin/edit-tags.php?taxonomy=product_cat');
    console.log('  Frontend (Local):    http://localhost:3000');
    console.log('');
    console.log('═'.repeat(80));
    console.log('');
    
  } catch (error) {
    console.error('❌ Error fetching data:', error);
    process.exit(1);
  }
}

main();
