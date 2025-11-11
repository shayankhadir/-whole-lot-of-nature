"use client";

import Script from 'next/script';

export default function ProductListJsonLd(props: {
  url: string;
  items: Array<{ name: string; url: string }>;
}) {
  const { url, items } = props;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
    url,
  };

  return (
    <Script id="ld-itemlist" type="application/ld+json" strategy="afterInteractive">
      {JSON.stringify(data)}
    </Script>
  );
}
