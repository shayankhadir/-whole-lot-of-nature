import { MetadataRoute } from 'next';
import { woocommerceClient as woocommerce } from '@/lib/services/woocommerceService';

type WCProductLite = { slug: string; date_modified?: string };
type WCCategoryLite = { slug: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all products
  const productsResponse = await woocommerce.get('products', {
    per_page: 100,
    status: 'publish',
  });
  const productsRaw: unknown = productsResponse.data;
  const products = Array.isArray(productsRaw) ? (productsRaw as WCProductLite[]) : [];

  // Get all categories
  const categoriesResponse = await woocommerce.get('products/categories', {
    per_page: 100,
    hide_empty: true,
  });
  const categoriesRaw: unknown = categoriesResponse.data;
  const categories = Array.isArray(categoriesRaw) ? (categoriesRaw as WCCategoryLite[]) : [];

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

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