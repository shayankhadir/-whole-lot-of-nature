#!/usr/bin/env node

/**
 * Market Research Pricing Tool
 * Analyzes products and suggests competitive prices based on Indian market
 */

// @ts-ignore
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env.local') });

// @ts-ignore
const WooCommerce = new WooCommerceRestApi.default({
  url: process.env.WORDPRESS_URL || 'https://wholelotofnature.com',
  consumerKey: process.env.WC_CONSUMER_KEY || '',
  consumerSecret: process.env.WC_CONSUMER_SECRET || '',
  version: 'wc/v3',
  queryStringAuth: true
});

// Market research based pricing (Indian market - INR)
const pricingGuide: Record<string, { regular: number; sale?: number; reasoning: string }> = {
  // Aquatic Plants (₹29-₹89 range based on existing)
  'guppy grass': { regular: 39, sale: 29, reasoning: 'Fast-growing, easy plant - competitive with existing' },
  'asian marshweed': { regular: 59, sale: 49, reasoning: 'Similar to Limnophila - market standard' },
  'indian bhrami': { regular: 59, sale: 49, reasoning: 'Medicinal value, matches existing Brahmi pricing' },
  'mexican sword': { regular: 99, sale: 89, reasoning: 'Premium centerpiece plant - matches existing' },
  'mexican pennyworth': { regular: 49, sale: 39, reasoning: 'Similar to existing Mexican Pennywort' },
  'bacopa': { regular: 49, sale: 39, reasoning: 'Standard medicinal aquatic plant' },
  'sagittaria': { regular: 59, sale: 49, reasoning: 'Carpeting plant - mid-range pricing' },
  'duckweed': { regular: 29, sale: 19, reasoning: 'Common floating plant - budget friendly' },
  'water lettuce': { regular: 39, sale: 29, reasoning: 'Popular floating plant' },
  'salvia': { regular: 49, sale: 39, reasoning: 'Specialty aquatic herb' },
  
  // Succulents & Cacti (₹49-₹199 range)
  'jade plant': { regular: 79, sale: 59, reasoning: 'Popular lucky plant - market average' },
  'haworthia': { regular: 99, sale: 79, reasoning: 'Decorative succulent - mid-premium' },
  'euphorbia': { regular: 129, sale: 99, reasoning: 'Unique cactus-like plant - premium' },
  'aloe vera': { regular: 69, sale: 49, reasoning: 'Common medicinal plant - affordable' },
  'mini cactus': { regular: 149, sale: 129, reasoning: 'Set of mini cacti - value pack' },
  
  // Soil & Amendments (₹69-₹199 range based on existing)
  'potting mix': { regular: 179, sale: 149, reasoning: 'Premium organic mix - competitive' },
  'cocopeat': { regular: 79, sale: 69, reasoning: 'Standard eco-friendly medium' },
  'leaf compost': { regular: 89, sale: 79, reasoning: 'Organic compost - market rate' },
  'cinder': { regular: 149, sale: 139, reasoning: 'Specialty lava rocks - premium' },
  'succulent mix': { regular: 219, sale: 199, reasoning: 'Specialized blend - premium' },
  
  // Herbal Products (₹149-₹399 range)
  'moringa tablets': { regular: 299, sale: 249, reasoning: 'Herbal supplement - market standard' },
  'ashwagandha': { regular: 399, sale: 349, reasoning: 'Premium Ayurvedic blend - competitive' },
  'hair oil': { regular: 249, sale: 199, reasoning: 'Ayurvedic hair care - mid-range' },
  'facepack': { regular: 199, sale: 149, reasoning: 'Natural beauty product - affordable' },
  
  // Pond Companions (₹29-₹79 range)
  'snail': { regular: 49, sale: 39, reasoning: 'Aquarium cleaning crew - budget friendly' },
};

function suggestPrice(productName: string, categoryName: string): { regular: number; sale: number; reasoning: string } {
  const nameLower = productName.toLowerCase();
  
  // Check specific keywords
  for (const [keyword, price] of Object.entries(pricingGuide)) {
    if (nameLower.includes(keyword)) {
      return {
        regular: price.regular,
        sale: price.sale || price.regular,
        reasoning: price.reasoning
      };
    }
  }
  
  // Fallback by category
  const categoryLower = categoryName.toLowerCase();
  
  if (categoryLower.includes('aquatic')) {
    return { regular: 59, sale: 49, reasoning: 'Standard aquatic plant pricing' };
  } else if (categoryLower.includes('succulent') || categoryLower.includes('cacti')) {
    return { regular: 99, sale: 79, reasoning: 'Standard succulent pricing' };
  } else if (categoryLower.includes('soil') || categoryLower.includes('mix')) {
    return { regular: 149, sale: 129, reasoning: 'Standard soil mix pricing' };
  } else if (categoryLower.includes('herbal') || categoryLower.includes('supplement')) {
    return { regular: 299, sale: 249, reasoning: 'Standard herbal supplement pricing' };
  } else if (categoryLower.includes('snail') || categoryLower.includes('fish')) {
    return { regular: 49, sale: 39, reasoning: 'Standard aquarium livestock pricing' };
  }
  
  return { regular: 99, sale: 79, reasoning: 'Default mid-range pricing' };
}

async function main() {
  console.log('\n💰 MARKET RESEARCH PRICING TOOL\n');
  console.log('='.repeat(80));
  console.log('\n');
  
  // Fetch products without prices
  const response = await WooCommerce.get('products', {
    per_page: 100,
    status: 'publish'
  });
  
  const products = response.data;
  const productsWithoutPrice = products.filter((p: any) => !p.price || p.price === '' || p.price === '0');
  
  console.log(`📊 Found ${productsWithoutPrice.length} products without prices\n`);
  
  if (productsWithoutPrice.length === 0) {
    console.log('✅ All products have prices!\n');
    return;
  }
  
  console.log('📋 PRICING RECOMMENDATIONS:\n');
  console.log('='.repeat(80));
  
  const updates: Array<{ id: number; name: string; regular: number; sale: number; reasoning: string }> = [];
  
  productsWithoutPrice.forEach((product: any) => {
    const categoryName = product.categories[0]?.name || 'Uncategorized';
    const pricing = suggestPrice(product.name, categoryName);
    
    updates.push({
      id: product.id,
      name: product.name,
      regular: pricing.regular,
      sale: pricing.sale,
      reasoning: pricing.reasoning
    });
    
    console.log(`\n📦 ${product.name}`);
    console.log(`   Category: ${categoryName}`);
    console.log(`   Regular Price: ₹${pricing.regular}`);
    console.log(`   Sale Price: ₹${pricing.sale}`);
    console.log(`   💡 ${pricing.reasoning}`);
  });
  
  console.log('\n\n' + '='.repeat(80));
  console.log('\n💾 Apply these prices to WooCommerce?');
  console.log('Press Ctrl+C to cancel, or wait 5 seconds to proceed...\n');
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  console.log('🔄 Updating prices...\n');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const update of updates) {
    try {
      await WooCommerce.put(`products/${update.id}`, {
        regular_price: update.regular.toString(),
        sale_price: update.sale.toString(),
        price: update.sale.toString()
      });
      
      console.log(`✅ ${update.name} → ₹${update.sale} (₹${update.regular})`);
      successCount++;
    } catch (error) {
      console.log(`❌ Failed: ${update.name}`);
      failCount++;
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 RESULTS:\n');
  console.log(`   ✅ Successfully priced: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log('\n✅ Pricing complete!\n');
}

main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
