
const { WooCommerceService } = require('../src/lib/services/woocommerceService');

async function listProducts() {
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
