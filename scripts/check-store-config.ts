
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const api = new WooCommerceRestApi({
  url: process.env.WORDPRESS_URL || "https://admin.wholelotofnature.com",
  consumerKey: process.env.WC_CONSUMER_KEY!,
  consumerSecret: process.env.WC_CONSUMER_SECRET!,
  version: "wc/v3"
});

async function checkCoupons() {
  console.log('\n🎫 Checking Coupons...');
  try {
    const response = await api.get("coupons");
    const coupons = response.data;
    
    if (coupons.length === 0) {
      console.log('❌ No coupons found.');
      await createDefaultCoupons();
    } else {
      console.log(`✅ Found ${coupons.length} coupons:`);
      coupons.forEach((c: any) => {
        console.log(`   - ${c.code}: ${c.amount} ${c.discount_type} (Expires: ${c.date_expires || 'Never'})`);
      });
    }
  } catch (error: any) {
    console.error('Error fetching coupons:', error.response?.data?.message || error.message);
  }
}

async function createDefaultCoupons() {
  console.log('\n✨ Creating default coupons...');
  const defaultCoupons = [
    {
      code: 'WELCOME10',
      discount_type: 'percent',
      amount: '10',
      description: '10% off for new customers',
      individual_use: false,
      exclude_sale_items: true,
    },
    {
      code: 'FREESHIP',
      discount_type: 'fixed_cart',
      amount: '0',
      free_shipping: true,
      description: 'Free Shipping',
      minimum_amount: '500'
    }
  ];

  for (const coupon of defaultCoupons) {
    try {
      await api.post("coupons", coupon);
      console.log(`   ✅ Created coupon: ${coupon.code}`);
    } catch (error: any) {
      if (error.response?.data?.code === 'woocommerce_rest_coupon_code_already_exists') {
        console.log(`   ℹ️ Coupon ${coupon.code} already exists.`);
      } else {
        console.error(`   ❌ Failed to create ${coupon.code}:`, error.response?.data?.message || error.message);
      }
    }
  }
}

async function checkShipping() {
  console.log('\n🚚 Checking Shipping Configuration...');
  try {
    const zonesResponse = await api.get("shipping/zones");
    const zones = zonesResponse.data;

    if (zones.length === 0) {
      console.log('⚠️ No shipping zones found. Default "Rest of the World" might be used.');
    }

    for (const zone of zones) {
      console.log(`\nZone: ${zone.name} (ID: ${zone.id})`);
      const methodsResponse = await api.get(`shipping/zones/${zone.id}/methods`);
      const methods = methodsResponse.data;
      
      if (methods.length === 0) {
        console.log('   ❌ No shipping methods in this zone.');
      } else {
        methods.forEach((m: any) => {
          console.log(`   - ${m.method_title} (${m.method_id}): ${m.enabled ? 'Enabled' : 'Disabled'}`);
          if (m.method_id === 'free_shipping') {
             console.log(`     🎉 Free Shipping is configured! Settings:`, m.settings);
          }
        });
      }
    }
  } catch (error: any) {
    console.error('Error fetching shipping:', error.response?.data?.message || error.message);
  }
}

async function main() {
  console.log('🔍 Starting Store Configuration Check...');
  await checkCoupons();
  await checkShipping();
  console.log('\n🏁 Check Complete.');
}

main();
