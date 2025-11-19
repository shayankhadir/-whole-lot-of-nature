import { Metadata } from 'next';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * Generates comprehensive SEO metadata for Next.js pages
 * Usage: export const metadata = generateMetadata({ title: '...', description: '...' })
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords,
    image = '/og-cover.jpg',
    url,
    type = 'website',
    author,
    publishedTime,
    modifiedTime,
  } = config;

  const fullTitle = `${title} | Whole Lot of Nature`;
  const siteUrl = 'https://wholelotofnature.com';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    ...(keywords && { keywords }),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      type,
      url: fullUrl,
      title: fullTitle,
      description,
      siteName: 'Whole Lot of Nature',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_IN',
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      site: '@wholelotofnature',
      creator: author || '@wholelotofnature',
      title: fullTitle,
      description,
      images: [imageUrl],
    },
  };

  return metadata;
}

/**
 * Common page metadata presets
 */
export const seoPresets = {
  shop: {
    title: 'Shop Premium Plants & Gardening Essentials',
    description:
      'Discover our collection of indoor plants, outdoor plants, seeds, soil mixes, and organic gardening supplies. Free shipping on orders above ₹150.',
    keywords: 'buy plants online, indoor plants, outdoor plants, gardening supplies, organic seeds',
  },
  blog: {
    title: 'Gardening Blog - Tips, Guides & Plant Care',
    description:
      'Expert gardening tips, plant care guides, and sustainable gardening practices. Learn how to grow and maintain healthy plants.',
    keywords: 'gardening tips, plant care, organic gardening, gardening guide',
  },
  about: {
    title: 'About Us - Premium Plant Nursery',
    description:
      'Learn about Whole Lot of Nature - your trusted source for premium plants, organic supplies, and expert gardening advice in Bangalore.',
    keywords: 'plant nursery bangalore, organic nursery, about whole lot of nature',
  },
  contact: {
    title: 'Contact Us - Get in Touch',
    description:
      'Have questions? Contact Whole Lot of Nature for plant advice, order support, or general inquiries. We\'re here to help!',
    keywords: 'contact plant nursery, customer support, plant help',
  },
};
