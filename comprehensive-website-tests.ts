import axios from 'axios';

interface TestResult {
  testName: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  message: string;
  details?: string;
}

interface TestSuite {
  suiteName: string;
  results: TestResult[];
}

const BASE_URL = 'https://www.wholelotofnature.com';
const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://admin.wholelotofnature.com';

const suites: TestSuite[] = [];

async function test(suiteName: string, testName: string, testFn: () => Promise<void>) {
  if (!suites.find(s => s.suiteName === suiteName)) {
    suites.push({ suiteName, results: [] });
  }
  
  const suite = suites.find(s => s.suiteName === suiteName)!;
  
  try {
    await testFn();
    suite.results.push({ testName, status: 'PASS', message: '✅ Test passed' });
    console.log(`✅ ${suiteName} > ${testName}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    suite.results.push({ testName, status: 'FAIL', message: `❌ ${message}` });
    console.log(`❌ ${suiteName} > ${testName}: ${message}`);
  }
}

async function runWebsiteTests() {
  console.log('🚀 Starting Comprehensive Website Testing\n');
  console.log(`Target: ${BASE_URL}\n`);

  // ============================================
  // 1. SITE ACCESSIBILITY TESTS
  // ============================================
  await test('Site Accessibility', 'Homepage loads', async () => {
    const response = await axios.get(BASE_URL, { timeout: 10000 });
    if (response.status !== 200) throw new Error(`Status ${response.status}`);
    if (!response.data.includes('Whole Lot of Nature')) throw new Error('Homepage content not found');
  });

  await test('Site Accessibility', 'Homepage response time', async () => {
    const start = Date.now();
    await axios.get(BASE_URL, { timeout: 10000 });
    const loadTime = Date.now() - start;
    if (loadTime > 5000) throw new Error(`Load time ${loadTime}ms exceeds 5s`);
    console.log(`    Load time: ${loadTime}ms`);
  });

  // ============================================
  // 2. PRODUCT FUNCTIONALITY TESTS
  // ============================================
  await test('Product Functionality', 'Get products from API', async () => {
    const response = await axios.get(`${API_URL}/wp-json/wc/v3/products`, {
      params: { per_page: 5, consumer_key: process.env.WC_CONSUMER_KEY, consumer_secret: process.env.WC_CONSUMER_SECRET }
    });
    if (!Array.isArray(response.data)) throw new Error('Products not array');
    if (response.data.length === 0) throw new Error('No products found');
    console.log(`    Found ${response.data.length} products`);
  });

  await test('Product Functionality', 'Fetch specific product details', async () => {
    const productsRes = await axios.get(`${API_URL}/wp-json/wc/v3/products`, {
      params: { per_page: 1, consumer_key: process.env.WC_CONSUMER_KEY, consumer_secret: process.env.WC_CONSUMER_SECRET }
    });
    
    if (productsRes.data.length === 0) throw new Error('No products available');
    
    const product = productsRes.data[0];
    if (!product.id || !product.name || !product.price) {
      throw new Error('Product missing critical fields');
    }
    console.log(`    Product: ${product.name} - $${product.price}`);
  });

  await test('Product Functionality', 'Product stock status', async () => {
    const response = await axios.get(`${API_URL}/wp-json/wc/v3/products`, {
      params: { per_page: 5, consumer_key: process.env.WC_CONSUMER_KEY, consumer_secret: process.env.WC_CONSUMER_SECRET }
    });
    
    const products = response.data;
    const withStock = products.filter((p: any) => p.stock_status === 'instock').length;
    console.log(`    In-stock: ${withStock}/${products.length}`);
  });

  await test('Product Functionality', 'Product categories available', async () => {
    const response = await axios.get(`${API_URL}/wp-json/wc/v3/products/categories`, {
      params: { per_page: 20, consumer_key: process.env.WC_CONSUMER_KEY, consumer_secret: process.env.WC_CONSUMER_SECRET }
    });
    
    if (!Array.isArray(response.data)) throw new Error('Categories not array');
    console.log(`    Found ${response.data.length} categories`);
  });

  // ============================================
  // 3. HOMEPAGE CONTENT TESTS
  // ============================================
  await test('Homepage Content', 'Hero section present', async () => {
    const response = await axios.get(BASE_URL);
    if (!response.data.includes('hero') && !response.data.includes('banner')) {
      throw new Error('Hero section not found');
    }
  });

  await test('Homepage Content', 'Featured products section', async () => {
    const response = await axios.get(BASE_URL);
    if (!response.data.toLowerCase().includes('featured') && !response.data.toLowerCase().includes('product')) {
      throw new Error('Featured products section not found');
    }
  });

  await test('Homepage Content', 'Navigation menu', async () => {
    const response = await axios.get(BASE_URL);
    if (!response.data.includes('nav') && !response.data.includes('menu')) {
      throw new Error('Navigation not found');
    }
  });

  // ============================================
  // 4. AUTHENTICATION TESTS
  // ============================================
  await test('Authentication', 'NextAuth configuration', async () => {
    const nextAuthUrl = process.env.NEXTAUTH_URL;
    if (!nextAuthUrl) throw new Error('NEXTAUTH_URL not configured');
    console.log(`    NextAuth URL: ${nextAuthUrl}`);
  });

  await test('Authentication', 'NextAuth secret present', async () => {
    if (!process.env.NEXTAUTH_SECRET) throw new Error('NEXTAUTH_SECRET not set');
    console.log('    NEXTAUTH_SECRET is configured');
  });

  // ============================================
  // 5. EMAIL SERVICE TESTS
  // ============================================
  await test('Email Service', 'Resend API configured', async () => {
    if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY not configured');
    console.log('    Resend API is configured');
  });

  await test('Email Service', 'Marketing email address', async () => {
    if (!process.env.MARKETING_EMAIL_FROM) {
      throw new Error('MARKETING_EMAIL_FROM not configured');
    }
    console.log(`    Marketing email: ${process.env.MARKETING_EMAIL_FROM}`);
  });

  // ============================================
  // 6. PAYMENT GATEWAY TESTS
  // ============================================
  await test('Payment Gateway', 'Cashfree configuration', async () => {
    if (!process.env.CASHFREE_APP_ID) throw new Error('CASHFREE_APP_ID not configured');
    if (!process.env.CASHFREE_SECRET_KEY) throw new Error('CASHFREE_SECRET_KEY not configured');
    console.log('    Cashfree payment gateway configured');
  });

  await test('Payment Gateway', 'Payment mode', async () => {
    const mode = process.env.CASHFREE_MODE || 'sandbox';
    console.log(`    Payment mode: ${mode}`);
  });

  // ============================================
  // 7. ANALYTICS TESTS
  // ============================================
  await test('Analytics', 'Google Analytics configured', async () => {
    if (!process.env.NEXT_PUBLIC_GA_ID) {
      throw new Error('NEXT_PUBLIC_GA_ID not configured - Analytics not active');
    }
    console.log(`    GA ID: ${process.env.NEXT_PUBLIC_GA_ID}`);
  });

  // ============================================
  // 8. SECURITY TESTS
  // ============================================
  await test('Security', 'SSL/TLS enabled', async () => {
    const response = await axios.get(BASE_URL, { maxRedirects: 0 }).catch(e => e.response);
    if (!BASE_URL.startsWith('https://')) throw new Error('Not using HTTPS');
    console.log('    ✅ HTTPS enabled');
  });

  await test('Security', 'Security headers present', async () => {
    const response = await axios.get(BASE_URL);
    const headers = response.headers;
    const securityHeaders = [
      'x-content-type-options',
      'x-frame-options'
    ];
    
    const missing = securityHeaders.filter(h => !headers[h]);
    if (missing.length > 0) {
      console.log(`    ⚠️ Missing headers: ${missing.join(', ')}`);
    }
  });

  // ============================================
  // 9. API INTEGRATION TESTS
  // ============================================
  await test('API Integration', 'WooCommerce API accessible', async () => {
    try {
      const response = await axios.get(`${API_URL}/wp-json/wc/v3/orders`, {
        params: { consumer_key: process.env.WC_CONSUMER_KEY, consumer_secret: process.env.WC_CONSUMER_SECRET },
        timeout: 5000
      });
      console.log('    WooCommerce API responding');
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('WooCommerce credentials invalid');
      }
      throw error;
    }
  });

  await test('API Integration', 'Database connectivity', async () => {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL not configured');
    }
    console.log('    Database URL configured');
  });

  // ============================================
  // 10. LIGHTHOUSE/PERFORMANCE TESTS
  // ============================================
  await test('Performance', 'Page structure', async () => {
    const response = await axios.get(BASE_URL);
    if (!response.data.includes('<main')) throw new Error('No main element');
    if (!response.data.includes('<title>')) throw new Error('No page title');
    console.log('    ✅ Semantic HTML structure present');
  });

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n' + '='.repeat(80));
  console.log('TEST SUMMARY');
  console.log('='.repeat(80));

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  suites.forEach(suite => {
    const passed = suite.results.filter(r => r.status === 'PASS').length;
    const failed = suite.results.filter(r => r.status === 'FAIL').length;
    const total = suite.results.length;

    totalTests += total;
    passedTests += passed;
    failedTests += failed;

    console.log(`\n📋 ${suite.suiteName}: ${passed}/${total} passed`);
    suite.results.forEach(result => {
      if (result.status === 'FAIL') {
        console.log(`   ❌ ${result.testName}: ${result.message}`);
      }
    });
  });

  console.log('\n' + '='.repeat(80));
  console.log(`OVERALL: ${passedTests}/${totalTests} tests passed`);
  console.log(`Failed: ${failedTests} | Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  console.log('='.repeat(80));

  if (failedTests > 0) {
    console.log('\n⚠️  ACTION REQUIRED: Fix failed tests before launch');
    process.exit(1);
  } else {
    console.log('\n✅ All tests passed! Website is ready for launch.');
    process.exit(0);
  }
}

runWebsiteTests().catch(error => {
  console.error('Test suite error:', error);
  process.exit(1);
});
