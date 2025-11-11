#!/usr/bin/env node

/**
 * Generate Product Images using Placeholder Service
 * Creates beautiful placeholder images for products without images
 */

// @ts-ignore
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import https from 'https';
import fs from 'fs';
import path from 'path';

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

// Color schemes by category
const categoryColors: Record<string, { bg: string; text: string; emoji: string }> = {
  'aquatic': { bg: '0077be', text: 'ffffff', emoji: '🌊' },
  'succulent': { bg: '2d5016', text: 'ffffff', emoji: '🌵' },
  'cacti': { bg: '2d5016', text: 'ffffff', emoji: '🌵' },
  'soil': { bg: '6b4423', text: 'ffffff', emoji: '🌱' },
  'mix': { bg: '6b4423', text: 'ffffff', emoji: '🌱' },
  'herbal': { bg: '228b22', text: 'ffffff', emoji: '🌿' },
  'supplement': { bg: '228b22', text: 'ffffff', emoji: '💊' },
  'snail': { bg: '4169e1', text: 'ffffff', emoji: '🐌' },
  'fish': { bg: '1e90ff', text: 'ffffff', emoji: '🐟' },
  'plant': { bg: '006400', text: 'ffffff', emoji: '🪴' },
  'default': { bg: '2d5016', text: 'ffffff', emoji: '🌿' }
};

function getColorScheme(categoryName: string, productName: string): { bg: string; text: string; emoji: string } {
  const searchText = `${categoryName} ${productName}`.toLowerCase();
  
  for (const [keyword, colors] of Object.entries(categoryColors)) {
    if (searchText.includes(keyword)) {
      return colors;
    }
  }
  
  return categoryColors.default;
}

function generateImageUrl(productName: string, categoryName: string): string {
  const colors = getColorScheme(categoryName, productName);
  
  // Use placeholder.com API - simple and reliable
  // Format: https://via.placeholder.com/800x800/BGCOLOR/TEXTCOLOR?text=Product+Name
  const cleanName = productName
    .replace(/[^\w\s]/g, '')
    .split(' ')
    .slice(0, 4) // First 4 words max
    .join('+');
  
  return `https://via.placeholder.com/800x800/${colors.bg}/${colors.text}?text=${colors.emoji}+${cleanName}`;
}

async function downloadImage(url: string, filepath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      console.error(`   Error downloading image: ${err.message}`);
      resolve(false);
    });
  });
}

async function uploadImageToWordPress(imagePath: string, productName: string): Promise<number | null> {
  try {
    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString('base64');
    
    const response = await WooCommerce.post('media', {
      title: `${productName} - Product Image`,
      alt_text: productName,
      caption: productName,
      type: 'image/png',
      media_attachment: base64Image
    });
    
    return response.data.id;
  } catch (error) {
    console.error(`   Error uploading to WordPress:`, error);
    return null;
  }
}

async function main() {
  console.log('\n🎨 PRODUCT IMAGE GENERATOR\n');
  console.log('='.repeat(80));
  console.log('\n');
  
  // Create temp directory
  const tempDir = resolve(__dirname, '../temp_images');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  // Fetch products without images
  const response = await WooCommerce.get('products', {
    per_page: 100,
    status: 'publish'
  });
  
  const products = response.data;
  const productsWithoutImages = products.filter((p: any) => !p.images || p.images.length === 0);
  
  console.log(`📊 Found ${productsWithoutImages.length} products without images\n`);
  
  if (productsWithoutImages.length === 0) {
    console.log('✅ All products have images!\n');
    return;
  }
  
  // Limit to first 10 for demo
  const productsToProcess = productsWithoutImages.slice(0, 10);
  
  console.log(`🎨 Generating images for ${productsToProcess.length} products...\n`);
  console.log('='.repeat(80));
  
  let successCount = 0;
  let failCount = 0;
  
  for (const product of productsToProcess) {
    const categoryName = product.categories[0]?.name || 'Product';
    const colors = getColorScheme(categoryName, product.name);
    
    console.log(`\n📦 ${product.name}`);
    console.log(`   Category: ${categoryName}`);
    console.log(`   Color: ${colors.emoji} #${colors.bg}`);
    
    try {
      // Generate image URL
      const imageUrl = generateImageUrl(product.name, categoryName);
      const imagePath = path.join(tempDir, `product-${product.id}.png`);
      
      console.log(`   ⬇️  Downloading placeholder image...`);
      const downloaded = await downloadImage(imageUrl, imagePath);
      
      if (!downloaded) {
        console.log(`   ❌ Failed to download image`);
        failCount++;
        continue;
      }
      
      console.log(`   ⬆️  Uploading to WordPress...`);
      const mediaId = await uploadImageToWordPress(imagePath, product.name);
      
      if (!mediaId) {
        console.log(`   ❌ Failed to upload to WordPress`);
        failCount++;
        continue;
      }
      
      console.log(`   🔗 Attaching to product...`);
      await WooCommerce.put(`products/${product.id}`, {
        images: [{ id: mediaId }]
      });
      
      console.log(`   ✅ Image added successfully!`);
      successCount++;
      
      // Clean up temp file
      fs.unlinkSync(imagePath);
      
      // Small delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`   ❌ Error processing: ${error}`);
      failCount++;
    }
  }
  
  // Cleanup temp directory
  if (fs.existsSync(tempDir)) {
    fs.rmdirSync(tempDir, { recursive: true });
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 RESULTS:\n');
  console.log(`   ✅ Images generated: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   ⏭️  Remaining: ${productsWithoutImages.length - productsToProcess.length}`);
  
  if (successCount > 0) {
    console.log('\n✅ Product images added successfully!\n');
    console.log('💡 TIP: You can run this script again to process more products.\n');
  }
}

main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
