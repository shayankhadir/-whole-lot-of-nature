import { type Metadata } from 'next';
import { WooCommerceProduct, WooCommerceCategory } from './services/woocommerceService';

// Default metadata
export const defaultMetadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: 'Whole Lot of Nature - Premium Eco-Friendly Products',
    template: '%s | Whole Lot of Nature',
  },
  description:
    'Discover our curated collection of sustainable, eco-friendly products for your home and garden.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Whole Lot of Nature',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@wholelotofnature',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Generate product metadata
export function generateProductMetadata(product: WooCommerceProduct): Metadata {
  return {
    title: product.name,
    description: product.short_description?.replace(/(<([^>]+)>)/gi, '') || product.name,
    openGraph: {
      title: product.name,
      description: product.short_description?.replace(/(<([^>]+)>)/gi, '') || product.name,
      images: product.images?.[0]?.src ? [{ url: product.images[0].src }] : [],
      type: 'website',
      ...(product.price && {
        priceAmount: product.price,
        priceCurrency: 'USD',
      }),
    } as any,
  };
}

// Generate category metadata
export function generateCategoryMetadata(category: WooCommerceCategory): Metadata {
  return {
    title: `${category.name} Products`,
    description: `Shop our collection of ${category.name.toLowerCase()} products. ${category.description?.replace(/(<([^>]+)>)/gi, '')}`,
    openGraph: {
      title: `${category.name} Products | Whole Lot of Nature`,
      description: `Shop our collection of ${category.name.toLowerCase()} products. ${category.description?.replace(/(<([^>]+)>)/gi, '')}`,
      type: 'website',
    },
  };
}