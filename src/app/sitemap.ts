import { MetadataRoute } from 'next';
import { woocommerceClient as woocommerce } from '@/lib/services/woocommerceService';
import { SEO_PAGES } from '@/lib/seo/seoPages';

type WCProductLite = { slug: string; date_modified?: string };
type WCCategoryLite = { slug: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wholelotofnature.com';
  
  // Static routes - always include these
  const routes = [
    '',
    '/shop',
    '/about',
    '/contact',
    '/cart',
    '/blog',
    '/seo-pages',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }));

  const seoPageRoutes: MetadataRoute.Sitemap = SEO_PAGES.map((p) => ({
    url: `${baseUrl}/seo-pages/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  let categoryRoutes: MetadataRoute.Sitemap = [];

  try {
    // Get all products
    const productsResponse = await woocommerce.get('products', {
      per_page: 100,
      status: 'publish',
    });
    const productsRaw: unknown = productsResponse.data;
    const products = Array.isArray(productsRaw) ? (productsRaw as WCProductLite[]) : [];

    // Product routes
    productRoutes = products.map((product) => ({
      url: `${baseUrl}/shop/${product.slug}`,
      lastModified: product.date_modified ? new Date(product.date_modified) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Sitemap: Failed to fetch products', error);
  }

  try {
    // Get all categories
    const categoriesResponse = await woocommerce.get('products/categories', {
      per_page: 100,
      hide_empty: true,
    });
    const categoriesRaw: unknown = categoriesResponse.data;
    const categories = Array.isArray(categoriesRaw) ? (categoriesRaw as WCCategoryLite[]) : [];

    // Category routes
    categoryRoutes = categories.map((category) => ({
      url: `${baseUrl}/shop/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Sitemap: Failed to fetch categories', error);
  }

  return [...routes, ...seoPageRoutes, ...productRoutes, ...categoryRoutes];
}