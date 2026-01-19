/**
 * Plantsy - AI-Powered Plant Doctor & Care Companion
 * ------------------------------------------------
 * Provides intelligent, contextual plant-care responses using:
 * - AI language models (Groq/Together/OpenAI - free tiers available)
 * - WooCommerce product data for recommendations
 * - Blog content for additional tips
 */

import { WooCommerceService, type WooCommerceProduct } from '@/lib/services/woocommerceService';
import { getPosts, type Post } from '@/lib/api/wordpress';
import { aiService } from '@/lib/ai/aiService';

export interface PlantsyQuestionContext {
  preferredCategory?: string;
  environment?: 'indoor' | 'outdoor' | 'balcony' | 'terrarium';
  experienceLevel?: 'beginner' | 'intermediate' | 'pro';
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface PlantsyReference {
  type: 'product' | 'article';
  title: string;
  url: string;
  snippet: string;
}

export interface PlantsyResponse {
  answer: string;
  followUpQuestions: string[];
  recommendedProducts: Array<Pick<WooCommerceProduct, 'id' | 'name' | 'slug' | 'images' | 'price'>>;
  references: PlantsyReference[];
  confidence: 'low' | 'medium' | 'high';
  carePlan: string[];
}

const CACHE_TTL_MS = 1000 * 60 * 10; // 10 minutes

// Plant care knowledge base
const PLANT_KNOWLEDGE = {
  bangalore_climate: 'Bangalore has pleasant year-round temperatures (15-35°C). Most plants thrive with protection from harsh afternoon sun.',
};

export class PlantDoctorAgent {
  private cachedProducts: WooCommerceProduct[] = [];
  private cachedArticles: Post[] = [];
  private lastSync = 0;

  private async ensureKnowledgeBase() {
    const now = Date.now();
    if (now - this.lastSync < CACHE_TTL_MS && this.cachedProducts.length > 0) {
      return;
    }

    try {
      const [products, posts] = await Promise.all([
        WooCommerceService.getProducts(60).catch(() => []),
        getPosts({ per_page: 6 }).catch(() => [] as Post[]),
      ]);

      this.cachedProducts = products || [];
      this.cachedArticles = posts || [];
      this.lastSync = now;
    } catch (error) {
      console.error('Failed to sync knowledge base:', error);
    }
  }

  private buildProductContext(): string {
    if (this.cachedProducts.length === 0) return '';
    const productList = this.cachedProducts
      .slice(0, 15)
      .map((p) => `- ${p.name} (₹${p.price})`)
      .join('\n');
    return `\nAvailable Products:\n${productList}`;
  }

  private scoreProduct(product: WooCommerceProduct, question: string, context?: PlantsyQuestionContext) {
    let score = 0;
    const normalizedQuestion = question.toLowerCase();

    const applyMatch = (text?: string, weight = 1) => {
      if (!text) return;
      text
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .forEach((token) => {
          if (token && token.length > 2 && normalizedQuestion.includes(token)) {
            score += weight;
          }
        });
    };

    applyMatch(product.name, 3);
    applyMatch(product.short_description, 1.5);
    applyMatch(product.description, 1);
    product.categories?.forEach((cat) => applyMatch(cat.name, 2));
    product.tags?.forEach((tag) => applyMatch(tag.name, 2));

    if (context?.preferredCategory) {
      const category = context.preferredCategory;
      const match = product.categories?.some(
        (cat) => cat.slug === category || cat.name.toLowerCase().includes(category.toLowerCase()),
      );
      if (match) score += 3;
    }

    if (normalizedQuestion.includes('pet')) {
      const petSafe = product.tags?.some((tag) => /pet|safe/i.test(tag.name));
      if (petSafe) score += 2;
    }

    return score;
  }

  private buildCarePlan(product: WooCommerceProduct, question: string): string[] {
    const bullets: string[] = [];

    const hasLowLight = /low light|shade/i.test(`${product.short_description} ${product.description}`);
    const hasWaterNote = /water|watering|moist|dry/i.test(product.description);
    const hasFertilizer = /fertiliz|feed/i.test(product.description);

    if (hasLowLight) {
      bullets.push(`Place **${product.name}** in bright, indirect light; avoid harsh midday sun.`);
    } else {
      bullets.push(`Ensure **${product.name}** gets at least 4-6 hours of filtered light daily.`);
    }

    if (hasWaterNote) {
      bullets.push('Follow a soak-and-dry watering cycle; let the topsoil dry before the next drink.');
    } else {
      bullets.push('Water when the top inch of soil feels dry—use rain or filtered water if possible.');
    }

    if (hasFertilizer) {
      bullets.push('Feed with a dilute organic fertilizer every 3 weeks during the growing season.');
    } else {
      bullets.push('Mix a handful of vermicompost into the topsoil once a month to keep nutrients flowing.');
    }

    if (/pest|mealy|aphid/i.test(question)) {
      bullets.push('Mist diluted neem oil on both sides of the leaves weekly until pests disappear.');
    }

    return bullets;
  }

  private formatAnswer(product: WooCommerceProduct, carePlan: string[], question: string): string {
    return [
      `Here’s how to care for **${product.name}** based on what you asked:
`,
      `- ${carePlan.join('\n- ')}`,
      `
Pair it with our ${product.categories?.[0]?.name ?? 'signature'} soil mix for best results. Let me know if you need repotting steps or troubleshooting help!`,
    ].join('\n');
  }

  private selectArticles(question: string): PlantsyReference[] {
    const normalized = question.toLowerCase();
    return this.cachedArticles.slice(0, 3).map((post) => ({
      type: 'article' as const,
      title: post.title.rendered.replace(/<[^>]+>/g, ''),
      url: post.link,
      snippet: post.excerpt.rendered.replace(/<[^>]+>/g, '').slice(0, 140) + '…',
    })).filter((ref) => normalized.split(' ').some((token) => token.length > 3 && ref.snippet.toLowerCase().includes(token)));
  }

  private extractCarePlan(aiResponse: string): string[] {
    const lines = aiResponse.split('\n');
    const carePlan: string[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (/^[-*•]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
        const cleanLine = trimmed.replace(/^[-*•]\s+/, '').replace(/^\d+\.\s+/, '');
        if (cleanLine.length > 10 && cleanLine.length < 200) {
          carePlan.push(cleanLine);
        }
      }
    }
    return carePlan.slice(0, 5);
  }

  private generateFollowUpQuestions(question: string): string[] {
    const lowerQ = question.toLowerCase();
    const followUps: string[] = [];

    if (!lowerQ.includes('water')) followUps.push('How often should I water this plant?');
    if (!lowerQ.includes('light')) followUps.push('What light conditions does it need?');
    if (!lowerQ.includes('soil')) followUps.push('What soil mix should I use?');
    if (!lowerQ.includes('fertiliz')) followUps.push('When should I fertilize?');
    
    followUps.push('Can you recommend similar plants?');
    return followUps.slice(0, 3);
  }

  public async answerQuestion(question: string, context?: PlantsyQuestionContext): Promise<PlantsyResponse> {
    await this.ensureKnowledgeBase();

    // Score products for recommendations
    const scored = this.cachedProducts
      .map((product) => ({ product, score: this.scoreProduct(product, question, context) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    // Build AI prompt with context
    const systemPrompt = `You are Plantsy, a friendly plant care assistant for "Whole Lot of Nature" - a premium Indian plant store in Bangalore.

BRAND: "Stay Loyal to the Soil" - eco-friendly, sustainable gardening
TONE: Warm, helpful, expert but accessible
FORMAT: Keep responses 100-200 words, use bullet points for tips
CLIMATE: Bangalore (15-35°C year-round)
${this.buildProductContext()}

Answer the customer's plant question helpfully. Include 2-4 specific care tips.`;

    let aiAnswer: string;
    let confidence: 'low' | 'medium' | 'high' = 'medium';

    try {
      aiAnswer = await aiService.complete(question, {
        systemPrompt,
        temperature: 0.7,
        maxTokens: 600,
      });
      confidence = 'high';
    } catch (error) {
      console.error('AI completion failed:', error);
      // Fallback to rule-based response
      const top = scored[0]?.product;
      if (top) {
        const carePlan = this.buildCarePlan(top, question);
        aiAnswer = this.formatAnswer(top, carePlan, question);
        confidence = 'medium';
      } else {
        aiAnswer = "I'm here to help with your plant questions! Please tell me more about your plant or what you'd like to know - watering, light requirements, soil mix, or troubleshooting issues.";
        confidence = 'low';
      }
    }

    // Extract care plan from AI response
    const carePlan = this.extractCarePlan(aiAnswer);
    
    // Build references
    const references: PlantsyReference[] = [
      ...scored.slice(0, 2).map(({ product }) => ({
        type: 'product' as const,
        title: product.name,
        url: `/shop/${product.slug}`,
        snippet: product.short_description?.replace(/<[^>]+>/g, '').slice(0, 100) || `Premium ${product.name}`,
      })),
      ...this.selectArticles(question).slice(0, 2),
    ];

    return {
      answer: aiAnswer,
      carePlan: carePlan.length > 0 ? carePlan : (scored[0]?.product ? this.buildCarePlan(scored[0].product, question) : []),
      confidence,
      followUpQuestions: this.generateFollowUpQuestions(question),
      references,
      recommendedProducts: scored.map(({ product }) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        images: product.images,
        price: product.price,
      })),
    };
  }
}

const plantsyAgent = new PlantDoctorAgent();
export default plantsyAgent;