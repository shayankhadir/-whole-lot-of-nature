import { MetadataRoute } from 'next';
import { woocommerceClient as woocommerce } from '@/lib/services/woocommerceService';

type WCProductLite = { slug: string; date_modified?: string };
type WCCategoryLite = { slug: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wholelotofnature.com';
  
  let products: WCProductLite[] = [];
  let categories: WCCategoryLite[] = [];

  // Fetch products with error handling
  try {
    const productsResponse = await woocommerce.get('products', {
      per_page: 100,
      status: 'publish',
    });
    const productsRaw: unknown = productsResponse.data;
    products = Array.isArray(productsRaw) ? (productsRaw as WCProductLite[]) : [];
  } catch (error) {
    console.error('Sitemap: Failed to fetch products', error);
  }

  // Fetch categories with error handling
  try {
    const categoriesResponse = await woocommerce.get('products/categories', {
      per_page: 100,
      hide_empty: true,
    });
    const categoriesRaw: unknown = categoriesResponse.data;
    categories = Array.isArray(categoriesRaw) ? (categoriesRaw as WCCategoryLite[]) : [];
  } catch (error) {
    console.error('Sitemap: Failed to fetch categories', error);
  }

  // Static routes
  const routes = [
    '',
    '/shop',
    '/about',
    '/contact',
    '/cart',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }));

  // Product routes
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/shop/${product.slug}`,
    lastModified: product.date_modified ? new Date(product.date_modified) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Category routes
  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/shop/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...productRoutes, ...categoryRoutes];
}