import Script from 'next/script';

interface ProductSchemaProps {
  name: string;
  description: string;
  image: string | string[];
  price: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  brand?: string;
  sku?: string;
  rating?: {
    value: number;
    count: number;
  };
}

/**
 * Generates Schema.org Product structured data for SEO
 * https://schema.org/Product
 */
export default function ProductSchema({
  name,
  description,
  image,
  price,
  currency = 'INR',
  availability = 'InStock',
  brand = 'Whole Lot of Nature',
  sku,
  rating,
}: ProductSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: Array.isArray(image) ? image : [image],
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    offers: {
      '@type': 'Offer',
      price: price.toFixed(2),
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    },
    ...(sku && { sku }),
    ...(rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating.value,
        reviewCount: rating.count,
      },
    }),
  };

  return (
    <Script
      id="product-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
