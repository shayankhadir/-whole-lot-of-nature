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
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0d3512',
            color: '#daf2d0',
          }}
        >
          <div style={{ fontSize: 60, fontWeight: 'bold' }}>Whole Lot of Nature</div>
          <div style={{ fontSize: 30, marginTop: 20 }}>Premium Plants & Gardening</div>
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
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          backgroundColor: '#0d3512',
          padding: 40,
        }}
      >
        {/* Left: Product Image */}
        <div
          style={{
            width: '50%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            overflow: 'hidden',
            backgroundColor: '#1a4a1f',
          }}
        >
          {productImage ? (
            <img
              src={productImage}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div
              style={{
                fontSize: 80,
                color: '#86efbe',
              }}
            >
              🌿
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div
          style={{
            width: '50%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 40px',
            color: '#daf2d0',
          }}
        >
          {/* Brand */}
          <div
            style={{
              fontSize: 20,
              color: '#86efbe',
              marginBottom: 16,
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            Whole Lot of Nature
          </div>

          {/* Product Name */}
          <div
            style={{
              fontSize: 48,
              fontWeight: 'bold',
              lineHeight: 1.2,
              marginBottom: 24,
              maxWidth: '100%',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {product.name}
          </div>

          {/* Price */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 16,
            }}
          >
            <div
              style={{
                fontSize: 40,
                fontWeight: 'bold',
                color: '#86efbe',
              }}
            >
              ₹{price.toLocaleString('en-IN')}
            </div>
            {hasDiscount && (
              <div
                style={{
                  fontSize: 24,
                  color: '#888',
                  textDecoration: 'line-through',
                }}
              >
                ₹{regularPrice.toLocaleString('en-IN')}
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div
            style={{
              marginTop: 20,
              fontSize: 18,
              color: product.stock_status === 'instock' ? '#4ade80' : '#f87171',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: product.stock_status === 'instock' ? '#4ade80' : '#f87171',
              }}
            />
            {product.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}
          </div>

          {/* CTA */}
          <div
            style={{
              marginTop: 30,
              padding: '16px 32px',
              backgroundColor: '#22c55e',
              color: 'white',
              borderRadius: 50,
              fontSize: 20,
              fontWeight: 'bold',
              display: 'inline-flex',
              alignSelf: 'flex-start',
            }}
          >
            Shop Now →
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
