import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Product Image';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Color constants
const COLORS = {
  primary: '#0d3512',
  secondary: '#1a4a1f',
  accent: '#86efbe',
  light: '#daf2d0',
  success: '#4ade80',
  error: '#f87171',
  cta: '#22c55e',
  muted: '#888',
};

// Common style objects
const styles = {
  container: {
    height: '100%',
    width: '100%',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: COLORS.primary,
    color: COLORS.light,
  },
  fullContainer: {
    height: '100%',
    width: '100%',
    display: 'flex' as const,
    backgroundColor: COLORS.primary,
    padding: 40,
  },
  imageContainer: {
    width: '50%',
    height: '100%',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: 20,
    overflow: 'hidden' as const,
    backgroundColor: COLORS.secondary,
  },
  infoContainer: {
    width: '50%',
    height: '100%',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    justifyContent: 'center' as const,
    padding: '0 40px',
    color: COLORS.light,
  },
  emoji: {
    fontSize: 80,
    color: COLORS.accent,
  },
  brand: {
    fontSize: 20,
    color: COLORS.accent,
    marginBottom: 16,
    textTransform: 'uppercase' as const,
    letterSpacing: 2,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold' as const,
    lineHeight: 1.2,
    marginBottom: 24,
    maxWidth: '100%',
    overflow: 'hidden' as const,
    display: '-webkit-box' as const,
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical' as const,
  },
  priceContainer: {
    display: 'flex' as const,
    alignItems: 'baseline' as const,
    gap: 16,
  },
  price: {
    fontSize: 40,
    fontWeight: 'bold' as const,
    color: COLORS.accent,
  },
  originalPrice: {
    fontSize: 24,
    color: COLORS.muted,
    textDecoration: 'line-through' as const,
  },
  stockContainer: {
    marginTop: 20,
    fontSize: 18,
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  stockDot: {
    width: 12,
    height: 12,
    borderRadius: '50%',
  },
  cta: {
    marginTop: 30,
    padding: '16px 32px',
    backgroundColor: COLORS.cta,
    color: 'white',
    borderRadius: 50,
    fontSize: 20,
    fontWeight: 'bold' as const,
    display: 'inline-flex' as const,
    alignSelf: 'flex-start' as const,
  },
};

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
        <div style={styles.container}>
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
      <div style={styles.fullContainer}>
        {/* Left: Product Image */}
        <div style={styles.imageContainer}>
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
            <div style={styles.emoji}>🌿</div>
          )}
        </div>

        {/* Right: Product Info */}
        <div style={styles.infoContainer}>
          {/* Brand */}
          <div style={styles.brand}>
            Whole Lot of Nature
          </div>

          {/* Product Name */}
          <div style={styles.title}>
            {product.name}
          </div>

          {/* Price */}
          <div style={styles.priceContainer}>
            <div style={styles.price}>
              ₹{price.toLocaleString('en-IN')}
            </div>
            {hasDiscount && (
              <div style={styles.originalPrice}>
                ₹{regularPrice.toLocaleString('en-IN')}
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div
            style={{
              ...styles.stockContainer,
              color: product.stock_status === 'instock' ? COLORS.success : COLORS.error,
            }}
          >
            <div
              style={{
                ...styles.stockDot,
                backgroundColor: product.stock_status === 'instock' ? COLORS.success : COLORS.error,
              }}
            />
            {product.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}
          </div>

          {/* CTA */}
          <div style={styles.cta}>
            Shop Now →
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
