#!/usr/bin/env node

/**
 * Script to fetch products from WooCommerce and intelligently categorize them
 * Usage: npx ts-node scripts/categorize-products.ts
 */

// @ts-ignore - CJS import in TS
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

// @ts-ignore
const WooCommerce = new WooCommerceRestApi.default({
  url: process.env.WORDPRESS_URL || 'https://wholelotofnature.com',
  consumerKey: process.env.WC_CONSUMER_KEY || '',
  consumerSecret: process.env.WC_CONSUMER_SECRET || '',
  version: 'wc/v3',
  queryStringAuth: true
});

interface WCProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  categories: Array<{ id: number; name: string; slug: string }>;
}

interface WCCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
}

// Category mapping rules based on keywords
const categoryRules: Record<string, { keywords: string[]; categorySlug: string; categoryName: string }> = {
  // Soil & Growing Media
  'soil-mixes': {
    keywords: ['potting mix', 'soil mix', 'garden soil', 'planting mix', 'seed starting mix'],
    categorySlug: 'soil-mixes',
    categoryName: 'Soil Mixes'
  },
  'amendments-and-additives': {
    keywords: ['cocopeat', 'coco peat', 'vermicompost', 'compost', 'perlite', 'vermiculite', 'peat moss', 'cinder', 'lava rock'],
    categorySlug: 'amendments-and-additives',
    categoryName: 'Amendments & Additives'
  },
  'fertilizers-and-organic-manures': {
    keywords: ['fertilizer', 'manure', 'organic feed', 'plant food', 'nutrients', 'npk'],
    categorySlug: 'fertilizers-and-organic-manures',
    categoryName: 'Fertilizers & Organic Manures'
  },
  
  // Land Plants
  'indoor-plants': {
    keywords: ['indoor plant', 'houseplant', 'pothos', 'monstera', 'snake plant', 'peace lily', 'spider plant', 'fern'],
    categorySlug: 'indoor-plants',
    categoryName: 'Indoor Plants'
  },
  'outdoor-garden-plants': {
    keywords: ['outdoor plant', 'garden plant', 'shrub', 'tree', 'flowering plant', 'ornamental'],
    categorySlug: 'outdoor-garden-plants',
    categoryName: 'Outdoor / Garden Plants'
  },
  'succulents-and-cacti': {
    keywords: ['succulent', 'cacti', 'cactus', 'echeveria', 'jade', 'aloe'],
    categorySlug: 'succulents-and-cacti',
    categoryName: 'Succulents & Cacti'
  },
  
  // Aquatic Life & Ecosystem
  'aquatic-plants': {
    keywords: ['aquatic plant', 'water plant', 'pond plant', 'lotus', 'water lily', 'submerged'],
    categorySlug: 'aquatic-plants',
    categoryName: 'Aquatic Plants'
  },
  'pond-fish': {
    keywords: ['fish', 'koi', 'goldfish', 'pond fish'],
    categorySlug: 'pond-fish',
    categoryName: 'Pond Fish'
  },
  
  // Wellness & Herbal
  'herbal-supplements': {
    keywords: ['supplement', 'herbal', 'tea', 'extract', 'tincture', 'powder'],
    categorySlug: 'herbal-supplements',
    categoryName: 'Herbal Supplements'
  },
  
  // Containers & Accessories
  'pots-and-planters': {
    keywords: ['pot', 'planter', 'container', 'ceramic pot', 'plastic pot', 'grow bag'],
    categorySlug: 'pots-and-planters',
    categoryName: 'Pots & Planters'
  },
  'gardening-tools': {
    keywords: ['tool', 'trowel', 'pruner', 'shears', 'watering can', 'sprayer', 'gloves'],
    categorySlug: 'gardening-tools',
    categoryName: 'Gardening Tools'
  },
  
  // Seeds
  'vegetable-seeds': {
    keywords: ['vegetable seed', 'tomato seed', 'pepper seed', 'cucumber seed', 'lettuce seed'],
    categorySlug: 'vegetable-seeds',
    categoryName: 'Vegetable Seeds'
  },
  'flower-seeds': {
    keywords: ['flower seed', 'sunflower seed', 'marigold seed', 'zinnia seed'],
    categorySlug: 'flower-seeds',
    categoryName: 'Flower Seeds'
  },
  'herb-seeds': {
    keywords: ['herb seed', 'basil seed', 'mint seed', 'coriander seed', 'parsley seed'],
    categorySlug: 'herb-seeds',
    categoryName: 'Herb Seeds'
  }
};

/**
 * Determine the best category for a product based on its name and description
 */
function categorizeProduct(product: WCProduct): { categorySlug: string; categoryName: string } | null {
  const searchText = `${product.name} ${product.description} ${product.short_description}`.toLowerCase();
  
  // Check each category rule
  for (const rule of Object.values(categoryRules)) {
    for (const keyword of rule.keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        return { categorySlug: rule.categorySlug, categoryName: rule.categoryName };
      }
    }
  }
  
  return null;
}

/**
 * Fetch all products from WooCommerce
 */
async function fetchAllProducts(): Promise<WCProduct[]> {
  console.log('📦 Fetching products from WooCommerce...\n');
  
  try {
    let page = 1;
    let allProducts: WCProduct[] = [];
    let hasMore = true;
    
    while (hasMore) {
      const response = await WooCommerce.get('products', {
        per_page: 100,
        page: page,
        status: 'publish'
      });
      
      const products = response.data as WCProduct[];
      allProducts = [...allProducts, ...products];
      
      console.log(`   Fetched page ${page}: ${products.length} products`);
      
      // Check if there are more pages
      const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1', 10);
      hasMore = page < totalPages;
      page++;
    }
    
    console.log(`\n✅ Total products fetched: ${allProducts.length}\n`);
    return allProducts;
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    throw error;
  }
}

/**
 * Fetch all categories from WooCommerce
 */
async function fetchAllCategories(): Promise<Map<string, WCCategory>> {
  console.log('📁 Fetching categories from WooCommerce...\n');
  
  try {
    const response = await WooCommerce.get('products/categories', {
      per_page: 100
    });
    
    const categories = response.data as WCCategory[];
    const categoryMap = new Map<string, WCCategory>();
    
    categories.forEach(cat => {
      categoryMap.set(cat.slug, cat);
    });
    
    console.log(`✅ Total categories fetched: ${categories.length}\n`);
    return categoryMap;
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    throw error;
  }
}

/**
 * Update product with new category
 */
async function updateProductCategory(productId: number, categoryId: number): Promise<boolean> {
  try {
    await WooCommerce.put(`products/${productId}`, {
      categories: [{ id: categoryId }]
    });
    return true;
  } catch (error) {
    console.error(`❌ Error updating product ${productId}:`, error);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting Product Categorization Script\n');
  console.log('='.repeat(60));
  console.log('\n');
  
  // Fetch all products
  const products = await fetchAllProducts();
  
  // Fetch all categories
  const categories = await fetchAllCategories();
  
  // Filter products without categories
  const uncategorizedProducts = products.filter(p => p.categories.length === 0);
  
  console.log('📊 Product Summary:');
  console.log(`   Total Products: ${products.length}`);
  console.log(`   Uncategorized Products: ${uncategorizedProducts.length}`);
  console.log(`   Already Categorized: ${products.length - uncategorizedProducts.length}\n`);
  
  if (uncategorizedProducts.length === 0) {
    console.log('✅ All products are already categorized!\n');
    return;
  }
  
  console.log('='.repeat(60));
  console.log('\n🔍 Analyzing and categorizing products...\n');
  
  // Categorize products
  const categorizedProducts: Array<{ product: WCProduct; category: { categorySlug: string; categoryName: string } }> = [];
  const unableToCategize: WCProduct[] = [];
  
  for (const product of uncategorizedProducts) {
    const suggestedCategory = categorizeProduct(product);
    
    if (suggestedCategory) {
      categorizedProducts.push({ product, category: suggestedCategory });
    } else {
      unableToCategize.push(product);
    }
  }
  
  // Display results
  console.log('📋 Categorization Results:\n');
  
  if (categorizedProducts.length > 0) {
    console.log(`✅ Successfully categorized ${categorizedProducts.length} products:\n`);
    
    categorizedProducts.forEach(({ product, category }, index) => {
      console.log(`${index + 1}. "${product.name}"`);
      console.log(`   → Category: ${category.categoryName} (${category.categorySlug})`);
      console.log(`   → Product ID: ${product.id}\n`);
    });
  }
  
  if (unableToCategize.length > 0) {
    console.log(`\n⚠️  Unable to categorize ${unableToCategize.length} products:\n`);
    
    unableToCategize.forEach((product, index) => {
      console.log(`${index + 1}. "${product.name}" (ID: ${product.id})`);
      console.log(`   Description: ${product.short_description.substring(0, 100)}...\n`);
    });
  }
  
  // Ask for confirmation
  console.log('='.repeat(60));
  console.log('\n💾 Ready to update products in WooCommerce?\n');
  console.log('This will add categories to the products listed above.');
  console.log('\nPress Ctrl+C to cancel, or wait 5 seconds to proceed...\n');
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Update products
  console.log('🔄 Updating products...\n');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const { product, category } of categorizedProducts) {
    const categoryData = categories.get(category.categorySlug);
    
    if (!categoryData) {
      console.log(`⚠️  Category "${category.categoryName}" not found in WooCommerce. Skipping product "${product.name}"`);
      failCount++;
      continue;
    }
    
    const success = await updateProductCategory(product.id, categoryData.id);
    
    if (success) {
      console.log(`✅ Updated: "${product.name}" → ${category.categoryName}`);
      successCount++;
    } else {
      console.log(`❌ Failed: "${product.name}"`);
      failCount++;
    }
    
    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Final Summary:');
  console.log(`   ✅ Successfully updated: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   ⚠️  Unable to categorize: ${unableToCategize.length}\n`);
  
  if (unableToCategize.length > 0) {
    console.log('💡 Tip: Products that could not be categorized need manual review.');
    console.log('   You can categorize them manually in WordPress admin.\n');
  }
  
  console.log('✅ Script completed!\n');
}

// Run the script
main().catch(error => {
  console.error('\n❌ Script failed:', error);
  process.exit(1);
});
