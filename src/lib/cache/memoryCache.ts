/**
 * In-memory cache with TTL support for serverless environments
 * Provides fast repeated access within a single serverless instance lifetime
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  createdAt: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private maxSize = 100; // Max entries to prevent memory bloat

  /**
   * Get cached value if not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set cache value with TTL in seconds
   */
  set<T>(key: string, data: T, ttlSeconds: number): void {
    // Evict oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
      createdAt: Date.now(),
    });
  }

  /**
   * Delete a cache entry
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clear entries matching a prefix
   */
  clearPrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache stats for debugging
   */
  stats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Singleton instance
export const memoryCache = new MemoryCache();

// Cache TTL constants (in seconds)
export const CACHE_TTL = {
  PRODUCTS: 60,           // Products: 1 minute (frequently updated stock)
  PRODUCTS_LIST: 120,     // Product listings: 2 minutes
  PRODUCT_SINGLE: 60,     // Single product: 1 minute
  CATEGORIES: 300,        // Categories: 5 minutes (rarely change)
  BLOG_POSTS: 300,        // Blog posts: 5 minutes
  REVIEWS: 180,           // Reviews: 3 minutes
  CUSTOMERS: 60,          // Customers: 1 minute (for admin only)
  RELATED_PRODUCTS: 180,  // Related products: 3 minutes
  SEARCH: 30,             // Search results: 30 seconds (more dynamic)
} as const;

// Cache key generators
export const cacheKey = {
  products: (limit?: number) => `products:${limit || 'all'}`,
  productBySlug: (slug: string) => `product:slug:${slug}`,
  productById: (id: number) => `product:id:${id}`,
  productsByCategory: (slug: string, limit?: number) => `products:category:${slug}:${limit || 'all'}`,
  productsByTag: (tag: string, limit?: number) => `products:tag:${tag}:${limit || 'all'}`,
  relatedProducts: (productId: number, limit?: number) => `products:related:${productId}:${limit || 4}`,
  categories: () => 'categories:all',
  blogPosts: (limit?: number) => `blog:posts:${limit || 'all'}`,
  blogPostBySlug: (slug: string) => `blog:post:${slug}`,
  reviews: (productId: number) => `reviews:${productId}`,
  search: (query: string, limit?: number) => `search:${query}:${limit || 20}`,
};

/**
 * Cache wrapper for async functions
 * Usage: const result = await withCache(cacheKey.products(10), CACHE_TTL.PRODUCTS, () => fetchProducts(10));
 */
export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = memoryCache.get<T>(key);
  if (cached !== null) {
    console.log(`[Cache HIT] ${key}`);
    return cached;
  }

  console.log(`[Cache MISS] ${key}`);
  const data = await fetcher();
  memoryCache.set(key, data, ttlSeconds);
  return data;
}
