/* eslint-disable */
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Product Image';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';


async function getProduct(slug: string) {
  try {
    // Use direct fetch for edge runtime compatibility
    const baseUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || 'https://admin.wholelotofnature.com';
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;
    
    if (!consumerKey || !consumerSecret) {
      return null;
    }
    
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const response = await fetch(
      `${baseUrl}/wp-json/wc/v3/products?slug=${slug}&per_page=1`,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );
    
    if (!response.ok) return null;
    const products = await response.json();
    return products[0] || null;
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);

  if (!product) {
    // Fallback OG image
    return new ImageResponse(
      (
        <div tw="h-full w-full flex flex-col items-center justify-center bg-[#0d3512] text-[#daf2d0]">
          <div tw="text-[60px] font-bold">Whole Lot of Nature</div>
          <div tw="text-[30px] mt-5">Premium Plants & Gardening</div>
        </div>
      ),
      { ...size }
    );
  }

  const productImage = product.images?.[0]?.src;
  const price = parseFloat(product.price) || 0;
  const regularPrice = product.regular_price ? parseFloat(product.regular_price) : null;
  const hasDiscount = regularPrice && regularPrice > price;

  return new ImageResponse(
    (
      <div tw="h-full w-full flex bg-[#0d3512] p-10">
        {/* Left: Product Image */}
        <div tw="w-1/2 h-full flex items-center justify-center rounded-[20px] overflow-hidden bg-[#1a4a1f]">
          {productImage ? (
            <img
              src={productImage}
              alt={product.name}
              tw="w-full h-full object-cover"
            />
          ) : (
            <div tw="text-[80px] text-[#86efbe]">🌿</div>
          )}
        </div>

        {/* Right: Product Info */}
        <div tw="w-1/2 h-full flex flex-col justify-center px-10 text-[#daf2d0]">
          {/* Brand */}
          <div tw="text-[20px] text-[#86efbe] mb-4 uppercase tracking-[2px] font-semibold">
            Whole Lot of Nature
          </div>

          {/* Product Name */}
          <div tw="text-[48px] font-bold leading-tight mb-6">
            {product.name}
          </div>

          {/* Price */}
          <div tw="flex items-baseline gap-4">
            <div tw="text-[40px] font-bold text-[#86efbe]">
              ₹{price.toLocaleString('en-IN')}
            </div>
            {hasDiscount && (
              <div tw="text-[24px] text-[#888] line-through">
                ₹{regularPrice.toLocaleString('en-IN')}
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div tw="mt-5 text-[18px] flex items-center gap-2">
            <div
              tw={product.stock_status === 'instock' ? 'w-3 h-3 rounded-full bg-[#4ade80]' : 'w-3 h-3 rounded-full bg-[#f87171]'}
            />
            {product.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}
          </div>

          {/* CTA */}
          <div tw="mt-8 px-8 py-4 bg-[#22c55e] text-white rounded-full text-[20px] font-bold inline-flex self-start">
            Shop Now →
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
