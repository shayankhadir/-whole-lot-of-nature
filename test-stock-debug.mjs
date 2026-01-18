#!/usr/bin/env node

/**
 * Debug Script - Check Stock Status from WooCommerce
 * This script directly queries WooCommerce API to see what stock_status is being returned
 */

import crypto from 'crypto';

const WORDPRESS_URL = 'https://admin.wholelotofnature.com';
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY || '';
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET || '';

console.log('🔍 Stock Status Debug Script\n');
console.log('Configuration:');
console.log(`  URL: ${WORDPRESS_URL}`);
console.log(`  Key Set: ${!!WC_CONSUMER_KEY}`);
console.log(`  Secret Set: ${!!WC_CONSUMER_SECRET}\n`);

if (!WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
  console.error('❌ Missing WooCommerce API credentials');
  console.error('   Set WC_CONSUMER_KEY and WC_CONSUMER_SECRET environment variables');
  process.exit(1);
}

// Generate OAuth1 signature for WooCommerce API
function generateOAuth1Header(method, url, consumerKey, consumerSecret) {
  const timestamp = Math.floor(Date.now() / 1000);
  const nonce = Math.random().toString(36).substring(2, 15);
  
  const oauthParams = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: nonce,
    oauth_signature_method: 'HMAC-SHA256',
    oauth_timestamp: timestamp,
    oauth_version: '1.0',
  };

  const allParams = { ...oauthParams };
  const paramString = Object.keys(allParams)
    .sort()
    .map(k => `${k}=${allParams[k]}`)
    .join('&');

  const baseString = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(paramString)}`;
  const signingKey = `${consumerSecret}&`;
  
  const signature = crypto
    .createHmac('sha256', signingKey)
    .update(baseString)
    .digest('base64');

  oauthParams.oauth_signature = signature;

  const authHeader = 'OAuth ' + Object.keys(oauthParams)
    .sort()
    .map(k => `${k}="${oauthParams[k]}"`)
    .join(', ');

  return authHeader;
}

async function fetchProducts() {
  try {
    const url = `${WORDPRESS_URL}/wp-json/wc/v3/products?per_page=5`;
    const authHeader = generateOAuth1Header('GET', url, WC_CONSUMER_KEY, WC_CONSUMER_SECRET);

    console.log('📡 Fetching products from WooCommerce API...\n');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ API Error (${response.status}):`);
      console.error(error);
      process.exit(1);
    }

    const products = await response.json();

    console.log(`✅ Fetched ${products.length} products\n`);
    console.log('Product Stock Status Summary:');
    console.log('='.repeat(80));

    products.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   SKU: ${product.sku}`);
      console.log(`   Stock Status: ${product.stock_status || 'NOT SET'}`);
      console.log(`   Stock Quantity: ${product.stock_quantity !== null ? product.stock_quantity : 'N/A'}`);
      console.log(`   Manage Stock: ${product.manage_stock}`);
      console.log(`   Status: ${product.status}`);
      
      // Show what in_stock would be
      const inStock = product.stock_status === 'instock' || 
                     product.stock_status === 'onbackorder' || 
                     !product.stock_status;
      console.log(`   → in_stock (as calculated): ${inStock ? '✅ TRUE' : '❌ FALSE'}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log('\n📊 Analysis:');
    console.log('   All products should have in_stock: true');
    console.log('   This means either stock_status is "instock", "onbackorder", or not set');
    console.log('   If all show FALSE, check WooCommerce settings');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fetchProducts();
