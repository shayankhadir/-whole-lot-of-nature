
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const api = new WooCommerceRestApi({
  url: process.env.WORDPRESS_URL || "https://admin.wholelotofnature.com",
  consumerKey: process.env.WC_CONSUMER_KEY!,
  consumerSecret: process.env.WC_CONSUMER_SECRET!,
  version: "wc/v3"
});

async function enableFreeShipping() {
  console.log('🚚 Enabling Free Shipping...');
  
  try {
    const zonesResponse = await api.get("shipping/zones");
    const zones = zonesResponse.data;

    for (const zone of zones) {
      if (zone.id === 0) continue; // Skip default zone usually

      console.log(`Processing Zone: ${zone.name} (ID: ${zone.id})`);
      
      // Check if free shipping exists
      const methodsResponse = await api.get(`shipping/zones/${zone.id}/methods`);
      const methods = methodsResponse.data;
      const hasFreeShipping = methods.find((m: any) => m.method_id === 'free_shipping');

      if (hasFreeShipping) {
        console.log(`   ✅ Free shipping already exists in ${zone.name}`);
      } else {
        console.log(`   ➕ Adding Free Shipping to ${zone.name}...`);
        await api.post(`shipping/zones/${zone.id}/methods`, {
          method_id: 'free_shipping',
          settings: {
            requires: 'min_amount',
            min_amount: '999', // Free shipping for orders over 999
            title: 'Free Shipping'
          }
        });
        console.log(`   ✅ Added Free Shipping (Orders > 999)`);
      }
    }
  } catch (error: any) {
    console.error('Error:', error.response?.data?.message || error.message);
  }
}

enableFreeShipping();
