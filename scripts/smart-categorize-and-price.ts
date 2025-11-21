import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
dotenv.config({ path: '.env.local' });

const WooCommerce = new WooCommerceRestApi({
  url: process.env.WORDPRESS_URL || 'https://wholelotofnature.com',
  consumerKey: process.env.WC_CONSUMER_KEY || '',
  consumerSecret: process.env.WC_CONSUMER_SECRET || '',
  version: 'wc/v3',
  queryStringAuth: true
});

// Category Definitions
const CATEGORIES = {
  PLANTS: { id: 0, name: 'Plants' },
  SOIL: { id: 0, name: 'Soil & Fertilizers' },
  AQUATIC: { id: 0, name: 'Aquatic Life' },
  WELLNESS: { id: 0, name: 'Wellness & Herbal' },
  SEEDS: { id: 0, name: 'Seeds' },
  ESSENTIALS: { id: 0, name: 'Gardening Essentials' }
};

// Pricing Strategy (Competitor Benchmarked)
// Based on analysis: Entry ~₹99, Mid ~₹299-499, Premium ~₹999+
const PRICING_RULES = [
  {
    keywords: ['soil', 'mix', 'compost', 'manure', 'cinder', 'cocopeat'],
    category: 'SOIL',
    basePrice: 499,
    salePrice: 299, // Competitive with 3kg packs
    weightMultiplier: true // If weight is detected, scale price
  },
  {
    keywords: ['snail', 'shrimp', 'fish', 'guppy'],
    category: 'AQUATIC',
    basePrice: 199,
    salePrice: 99, // Entry level aquatic life
  },
  {
    keywords: ['aquatic plant', 'water lettuce', 'duckweed', 'guppy grass', 'marshweed', 'sword plant', 'pennywort', 'bramhi', 'sagittaria'],
    category: 'AQUATIC',
    basePrice: 249,
    salePrice: 149,
  },
  {
    keywords: ['succulent', 'cactus', 'jade', 'haworthia', 'aloe', 'euphorbia'],
    category: 'PLANTS',
    basePrice: 399,
    salePrice: 249,
  },
  {
    keywords: ['oil', 'tablet', 'powder', 'facepack', 'herbal', 'ashwagandha', 'moringa'],
    category: 'WELLNESS',
    basePrice: 599,
    salePrice: 399,
  },
  {
    keywords: ['seed'],
    category: 'SEEDS',
    basePrice: 149,
    salePrice: 99,
  },
  {
    keywords: ['plant', 'fern', 'palm', 'money plant'], // Fallback for general plants
    category: 'PLANTS',
    basePrice: 499,
    salePrice: 299,
  }
];

const ensureCategoriesExist = async () => {
  console.log("Checking categories...");
  const { data: existingCategories } = await WooCommerce.get("products/categories", { per_page: 100 });
  
  for (const key of Object.keys(CATEGORIES) as Array<keyof typeof CATEGORIES>) {
    const catName = CATEGORIES[key].name;
    const existing = existingCategories.find((c: any) => c.name === catName);
    
    if (existing) {
      CATEGORIES[key].id = existing.id;
      console.log(`Category exists: ${catName} (ID: ${existing.id})`);
    } else {
      console.log(`Creating category: ${catName}...`);
      const { data: newCat } = await WooCommerce.post("products/categories", { name: catName });
      CATEGORIES[key].id = newCat.id;
      console.log(`Created category: ${catName} (ID: ${newCat.id})`);
    }
  }
};

const determineCategoryAndPrice = (product: any) => {
  const name = product.name.toLowerCase();
  
  for (const rule of PRICING_RULES) {
    if (rule.keywords.some(k => name.includes(k))) {
      let regular_price = rule.basePrice;
      let sale_price = rule.salePrice;

      // Simple weight heuristic for soil
      if (rule.weightMultiplier) {
        if (name.includes('5kg') || name.includes('5 kg')) {
          regular_price *= 1.5;
          sale_price *= 1.5;
        } else if (name.includes('1kg') || name.includes('1 kg')) {
          regular_price *= 0.4;
          sale_price *= 0.4;
        }
      }

      return {
        categoryId: CATEGORIES[rule.category as keyof typeof CATEGORIES].id,
        regular_price: regular_price.toString(),
        sale_price: sale_price.toString()
      };
    }
  }

  // Default fallback
  return {
    categoryId: CATEGORIES.ESSENTIALS.id,
    regular_price: '299',
    sale_price: '199'
  };
};

const categorizeAndPrice = async () => {
  try {
    await ensureCategoriesExist();

    console.log("Fetching products...");
    const { data: products } = await WooCommerce.get("products", { per_page: 100 });
    console.log(`Found ${products.length} products.`);

    for (const product of products) {
      const { categoryId, regular_price, sale_price } = determineCategoryAndPrice(product);
      
      console.log(`Updating ${product.name}:`);
      console.log(`  - Category ID: ${categoryId}`);
      console.log(`  - Price: ₹${sale_price} (was ₹${regular_price})`);

      const updateData: any = {
        categories: [{ id: categoryId }],
        regular_price,
        sale_price
      };

      // If it's a variable product, we need to update variations instead of the main price
      if (product.type === 'variable') {
        // We still update the category on the parent
        await WooCommerce.put(`products/${product.id}`, { categories: [{ id: categoryId }] });
        
        // Fetch variations
        const { data: variations } = await WooCommerce.get(`products/${product.id}/variations`);
        
        for (const variation of variations) {
          // Scale variation prices based on the base sale price we calculated
          // Assuming variations are Size: Small (1x), Medium (1.5x), Large (2.5x)
          let multiplier = 1;
          const size = variation.attributes.find((a: any) => a.name === 'Size')?.option;
          
          if (size === 'Medium') multiplier = 1.5;
          if (size === 'Large') multiplier = 2.5;

          const varRegular = (parseFloat(regular_price) * multiplier).toFixed(2);
          const varSale = (parseFloat(sale_price) * multiplier).toFixed(2);

          await WooCommerce.put(`products/${product.id}/variations/${variation.id}`, {
            regular_price: varRegular,
            sale_price: varSale
          });
          console.log(`    - Updated variation ${variation.id} (${size}): ₹${varSale}`);
        }
      } else {
        // Simple product update
        await WooCommerce.put(`products/${product.id}`, updateData);
      }
    }

    console.log("Categorization and pricing update complete!");

  } catch (error) {
    console.error("Error:", error);
  }
};

categorizeAndPrice();
