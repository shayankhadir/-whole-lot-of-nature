import { WooCommerceService } from './src/lib/services/woocommerceService';

interface Product {
  id: number;
  name: string;
  stock_status?: string;
  stock_quantity?: number;
  in_stock?: boolean;
}

async function debugProducts(): Promise<void> {
  console.log('🔍 Product Debug - Stock Status Check\n');
  
  try {
    console.log('Fetching products...');
    const products = await WooCommerceService.getProducts(5);
    
    console.log(`✅ Fetched ${products.length} products\n`);
    console.log('Product Stock Status:');
    console.log('='.repeat(80));
    
    products.forEach((product: Product) => {
      console.log(`\n📦 ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Stock Status (raw): ${product.stock_status || 'undefined'}`);
      console.log(`   Stock Quantity: ${product.stock_quantity}`);
      console.log(`   in_stock (mapped): ${product.in_stock ? '✅ TRUE' : '❌ FALSE'}`);
    });
    
    console.log('\n' + '='.repeat(80));
    console.log('\nIssue Analysis:');
    
    const outOfStockProducts = products.filter((p: Product) => !p.in_stock);
    if (outOfStockProducts.length > 0) {
      console.log(`\n⚠️  ${outOfStockProducts.length} products are OUT OF STOCK:`);
      outOfStockProducts.forEach((p: Product) => {
        console.log(`   - ${p.name} (stock_status: ${p.stock_status})`);
      });
      console.log('\nPossible causes:');
      console.log('  1. WooCommerce stock_status is set to "outofstock"');
      console.log('  2. Inventory management is enabled but stock is 0');
      console.log('  3. Product is marked as not for sale');
    } else {
      console.log('\n✅ All products are IN STOCK!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
    }
  }
}

debugProducts();
