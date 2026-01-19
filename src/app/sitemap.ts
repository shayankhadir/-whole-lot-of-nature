import { MetadataRoute } from 'next';
import { woocommerceClient as woocommerce } from '@/lib/services/woocommerceService';
import { SEO_PAGES } from '@/lib/seo/seoPages';
import { getPosts } from '@/lib/api/wordpress';

type WCProductLite = { slug: string; date_modified?: string };
type WCCategoryLite = { slug: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wholelotofnature.com';
  
  // Static routes - always include these
  const routes = [
    { path: '', priority: 1.0, changeFreq: 'daily' as const },
    { path: '/shop', priority: 0.9, changeFreq: 'daily' as const },
    { path: '/about', priority: 0.7, changeFreq: 'monthly' as const },
    { path: '/contact', priority: 0.7, changeFreq: 'monthly' as const },
    { path: '/blog', priority: 0.8, changeFreq: 'daily' as const },
    { path: '/services', priority: 0.7, changeFreq: 'monthly' as const },
    { path: '/faq', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/cart', priority: 0.5, changeFreq: 'weekly' as const },
    { path: '/wishlist', priority: 0.5, changeFreq: 'weekly' as const },
    { path: '/login', priority: 0.4, changeFreq: 'monthly' as const },
    { path: '/signup', priority: 0.4, changeFreq: 'monthly' as const },
    { path: '/privacy-policy', priority: 0.3, changeFreq: 'yearly' as const },
    { path: '/terms-and-conditions', priority: 0.3, changeFreq: 'yearly' as const },
    { path: '/refund-policy', priority: 0.3, changeFreq: 'yearly' as const },
    { path: '/shipping-policy', priority: 0.3, changeFreq: 'yearly' as const },
  ].map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFreq,
    priority: route.priority,
  }));

  const seoPageRoutes: MetadataRoute.Sitemap = SEO_PAGES.map((p) => ({
    url: `${baseUrl}/seo-pages/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  let categoryRoutes: MetadataRoute.Sitemap = [];
  let blogRoutes: MetadataRoute.Sitemap = [];

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

  // Fetch blog posts
  try {
    const posts = await getPosts({ per_page: 50 });
    blogRoutes = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.modified ? new Date(post.modified) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Sitemap: Failed to fetch blog posts', error);
  }

  return [...routes, ...seoPageRoutes, ...productRoutes, ...categoryRoutes, ...blogRoutes];
}