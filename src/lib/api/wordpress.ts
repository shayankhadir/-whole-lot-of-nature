// WordPress REST API Service
const API_URL = process.env.WORDPRESS_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://admin.wholelotofnature.com/wp-json';

export interface Post {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  categories: number[];
  tags: number[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      id: number;
      source_url: string;
      alt_text: string;
      media_details: {
        width: number;
        height: number;
        sizes: Record<string, {
          source_url: string;
          width: number;
          height: number;
        }>;
      };
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
      taxonomy: string;
    }>>;
    author?: Array<{
      id: number;
      name: string;
      avatar_urls: Record<string, string>;
    }>;
  };
}

export interface Page {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  featured_media: number;
  parent: number;
  menu_order: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

export interface Media {
  id: number;
  date: string;
  slug: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  author: number;
  caption: {
    rendered: string;
  };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes: Record<string, {
      file: string;
      width: number;
      height: number;
      mime_type: string;
      source_url: string;
    }>;
  };
  source_url: string;
}

/**
 * Fetch all posts from WordPress
 */
export async function getPosts(params: {
  per_page?: number;
  page?: number;
  search?: string;
  categories?: string;
  tags?: string;
  orderby?: string;
  order?: 'asc' | 'desc';
} = {}): Promise<Post[]> {
  try {
    const queryParams = new URLSearchParams({
      per_page: (params.per_page || 10).toString(),
      page: (params.page || 1).toString(),
      _embed: 'true',
      ...(params.search && { search: params.search }),
      ...(params.categories && { categories: params.categories }),
      ...(params.tags && { tags: params.tags }),
      ...(params.orderby && { orderby: params.orderby }),
      ...(params.order && { order: params.order }),
    });

    const url = `${API_URL}/wp/v2/posts?${queryParams}`;
    
    console.log('Fetching posts from:', url);

    const res = await fetch(url, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch posts:', res.status, res.statusText);
      throw new Error(`Failed to fetch posts: ${res.statusText}`);
    }

    const posts = await res.json();
    console.log(`Successfully fetched ${posts.length} posts`);
    
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

/**
 * Fetch a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const url = `${API_URL}/wp/v2/posts?slug=${slug}&_embed`;
    
    console.log('Fetching post by slug:', url);

    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch post:', res.status, res.statusText);
      throw new Error(`Failed to fetch post: ${res.statusText}`);
    }

    const posts = await res.json();
    const post = posts[0] || null;
    
    if (post) {
      console.log('Successfully fetched post:', post.title.rendered);
    } else {
      console.log('No post found with slug:', slug);
    }
    
    return post;
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
}

/**
 * Fetch a single post by ID
 */
export async function getPostById(id: number): Promise<Post | null> {
  try {
    const url = `${API_URL}/wp/v2/posts/${id}?_embed`;
    
    console.log('Fetching post by ID:', url);

    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch post:', res.status, res.statusText);
      throw new Error(`Failed to fetch post: ${res.statusText}`);
    }

    const post = await res.json();
    console.log('Successfully fetched post:', post.title.rendered);
    
    return post;
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    return null;
  }
}

/**
 * Fetch all pages from WordPress
 */
export async function getPages(params: {
  per_page?: number;
  page?: number;
  parent?: number;
} = {}): Promise<Page[]> {
  try {
    const queryParams = new URLSearchParams({
      per_page: (params.per_page || 100).toString(),
      page: (params.page || 1).toString(),
      _embed: 'true',
      ...(params.parent !== undefined && { parent: params.parent.toString() }),
    });

    const url = `${API_URL}/wp/v2/pages?${queryParams}`;
    
    console.log('Fetching pages from:', url);

    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Pages change less often - revalidate every hour
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch pages:', res.status, res.statusText);
      throw new Error(`Failed to fetch pages: ${res.statusText}`);
    }

    const pages = await res.json();
    console.log(`Successfully fetched ${pages.length} pages`);
    
    return pages;
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
}

/**
 * Fetch a single page by slug
 */
export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const url = `${API_URL}/wp/v2/pages?slug=${slug}&_embed`;
    
    console.log('Fetching page by slug:', url);

    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch page:', res.status, res.statusText);
      throw new Error(`Failed to fetch page: ${res.statusText}`);
    }

    const pages = await res.json();
    const page = pages[0] || null;
    
    if (page) {
      console.log('Successfully fetched page:', page.title.rendered);
    } else {
      console.log('No page found with slug:', slug);
    }
    
    return page;
  } catch (error) {
    console.error('Error fetching page by slug:', error);
    return null;
  }
}

/**
 * Fetch media by ID
 */
export async function getMediaById(id: number): Promise<Media | null> {
  try {
    const url = `${API_URL}/wp/v2/media/${id}`;
    
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch media:', res.status, res.statusText);
      return null;
    }

    const media = await res.json();
    return media;
  } catch (error) {
    console.error('Error fetching media by ID:', error);
    return null;
  }
}

/**
 * Search across posts and pages
 */
export async function searchContent(query: string, type: 'post' | 'page' | 'any' = 'any', limit: number = 10): Promise<(Post | Page)[]> {
  try {
    const endpoint = type === 'any' ? 'search' : type === 'post' ? 'posts' : 'pages';
    const url = `${API_URL}/wp/v2/${endpoint}?search=${encodeURIComponent(query)}&per_page=${limit}&_embed`;
    
    console.log('Searching content:', url);

    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Failed to search content:', res.status, res.statusText);
      throw new Error(`Failed to search content: ${res.statusText}`);
    }

    const results = await res.json();
    console.log(`Found ${results.length} results for "${query}"`);
    
    return results;
  } catch (error) {
    console.error('Error searching content:', error);
    return [];
  }
}

/**
 * Test WordPress REST API connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    console.log('Testing WordPress REST API connection...');
    console.log('API URL:', API_URL);
    
    const url = `${API_URL}/wp/v2/posts?per_page=1`;
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      console.log('✅ WordPress REST API is working!');
      return true;
    } else {
      console.error('❌ WordPress REST API connection failed:', res.status, res.statusText);
      return false;
    }
  } catch (error) {
    console.error('❌ WordPress REST API connection error:', error);
    return false;
  }
}
