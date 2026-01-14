require('dotenv').config({ path: '.env.local' });
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;

// Check environment variables
console.log('=== Environment Variables Check ===');
console.log('WORDPRESS_URL:', process.env.WORDPRESS_URL || 'NOT SET');
console.log('WC_CONSUMER_KEY:', process.env.WC_CONSUMER_KEY ? '***' + process.env.WC_CONSUMER_KEY.slice(-4) : 'NOT SET');
console.log('WC_CONSUMER_SECRET:', process.env.WC_CONSUMER_SECRET ? '***' + process.env.WC_CONSUMER_SECRET.slice(-4) : 'NOT SET');

const WORDPRESS_URL = process.env.WORDPRESS_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://admin.wholelotofnature.com';
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY || '';
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET || '';

console.log('\n=== WooCommerce Configuration ===');
console.log('URL:', WORDPRESS_URL);
console.log('Has Key:', !!WC_CONSUMER_KEY);
console.log('Has Secret:', !!WC_CONSUMER_SECRET);

// Initialize WooCommerce API
const WooCommerce = new WooCommerceRestApi({
  url: WORDPRESS_URL,
  consumerKey: WC_CONSUMER_KEY,
  consumerSecret: WC_CONSUMER_SECRET,
  version: 'wc/v3',
  queryStringAuth: true
});

async function testConnection() {
  try {
    console.log('\n=== Testing WooCommerce Connection ===');
    const response = await WooCommerce.get('products', {
      per_page: 1,
      status: 'publish'
    });

    console.log('✅ Connection successful!');
    console.log('Products found:', response.data.length);
    if (response.data.length > 0) {
      console.log('Sample product:', {
        id: response.data[0].id,
        name: response.data[0].name,
        status: response.data[0].status
      });
    }
  } catch (error) {
    console.log('❌ Connection failed!');
    console.log('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', error.response.data);
    }
  }
}

testConnection();
