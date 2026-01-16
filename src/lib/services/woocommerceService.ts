import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';

// Check if WooCommerce credentials are properly set
const WORDPRESS_URL = process.env.WORDPRESS_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://admin.wholelotofnature.com';
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY || '';
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET || '';

// Log configuration status (always log in production for debugging)
console.log('[WooCommerce Service Init]', {
  url: WORDPRESS_URL,
  hasKey: !!WC_CONSUMER_KEY,
  hasSecret: !!WC_CONSUMER_SECRET,
  nodeEnv: process.env.NODE_ENV,
  timestamp: new Date().toISOString()
});

// Initialize WooCommerce API with REST API v3
const WooCommerce = new WooCommerceRestApi({
  url: WORDPRESS_URL,
  consumerKey: WC_CONSUMER_KEY,
  consumerSecret: WC_CONSUMER_SECRET,
  version: 'wc/v3', // Updated to v3 for Reviews support
  queryStringAuth: true // For https
});

// Export singleton client to unify usage across the codebase
export const woocommerceClient = WooCommerce;

// Check if credentials are missing
const hasValidCredentials = () => {
  return !!WC_CONSUMER_KEY && !!WC_CONSUMER_SECRET;
};

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

export interface WooCommerceCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  billing?: {
    first_name?: string;
    last_name?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    phone?: string;
  };
  shipping?: {
    first_name?: string;
    last_name?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  total_spent?: string;
  orders_count?: number;
  date_created?: string;
}

export interface WooCommerceOrderItem {
  id: number;
  name: string;
  product_id: number;
  quantity: number;
  total: string;
}

export interface WooCommerceOrder {
  id: number;
  status: string;
  total: string;
  currency: string;
  date_created: string;
  payment_method_title?: string;
  line_items: WooCommerceOrderItem[];
  shipping_total?: string;
  shipping_lines?: Array<{ method_title?: string; total?: string }>;
  meta_data?: Array<{ key: string; value: string }>;
}

export interface WooCommerceCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description?: string;
  image?: string;
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

interface WordPressPost {
  id: number;
  title: { rendered: string };
  slug: string;
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
    author?: Array<{ name: string; avatar_urls?: Record<string, string> }>;
  };
  date: string;
  categories?: number[];
  author: number;
  tags?: Array<{ name: string }>;
}

interface WooCommerceReview {
  id: number;
  reviewer: string;
  review: string;
  rating: number;
  date_created: string;
  verified: boolean;
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
  parent?: number;
  description?: string;
  image?: { src?: string };
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
  sku?: string;
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

interface WCRawCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  billing?: {
    first_name?: string;
    last_name?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    phone?: string;
  };
  shipping?: {
    first_name?: string;
    last_name?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  total_spent?: string;
  orders_count?: number;
  date_created?: string;
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
   * Fetch WooCommerce customer by email address
   */
  static async getCustomerByEmail(email: string): Promise<WooCommerceCustomer | null> {
    try {
      const response = await WooCommerce.get('customers', {
        email,
        per_page: 1,
      });

      const raw: unknown = response.data;
      const list = Array.isArray(raw) ? (raw as WooCommerceCustomer[]) : [];
      return list[0] || null;
    } catch (error) {
      console.error(`Error fetching customer for email ${email}:`, error);
      return null;
    }
  }

  /**
   * Fetch recent orders for a WooCommerce customer
   */
  static async getOrdersForCustomer(customerId: number, limit: number = 5): Promise<WooCommerceOrder[]> {
    try {
      const response = await WooCommerce.get('orders', {
        customer: customerId,
        per_page: limit,
        orderby: 'date',
        order: 'desc',
      });

      const raw: unknown = response.data;
      const list = Array.isArray(raw) ? (raw as WooCommerceOrder[]) : [];
      return list;
    } catch (error) {
      console.error(`Error fetching orders for customer ${customerId}:`, error);
      return [];
    }
  }
  /**
   * Get all products from WooCommerce
   */
  static async getProducts(limit?: number): Promise<WooCommerceProduct[]> {
    try {
      // Check credentials first - THIS IS CRITICAL
      if (!WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
        const errorMsg = '[CRITICAL] WooCommerce credentials missing!';
        console.error(errorMsg, {
          hasKey: !!WC_CONSUMER_KEY,
          hasSecret: !!WC_CONSUMER_SECRET,
          url: WORDPRESS_URL,
          env: process.env.NODE_ENV
        });
        throw new Error(errorMsg);
      }

      console.log('[WooCommerce] Attempting to fetch products...', {
        url: WORDPRESS_URL,
        hasKey: !!WC_CONSUMER_KEY,
        hasSecret: !!WC_CONSUMER_SECRET,
        per_page: limit || 100
      });
      
      const response = await WooCommerce.get('products', {
        per_page: limit || 100,
        status: 'publish',
        stock_status: 'instock'
      });

      const raw: unknown = response.data;
      const list = Array.isArray(raw) ? (raw as WCRawProduct[]) : [];
      console.log(`[WooCommerce SUCCESS] Fetched ${list.length} products`);
      
      return list.map(this.transformWooCommerceProduct);
    } catch (error: unknown) {
      const e = error as { response?: { status?: number; data?: unknown }; request?: unknown; message?: string };
      
      console.error('[WooCommerce ERROR] Product fetch failed:', {
        message: e.message,
        status: e.response?.status,
        hasRequest: !!e.request,
        credentialsSet: !!(WC_CONSUMER_KEY && WC_CONSUMER_SECRET),
        url: WORDPRESS_URL
      });

      if (e.response?.status === 401) {
        console.error('[WooCommerce AUTH ERROR] 401 - Invalid credentials. Check WC_CONSUMER_KEY and WC_CONSUMER_SECRET in Vercel environment variables');
      }
      
      throw error;
    }
  }

  /**
   * Get single product by slug
   */
  static async getProductBySlug(slug: string): Promise<WooCommerceProduct | null> {
    try {
      // Check credentials first
      if (!hasValidCredentials()) {
        console.warn(`[WooCommerce] Missing credentials - cannot fetch product by slug: ${slug}`);
        return null;
      }

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
      const e = error as { response?: { status?: number }; message?: string };
      if (e.response?.status === 401) {
        console.error('[WooCommerce] Authentication failed - check WC_CONSUMER_KEY and WC_CONSUMER_SECRET');
      }
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
   * Get products by tag
   */
  static async getProductsByTag(tagSlug: string, limit?: number): Promise<WooCommerceProduct[]> {
    try {
      // First get tag ID by slug
      const tagResponse = await WooCommerce.get('products/tags', {
        slug: tagSlug
      });
      
      const tagRaw: unknown = tagResponse.data;
      const tagList = Array.isArray(tagRaw) ? (tagRaw as WCRawTag[]) : [];
      if (tagList.length === 0) {
        return [];
      }
      const tagId = tagList[0].id;
      
      const response = await WooCommerce.get('products', {
        tag: tagId,
        per_page: limit || 20,
        status: 'publish'
      });

      const raw: unknown = response.data;
      const list = Array.isArray(raw) ? (raw as WCRawProduct[]) : [];
      return list.map(this.transformWooCommerceProduct);
    } catch (error) {
      console.error(`Error fetching products for tag ${tagSlug}:`, error);
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
  static async getCategories(): Promise<WooCommerceCategory[]> {
    try {
      const response = await WooCommerce.get('products/categories', {
        per_page: 50,
        hide_empty: true
      });

      const raw: unknown = response.data;
      const list = Array.isArray(raw) ? (raw as WCRawCategory[]) : [];
      return list.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        parent: typeof category.parent === 'number' ? category.parent : 0,
        description: category.description,
        image: category.image?.src,
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
      const response = await fetch(`${process.env.WORDPRESS_URL}/wp-json/wp/v2/posts?_embed&per_page=${limit}&page=${page}&status=publish`);

      if (!response.ok) {
        console.error('Error fetching blog posts:', response.statusText);
        return [];
      }

      const posts = await response.json();
      return posts.map((post: WordPressPost) => ({
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
        `${process.env.WORDPRESS_URL}/wp-json/wp/v2/posts?_embed&slug=${slug}&status=publish`
      );

      if (!response.ok) return null;

      const posts = await response.json();
      if (posts.length === 0) return null;

      const post = posts[0] as WordPressPost;
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
        tags: post.tags?.map((t) => t.name) || []
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
        `${process.env.WORDPRESS_URL}/wp-json/wp/v2/posts?_embed&categories=${categoryId}&per_page=${limit}&status=publish`
      );

      if (!response.ok) return [];

      const posts = await response.json();
      return posts.map((post: WordPressPost) => ({
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
        tags: post.tags?.map((t) => t.name) || []
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
      
      return reviews.map((review: WooCommerceReview) => ({
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
   * Create a WooCommerce order
   */
  static async createOrder(orderData: any): Promise<WooCommerceOrder | null> {
    try {
      const response = await WooCommerce.post('orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating WooCommerce order:', error);
      throw error;
    }
  }

  /**
   * Get order by ID
   */
  static async getOrder(orderId: number): Promise<WooCommerceOrder | null> {
    try {
      const response = await WooCommerce.get(`orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      return null;
    }
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(orderId: number, status: string, transactionId?: string): Promise<WooCommerceOrder | null> {
    try {
      const data: any = { status };
      if (transactionId) {
        data.transaction_id = transactionId;
      }
      const response = await WooCommerce.put(`orders/${orderId}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating order ${orderId}:`, error);
      return null;
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

