import { woocommerceClient as woocommerce } from '@/lib/services/woocommerceService';

export async function GET() {
  try {
    console.log('Testing WordPress connection...');
    console.log('WordPress URL:', process.env.WORDPRESS_URL);
    console.log('Consumer Key:', process.env.WC_CONSUMER_KEY ? 'Set' : 'Not set');
    console.log('Consumer Secret:', process.env.WC_CONSUMER_SECRET ? 'Set' : 'Not set');
    
    const response = await woocommerce.get('products', {
      per_page: 5,
      status: 'publish',
    });
    
    console.log('Products fetched:', response.data.length);
    
    return Response.json({
      success: true,
      connection: 'OK',
      productsCount: response.data.length,
      sampleProduct: response.data[0] || null,
      config: {
        url: process.env.WORDPRESS_URL,
        hasKey: !!process.env.WC_CONSUMER_KEY,
        hasSecret: !!process.env.WC_CONSUMER_SECRET,
      }
    });
  } catch (error: any) {
    console.error('WordPress connection error:', error);
    
    return Response.json({
      success: false,
      error: error.message,
      config: {
        url: process.env.WORDPRESS_URL,
        hasKey: !!process.env.WC_CONSUMER_KEY,
        hasSecret: !!process.env.WC_CONSUMER_SECRET,
      }
    }, { status: 500 });
  }
}