import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.WORDPRESS_GRAPHQL_URL || 'https://wholelotofnature.com/graphql';

export const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch all blog posts
export async function fetchBlogPosts() {
  const query = `
    query GetPosts {
      posts {
        nodes {
          id
          title
          excerpt
          content
          date
          slug
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          author {
            node {
              name
            }
          }
        }
      }
    }
  `;
  
  const data = await graphQLClient.request(query);
  return data.posts.nodes;
}

// Fetch a single post by slug
export async function fetchPostBySlug(slug: string) {
  const query = `
    query GetPostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        id
        title
        content
        date
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        author {
          node {
            name
          }
        }
      }
    }
  `;
  
  const data = await graphQLClient.request(query, { slug });
  return data.post;
}

// Fetch WooCommerce products (requires WPGraphQL WooCommerce plugin)
export async function fetchProducts() {
  const query = `
    query GetProducts {
      products(first: 100) {
        nodes {
          id
          name
          slug
          price
          regularPrice
          salePrice
          description
          shortDescription
          image {
            sourceUrl
            altText
          }
          galleryImages {
            nodes {
              sourceUrl
              altText
            }
          }
          productCategories {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  `;
  
  const data = await graphQLClient.request(query);
  return data.products.nodes;
}

// Fetch product by slug
export async function fetchProductBySlug(slug: string) {
  const query = `
    query GetProductBySlug($slug: ID!) {
      product(id: $slug, idType: SLUG) {
        id
        name
        slug
        price
        regularPrice
        salePrice
        description
        shortDescription
        image {
          sourceUrl
          altText
        }
        galleryImages {
          nodes {
            sourceUrl
            altText
          }
        }
        productCategories {
          nodes {
            name
            slug
          }
        }
      }
    }
  `;
  
  const data = await graphQLClient.request(query, { slug });
  return data.product;
}

// Create a new blog post (requires authentication)
export async function createBlogPost({ title, content }: { title: string; content: string }) {
  const username = process.env.WORDPRESS_USERNAME;
  const password = process.env.WORDPRESS_APP_PASSWORD;
  const token = Buffer.from(`${username}:${password}`).toString('base64');
  
  const authenticatedClient = new GraphQLClient(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${token}`,
    },
  });
  
  const mutation = `
    mutation CreatePost($title: String!, $content: String!) {
      createPost(input: { title: $title, content: $content, status: PUBLISH }) {
        post {
          id
          title
          content
          date
        }
      }
    }
  `;
  
  const data = await authenticatedClient.request(mutation, { title, content });
  return data.createPost.post;
}

// Instagram API functions
interface InstagramPost {
  id: string;
  caption: string;
  media_type: string;
  media_url: string;
  permalink: string;
  timestamp: string;
  like_count: number;
}

interface InstagramAccessTokenResponse {
  access_token: string;
  expires_in: number;
}

interface InstagramMediaResponse {
  data: Array<{
    id: string;
    caption: string;
    media_type: string;
    media_url: string;
    permalink: string;
    timestamp: string;
    like_count: number;
  }>;
  paging?: {
    cursors: {
      after: string;
    };
  };
}

// Get Instagram access token using app credentials
export async function getInstagramAccessToken(): Promise<string> {
  const appId = process.env.INSTAGRAM_APP_ID;
  const appSecret = process.env.INSTAGRAM_APP_SECRET;

  if (!appId || !appSecret) {
    throw new Error('Instagram app credentials not configured in environment variables');
  }

  try {
    const response = await fetch(
      `https://graph.instagram.com/v18.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&grant_type=client_credentials`,
      {
        method: 'GET',
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Instagram API Error:', data);
      throw new Error(`Failed to get access token: ${data.error?.message || response.statusText}`);
    }

    return data.access_token;
  } catch (error) {
    console.error('Error getting Instagram access token:', error);
    throw error;
  }
}

// Fetch Instagram feed posts
export async function fetchInstagramFeed(limit: number = 6): Promise<InstagramPost[]> {
  try {
    const accessToken = await getInstagramAccessToken();

    const response = await fetch(
      `https://graph.instagram.com/v18.0/me/media?fields=id,caption,media_type,media_url,permalink,timestamp,like_count&access_token=${accessToken}`,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch Instagram feed: ${response.statusText}`);
    }

    const data = (await response.json()) as InstagramMediaResponse;
    
    // Return limited posts
    return data.data.slice(0, limit) as InstagramPost[];
  } catch (error) {
    console.error('Error fetching Instagram feed:', error);
    // Return empty array on error instead of throwing
    return [];
  }
}
