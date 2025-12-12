// Deprecated: prefer using methods from '@/lib/services/woocommerceService'
// Keeping type exports/function names for backward compatibility where needed.
const WC_URL = process.env.WORDPRESS_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://wholelotofnature.com';
const WC_KEY = process.env.WC_CONSUMER_KEY || '';
const WC_SECRET = process.env.WC_CONSUMER_SECRET || '';

export interface Product {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  type: 'simple' | 'grouped' | 'external' | 'variable';
  status: 'draft' | 'pending' | 'private' | 'publish';
  featured: boolean;
  catalog_visibility: 'visible' | 'catalog' | 'search' | 'hidden';
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  date_on_sale_from: string | null;
  date_on_sale_from_gmt: string | null;
  date_on_sale_to: string | null;
  date_on_sale_to_gmt: string | null;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  virtual: boolean;
  downloadable: boolean;
  downloads: unknown[];
  download_limit: number;
  download_expiry: number;
  external_url: string;
  button_text: string;
  tax_status: 'taxable' | 'shipping' | 'none';
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: number | null;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  backorders: 'no' | 'notify' | 'yes';
  backorders_allowed: boolean;
  backordered: boolean;
  sold_individually: boolean;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  shipping_required: boolean;
  shipping_taxable: boolean;
  shipping_class: string;
  shipping_class_id: number;
  reviews_allowed: boolean;
  average_rating: string;
  rating_count: number;
  related_ids: number[];
  upsell_ids: number[];
  cross_sell_ids: number[];
  parent_id: number;
  purchase_note: string;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  images: Array<{
    id: number;
    date_created: string;
    date_created_gmt: string;
    date_modified: string;
    date_modified_gmt: string;
    src: string;
    name: string;
    alt: string;
  }>;
  attributes: Array<{
    id: number;
    name: string;
    position: number;
    visible: boolean;
    variation: boolean;
    options: string[];
  }>;
  default_attributes: unknown[];
  variations: number[];
  grouped_products: number[];
  menu_order: number;
  meta_data: Array<{
    id: number;
    key: string;
    value: unknown;
  }>;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  display: 'default' | 'products' | 'subcategories' | 'both';
  image: {
    id: number;
    date_created: string;
    date_created_gmt: string;
    date_modified: string;
    date_modified_gmt: string;
    src: string;
    name: string;
    alt: string;
  } | null;
  menu_order: number;
  count: number;
}

export interface Order {
  id: number;
  parent_id: number;
  number: string;
  order_key: string;
  created_via: string;
  version: string;
  status: string;
  currency: string;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  discount_total: string;
  discount_tax: string;
  shipping_total: string;
  shipping_tax: string;
  cart_tax: string;
  total: string;
  total_tax: string;
  prices_include_tax: boolean;
  customer_id: number;
  customer_ip_address: string;
  customer_user_agent: string;
  customer_note: string;
  billing: Record<string, unknown>;
  shipping: Record<string, unknown>;
  payment_method: string;
  payment_method_title: string;
  transaction_id: string;
  date_paid: string | null;
  date_paid_gmt: string | null;
  date_completed: string | null;
  date_completed_gmt: string | null;
  cart_hash: string;
  meta_data: Array<{ id: number; key: string; value: unknown }>;
  line_items: unknown[];
  tax_lines: unknown[];
  shipping_lines: unknown[];
  fee_lines: unknown[];
  coupon_lines: unknown[];
  refunds: unknown[];
}

/**
 * Build authenticated WooCommerce URL
 */
function buildAuthenticatedURL(endpoint: string, params: Record<string, string | number | boolean> = {}): string {
  const url = `${WC_URL}/wp-json/wc/v3${endpoint}`;
  
  const authParams: Record<string, string> = {
    consumer_key: WC_KEY,
    consumer_secret: WC_SECRET,
  };

  // Add additional params
  const allParams = { ...authParams, ...params };

  const queryString = Object.keys(allParams)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(String(allParams[key]))}`)
    .join('&');

  return `${url}?${queryString}`;
}

/**
 * Fetch products from WooCommerce
 */
export async function getProducts(params: {
  per_page?: number;
  page?: number;
  search?: string;
  category?: string;
  tag?: string;
  featured?: boolean;
  on_sale?: boolean;
  min_price?: string;
  max_price?: string;
  stock_status?: 'instock' | 'outofstock' | 'onbackorder';
  orderby?: 'date' | 'id' | 'include' | 'title' | 'slug' | 'price' | 'popularity' | 'rating';
  order?: 'asc' | 'desc';
  status?: 'any' | 'draft' | 'pending' | 'private' | 'publish';
} = {}): Promise<Product[]> {
  try {
    const queryParams: Record<string, string | number | boolean> = {
      per_page: params.per_page || 10,
      page: params.page || 1,
      status: params.status || 'publish',
    };

    // Add optional parameters
    if (params.search) queryParams.search = params.search;
    if (params.category) queryParams.category = params.category;
    if (params.tag) queryParams.tag = params.tag;
    if (params.featured !== undefined) queryParams.featured = params.featured;
    if (params.on_sale !== undefined) queryParams.on_sale = params.on_sale;
    if (params.min_price) queryParams.min_price = params.min_price;
    if (params.max_price) queryParams.max_price = params.max_price;
    if (params.stock_status) queryParams.stock_status = params.stock_status;
    if (params.orderby) queryParams.orderby = params.orderby;
    if (params.order) queryParams.order = params.order;

    const url = buildAuthenticatedURL('/products', queryParams);
    
    console.log('Fetching products from WooCommerce:', WC_URL);

    const res = await fetch(url, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch products:', res.status, res.statusText);
      const errorText = await res.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }

    const products = await res.json();
    console.log(`Successfully fetched ${products.length} products from WooCommerce`);
    
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Fetch a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { WooCommerceService } = await import('@/lib/services/woocommerceService');
  return WooCommerceService.getProductBySlug(slug) as unknown as Product | null;
}

/**
 * Fetch a single product by ID
 */
export async function getProductById(id: number): Promise<Product | null> {
  const { WooCommerceService } = await import('@/lib/services/woocommerceService');
  return WooCommerceService.getProductById(id) as unknown as Product | null;
}

/**
 * Fetch product categories
 */
export async function getCategories(params: {
  per_page?: number;
  page?: number;
  parent?: number;
  hide_empty?: boolean;
  orderby?: 'id' | 'include' | 'name' | 'slug' | 'count';
  order?: 'asc' | 'desc';
} = {}): Promise<Category[]> {
  try {
    const queryParams: Record<string, string | number | boolean> = {
      per_page: params.per_page || 100,
      page: params.page || 1,
      hide_empty: params.hide_empty !== false,
    };

    if (params.parent !== undefined) queryParams.parent = params.parent;
    if (params.orderby) queryParams.orderby = params.orderby;
    if (params.order) queryParams.order = params.order;

    const url = buildAuthenticatedURL('/products/categories', queryParams);
    
    console.log('Fetching categories from WooCommerce');

    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Categories change less often - revalidate every hour
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch categories:', res.status, res.statusText);
      throw new Error(`Failed to fetch categories: ${res.statusText}`);
    }

    const categories = await res.json();
    console.log(`Successfully fetched ${categories.length} categories`);
    
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const url = buildAuthenticatedURL('/products/categories', { slug });
    
    console.log('Fetching category by slug:', slug);

    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch category:', res.status, res.statusText);
      return null;
    }

    const categories = await res.json();
    return categories[0] || null;
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return null;
  }
}

/**
 * Fetch featured products
 */
export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  return getProducts({
    per_page: limit,
    featured: true,
    orderby: 'date',
    order: 'desc',
  });
}

/**
 * Fetch products on sale
 */
export async function getOnSaleProducts(limit: number = 8): Promise<Product[]> {
  return getProducts({
    per_page: limit,
    on_sale: true,
    orderby: 'date',
    order: 'desc',
  });
}

/**
 * Search products
 */
export async function searchProducts(query: string, limit: number = 20): Promise<Product[]> {
  return getProducts({
    per_page: limit,
    search: query,
    orderby: 'date',
  });
}

/**
 * Get products by category
 */
export async function getProductsByCategory(categoryId: number, limit: number = 10): Promise<Product[]> {
  return getProducts({
    per_page: limit,
    category: categoryId.toString(),
  });
}

/**
 * Get related products
 */
export async function getRelatedProducts(productId: number, limit: number = 4): Promise<Product[]> {
  try {
    // First get the product to find its related IDs
    const product = await getProductById(productId);
    
    if (!product || !product.related_ids || product.related_ids.length === 0) {
      console.log('No related products found');
      return [];
    }

    // Fetch related products by IDs
    const relatedIds = product.related_ids.slice(0, limit);
    const url = buildAuthenticatedURL('/products', {
      include: relatedIds.join(','),
      per_page: limit,
    });

    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch related products');
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

/**
 * Create an order
 */
export async function createOrder(orderData: Record<string, unknown>): Promise<Order | null> {
  try {
    const url = buildAuthenticatedURL('/orders');
    
    console.log('Creating order...');

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!res.ok) {
      console.error('Failed to create order:', res.status, res.statusText);
      const errorText = await res.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to create order: ${res.statusText}`);
    }

    const order = await res.json();
    console.log('Successfully created order:', order.id);
    
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
}

/**
 * Test WooCommerce REST API connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    console.log('Testing WooCommerce REST API connection...');
    console.log('WooCommerce URL:', WC_URL);
    console.log('Consumer Key:', WC_KEY ? `${WC_KEY.substring(0, 10)}...` : 'Not set');
    
    const url = buildAuthenticatedURL('/products', { per_page: 1 });
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      const products = await res.json();
      console.log('WooCommerce REST API is working');
      console.log(`Found ${products.length} product(s)`);
      return true;
    } else {
      console.error('WooCommerce REST API connection failed:', res.status, res.statusText);
      const errorText = await res.text();
      console.error('Error response:', errorText);
      return false;
    }
  } catch (error) {
    console.error('WooCommerce REST API connection error:', error);
    return false;
  }
}

/**
 * Get product stock status
 */
export function getStockStatusLabel(status: string): string {
  switch (status) {
    case 'instock':
      return 'In Stock';
    case 'outofstock':
      return 'Out of Stock';
    case 'onbackorder':
      return 'On Backorder';
    default:
      return 'Unknown';
  }
}

// formatPrice removed - use the canonical INR version from @/lib/utils/pricing instead
