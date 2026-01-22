import { Metadata } from 'next';
import { WooCommerceService } from '@/lib/services/woocommerceService';
import ShopClient from './ShopClient';
import { Product, ProductCategory } from '@/types/product';

// ISR: Revalidate every 60 seconds for fresh product data
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Buy Premium Plants Online | Whole Lot of Nature',
  description: 'Shop premium indoor and outdoor plants online. Expert plant care, fast delivery across Bangalore. Soil mixes, pots, and gardening supplies available.',
  openGraph: {
    title: 'Buy Premium Plants Online | Whole Lot of Nature',
    description: 'Shop premium indoor and outdoor plants online. Expert plant care, fast delivery across Bangalore. Soil mixes, pots, and gardening supplies available.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
    url: 'https://wholelotofnature.com/shop',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy Premium Plants Online | Whole Lot of Nature',
    description: 'Shop premium indoor and outdoor plants online. Expert plant care, fast delivery across Bangalore. Soil mixes, pots, and gardening supplies available.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://wholelotofnature.com/shop',
  },
};

// Fetch data on the server with caching
async function getShopData() {
  try {
    // Fetch products and categories in parallel
    const [wcProducts, wcCategories] = await Promise.all([
      WooCommerceService.getProducts(100),
      WooCommerceService.getCategories()
    ]);
    
    // Transform WooCommerceProduct to Product type
    const products: Product[] = wcProducts.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      price: p.price,
      regular_price: p.regular_price,
      sale_price: p.sale_price,
      description: p.description,
      short_description: p.short_description,
      categories: p.categories.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        count: 0,
        parent: 0,
      })),
      images: p.images,
      attributes: p.attributes.map(a => ({
        id: a.id,
        name: a.name,
        options: a.options,
        position: 0,
        visible: true,
        variation: false,
      })),
      variations: p.variations || [],
      in_stock: p.in_stock,
      stock_status: p.stock_status,
      stock_quantity: p.stock_quantity,
      average_rating: p.average_rating,
      rating_count: p.rating_count,
      tags: p.tags,
      date_created: p.date_created,
      featured: p.featured,
    }));
    
    // Transform WooCommerceCategory to ProductCategory
    const categories: ProductCategory[] = wcCategories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      parent: cat.parent,
      count: 1,
      image: cat.image ? { src: cat.image, alt: cat.name } : undefined
    }));
    
    return { products, categories };
  } catch (error) {
    console.error('[Shop] Error fetching data:', error);
    return { products: [], categories: [] };
  }
}

export default async function ShopPage() {
  // Data is fetched on the server and cached via ISR
  const { products, categories } = await getShopData();
  
  return <ShopClient initialProducts={products} initialCategories={categories} />;
}
