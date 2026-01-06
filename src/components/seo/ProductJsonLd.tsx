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
  regularPrice?: number;
  priceCurrency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  url?: string;
  slug?: string;
  category?: string;
  aggregateRating?: { ratingValue: number; reviewCount: number };
}) {
  const {
    name,
    description,
    sku,
    brand = 'Whole Lot of Nature',
    images = [],
    price,
    regularPrice,
    priceCurrency = 'INR',
    availability = 'InStock',
    url,
    slug,
    category,
    aggregateRating,
  } = props;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wholelotofnature.com';
  const productUrl = url || (slug ? `${baseUrl}/shop/${slug}` : baseUrl);

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    sku: sku ? String(sku) : undefined,
    brand: { '@type': 'Brand', name: brand },
    image: images.map((i) => i.src).slice(0, 10),
    ...(category && { category }),
    offers: {
      '@type': 'Offer',
      priceCurrency,
      price: price.toFixed(2),
      ...(regularPrice && regularPrice > price && {
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: price.toFixed(2),
          priceCurrency,
          valueAddedTaxIncluded: true,
        },
      }),
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: `https://schema.org/${availability}`,
      url: productUrl,
      seller: {
        '@type': 'Organization',
        name: 'Whole Lot of Nature',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: price >= 499 ? '0' : '49',
          currency: 'INR',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN',
        },
      },
    },
    ...(aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: aggregateRating.ratingValue,
        reviewCount: aggregateRating.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };

  // BreadcrumbList
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: `${baseUrl}/shop` },
      ...(category ? [{ '@type': 'ListItem', position: 3, name: category, item: `${baseUrl}/shop?category=${encodeURIComponent(category)}` }] : []),
      { '@type': 'ListItem', position: category ? 4 : 3, name, item: productUrl },
    ],
  };

  return (
    <>
      <Script id={`ld-product-${encodeURIComponent(name)}`} type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(data)}
      </Script>
      <Script id={`ld-breadcrumb-${encodeURIComponent(name)}`} type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(breadcrumbData)}
      </Script>
    </>
  );
}
