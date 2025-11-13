#!/usr/bin/env node

import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';

const woocommerce = new WooCommerceRestApi({
  url: process.env.WORDPRESS_URL || 'https://wholelotofnature.com',
  consumerKey: process.env.WC_CONSUMER_KEY || '',
  consumerSecret: process.env.WC_CONSUMER_SECRET || '',
  version: 'wc/v2',
  queryStringAuth: true
});

async function testProductFetch() {
  try {
    console.log('🔍 Testing Product Fetch from WordPress...\n');
    console.log('URL:', process.env.WORDPRESS_URL);
    
    // Test 1: Get first product
    console.log('\n📦 Fetching first product...');
    const response = await woocommerce.get('products', {
      per_page: 1,
      status: 'publish'
    });
    
    const product = response.data[0];
    if (product) {
      console.log('\n✅ Product Found:');
      console.log('  ID:', product.id);
      console.log('  Name:', product.name);
      console.log('  Slug:', product.slug);
      console.log('  Price:', product.price);
      console.log('  Regular Price:', product.regular_price);
      console.log('  Sale Price:', product.sale_price);
      console.log('  Currency:', product.price_currency || 'NOT SET');
      console.log('  Description length:', product.description ? product.description.length : 0);
      const shortDesc = product.short_description ? product.short_description.substring(0, 100) : 'NONE';
      console.log('  Short Description:', shortDesc);
      const catNames = product.categories.map((c) => c.name).join(', ');
      console.log('  Categories:', catNames);
      console.log('  Images:', product.images.length);
      console.log('  Stock Status:', product.stock_status);
      console.log('  Stock Quantity:', product.stock_quantity);
      console.log('  Attributes:', product.attributes ? product.attributes.length : 0);
      console.log('  Has Reviews:', !!product.reviews_allowed);
    } else {
      console.log('❌ No products found');
    }
    
    // Test 2: Count total products
    console.log('\n📊 Checking total product count...');
    const countResponse = await woocommerce.get('products', {
      per_page: 1,
      status: 'publish'
    });
    console.log('  Total products available:', countResponse.headers['x-wp-total'] || 'Unknown');
    
    // Test 3: Get store settings
    console.log('\n⚙️ Fetching store settings...');
    try {
      const settingsResponse = await woocommerce.get('settings');
      const currencySetting = settingsResponse.data.find((s) => s.id === 'woocommerce_currency');
      if (currencySetting) {
        console.log('  Store Currency:', currencySetting.value);
      }
    } catch (e) {
      console.log('  ⚠️ Could not fetch settings (may require admin permissions)');
    }
    
  } catch (error) {
    console.error('❌ Error:', (error).message);
    if ((error).response) {
      console.error('Status:', (error).response.status);
      console.error('Data:', (error).response.data);
    }
  }
}

testProductFetch();
