#!/usr/bin/env node

/**
 * Script to manually categorize the remaining 2 snail products
 * Usage: npx ts-node scripts/categorize-snails.ts
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
  console.log('🐌 Categorizing Snail Products\n');
  console.log('='.repeat(60));
  console.log('\n');
  
  try {
    // First, check if "Pond Fish & Companions" category exists
    console.log('📁 Checking for "Pond Fish & Companions" category...');
    
    const categoriesResponse = await WooCommerce.get('products/categories', {
      slug: 'pond-fish'
    });
    
    let categoryId: number;
    
    if (categoriesResponse.data.length > 0) {
      categoryId = categoriesResponse.data[0].id;
      console.log(`✅ Found existing category (ID: ${categoryId})\n`);
    } else {
      // Create the category
      console.log('⚠️  Category not found. Creating new category...');
      
      const newCategoryResponse = await WooCommerce.post('products/categories', {
        name: 'Pond Fish & Companions',
        slug: 'pond-fish',
        description: 'Fish, snails, and other aquatic creatures for ponds and aquariums.'
      });
      
      categoryId = newCategoryResponse.data.id;
      console.log(`✅ Created new category (ID: ${categoryId})\n`);
    }
    
    // Update the snail products
    const snailProducts = [
      { id: 1916, name: 'Ramshorn Snails' },
      { id: 1917, name: 'Malaysian Trumpet Snail' }
    ];
    
    console.log('🔄 Updating snail products...\n');
    
    for (const product of snailProducts) {
      try {
        await WooCommerce.put(`products/${product.id}`, {
          categories: [{ id: categoryId }]
        });
        console.log(`✅ ${product.name} → Pond Fish & Companions`);
      } catch (error) {
        console.log(`❌ Failed to update ${product.name}`);
      }
      
      // Small delay
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('\n✅ All snail products categorized successfully!\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
