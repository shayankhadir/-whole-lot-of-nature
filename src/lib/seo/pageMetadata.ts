import type { Metadata } from 'next';

const SITE_URL = 'https://wholelotofnature.com';

interface PageMetaInput {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  robots?: Metadata['robots'];
}

export function buildPageMetadata({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  robots,
}: PageMetaInput): Metadata {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const absoluteUrl = `${SITE_URL}${normalizedPath === '/' ? '' : normalizedPath}`;

  return {
    title,
    description,
    alternates: {
      canonical: normalizedPath,
    },
    openGraph: {
      title,
      description,
      type,
      url: absoluteUrl,
      siteName: 'Whole Lot of Nature',
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image
        ? [
            {
              url: image,
              alt: title,
            },
          ]
        : undefined,
    },
    robots,
  };
}
