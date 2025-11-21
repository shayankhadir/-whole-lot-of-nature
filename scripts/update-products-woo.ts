import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import * as fs from 'fs';
import * as path from 'path';
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

const brandVoice = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'brand-voice.json'), 'utf-8'));

const generateDescription = (product: any) => {
  const name = product.name;
  const category = product.categories[0]?.name || 'Nature';
  
  const intro = `Bring the essence of nature into your home with our premium ${name}. ${brandVoice.voice.example}`;
  
  let body = '';
  if (category.toLowerCase().includes('plant')) {
    body = `
    <h3>Why You'll Love This Plant</h3>
    <p>Our ${name} is more than just a plant; it's a living piece of art that purifies your air and calms your mind. Grown with love and sustainable practices, it's perfect for both beginners and experienced plant parents.</p>
    
    <h3>Care Instructions</h3>
    <ul>
      <li><strong>Light:</strong> Thrives in bright, indirect light.</li>
      <li><strong>Water:</strong> Water when the top inch of soil feels dry.</li>
      <li><strong>Soil:</strong> Planted in our signature organic soil mix for optimal health.</li>
    </ul>
    
    <h3>The Whole Lot of Nature Promise</h3>
    <p>${brandVoice.essence.story}</p>
    `;
  } else if (category.toLowerCase().includes('soil')) {
    body = `
    <h3>Premium Organic Quality</h3>
    <p>Give your plants the foundation they deserve with our ${name}. Rich in nutrients and teeming with beneficial microbes, this mix mimics the forest floor to promote vigorous root growth.</p>
    
    <h3>Benefits</h3>
    <ul>
      <li>100% Organic and sustainable</li>
      <li>Perfect aeration and drainage</li>
      <li>Enriched with natural amendments</li>
    </ul>
    `;
  } else {
    body = `
    <h3>Sustainable & Natural</h3>
    <p>Embrace a greener lifestyle with our ${name}. Crafted to align with our values of eco-conscious living, this product helps you stay loyal to the soil.</p>
    `;
  }

  const seoOutro = `
  <p><em>Shop ${name} online at Whole Lot of Nature. Best ${category} in India. Sustainable, organic, and delivered to your doorstep.</em></p>
  `;

  return intro + body + seoOutro;
};

const generateShortDescription = (product: any) => {
  return `Premium ${product.name} from Whole Lot of Nature. ${brandVoice.brand.tagline}. Organic, sustainable, and perfect for your green space.`;
};

const updateProducts = async () => {
  try {
    console.log("Fetching products...");
    const { data: products } = await WooCommerce.get("products", { per_page: 100 });
    console.log(`Found ${products.length} products.`);

    for (const product of products) {
      console.log(`Processing: ${product.name} (ID: ${product.id})`);
      
      const updateData: any = {
        description: generateDescription(product),
        short_description: generateShortDescription(product),
        meta_data: [
          {
            key: '_yoast_wpseo_title',
            value: `${product.name} | Whole Lot of Nature - Premium & Organic`
          },
          {
            key: '_yoast_wpseo_metadesc',
            value: `Buy ${product.name} online. ${brandVoice.mission.substring(0, 120)}...`
          }
        ]
      };

      // Convert Plants to Variable Products
      const isPlant = product.categories.some((c: any) => c.name.toLowerCase().includes('plant') || c.name.toLowerCase().includes('succulent'));
      
      if (isPlant && product.type === 'simple') {
        console.log(`Converting ${product.name} to variable product...`);
        
        // 1. Update to variable and add attributes
        updateData.type = 'variable';
        updateData.attributes = [
          {
            name: 'Size',
            visible: true,
            variation: true,
            options: ['Small', 'Medium', 'Large']
          }
        ];
        
        // Update the product first to make it variable
        await WooCommerce.put(`products/${product.id}`, updateData);
        
        // 2. Create variations
        const basePrice = parseFloat(product.regular_price || product.price || '299');
        
        const variations = [
          {
            regular_price: basePrice.toString(),
            attributes: [{ name: 'Size', option: 'Small' }]
          },
          {
            regular_price: (basePrice * 1.5).toFixed(2),
            attributes: [{ name: 'Size', option: 'Medium' }]
          },
          {
            regular_price: (basePrice * 2.5).toFixed(2),
            attributes: [{ name: 'Size', option: 'Large' }]
          }
        ];

        for (const variation of variations) {
          await WooCommerce.post(`products/${product.id}/variations`, variation);
        }
        console.log(`Created variations for ${product.name}`);
      } else {
        // Just update content for non-plants or already variable products
        await WooCommerce.put(`products/${product.id}`, updateData);
        console.log(`Updated content for ${product.name}`);
      }
    }
    
    console.log("All products updated successfully!");
  } catch (error) {
    console.error("Error updating products:", error);
  }
};

updateProducts();
