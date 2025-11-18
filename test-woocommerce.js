#!/usr/bin/env node

/**
 * WooCommerce API and Product Functionality Test Script
 * 
 * Tests all WooCommerce API endpoints and product functionality
 */

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

async function testEndpoint(name, url) {
  try {
    logInfo(`Testing: ${name}`);
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok && data.success) {
      logSuccess(`${name} - PASSED`);
      return { success: true, data };
    } else {
      logError(`${name} - FAILED (Status: ${response.status})`);
      console.log('Response:', JSON.stringify(data, null, 2));
      return { success: false, data };
    }
  } catch (error) {
    logError(`${name} - ERROR: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  log('\n' + '='.repeat(60), 'blue');
  log('  WooCommerce API & Product Functionality Test Suite', 'blue');
  log('='.repeat(60) + '\n', 'blue');

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  let passedTests = 0;
  let failedTests = 0;
  const testResults = [];

  // Test 1: WooCommerce Connection Test
  log('\n📌 Test 1: WooCommerce Connection', 'yellow');
  const connectionTest = await testEndpoint(
    'WooCommerce Connection',
    `${baseUrl}/api/test-woocommerce`
  );
  testResults.push({ name: 'WooCommerce Connection', ...connectionTest });
  connectionTest.success ? passedTests++ : failedTests++;
  
  if (connectionTest.success && connectionTest.data?.data) {
    console.log('\nConnection Details:');
    console.log(`  WordPress URL: ${connectionTest.data.environment?.wordpress_url || 'Not set'}`);
    console.log(`  Consumer Key: ${connectionTest.data.environment?.has_consumer_key ? 'Set' : 'Not set'}`);
    console.log(`  Consumer Secret: ${connectionTest.data.environment?.has_consumer_secret ? 'Set' : 'Not set'}`);
    if (connectionTest.data.data?.product_count !== undefined) {
      console.log(`  Product Count: ${connectionTest.data.data.product_count}`);
    }
  }

  // Test 2: Fetch All Products
  log('\n📌 Test 2: Fetch All Products (limit 5)', 'yellow');
  const productsTest = await testEndpoint(
    'Fetch All Products',
    `${baseUrl}/api/products?limit=5`
  );
  testResults.push({ name: 'Fetch All Products', ...productsTest });
  productsTest.success ? passedTests++ : failedTests++;
  
  if (productsTest.success && productsTest.data?.data) {
    console.log(`\n  Found ${productsTest.data.count} products`);
    if (productsTest.data.data.length > 0) {
      const firstProduct = productsTest.data.data[0];
      console.log(`\n  Sample Product:`);
      console.log(`    Name: ${firstProduct.name}`);
      console.log(`    Slug: ${firstProduct.slug}`);
      console.log(`    Price: ₹${firstProduct.price}`);
      console.log(`    Stock Status: ${firstProduct.stock_status || 'N/A'}`);
      console.log(`    Categories: ${firstProduct.categories?.map(c => c.name).join(', ') || 'None'}`);
      console.log(`    Images: ${firstProduct.images?.length || 0}`);
    }
  }

  // Test 3: Search Products
  log('\n📌 Test 3: Search Products (query: "soil")', 'yellow');
  const searchTest = await testEndpoint(
    'Search Products',
    `${baseUrl}/api/products?search=soil&limit=3`
  );
  testResults.push({ name: 'Search Products', ...searchTest });
  searchTest.success ? passedTests++ : failedTests++;
  
  if (searchTest.success && searchTest.data?.data) {
    console.log(`\n  Found ${searchTest.data.count} products matching "soil"`);
    searchTest.data.data.forEach((product, index) => {
      console.log(`    ${index + 1}. ${product.name} (₹${product.price})`);
    });
  }

  // Test 4: Fetch Categories
  log('\n📌 Test 4: Fetch Categories', 'yellow');
  const categoriesTest = await testEndpoint(
    'Fetch Categories',
    `${baseUrl}/api/categories`
  );
  testResults.push({ name: 'Fetch Categories', ...categoriesTest });
  categoriesTest.success ? passedTests++ : failedTests++;
  
  if (categoriesTest.success && categoriesTest.data?.data) {
    console.log(`\n  Found ${categoriesTest.data.data.length} categories`);
    categoriesTest.data.data.slice(0, 5).forEach((category, index) => {
      console.log(`    ${index + 1}. ${category.name} (${category.count} products)`);
    });
  }

  // Test 5: Fetch Products by Category
  if (categoriesTest.success && categoriesTest.data?.data?.length > 0) {
    const firstCategory = categoriesTest.data.data[0];
    log(`\n📌 Test 5: Fetch Products by Category (${firstCategory.name})`, 'yellow');
    const categoryProductsTest = await testEndpoint(
      'Fetch Products by Category',
      `${baseUrl}/api/products?category=${firstCategory.slug}&limit=3`
    );
    testResults.push({ name: 'Fetch Products by Category', ...categoryProductsTest });
    categoryProductsTest.success ? passedTests++ : failedTests++;
    
    if (categoryProductsTest.success && categoryProductsTest.data?.data) {
      console.log(`\n  Found ${categoryProductsTest.data.count} products in category "${firstCategory.name}"`);
      categoryProductsTest.data.data.forEach((product, index) => {
        console.log(`    ${index + 1}. ${product.name}`);
      });
    }
  } else {
    logWarning('Test 5: Skipped (no categories available)');
    failedTests++;
  }

  // Test 6: Fetch Product by Slug
  if (productsTest.success && productsTest.data?.data?.length > 0) {
    const firstProduct = productsTest.data.data[0];
    log(`\n📌 Test 6: Fetch Product by Slug (${firstProduct.slug})`, 'yellow');
    const productBySlugTest = await testEndpoint(
      'Fetch Product by Slug',
      `${baseUrl}/api/products?slug=${firstProduct.slug}`
    );
    testResults.push({ name: 'Fetch Product by Slug', ...productBySlugTest });
    productBySlugTest.success ? passedTests++ : failedTests++;
    
    if (productBySlugTest.success && productBySlugTest.data?.data?.length > 0) {
      const product = productBySlugTest.data.data[0];
      console.log(`\n  Product Details:`);
      console.log(`    ID: ${product.id}`);
      console.log(`    Name: ${product.name}`);
      console.log(`    Slug: ${product.slug}`);
      console.log(`    Price: ₹${product.price}`);
      console.log(`    Regular Price: ₹${product.regular_price || 'N/A'}`);
      console.log(`    Sale Price: ₹${product.sale_price || 'N/A'}`);
      console.log(`    On Sale: ${product.on_sale ? 'Yes' : 'No'}`);
      console.log(`    Stock Status: ${product.stock_status}`);
      console.log(`    Description: ${(product.description || '').substring(0, 100)}...`);
    }
  } else {
    logWarning('Test 6: Skipped (no products available)');
    failedTests++;
  }

  // Test 7: Fetch Product by ID
  if (productsTest.success && productsTest.data?.data?.length > 0) {
    const firstProduct = productsTest.data.data[0];
    log(`\n📌 Test 7: Fetch Product by ID (${firstProduct.id})`, 'yellow');
    const productByIdTest = await testEndpoint(
      'Fetch Product by ID',
      `${baseUrl}/api/products/${firstProduct.id}`
    );
    testResults.push({ name: 'Fetch Product by ID', ...productByIdTest });
    productByIdTest.success ? passedTests++ : failedTests++;
    
    if (productByIdTest.success && productByIdTest.data?.data) {
      const product = productByIdTest.data.data;
      console.log(`\n  Product Found: ${product.name}`);
      console.log(`    Available Variations: ${product.variations?.length || 0}`);
      console.log(`    Attributes: ${product.attributes?.length || 0}`);
      console.log(`    Reviews Allowed: ${product.reviews_allowed ? 'Yes' : 'No'}`);
      console.log(`    Average Rating: ${product.average_rating || 'N/A'}`);
      console.log(`    Rating Count: ${product.rating_count || 0}`);
    }
  } else {
    logWarning('Test 7: Skipped (no products available)');
    failedTests++;
  }

  // Summary
  log('\n' + '='.repeat(60), 'blue');
  log('  Test Summary', 'blue');
  log('='.repeat(60), 'blue');
  
  const totalTests = passedTests + failedTests;
  console.log(`\nTotal Tests: ${totalTests}`);
  logSuccess(`Passed: ${passedTests}`);
  if (failedTests > 0) {
    logError(`Failed: ${failedTests}`);
  }
  
  const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
  console.log(`Pass Rate: ${passRate}%\n`);

  // Detailed results
  log('Detailed Results:', 'yellow');
  testResults.forEach((result, index) => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    console.log(`  ${index + 1}. ${result.name}: ${status}`);
  });

  console.log('\n');
  
  // Exit with appropriate code
  process.exit(failedTests > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  logError(`\nTest suite failed with error: ${error.message}`);
  console.error(error);
  process.exit(1);
});
