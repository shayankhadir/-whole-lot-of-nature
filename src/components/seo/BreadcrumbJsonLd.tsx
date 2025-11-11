"use client";

import Script from 'next/script';

export default function BreadcrumbJsonLd(props: {
  items: Array<{ name: string; url: string }>;
}) {
  const { items } = props;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return (
    <Script id="ld-breadcrumbs" type="application/ld+json" strategy="afterInteractive">
      {JSON.stringify(data)}
    </Script>
  );
}
