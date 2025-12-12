/**
 * SEO Utility Layer - Reusable functions for meta tags and structured data
 * Used across all dynamic pages (products, blog posts, categories)
 */

import { BUSINESS_EMAIL } from '@/lib/config/site';

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  canonicalUrl?: string;
  author?: string;
  publishDate?: string;
  modifiedDate?: string;
}

/**
 * Generate standard meta tags object
 */
export function generateSEOMetadata(input: {
  title: string;
  description: string;
  slug: string;
  keywords?: string[];
  image?: string;
  author?: string;
  publishDate?: string;
  modifiedDate?: string;
  type?: 'product' | 'article' | 'page';
}): SEOMetadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wholelotofnature.com';
  const canonicalUrl = `${baseUrl}${input.slug}`;

  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    ogTitle: input.title,
    ogDescription: input.description,
    ogImage: input.image,
    ogUrl: canonicalUrl,
    twitterCard: input.image ? 'summary_large_image' : 'summary',
    canonicalUrl,
    author: input.author,
    publishDate: input.publishDate,
    modifiedDate: input.modifiedDate
  };
}

/**
 * Product-specific SEO metadata generator
 */
export function generateProductSEO(product: {
  name: string;
  description: string;
  price: string;
  slug: string;
  image?: string;
  rating?: number;
  ratingCount?: number;
  availability?: boolean;
  category?: string;
}): SEOMetadata {
  const keywords = [
    'organic seeds',
    'sustainable gardening',
    product.category,
    product.name,
    'buy seeds online',
    'heirloom seeds'
  ].filter(Boolean);

  const description = `${product.description.substring(0, 120)}... Buy ${product.name} online. Organic, sustainable, high-quality seeds for your garden.`;

  return generateSEOMetadata({
    title: `${product.name} | Organic Seeds | Whole Lot of Nature`,
    description,
    slug: `/shop/${product.slug}`,
    keywords: keywords as string[],
    image: product.image,
    type: 'product'
  });
}

/**
 * Blog post SEO metadata generator
 */
export function generateBlogSEO(post: {
  title: string;
  excerpt?: string;
  slug: string;
  image?: string;
  author?: string;
  publishDate?: string;
  modifiedDate?: string;
  category?: string;
  tags?: string[];
}): SEOMetadata {
  const keywords = [
    'gardening tips',
    'organic gardening',
    'sustainable farming',
    post.category,
    ...(post.tags || [])
  ].filter(Boolean);

  const description = post.excerpt || `${post.title}. Read our latest gardening and organic farming tips.`;

  return generateSEOMetadata({
    title: `${post.title} | Gardening Blog | Whole Lot of Nature`,
    description,
    slug: `/blog/${post.slug}`,
    keywords: keywords as string[],
    image: post.image,
    author: post.author || 'Whole Lot of Nature',
    publishDate: post.publishDate,
    modifiedDate: post.modifiedDate,
    type: 'article'
  });
}

/**
 * Category page SEO metadata generator
 */
export function generateCategorySEO(category: {
  name: string;
  description?: string;
  slug: string;
  image?: string;
  type: 'product' | 'blog';
  count?: number;
}): SEOMetadata {
  const typeLabel = category.type === 'product' ? 'Seeds' : 'Articles';
  const description = category.description || `Browse our collection of ${category.count || 'many'} ${category.name} ${typeLabel}`;

  const slug = category.type === 'product' 
    ? `/shop?category=${category.slug}`
    : `/blog/category/${category.slug}`;

  return generateSEOMetadata({
    title: `${category.name} ${typeLabel} | Whole Lot of Nature`,
    description,
    slug,
    keywords: ['organic', category.name.toLowerCase(), 'seeds', 'gardening'],
    image: category.image,
    type: 'page'
  });
}

/**
 * Generate JSON-LD schema for products
 */
export function generateProductSchema(product: {
  name: string;
  description: string;
  image: string;
  price: string;
  currency?: string;
  url: string;
  rating?: number;
  ratingCount?: number;
  availability?: 'InStock' | 'OutOfStock';
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    url: product.url,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'INR',
      availability: `https://schema.org/${product.availability || 'InStock'}`
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.ratingCount || 0
      }
    })
  };
}

/**
 * Generate JSON-LD schema for blog articles
 */
export function generateArticleSchema(article: {
  title: string;
  description: string;
  image: string;
  url: string;
  author: string;
  publishDate: string;
  modifiedDate?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    image: article.image,
    url: article.url,
    author: {
      '@type': 'Person',
      name: article.author
    },
    datePublished: article.publishDate,
    dateModified: article.modifiedDate || article.publishDate
  };
}

/**
 * Generate JSON-LD schema for organization
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Whole Lot of Nature',
    url: 'https://wholelotofnature.com',
    logo: 'https://wholelotofnature.com/logo.png',
    description: 'Organic seeds and sustainable gardening solutions for 10,000+ customers',
    sameAs: [
      'https://twitter.com/wholelotofnature',
      'https://facebook.com/wholelotofnature',
      'https://instagram.com/wholelotofnature'
    ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Support',
        email: BUSINESS_EMAIL
    }
  };
}

/**
 * Sanitize title for meta tags (max 60 chars)
 */
export function sanitizeTitle(title: string, maxLength = 60): string {
  const clean = title.replace(/<[^>]*>/g, '').trim();
  if (clean.length > maxLength) {
    return clean.substring(0, maxLength - 1) + '…';
  }
  return clean;
}

/**
 * Sanitize description for meta tags (max 160 chars)
 */
export function sanitizeDescription(description: string, maxLength = 160): string {
  const clean = description.replace(/<[^>]*>/g, '').trim();
  if (clean.length > maxLength) {
    return clean.substring(0, maxLength - 1) + '…';
  }
  return clean;
}

/**
 * Generate breadcrumb schema
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

/**
 * Extract keywords from content
 */
export function extractKeywords(content: string, count = 5): string[] {
  const stopwords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who', 'when', 'where', 'why', 'how'
  ]);

  const words = content
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .split(/\W+/)
    .filter((word) => word.length > 3 && !stopwords.has(word));

  const frequency: { [key: string]: number } = {};
  words.forEach((word) => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([word]) => word);
}

/**
 * Generate reading time estimate
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
