/**
 * AI-Powered Recommendation Engine
 * 
 * Uses user behavior tracking + product attributes to generate
 * personalized product recommendations.
 * 
 * Features:
 * - Collaborative filtering (users who bought X also bought Y)
 * - Content-based filtering (similar products by attributes)
 * - Hybrid recommendations combining both
 * - Real-time personalization
 */

import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client (server-side only)
const getAnthropicClient = () => {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('ANTHROPIC_API_KEY not configured - AI recommendations disabled');
    return null;
  }
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
};

// Product interface
export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  categories: string[];
  tags: string[];
  attributes: {
    lightRequirement?: string;
    waterFrequency?: string;
    difficulty?: string;
    petFriendly?: boolean;
    airPurifying?: boolean;
  };
  description?: string;
  image?: string;
  averageRating?: number;
  reviewCount?: number;
}

// User behavior tracking
export interface UserBehavior {
  viewedProducts: string[];
  purchasedProducts: string[];
  cartProducts: string[];
  searchQueries: string[];
  categoryViews: string[];
  timeOnSite?: number;
  lastVisit?: Date;
}

// Recommendation result
interface Recommendation {
  productId: string;
  product: Product;
  score: number;
  reason: string;
  type: 'similar' | 'complementary' | 'trending' | 'personalized';
}

/**
 * Get personalized recommendations using Claude AI
 */
export async function getAIRecommendations(
  products: Product[],
  userBehavior: UserBehavior,
  currentProductId?: string,
  limit: number = 6
): Promise<Recommendation[]> {
  const client = getAnthropicClient();
  
  // Fallback to rule-based if no API key
  if (!client) {
    return getRuleBasedRecommendations(products, userBehavior, currentProductId, limit);
  }

  try {
    const prompt = buildRecommendationPrompt(products, userBehavior, currentProductId, limit);
    
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    // Parse the response
    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    const recommendations = parseAIResponse(content.text, products);
    return recommendations.slice(0, limit);
    
  } catch (error) {
    console.error('AI recommendation error:', error);
    // Fallback to rule-based
    return getRuleBasedRecommendations(products, userBehavior, currentProductId, limit);
  }
}

/**
 * Build the prompt for Claude
 */
function buildRecommendationPrompt(
  products: Product[],
  userBehavior: UserBehavior,
  currentProductId?: string,
  limit: number = 6
): string {
  const productSummary = products.slice(0, 50).map(p => ({
    id: p.id,
    name: p.name,
    categories: p.categories,
    price: p.price,
    attributes: p.attributes,
    rating: p.averageRating
  }));

  return `You are a product recommendation engine for an online plant store called "Whole Lot of Nature".

AVAILABLE PRODUCTS:
${JSON.stringify(productSummary, null, 2)}

USER BEHAVIOR:
- Viewed Products: ${userBehavior.viewedProducts.join(', ') || 'None'}
- Purchased Products: ${userBehavior.purchasedProducts.join(', ') || 'None'}
- Cart Products: ${userBehavior.cartProducts.join(', ') || 'None'}
- Search Queries: ${userBehavior.searchQueries.join(', ') || 'None'}
- Category Views: ${userBehavior.categoryViews.join(', ') || 'None'}

${currentProductId ? `CURRENTLY VIEWING: Product ID ${currentProductId}` : ''}

Based on this data, recommend ${limit} products. For each recommendation, provide:
1. Product ID
2. Score (0-100)
3. Brief reason (max 10 words)
4. Type: "similar", "complementary", "trending", or "personalized"

Return ONLY a JSON array with this format:
[
  {"id": "123", "score": 95, "reason": "Similar care requirements", "type": "similar"},
  ...
]`;
}

/**
 * Parse Claude's response into recommendations
 */
function parseAIResponse(
  response: string,
  products: Product[]
): Recommendation[] {
  try {
    // Extract JSON from response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON array found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]) as Array<{
      id: string;
      score: number;
      reason: string;
      type: 'similar' | 'complementary' | 'trending' | 'personalized';
    }>;

    // Map to full recommendations
    return parsed
      .map(rec => {
        const product = products.find(p => p.id === rec.id);
        if (!product) return null;

        return {
          productId: rec.id,
          product,
          score: rec.score,
          reason: rec.reason,
          type: rec.type
        };
      })
      .filter((r): r is Recommendation => r !== null);

  } catch (error) {
    console.error('Failed to parse AI response:', error);
    return [];
  }
}

/**
 * Rule-based fallback recommendations
 */
export function getRuleBasedRecommendations(
  products: Product[],
  userBehavior: UserBehavior,
  currentProductId?: string,
  limit: number = 6
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  // Find current product
  const currentProduct = currentProductId 
    ? products.find(p => p.id === currentProductId)
    : null;

  // 1. Similar products (same category)
  if (currentProduct) {
    const sameCategory = products
      .filter(p => 
        p.id !== currentProductId &&
        p.categories.some(c => currentProduct.categories.includes(c))
      )
      .slice(0, 3)
      .map(p => ({
        productId: p.id,
        product: p,
        score: 85,
        reason: 'Same category',
        type: 'similar' as const
      }));
    
    recommendations.push(...sameCategory);
  }

  // 2. Complementary products (different category, often bought together)
  const complementary = products
    .filter(p => !recommendations.some(r => r.productId === p.id))
    .filter(p => {
      // Soil with plants, pots with plants, etc.
      if (currentProduct?.categories.includes('Plants')) {
        return p.categories.includes('Soil') || p.categories.includes('Pots');
      }
      return false;
    })
    .slice(0, 2)
    .map(p => ({
      productId: p.id,
      product: p,
      score: 75,
      reason: 'Goes well together',
      type: 'complementary' as const
    }));
  
  recommendations.push(...complementary);

  // 3. Based on user's viewed categories
  if (userBehavior.categoryViews.length > 0) {
    const preferredCategory = userBehavior.categoryViews[0];
    const categoryBased = products
      .filter(p => !recommendations.some(r => r.productId === p.id))
      .filter(p => p.categories.includes(preferredCategory))
      .slice(0, 2)
      .map(p => ({
        productId: p.id,
        product: p,
        score: 70,
        reason: `Based on your interest in ${preferredCategory}`,
        type: 'personalized' as const
      }));
    
    recommendations.push(...categoryBased);
  }

  // 4. Trending (high rating + recent reviews)
  const trending = products
    .filter(p => !recommendations.some(r => r.productId === p.id))
    .filter(p => (p.averageRating || 0) >= 4)
    .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
    .slice(0, 2)
    .map(p => ({
      productId: p.id,
      product: p,
      score: 65,
      reason: 'Popular choice',
      type: 'trending' as const
    }));
  
  recommendations.push(...trending);

  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Track user behavior (client-side)
 */
export function trackProductView(productId: string): void {
  if (typeof window === 'undefined') return;

  const key = 'wlon_user_behavior';
  const stored = localStorage.getItem(key);
  const behavior: UserBehavior = stored 
    ? JSON.parse(stored) 
    : { viewedProducts: [], purchasedProducts: [], cartProducts: [], searchQueries: [], categoryViews: [] };

  // Add to viewed products (keep last 20)
  if (!behavior.viewedProducts.includes(productId)) {
    behavior.viewedProducts = [productId, ...behavior.viewedProducts].slice(0, 20);
  }

  behavior.lastVisit = new Date();
  localStorage.setItem(key, JSON.stringify(behavior));
}

export function trackCategoryView(category: string): void {
  if (typeof window === 'undefined') return;

  const key = 'wlon_user_behavior';
  const stored = localStorage.getItem(key);
  const behavior: UserBehavior = stored 
    ? JSON.parse(stored) 
    : { viewedProducts: [], purchasedProducts: [], cartProducts: [], searchQueries: [], categoryViews: [] };

  // Add to category views (keep last 10)
  if (!behavior.categoryViews.includes(category)) {
    behavior.categoryViews = [category, ...behavior.categoryViews].slice(0, 10);
  }

  localStorage.setItem(key, JSON.stringify(behavior));
}

export function trackSearch(query: string): void {
  if (typeof window === 'undefined') return;

  const key = 'wlon_user_behavior';
  const stored = localStorage.getItem(key);
  const behavior: UserBehavior = stored 
    ? JSON.parse(stored) 
    : { viewedProducts: [], purchasedProducts: [], cartProducts: [], searchQueries: [], categoryViews: [] };

  // Add to search queries (keep last 10)
  behavior.searchQueries = [query, ...behavior.searchQueries.filter(q => q !== query)].slice(0, 10);

  localStorage.setItem(key, JSON.stringify(behavior));
}

export function trackPurchase(productIds: string[]): void {
  if (typeof window === 'undefined') return;

  const key = 'wlon_user_behavior';
  const stored = localStorage.getItem(key);
  const behavior: UserBehavior = stored 
    ? JSON.parse(stored) 
    : { viewedProducts: [], purchasedProducts: [], cartProducts: [], searchQueries: [], categoryViews: [] };

  // Add to purchased products
  const newPurchases = productIds.filter(id => !behavior.purchasedProducts.includes(id));
  behavior.purchasedProducts = [...newPurchases, ...behavior.purchasedProducts];
  
  // Clear from cart
  behavior.cartProducts = behavior.cartProducts.filter(id => !productIds.includes(id));

  localStorage.setItem(key, JSON.stringify(behavior));
}

export function getUserBehavior(): UserBehavior {
  if (typeof window === 'undefined') {
    return { viewedProducts: [], purchasedProducts: [], cartProducts: [], searchQueries: [], categoryViews: [] };
  }

  const key = 'wlon_user_behavior';
  const stored = localStorage.getItem(key);
  
  return stored 
    ? JSON.parse(stored) 
    : { viewedProducts: [], purchasedProducts: [], cartProducts: [], searchQueries: [], categoryViews: [] };
}
