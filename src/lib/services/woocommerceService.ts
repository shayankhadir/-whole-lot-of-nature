import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';

// Initialize WooCommerce API with Legacy API (v2)
const WooCommerce = new WooCommerceRestApi({
  url: process.env.WORDPRESS_URL || 'https://wholelotofnature.com',
  consumerKey: process.env.WC_CONSUMER_KEY || '',
  consumerSecret: process.env.WC_CONSUMER_SECRET || '',
  version: 'wc/v2', // Changed to Legacy API
  queryStringAuth: true // For https
});

// Export singleton client to unify usage across the codebase
export const woocommerceClient = WooCommerce;

export interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  sku?: string;
  price: string;
  regular_price: string;
  sale_price: string;
  description: string;
  short_description: string;
  images: Array<{
    id: number;
    src: string;
    alt: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  attributes: Array<{
    id: number;
    name: string;
    options: string[];
  }>;
  in_stock: boolean;
  stock_quantity: number;
  featured: boolean;
  average_rating?: number;
  rating_count?: number;
  tags?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  date_created?: string;
  variations?: number[];
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  date: string;
  categories: number[];
  category_id?: number;
  author: number;
  author_name?: string;
  author_avatar?: string;
  reading_time?: number;
  tags?: string[];
}

// Raw WooCommerce API types (subset we use)
interface WCRawImage {
  id: number;
  src: string;
  alt?: string;
}

interface WCRawCategory {
  id: number;
  name: string;
  slug: string;
}

interface WCRawAttribute {
  id: number;
  name: string;
  options: string[];
}

interface WCRawTag {
  id: number;
  name: string;
  slug: string;
}

interface WCRawProduct {
  id: number;
  name: string;
  slug: string;
  price?: string | number;
  regular_price?: string | number;
  sale_price?: string | number | null;
  description: string;
  short_description: string;
  images?: WCRawImage[];
  categories?: WCRawCategory[];
  attributes?: WCRawAttribute[];
  stock_status?: 'instock' | 'outofstock' | 'onbackorder';
  stock_quantity?: number | null;
  featured: boolean;
  average_rating?: string | number;
  rating_count?: number;
  tags?: WCRawTag[];
  date_created?: string;
  variations?: number[];
}

export class WooCommerceService {
  /**
   * Get single product by ID
   */
  static async getProductById(id: number): Promise<WooCommerceProduct | null> {
    try {
      const response = await WooCommerce.get(`products/${id}`);
      return this.transformWooCommerceProduct(response.data);
    } catch (error) {
      console.error(`Error fetching product by id ${id}:`, error);
      return null;
    }
  }
  /**
   * Get all products from WooCommerce
   */
  static async getProducts(limit?: number): Promise<WooCommerceProduct[]> {
    try {
      console.log('Attempting to fetch products from WooCommerce API...');
      
      const response = await WooCommerce.get('products', {
        per_page: limit || 100, // Changed from 20 to 100 to fetch more products
        status: 'publish',
        stock_status: 'instock'
      });

      const raw: unknown = response.data;
      const list = Array.isArray(raw) ? (raw as WCRawProduct[]) : [];
      console.log(`Successfully fetched ${list.length} products from WooCommerce`);
      
      return list.map(this.transformWooCommerceProduct);
    } catch (error: unknown) {
      console.error('Error fetching WooCommerce products:', error);
      
      // Check if it's a connection error or API error
      const e = error as { response?: { status?: number; data?: unknown }; request?: unknown; message?: string };
      if (e.response) {
        console.error('WooCommerce API Error:', e.response.status, e.response.data);
      } else if (e.request) {
        console.error('WooCommerce Connection Error:', e.message);
      }
      // Return sample products as fallback
      return this.getSampleProducts();
    }
  }

  /**
   * Get single product by slug
   */
  static async getProductBySlug(slug: string): Promise<WooCommerceProduct | null> {
    try {
      const response = await WooCommerce.get('products', {
        slug: slug,
        per_page: 1
      });
      
      const raw: unknown = response.data;
      const list = Array.isArray(raw) ? (raw as WCRawProduct[]) : [];
      if (list.length > 0) {
        return this.transformWooCommerceProduct(list[0]);
      }
      return null;
    } catch (error) {
      console.error(`Error fetching product by slug ${slug}:`, error);
      return null;
    }
  }

  /**
   * Get products by category
   */
  static async getProductsByCategory(categorySlug: string, limit?: number): Promise<WooCommerceProduct[]> {
    try {
      // First get category ID by slug
      const categoryResponse = await WooCommerce.get('products/categories', {
        slug: categorySlug
      });
      
      const catRaw: unknown = categoryResponse.data;
      const catList = Array.isArray(catRaw) ? (catRaw as WCRawCategory[]) : [];
      if (catList.length === 0) {
        return [];
      }
      const categoryId = catList[0].id;
      
      const response = await WooCommerce.get('products', {
        category: categoryId,
        per_page: limit || 20,
        status: 'publish'
      });

      const raw: unknown = response.data;
      const list = Array.isArray(raw) ? (raw as WCRawProduct[]) : [];
      return list.map(this.transformWooCommerceProduct);
    } catch (error) {
      console.error(`Error fetching products for category ${categorySlug}:`, error);
      return [];
    }
  }

  /**
   * Search products
   */
  static async searchProducts(searchTerm: string, limit?: number): Promise<WooCommerceProduct[]> {
    try {
      const response = await WooCommerce.get('products', {
        search: searchTerm,
        per_page: limit || 20,
        status: 'publish'
      });

      const raw: unknown = response.data;
      const list = Array.isArray(raw) ? (raw as WCRawProduct[]) : [];
      return list.map(this.transformWooCommerceProduct);
    } catch (error) {
      console.error(`Error searching products for "${searchTerm}":`, error);
      return [];
    }
  }

  /**
   * Get product categories
   */
  static async getCategories(): Promise<Array<{id: number, name: string, slug: string, description?: string, image?: string}>> {
    try {
      const response = await WooCommerce.get('products/categories', {
        per_page: 50,
        hide_empty: true
      });

      const raw: unknown = response.data;
      const list = Array.isArray(raw) ? (raw as WCRawCategory[]) : [];
      return list.map((category: any) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image?.src
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  /**
   * Get blog posts (from WordPress)
   */
  static async getBlogPosts(limit: number = 10, page: number = 1): Promise<Array<{
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_media?: string;
    date: string;
    categories: number[];
    author: number;
  }>> {
    try {
      const response = await fetch(`${process.env.WORDPRESS_URL}/wp-json/wp/v2/posts?_embed&per_page=${limit}&page=${page}&status=publish`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64')}`
        }
      });

      if (!response.ok) {
        console.error('Error fetching blog posts:', response.statusText);
        return [];
      }

      const posts = await response.json();
      return posts.map((post: any) => ({
        id: post.id,
        title: post.title.rendered,
        slug: post.slug,
        excerpt: post.excerpt.rendered.replace(/<[^>]*>/g, ''),
        content: post.content.rendered,
        featured_media: post._embedded?.['wp:featuredmedia']?.[0]?.source_url,
        date: post.date,
        categories: post.categories || [],
        author: post.author
      }));
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
  }

  /**
   * Get single blog post by slug
   */
  static async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const response = await fetch(
        `${process.env.WORDPRESS_URL}/wp-json/wp/v2/posts?_embed&slug=${slug}&status=publish`,
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64')}`
          }
        }
      );

      if (!response.ok) return null;

      const posts = await response.json();
      if (posts.length === 0) return null;

      const post = posts[0];
      return {
        id: post.id,
        title: post.title.rendered,
        slug: post.slug,
        excerpt: post.excerpt.rendered.replace(/<[^>]*>/g, ''),
        content: post.content.rendered,
        featured_image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url,
        date: post.date,
        categories: post.categories || [],
        category_id: post.categories?.[0],
        author: post.author,
        author_name: post._embedded?.author?.[0]?.name,
        author_avatar: post._embedded?.author?.[0]?.avatar_urls?.['48'],
        tags: post.tags?.map((t: any) => t.name) || []
      };
    } catch (error) {
      console.error(`Error fetching blog post ${slug}:`, error);
      return null;
    }
  }

  /**
   * Get blog posts by category
   */
  static async getBlogPostsByCategory(categoryId: number, limit: number = 10): Promise<BlogPost[]> {
    try {
      const response = await fetch(
        `${process.env.WORDPRESS_URL}/wp-json/wp/v2/posts?_embed&categories=${categoryId}&per_page=${limit}&status=publish`,
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64')}`
          }
        }
      );

      if (!response.ok) return [];

      const posts = await response.json();
      return posts.map((post: any) => ({
        id: post.id,
        title: post.title.rendered,
        slug: post.slug,
        excerpt: post.excerpt.rendered.replace(/<[^>]*>/g, ''),
        content: post.content.rendered,
        featured_image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url,
        date: post.date,
        categories: post.categories || [],
        category_id: categoryId,
        author: post.author,
        author_name: post._embedded?.author?.[0]?.name,
        author_avatar: post._embedded?.author?.[0]?.avatar_urls?.['48'],
        tags: post.tags?.map((t: any) => t.name) || []
      }));
    } catch (error) {
      console.error(`Error fetching blog posts for category ${categoryId}:`, error);
      return [];
    }
  }

  /**
   * Get product reviews/testimonials
   */
  static async getProductReviews(productId: number, limit: number = 5): Promise<Array<{
    id: number;
    author: string;
    review: string;
    rating: number;
    date: string;
    verified: boolean;
  }>> {
    try {
      const response = await WooCommerce.get(`products/${productId}/reviews`, {
        per_page: limit,
        status: 'approved'
      });

      const raw: unknown = response.data;
      const reviews = Array.isArray(raw) ? raw : [];
      
      return reviews.map((review: any) => ({
        id: review.id,
        author: review.reviewer,
        review: review.review,
        rating: review.rating,
        date: review.date_created,
        verified: review.verified
      }));
    } catch (error) {
      console.error(`Error fetching reviews for product ${productId}:`, error);
      return [];
    }
  }

  /**
   * Get featured products
   */
  static async getFeaturedProducts(limit: number = 8): Promise<WooCommerceProduct[]> {
    try {
      const response = await WooCommerce.get('products', {
        featured: true,
        per_page: limit,
        status: 'publish',
        stock_status: 'instock'
      });

      const raw: unknown = response.data;
      const list = Array.isArray(raw) ? (raw as WCRawProduct[]) : [];
      return list.map(this.transformWooCommerceProduct);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  }

  /**
   * Get related products
   */
  static async getRelatedProducts(productId: number, limit: number = 4): Promise<WooCommerceProduct[]> {
    try {
      const product = await this.getProductById(productId);
      if (!product || product.categories.length === 0) return [];

      const categoryId = product.categories[0].id;
      const response = await WooCommerce.get('products', {
        category: categoryId,
        per_page: limit + 1, // +1 because we'll exclude the current product
        status: 'publish',
        exclude: productId
      });

      const raw: unknown = response.data;
      const list = Array.isArray(raw) ? (raw as WCRawProduct[]) : [];
      return list.slice(0, limit).map(this.transformWooCommerceProduct);
    } catch (error) {
      console.error(`Error fetching related products for ${productId}:`, error);
      return [];
    }
  }

  /**
   * Get WooCommerce customers for CRM/email intelligence tools
   */
  static async getCustomers(limit: number = 50): Promise<WooCommerceCustomer[]> {
    try {
      const response = await WooCommerce.get('customers', {
        per_page: limit,
        orderby: 'date',
        order: 'desc',
      });

      const raw: unknown = response.data;
      const list = Array.isArray(raw) ? (raw as WCRawCustomer[]) : [];
      return list.map((customer) => ({
        id: customer.id,
        email: customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name,
        orders_count: customer.orders_count,
        total_spent: customer.total_spent,
        date_created: customer.date_created,
        billing: customer.billing,
      }));
    } catch (error) {
      console.error('Error fetching WooCommerce customers:', error);
      return [];
    }
  }

  /**
   * Transform WooCommerce product to our format
   */
  private static transformWooCommerceProduct(product: WCRawProduct): WooCommerceProduct {
    const images = Array.isArray(product.images) ? product.images : [];
    const categories = Array.isArray(product.categories) ? product.categories : [];
    const attributes = Array.isArray(product.attributes) ? product.attributes : [];
    const tags = Array.isArray(product.tags) ? product.tags : [];

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      // Keep raw numeric strings; formatting handled in UI utils
      price: product.price?.toString() || '0',
      regular_price: product.regular_price?.toString() || '0',
      sale_price: product.sale_price ? product.sale_price.toString() : '',
      description: product.description || '',
      short_description: product.short_description || '',
      images: images.map((img: WCRawImage) => ({
        id: img.id,
        src: img.src,
        alt: img.alt || product.name
      })),
      categories: categories.map((cat: WCRawCategory) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug
      })),
      attributes: attributes.map((attr: WCRawAttribute) => ({
        id: attr.id,
        name: attr.name,
        options: attr.options
      })),
      // Default to in_stock if status is missing or ambiguous to prevent "Out of Stock" errors
      // when inventory management is disabled or not yet set up in WordPress.
      in_stock: product.stock_status === 'instock' || product.stock_status === 'onbackorder' || !product.stock_status,
      stock_quantity: typeof product.stock_quantity === 'number' ? product.stock_quantity : 100,
      featured: product.featured,
      average_rating: product.average_rating ? parseFloat(String(product.average_rating)) : undefined,
      rating_count: product.rating_count || 0,
      tags: tags.map((t: WCRawTag) => ({ id: t.id, name: t.name, slug: t.slug })),
      date_created: product.date_created,
      variations: Array.isArray(product.variations) ? product.variations : []
    };
  }

  /**
   * Sample products fallback
   */
  private static getSampleProducts(): WooCommerceProduct[] {
    // Remove placeholder content; return empty to avoid showing non-owner products
    return [];
  }

  /**
   * Test WooCommerce connection
   */
  static async testConnection(): Promise<{ success: boolean; message: string; data?: unknown }> {
    try {
      console.log('Testing WooCommerce connection...');
      console.log('URL:', process.env.WORDPRESS_URL);
      console.log('Consumer Key:', process.env.WC_CONSUMER_KEY ? '***' + process.env.WC_CONSUMER_KEY.slice(-4) : 'NOT SET');

      const response = await WooCommerce.get('');

      return {
        success: true,
        message: 'WooCommerce connection successful',
        data: response.data
      };
    } catch (error: unknown) {
      console.error('WooCommerce connection test failed:', error);

      return {
        success: false,
        message: `Connection failed: ${(error as Error).message}`,
        data: (error as { response?: { data?: unknown } })?.response?.data
      };
    }
  }
}

