
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function listProducts() {
  const { WooCommerceService } = await import('../src/lib/services/woocommerceService');
  try {
    const products = await WooCommerceService.getProducts(20);
    console.log('Available Products:');
    products.forEach(p => {
      console.log(`- ${p.name} (Slug: ${p.slug}, ID: ${p.id})`);
    });
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

listProducts();
