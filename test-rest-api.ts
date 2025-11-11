/**
 * Test REST API connections
 * Run with: node --loader ts-node/esm test-rest-api.ts
 * Or add to package.json scripts: "test:api": "ts-node test-rest-api.ts"
 */

// Import the API functions
import { testConnection as testWordPress, getPosts } from './src/lib/api/wordpress';
import { testConnection as testWooCommerce, getProducts, getCategories } from './src/lib/api/woocommerce';

async function runTests() {
  console.log('🧪 Testing REST API Connections...\n');
  console.log('=' .repeat(60));
  
  // Test WordPress REST API
  console.log('\n📝 Testing WordPress REST API...\n');
  const wpConnected = await testWordPress();
  
  if (wpConnected) {
    console.log('\n📄 Fetching latest posts...');
    const posts = await getPosts({ per_page: 5 });
    
    if (posts.length > 0) {
      console.log(`\n✅ Found ${posts.length} posts:`);
      posts.forEach((post, index) => {
        console.log(`${index + 1}. ${post.title.rendered}`);
        console.log(`   Slug: ${post.slug}`);
        console.log(`   Date: ${new Date(post.date).toLocaleDateString()}`);
      });
    } else {
      console.log('❌ No posts found. Please add some posts in WordPress admin.');
    }
  }
  
  console.log('\n' + '='.repeat(60));
  
  // Test WooCommerce REST API
  console.log('\n🛒 Testing WooCommerce REST API...\n');
  const wcConnected = await testWooCommerce();
  
  if (wcConnected) {
    console.log('\n📦 Fetching products...');
    const products = await getProducts({ per_page: 5 });
    
    if (products.length > 0) {
      console.log(`\n✅ Found ${products.length} products:`);
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   Price: $${product.price}`);
        console.log(`   Stock: ${product.stock_status}`);
        console.log(`   Featured: ${product.featured ? 'Yes' : 'No'}`);
      });
    } else {
      console.log('❌ No products found. Please add some products in WooCommerce.');
    }
    
    console.log('\n📂 Fetching categories...');
    const categories = await getCategories({ per_page: 10 });
    
    if (categories.length > 0) {
      console.log(`\n✅ Found ${categories.length} categories:`);
      categories.forEach((category, index) => {
        console.log(`${index + 1}. ${category.name} (${category.count} products)`);
      });
    } else {
      console.log('❌ No categories found.');
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n✨ Tests complete!\n');
  
  // Summary
  console.log('📊 Summary:');
  console.log(`WordPress REST API: ${wpConnected ? '✅ Working' : '❌ Failed'}`);
  console.log(`WooCommerce REST API: ${wcConnected ? '✅ Working' : '❌ Failed'}`);
  
  if (!wpConnected || !wcConnected) {
    console.log('\n⚠️  Check your environment variables in .env.local:');
    console.log('   - WORDPRESS_API_URL');
    console.log('   - WORDPRESS_URL');
    console.log('   - WC_CONSUMER_KEY');
    console.log('   - WC_CONSUMER_SECRET');
  }
}

// Run tests
runTests().catch(console.error);
