'use client';

import Script from 'next/script';

interface ArticleJsonLdProps {
  title: string;
  description: string;
  slug: string;
  publishedTime: string;
  modifiedTime?: string;
  authorName?: string;
  authorUrl?: string;
  featuredImage?: string;
  tags?: string[];
  categoryName?: string;
}

export default function ArticleJsonLd({
  title,
  description,
  slug,
  publishedTime,
  modifiedTime,
  authorName = 'Whole Lot of Nature',
  authorUrl,
  featuredImage,
  tags = [],
  categoryName,
}: ArticleJsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wholelotofnature.com';
  const articleUrl = `${baseUrl}/blog/${slug}`;
  
  const articleData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: featuredImage || `${baseUrl}/og-cover.jpg`,
    author: {
      '@type': 'Person',
      name: authorName,
      url: authorUrl || baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Whole Lot of Nature',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    url: articleUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    ...(tags.length > 0 && { keywords: tags.join(', ') }),
    ...(categoryName && { articleSection: categoryName }),
    inLanguage: 'en-IN',
  };

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog` },
      ...(categoryName ? [{ '@type': 'ListItem', position: 3, name: categoryName, item: `${baseUrl}/blog/category/${encodeURIComponent(categoryName.toLowerCase())}` }] : []),
      { '@type': 'ListItem', position: categoryName ? 4 : 3, name: title, item: articleUrl },
    ],
  };

  return (
    <>
      <Script
        id={`article-jsonld-${slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData) }}
      />
      <Script
        id={`article-breadcrumb-${slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
    </>
  );
}
