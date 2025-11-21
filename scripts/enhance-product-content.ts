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

// Content Templates
const DESCRIPTIONS = {
  PLANTS: {
    intro: "Bring nature indoors with this resilient and beautiful plant.",
    bullets: [
      "🌿 **Air Purifying:** Naturally filters indoor air toxins.",
      "💧 **Watering:** Water when topsoil is dry (approx. once a week).",
      "☀️ **Light:** Thrives in bright, indirect sunlight.",
      "🐾 **Pet Friendly:** Check specific variety details."
    ]
  },
  SOIL: {
    intro: "Premium organic mix designed for optimal root health and growth.",
    bullets: [
      "🌱 **Nutrient Rich:** Fortified with organic compost and minerals.",
      "💨 **Aeration:** Ensures roots get plenty of oxygen.",
      "💧 **Drainage:** Prevents root rot by draining excess water.",
      "🦠 **Bio-Active:** Contains beneficial microbes for soil health."
    ]
  },
  AQUATIC: {
    intro: "Create a thriving underwater ecosystem with our aquatic range.",
    bullets: [
      "🐟 **Safe for Fish:** 100% natural and non-toxic.",
      "🌊 **Water Quality:** Helps maintain chemical balance.",
      "🌿 **Growth:** Promotes healthy aquatic plant growth.",
      "🐌 **Natural Habitat:** Mimics natural riverbeds/ponds."
    ]
  },
  WELLNESS: {
    intro: "Natural herbal remedies for a healthier lifestyle.",
    bullets: [
      "🌿 **100% Organic:** Sourced from pesticide-free farms.",
      "✨ **Pure:** No additives or preservatives.",
      "💪 **Health Benefits:** Traditional Ayurvedic formulation.",
      "📦 **Fresh:** Sealed for maximum potency."
    ]
  },
  DEFAULT: {
    intro: "High-quality gardening essential for your home.",
    bullets: [
      "✅ **Premium Quality:** Tested for durability and performance.",
      "🌿 **Eco-Friendly:** Sustainable materials/ingredients.",
      "📦 **Fast Shipping:** Securely packed and delivered.",
      "💯 **Satisfaction:** Backed by our quality guarantee."
    ]
  }
};

const getCategoryContent = (categories: any[]) => {
  const catNames = categories.map(c => c.name.toLowerCase());
  
  if (catNames.some(c => c.includes('plant') || c.includes('succulent'))) return DESCRIPTIONS.PLANTS;
  if (catNames.some(c => c.includes('soil') || c.includes('fertilizer') || c.includes('compost'))) return DESCRIPTIONS.SOIL;
  if (catNames.some(c => c.includes('aquatic') || c.includes('fish') || c.includes('snail'))) return DESCRIPTIONS.AQUATIC;
  if (catNames.some(c => c.includes('wellness') || c.includes('herbal'))) return DESCRIPTIONS.WELLNESS;
  
  return DESCRIPTIONS.DEFAULT;
};

const formatShortDescription = (content: typeof DESCRIPTIONS.DEFAULT) => {
  const bulletsHtml = content.bullets.map(b => `<li>${b}</li>`).join('');
  return `<p>${content.intro}</p><ul class="product-features-list">${bulletsHtml}</ul>`;
};

const enhanceProducts = async () => {
  try {
    console.log("Fetching products...");
    const { data: products } = await WooCommerce.get("products", { per_page: 100 });
    console.log(`Found ${products.length} products.`);

    // Find potential cross-sells (simple logic: find a soil product to link to plants)
    const soilProduct = products.find((p: any) => p.name.toLowerCase().includes('potting mix'));
    const fertilizerProduct = products.find((p: any) => p.name.toLowerCase().includes('fertilizer') || p.name.toLowerCase().includes('compost'));
    
    const crossSellIds = [];
    if (soilProduct) crossSellIds.push(soilProduct.id);
    if (fertilizerProduct) crossSellIds.push(fertilizerProduct.id);

    for (const product of products) {
      console.log(`Processing: ${product.name}`);
      
      const content = getCategoryContent(product.categories);
      const newShortDesc = formatShortDescription(content);
      
      const updateData: any = {
        short_description: newShortDesc
      };

      // Add cross-sells to Plants
      if (content === DESCRIPTIONS.PLANTS && crossSellIds.length > 0) {
        // Don't link to itself
        const validCrossSells = crossSellIds.filter(id => id !== product.id);
        if (validCrossSells.length > 0) {
          updateData.cross_sell_ids = validCrossSells;
          console.log(`  - Linking cross-sells: ${validCrossSells.join(', ')}`);
        }
      }

      // Only update if description is empty or looks like it needs update (optional check)
      // For now, we overwrite to ensure consistency as requested
      await WooCommerce.put(`products/${product.id}`, updateData);
      console.log(`  - Updated description.`);
    }

    console.log("Enhancement complete!");

  } catch (error) {
    console.error("Error:", error);
  }
};

enhanceProducts();
