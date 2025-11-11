const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;

// Load environment variables
require('dotenv').config({ path: '.env.local' });

console.log('Testing WooCommerce API Connection...');
console.log('WordPress URL:', process.env.WORDPRESS_URL);
console.log('Consumer Key:', process.env.WC_CONSUMER_KEY ? 'Set' : 'Missing');
console.log('Consumer Secret:', process.env.WC_CONSUMER_SECRET ? 'Set' : 'Missing');

const WooCommerce = new WooCommerceRestApi({
  url: process.env.WORDPRESS_URL,
  consumerKey: process.env.WC_CONSUMER_KEY,
  consumerSecret: process.env.WC_CONSUMER_SECRET,
  version: 'wc/v3',
  queryStringAuth: true
});

async function testConnection() {
  try {
    console.log('\n--- Testing WooCommerce Connection ---');
    
    // Test API connection
    const response = await WooCommerce.get('products', {
      per_page: 3,
      status: 'publish'
    });
    
    console.log('✅ Connection successful!');
    console.log(`Found ${response.data.length} products`);
    
    if (response.data.length > 0) {
      console.log('\nFirst product:');
      console.log('- Name:', response.data[0].name);
      console.log('- Price:', response.data[0].price);
      console.log('- Status:', response.data[0].status);
      console.log('- ID:', response.data[0].id);
    }
    
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testConnection();