
import fs from 'fs';
import path from 'path';

// Simple env parser
function loadEnv(filePath: string) {
  if (fs.existsSync(filePath)) {
    console.log(`Loading ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf-8');
    content.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
        process.env[key] = value;
      }
    });
  }
}

const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');

loadEnv(envPath);
loadEnv(envLocalPath); // Override with local

async function testReviews() {
  try {
    console.log('Testing Reviews Fetch...');
    console.log('URL:', process.env.WORDPRESS_URL);
    console.log('Key exists:', !!process.env.WC_CONSUMER_KEY);
    
    // Re-create the client here for testing purposes to be sure env vars are used.
    const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;
    const client = new WooCommerceRestApi({
      url: process.env.WORDPRESS_URL || 'https://wholelotofnature.com',
      consumerKey: process.env.WC_CONSUMER_KEY || '',
      consumerSecret: process.env.WC_CONSUMER_SECRET || '',
      version: 'wc/v3',
      queryStringAuth: true
    });

    const response = await client.get('products/reviews', {
      page: '1',
      per_page: '10',
      status: 'approved',
      product: '1848'
    });
    console.log('Success:', response.data);
  } catch (error: any) {
    console.error('Error:', error.message);
    if (error.response) {
        console.error('Response Status:', error.response.status);
        console.error('Response Data:', error.response.data);
    }
  }
}

testReviews();
