"use client";

import Script from 'next/script';

type Image = { src: string; alt?: string };

export default function ProductJsonLd(props: {
  name: string;
  description?: string;
  sku?: string | number;
  brand?: string;
  images?: Image[];
  price: number;
  priceCurrency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  url?: string;
  aggregateRating?: { ratingValue: number; reviewCount: number };
}) {
  const {
    name,
    description,
    sku,
    brand = 'Whole Lot of Nature',
    images = [],
    price,
    priceCurrency = 'INR',
    availability = 'InStock',
    url,
    aggregateRating,
  } = props;

  const data: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    sku: sku ? String(sku) : undefined,
    brand: { '@type': 'Brand', name: brand },
    image: images.map((i) => i.src).slice(0, 10),
    offers: {
      '@type': 'Offer',
      priceCurrency,
      price: price.toFixed(2),
      availability: `https://schema.org/${availability}`,
      url,
    },
  };

  if (aggregateRating) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
    };
  }

  return (
    <Script id={`ld-product-${encodeURIComponent(name)}`} type="application/ld+json" strategy="afterInteractive">
      {JSON.stringify(data)}
    </Script>
  );
}
