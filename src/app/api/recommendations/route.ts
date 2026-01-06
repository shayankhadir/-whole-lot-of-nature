import { NextRequest, NextResponse } from 'next/server';
import { 
  getAIRecommendations, 
  getRuleBasedRecommendations, 
  UserBehavior,
  Product 
} from '@/lib/ai/recommendations';

// WooCommerce product response type
interface WooProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  images?: { src: string }[];
  categories?: { name: string }[];
  tags?: { name: string }[];
  attributes?: { name: string; options: string[] }[];
  description?: string;
  average_rating?: string;
  rating_count?: number;
}

// Fetch products from WordPress/WooCommerce
async function fetchProducts(): Promise<Product[]> {
  try {
    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WORDPRESS_URL;
    if (!wpUrl) {
      console.warn('WordPress URL not configured');
      return [];
    }

    const response = await fetch(`${wpUrl}/wp-json/wc/v3/products?per_page=50`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(
          `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
        ).toString('base64')}`
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      console.error('Failed to fetch products:', response.status);
      return [];
    }

    const products = await response.json();
    
    return products.map((p: WooProduct) => {
      // Extract attributes into the expected format
      const attrs: Product['attributes'] = {};
      if (p.attributes) {
        for (const attr of p.attributes) {
          const attrName = attr.name.toLowerCase().replace(/\s+/g, '');
          if (attrName.includes('light')) attrs.lightRequirement = attr.options[0];
          if (attrName.includes('water')) attrs.waterFrequency = attr.options[0];
          if (attrName.includes('difficulty')) attrs.difficulty = attr.options[0];
          if (attrName.includes('pet')) attrs.petFriendly = attr.options[0]?.toLowerCase() === 'yes';
          if (attrName.includes('air')) attrs.airPurifying = attr.options[0]?.toLowerCase() === 'yes';
        }
      }

      return {
        id: String(p.id),
        name: p.name,
        slug: p.slug,
        price: parseFloat(p.price) || 0,
        image: p.images?.[0]?.src || undefined,
        categories: p.categories?.map((c) => c.name) || [],
        tags: p.tags?.map((t) => t.name) || [],
        attributes: attrs,
        description: p.description,
        averageRating: p.average_rating ? parseFloat(p.average_rating) : undefined,
        reviewCount: p.rating_count
      };
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentProductId, behavior, limit = 4 } = body;

    // Fetch all products from WooCommerce
    const allProducts = await fetchProducts();
    
    if (allProducts.length === 0) {
      return NextResponse.json({ recommendations: [] });
    }

    // Find current product if viewing one
    const currentProduct = currentProductId 
      ? allProducts.find(p => p.id === currentProductId)
      : undefined;

    // Parse user behavior
    const userBehavior: UserBehavior = {
      viewedProducts: behavior?.viewedProducts || [],
      categoryViews: behavior?.categoryViews || behavior?.viewedCategories || [],
      searchQueries: behavior?.searchQueries || behavior?.searchTerms || [],
      purchasedProducts: behavior?.purchasedProducts || [],
      cartProducts: behavior?.cartProducts || []
    };

    // Try AI recommendations first, fall back to rule-based
    let recommendations;
    
    if (process.env.ANTHROPIC_API_KEY) {
      recommendations = await getAIRecommendations(
        allProducts,
        userBehavior,
        currentProductId,
        limit
      );
    } else {
      recommendations = await getRuleBasedRecommendations(
        allProducts,
        userBehavior,
        currentProductId,
        limit
      );
    }

    // Filter out current product and already viewed products
    const filteredRecommendations = recommendations.filter(rec => {
      if (currentProductId && rec.productId === currentProductId) return false;
      return true;
    }).slice(0, limit);

    return NextResponse.json({ 
      recommendations: filteredRecommendations,
      source: process.env.ANTHROPIC_API_KEY ? 'ai' : 'rules'
    });
  } catch (error) {
    console.error('Recommendations API error:', error);
    
    // Return empty recommendations on error
    return NextResponse.json({ 
      recommendations: [],
      error: 'Failed to generate recommendations'
    }, { status: 200 }); // Return 200 to not break UI
  }
}
