import { Metadata } from 'next';
import { woocommerceClient } from '@/lib/services/woocommerceService';

interface Props {
  params: { slug: string };
  children: React.ReactNode;
}

// Fetch product data for SEO
async function getProduct(slug: string) {
  try {
    const response = await woocommerceClient.get('products', {
      slug,
      per_page: 1,
    });
    const products = response.data as any[];
    return products[0] || null;
  } catch (error) {
    console.error('Failed to fetch product for metadata:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wholelotofnature.com';
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: 'Product Not Found | Whole Lot of Nature',
      description: 'The product you are looking for could not be found.',
    };
  }

  // Clean description - remove HTML tags
  const cleanDescription = product.short_description
    ? product.short_description.replace(/<[^>]+>/g, '').slice(0, 160)
    : product.description
      ? product.description.replace(/<[^>]+>/g, '').slice(0, 160)
      : `Buy ${product.name} online at Whole Lot of Nature. Premium quality, fast delivery across India.`;

  const productImage = product.images?.[0]?.src || `${baseUrl}/og-cover.jpg`;
  const productUrl = `${baseUrl}/shop/${params.slug}`;
  const price = product.price ? parseFloat(product.price) : 0;
  const regularPrice = product.regular_price ? parseFloat(product.regular_price) : price;

  return {
    title: `${product.name} | Buy Online | Whole Lot of Nature`,
    description: cleanDescription,
    keywords: [
      product.name,
      ...((product.categories || []).map((c: any) => c.name)),
      ...((product.tags || []).map((t: any) => t.name)),
      'buy plants online',
      'Bangalore',
      'India',
    ].filter(Boolean).join(', '),
    openGraph: {
      type: 'website',
      url: productUrl,
      title: `${product.name} | Whole Lot of Nature`,
      description: cleanDescription,
      siteName: 'Whole Lot of Nature',
      images: [
        {
          url: productImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@wholelotofnature',
      creator: '@wholelotofnature',
      title: `${product.name} | Whole Lot of Nature`,
      description: cleanDescription,
      images: [productImage],
    },
    alternates: {
      canonical: productUrl,
    },
    other: {
      // Product structured data hints for search engines
      'product:price:amount': String(price),
      'product:price:currency': 'INR',
      'product:availability': product.stock_status === 'instock' ? 'in stock' : 'out of stock',
    },
  };
}

export default function ProductLayout({ children }: Props) {
  return <>{children}</>;
}
