/**
 * WordPress Taxonomy REST API Service
 * Works with default post categories as well as custom taxonomies (e.g. product_cat, product_tag)
 */

const API_URL = process.env.WORDPRESS_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://wholelotofnature.com/wp-json';
const WORDPRESS_USER = process.env.WORDPRESS_USER || '';
const WORDPRESS_PASSWORD = process.env.WORDPRESS_PASSWORD || ''; // Application password, not regular password

export interface Category {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: Record<string, unknown>;
  _links: Record<string, unknown>;
}

/**
 * Get Basic Auth header from credentials
 */
function getAuthHeader(): string {
  if (!WORDPRESS_USER || !WORDPRESS_PASSWORD) {
    throw new Error('WORDPRESS_USER and WORDPRESS_PASSWORD environment variables are required');
  }
  const credentials = `${WORDPRESS_USER}:${WORDPRESS_PASSWORD}`;
  return `Basic ${Buffer.from(credentials).toString('base64')}`;
}

/**
 * Fetch all terms for a taxonomy
 */
export async function getCategories(
  params: {
  per_page?: number;
  page?: number;
  search?: string;
  orderby?: string;
  order?: 'asc' | 'desc';
  } = {},
  taxonomy: string = 'categories'
): Promise<Category[]> {
  try {
    const queryParams = new URLSearchParams({
      per_page: (params.per_page || 100).toString(),
      page: (params.page || 1).toString(),
      ...(params.search && { search: params.search }),
      ...(params.orderby && { orderby: params.orderby }),
      ...(params.order && { order: params.order }),
    });

    const url = `${API_URL}/wp/v2/${taxonomy}?${queryParams}`;
    
    console.log('Fetching categories from:', url);

    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch categories:', res.status, res.statusText);
      throw new Error(`Failed to fetch categories: ${res.statusText}`);
    }

    const categories = await res.json();
    console.log(`✅ Successfully fetched ${categories.length} categories`);
    
    return categories;
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return [];
  }
}

/**
 * Get a single term by slug
 */
export async function getCategoryBySlug(slug: string, taxonomy: string = 'categories'): Promise<Category | null> {
  try {
    const url = `${API_URL}/wp/v2/${taxonomy}?slug=${slug}`;
    
    console.log('Fetching category by slug:', slug);

    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch category:', res.status, res.statusText);
      throw new Error(`Failed to fetch category: ${res.statusText}`);
    }

    const categories = await res.json();
    const category = categories[0] || null;
    
    if (category) {
      console.log('✅ Found category:', category.name);
    } else {
      console.log('❌ No category found with slug:', slug);
    }
    
    return category;
  } catch (error) {
    console.error('❌ Error fetching category by slug:', error);
    return null;
  }
}

/**
 * Create a new term
 * Requires WordPress admin credentials (application password)
 */
export async function createCategory(
  categoryData: {
  name: string;
  slug?: string;
  description?: string;
  parent?: number;
  },
  taxonomy: string = 'categories'
): Promise<Category | null> {
  try {
    if (!WORDPRESS_USER || !WORDPRESS_PASSWORD) {
      throw new Error('WordPress credentials not configured. Set WORDPRESS_USER and WORDPRESS_PASSWORD environment variables.');
    }

    const url = `${API_URL}/wp/v2/${taxonomy}`;

    console.log('Creating category:', categoryData.name);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader(),
      },
      body: JSON.stringify({
        name: categoryData.name,
        slug: categoryData.slug || categoryData.name.toLowerCase().replace(/\s+/g, '-'),
        description: categoryData.description || '',
        parent: categoryData.parent || 0,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Failed to create category:', res.status, errorData);
      throw new Error(`Failed to create category: ${errorData.message || res.statusText}`);
    }

    const category = await res.json();
    console.log('✅ Successfully created category:', category.name);
    
    return category;
  } catch (error) {
    console.error('❌ Error creating category:', error);
    return null;
  }
}

/**
 * Update an existing term
 */
export async function updateCategory(
  categoryId: number,
  categoryData: {
    name?: string;
    slug?: string;
    description?: string;
    parent?: number;
  },
  taxonomy: string = 'categories'
): Promise<Category | null> {
  try {
    if (!WORDPRESS_USER || !WORDPRESS_PASSWORD) {
      throw new Error('WordPress credentials not configured. Set WORDPRESS_USER and WORDPRESS_PASSWORD environment variables.');
    }

    const url = `${API_URL}/wp/v2/${taxonomy}/${categoryId}`;

    console.log('Updating category ID:', categoryId);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader(),
      },
      body: JSON.stringify(categoryData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Failed to update category:', res.status, errorData);
      throw new Error(`Failed to update category: ${errorData.message || res.statusText}`);
    }

    const category = await res.json();
    console.log('✅ Successfully updated category:', category.name);
    
    return category;
  } catch (error) {
    console.error('❌ Error updating category:', error);
    return null;
  }
}

/**
 * Delete a term
 */
export async function deleteCategory(categoryId: number, force: boolean = false, taxonomy: string = 'categories'): Promise<boolean> {
  try {
    if (!WORDPRESS_USER || !WORDPRESS_PASSWORD) {
      throw new Error('WordPress credentials not configured. Set WORDPRESS_USER and WORDPRESS_PASSWORD environment variables.');
    }

    const url = `${API_URL}/wp/v2/${taxonomy}/${categoryId}?force=${force}`;

    console.log('Deleting category ID:', categoryId);

    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader(),
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Failed to delete category:', res.status, errorData);
      throw new Error(`Failed to delete category: ${errorData.message || res.statusText}`);
    }

    console.log('✅ Successfully deleted category ID:', categoryId);
    
    return true;
  } catch (error) {
    console.error('❌ Error deleting category:', error);
    return false;
  }
}

/**
 * Bulk create multiple terms
 */
export async function createCategories(
  categoriesData: Array<{
    name: string;
    slug?: string;
    description?: string;
    parent?: number;
  }>,
  taxonomy: string = 'categories'
): Promise<Category[]> {
  const results: Category[] = [];

  for (const categoryData of categoriesData) {
    const category = await createCategory(categoryData, taxonomy);
    if (category) {
      results.push(category);
    }
  }

  console.log(`✅ Created ${results.length} out of ${categoriesData.length} categories`);
  return results;
}
