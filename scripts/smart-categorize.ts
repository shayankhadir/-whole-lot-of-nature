#!/usr/bin/env node

/**
 * Script to categorize uncategorized products intelligently
 * Usage: npx ts-node scripts/smart-categorize.ts
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

interface CategoryMatch {
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
}

/**
 * Smart category detection based on product details
 */
function detectCategory(product: WCProduct, categories: Map<string, WCCategory>): CategoryMatch | null {
  const searchText = `${product.name} ${product.description} ${product.short_description}`.toLowerCase();
  
  // High confidence matches (specific keywords)
  const rules: Array<{ 
    keywords: string[]; 
    categorySlug: string; 
    categoryName: string;
    confidence: 'high' | 'medium' | 'low';
  }> = [
    // Aquatic Plants - HIGH CONFIDENCE
    { 
      keywords: ['guppy grass', 'mexican sword', 'mexican pennyworth', 'bhrami', 'bacopa', 'brahmi', 'marshweed', 'ambulia', 'sagittaria', 'duckweed', 'water lettuce', 'salvia', 'aquatic', 'aquarium plant'],
      categorySlug: 'aquatic-plants',
      categoryName: 'Aquatic Plants',
      confidence: 'high'
    },
    
    // Succulents & Cacti - HIGH CONFIDENCE
    { 
      keywords: ['jade plant', 'haworthia', 'euphorbia', 'mini cactus', 'succulent', 'cacti', 'cactus', 'aloe vera'],
      categorySlug: 'succulents-and-cacti',
      categoryName: 'Succulents & Cacti',
      confidence: 'high'
    },
    
    // Soil Mixes - HIGH CONFIDENCE
    { 
      keywords: ['potting mix', 'soil mix', 'succulent mix', 'indoor plants mix'],
      categorySlug: 'soil-mixes',
      categoryName: 'Soil Mixes',
      confidence: 'high'
    },
    
    // Amendments & Additives - HIGH CONFIDENCE
    { 
      keywords: ['cocopeat', 'coco peat', 'cinder', 'lava rock', 'leaf compost', 'compost'],
      categorySlug: 'amendments-and-additives',
      categoryName: 'Amendments & Additives',
      confidence: 'high'
    },
    
    // Pond Fish & Companions - HIGH CONFIDENCE
    { 
      keywords: ['snail', 'ramshorn', 'trumpet snail', 'malaysian snail', 'aquatic snail'],
      categorySlug: 'pond-fish',
      categoryName: 'Pond Fish & Companions',
      confidence: 'high'
    },
    
    // Herbal Supplements - HIGH CONFIDENCE
    { 
      keywords: ['ashwagandha', 'triphala', 'moringa', 'tablets', 'powder tablets', 'supplement', 'ayurvedic'],
      categorySlug: 'herbal-supplements',
      categoryName: 'Herbal Supplements',
      confidence: 'high'
    },
    
    // Natural Body Care - HIGH CONFIDENCE
    { 
      keywords: ['facepack', 'face pack', 'hair oil', 'ayurvedic oil', 'herbal mix', 'skin care'],
      categorySlug: 'natural-body-care',
      categoryName: 'Natural Body Care',
      confidence: 'high'
    },
    
    // Miniature Plant Decor - MEDIUM CONFIDENCE
    { 
      keywords: ['mini', 'miniature', 'desk', 'decorative', 'decor'],
      categorySlug: 'miniature-plant-decor',
      categoryName: 'Miniature Plant Decor',
      confidence: 'medium'
    }
  ];
  
  // Check rules in order
  for (const rule of rules) {
    for (const keyword of rule.keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        const category = categories.get(rule.categorySlug);
        if (category) {
          return {
            categoryId: category.id,
            categoryName: rule.categoryName,
            categorySlug: rule.categorySlug,
            confidence: rule.confidence,
            reason: `Matched keyword: "${keyword}"`
          };
        }
      }
    }
  }
  
  return null;
}

/**
 * Fetch all categories
 */
async function fetchCategories(): Promise<Map<string, WCCategory>> {
  try {
    const response = await WooCommerce.get('products/categories', {
      per_page: 100
    });
    
    const categories = response.data as WCCategory[];
    const categoryMap = new Map<string, WCCategory>();
    
    categories.forEach(cat => {
      categoryMap.set(cat.slug, cat);
    });
    
    return categoryMap;
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    throw error;
  }
}

/**
 * Fetch uncategorized products
 */
async function fetchUncategorizedProducts(): Promise<WCProduct[]> {
  try {
    const response = await WooCommerce.get('products', {
      per_page: 100,
      category: 15, // Uncategorized category ID
      status: 'publish'
    });
    
    return response.data as WCProduct[];
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    throw error;
  }
}

/**
 * Update product category
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
  console.log('🤖 Smart Product Categorization\n');
  console.log('='.repeat(80));
  console.log('\n');
  
  // Fetch categories
  console.log('📁 Fetching categories...');
  const categories = await fetchCategories();
  console.log(`✅ Fetched ${categories.size} categories\n`);
  
  // Fetch uncategorized products
  console.log('📦 Fetching uncategorized products...');
  const products = await fetchUncategorizedProducts();
  console.log(`✅ Found ${products.length} uncategorized products\n`);
  
  if (products.length === 0) {
    console.log('🎉 All products are already categorized!\n');
    return;
  }
  
  console.log('='.repeat(80));
  console.log('\n🔍 Analyzing products...\n');
  
  // Analyze each product
  const matches: Array<{ product: WCProduct; match: CategoryMatch }> = [];
  const unmatched: WCProduct[] = [];
  
  products.forEach(product => {
    const match = detectCategory(product, categories);
    if (match) {
      matches.push({ product, match });
    } else {
      unmatched.push(product);
    }
  });
  
  // Display results
  console.log('📊 CATEGORIZATION PLAN:\n');
  console.log('='.repeat(80));
  
  if (matches.length > 0) {
    // Group by category
    const byCategory = new Map<string, Array<{ product: WCProduct; match: CategoryMatch }>>();
    
    matches.forEach(item => {
      if (!byCategory.has(item.match.categoryName)) {
        byCategory.set(item.match.categoryName, []);
      }
      byCategory.get(item.match.categoryName)!.push(item);
    });
    
    // Display by category
    Array.from(byCategory.entries()).forEach(([categoryName, items]) => {
      console.log(`\n📁 ${categoryName} (${items.length} products):`);
      console.log('-'.repeat(80));
      
      items.forEach(({ product, match }, index) => {
        const confidence = match.confidence === 'high' ? '🟢' : match.confidence === 'medium' ? '🟡' : '🟠';
        console.log(`\n${index + 1}. ${product.name}`);
        console.log(`   ${confidence} Confidence: ${match.confidence.toUpperCase()}`);
        console.log(`   → ${match.reason}`);
        console.log(`   → Product ID: ${product.id}`);
      });
    });
  }
  
  if (unmatched.length > 0) {
    console.log(`\n\n⚠️  UNABLE TO CATEGORIZE (${unmatched.length} products):`);
    console.log('-'.repeat(80));
    
    unmatched.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}`);
      console.log(`   Product ID: ${product.id}`);
      console.log(`   → Needs manual categorization`);
    });
  }
  
  // Summary
  console.log('\n\n' + '='.repeat(80));
  console.log('\n📊 SUMMARY:\n');
  console.log(`   ✅ Products to categorize: ${matches.length}`);
  console.log(`   ⚠️  Need manual review: ${unmatched.length}`);
  console.log(`   📦 Total: ${products.length}`);
  
  // Ask for confirmation
  console.log('\n' + '='.repeat(80));
  console.log('\n💾 Apply these categories to WooCommerce?');
  console.log('\nThis will update the products listed above.');
  console.log('Press Ctrl+C to cancel, or wait 5 seconds to proceed...\n');
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Update products
  console.log('🔄 Updating products in WooCommerce...\n');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const { product, match } of matches) {
    const success = await updateProductCategory(product.id, match.categoryId);
    
    if (success) {
      console.log(`✅ ${product.name} → ${match.categoryName}`);
      successCount++;
    } else {
      console.log(`❌ Failed: ${product.name}`);
      failCount++;
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 FINAL RESULTS:\n');
  console.log(`   ✅ Successfully categorized: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   ⚠️  Need manual review: ${unmatched.length}`);
  
  if (unmatched.length > 0) {
    console.log('\n💡 TIP: The uncategorized products need manual review.');
    console.log('   You can categorize them in WordPress admin at:');
    console.log('   https://wholelotofnature.com/wp-admin/edit.php?post_type=product\n');
  }
  
  console.log('\n✅ Categorization complete!\n');
}

// Run the script
main().catch(error => {
  console.error('\n❌ Script failed:', error);
  process.exit(1);
});
