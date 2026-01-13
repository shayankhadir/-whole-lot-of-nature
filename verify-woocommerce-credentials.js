const axios = require('axios');

// WooCommerce API credentials (same as in your app)
const WORDPRESS_URL = 'https://admin.wholelotofnature.com';
const WC_CONSUMER_KEY = 'ck_7c14b9262866f37bee55394c53c727cf4a6c987f';
const WC_CONSUMER_SECRET = 'cs_25c1e29325113145d0c13913007cc1a92d965bce';

async function testWooCommerceCredentials() {
  console.log('🔍 Verifying WooCommerce API Credentials\n');
  console.log('📍 WordPress URL:', WORDPRESS_URL);
  console.log('🔑 Consumer Key:', WC_CONSUMER_KEY ? '***' + WC_CONSUMER_KEY.slice(-4) : 'NOT SET');
  console.log('🔐 Consumer Secret:', WC_CONSUMER_SECRET ? '***' + WC_CONSUMER_SECRET.slice(-4) : 'NOT SET');
  console.log('');

  // Test 1: Query String Authentication
  console.log('🧪 Test 1: Query String Authentication');
  try {
    const queryStringUrl = `${WORDPRESS_URL}/wp-json/wc/v3/products?consumer_key=${WC_CONSUMER_KEY}&consumer_secret=${WC_CONSUMER_SECRET}&per_page=1`;

    console.log('   URL:', queryStringUrl.replace(/consumer_secret=[^&]*/, 'consumer_secret=***'));

    const response = await axios.get(queryStringUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'WooCommerce Credential Test'
      }
    });

    console.log('   ✅ Status:', response.status);
    console.log('   📦 Products found:', Array.isArray(response.data) ? response.data.length : 'N/A');
    if (Array.isArray(response.data) && response.data.length > 0) {
      console.log('   🏷️  Sample product:', response.data[0].name);
    }
  } catch (error) {
    console.log('   ❌ Failed:', error.response?.status || error.code);
    console.log('   📝 Error:', error.response?.statusText || error.message);
    if (error.response?.data) {
      console.log('   📄 Response:', JSON.stringify(error.response.data, null, 2));
    }
  }

  console.log('');

  // Test 2: Basic Authentication
  console.log('🧪 Test 2: Basic Authentication (HTTP Basic Auth)');
  try {
    const basicAuth = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64');
    const basicAuthUrl = `${WORDPRESS_URL}/wp-json/wc/v3/products?per_page=1`;

    console.log('   URL:', basicAuthUrl);
    console.log('   Auth: Basic ***' + basicAuth.slice(-4));

    const response = await axios.get(basicAuthUrl, {
      timeout: 10000,
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'User-Agent': 'WooCommerce Credential Test'
      }
    });

    console.log('   ✅ Status:', response.status);
    console.log('   📦 Products found:', Array.isArray(response.data) ? response.data.length : 'N/A');
    if (Array.isArray(response.data) && response.data.length > 0) {
      console.log('   🏷️  Sample product:', response.data[0].name);
    }
  } catch (error) {
    console.log('   ❌ Failed:', error.response?.status || error.code);
    console.log('   📝 Error:', error.response?.statusText || error.message);
    if (error.response?.data) {
      console.log('   📄 Response:', JSON.stringify(error.response.data, null, 2));
    }
  }

  console.log('');

  // Test 3: WordPress REST API (non-WooCommerce)
  console.log('🧪 Test 3: WordPress REST API (basic connectivity)');
  try {
    const wpUrl = `${WORDPRESS_URL}/wp-json/wp/v2/posts?per_page=1`;

    const response = await axios.get(wpUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'WordPress Connectivity Test'
      }
    });

    console.log('   ✅ Status:', response.status);
    console.log('   📝 Posts found:', Array.isArray(response.data) ? response.data.length : 'N/A');
  } catch (error) {
    console.log('   ❌ Failed:', error.response?.status || error.code);
    console.log('   📝 Error:', error.response?.statusText || error.message);
  }

  console.log('');
  console.log('📋 Summary:');
  console.log('   - If Test 1 fails but Test 2 succeeds: Use Basic Auth in your WooCommerce service');
  console.log('   - If both Tests 1 & 2 fail: Check WooCommerce REST API settings in WordPress');
  console.log('   - If Test 3 fails: WordPress site connectivity issue');
  console.log('   - If all tests fail: Verify credentials and WordPress/WooCommerce setup');
}

testWooCommerceCredentials().catch(console.error);
