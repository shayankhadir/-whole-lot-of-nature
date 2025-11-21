import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();
dotenv.config({ path: '.env.local' });

const wpUrl = process.env.WORDPRESS_URL || 'https://wholelotofnature.com';

const WooCommerce = new WooCommerceRestApi({
  url: wpUrl,
  consumerKey: process.env.WC_CONSUMER_KEY || '',
  consumerSecret: process.env.WC_CONSUMER_SECRET || '',
  version: 'wc/v3',
  queryStringAuth: true
});

const cleanName = (name: string) => {
  // Remove things in brackets like (3kg), (Small), etc.
  return name.replace(/\s*\(.*?\)\s*/g, '').trim();
};

const getSearchVariations = (name: string) => {
  const variations = [name];
  
  // 1. Remove brackets
  const noBrackets = name.replace(/\s*\(.*?\)\s*/g, '').trim();
  if (noBrackets !== name) variations.push(noBrackets);

  // 2. Remove "ORGANIC" prefix (common in this catalog)
  if (noBrackets.toUpperCase().startsWith('ORGANIC ')) {
    variations.push(noBrackets.substring(8).trim());
  }

  // 3. First 2 words (if > 1 word)
  const words = noBrackets.split(' ');
  if (words.length > 2) {
    variations.push(`${words[0]} ${words[1]}`);
  }

  // 4. Just the first word (risky, but maybe useful as last resort?)
  // variations.push(words[0]); 

  return [...new Set(variations)]; // Unique only
};

const findMediaForProduct = async (productName: string) => {
  const variations = getSearchVariations(productName);

  for (const term of variations) {
    try {
      // console.log(`    - Searching for: "${term}"`);
      const searchUrl = `${wpUrl}/wp-json/wp/v2/media?search=${encodeURIComponent(term)}&per_page=1`;
      const response = await axios.get(searchUrl);
      
      if (response.data && response.data.length > 0) {
        // Check if the result is relevant? 
        // The API search is "contains", so "Plant" might return "Plant Pot".
        // But usually it ranks well.
        return response.data[0];
      }
    } catch (error) {
      // Ignore errors for individual searches
    }
  }
  return null;
};

const matchImages = async () => {
  try {
    console.log("Fetching products...");
    // Fetch all products (assuming < 100 for now, or paginate if needed)
    const { data: products } = await WooCommerce.get("products", { per_page: 100 });
    console.log(`Found ${products.length} products.`);

    let updatedCount = 0;

    for (const product of products) {
      console.log(`Processing: ${product.name} (ID: ${product.id})`);

      // Check if product already has images
      if (product.images && product.images.length > 0) {
        console.log(`  - Already has ${product.images.length} image(s). Skipping.`);
        continue;
      }

      const mediaItem = await findMediaForProduct(product.name);

      if (mediaItem) {
        console.log(`  - Found match: "${mediaItem.title.rendered}" (ID: ${mediaItem.id})`);
        console.log(`  - URL: ${mediaItem.source_url}`);

        // Update product
        try {
          await WooCommerce.put(`products/${product.id}`, {
            images: [
              {
                id: mediaItem.id
              }
            ]
          });
          console.log(`  - ✅ Product updated successfully.`);
          updatedCount++;
        } catch (updateError: any) {
          console.error(`  - ❌ Failed to update product:`, updateError.message);
        }

      } else {
        console.log(`  - ⚠️ No matching image found.`);
      }
    }

    console.log(`\nJob Complete! Updated ${updatedCount} products.`);

  } catch (error) {
    console.error("Fatal Error:", error);
  }
};

matchImages();
