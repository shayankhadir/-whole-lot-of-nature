/**
 * Plantsy - Plant Doctor & Care Companion Agent
 * ------------------------------------------------
 * Provides contextual plant-care responses using WooCommerce product data
 * and recent blog content as the knowledge base (simple RAG-lite approach).
 */

import { WooCommerceService, type WooCommerceProduct } from '@/lib/services/woocommerceService';
import { getPosts, type Post } from '@/lib/api/wordpress';

export interface PlantsyQuestionContext {
  preferredCategory?: string;
  environment?: 'indoor' | 'outdoor' | 'balcony' | 'terrarium';
  experienceLevel?: 'beginner' | 'intermediate' | 'pro';
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

export class PlantDoctorAgent {
  private cachedProducts: WooCommerceProduct[] = [];
  private cachedArticles: Post[] = [];
  private lastSync = 0;

  private async ensureKnowledgeBase() {
    const now = Date.now();
    if (now - this.lastSync < CACHE_TTL_MS && this.cachedProducts.length > 0) {
      return;
    }

    const [products, posts] = await Promise.all([
      WooCommerceService.getProducts(60),
      getPosts({ per_page: 6 }).catch(() => [] as Post[]),
    ]);

    this.cachedProducts = products;
    this.cachedArticles = posts;
    this.lastSync = now;
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
          if (token && normalizedQuestion.includes(token)) {
            score += weight;
          }
        });
    };

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
    })).filter((ref) => normalized.split(' ').some((token) => ref.snippet.toLowerCase().includes(token)));
  }

  public async answerQuestion(question: string, context?: PlantsyQuestionContext): Promise<PlantsyResponse> {
    await this.ensureKnowledgeBase();

    const scored = this.cachedProducts
      .map((product) => ({ product, score: this.scoreProduct(product, question, context) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const top = scored[0]?.product;
    if (!top) {
      return {
        answer: "I couldn't find a matching plant in the catalog yet, but I can still help if you mention the plant name or environment.",
        carePlan: [],
        confidence: 'low',
        followUpQuestions: [
          'Is this plant kept indoors or outdoors?',
          'Do you notice any discoloration or pests?',
          'How often are you watering it right now?'
        ],
        references: [],
        recommendedProducts: [],
      };
    }

    const carePlan = this.buildCarePlan(top, question);
    const answer = this.formatAnswer(top, carePlan, question);

    const references: PlantsyReference[] = [
      {
        type: 'product',
        title: top.name,
        url: `/shop/${top.slug}`,
        snippet: top.short_description ? top.short_description.replace(/<[^>]+>/g, '').slice(0, 140) + '…' : '',
      },
      ...this.selectArticles(question),
    ];

    const confidence = scored[0].score >= 8 ? 'high' : scored[0].score >= 4 ? 'medium' : 'low';

    return {
      answer,
      carePlan,
      confidence,
      followUpQuestions: [
        'Would you like watering reminders via WhatsApp/email?',
        'Should I suggest companion plants for the same light conditions?',
        'Need help picking soil or fertilizer for this plant?'
      ],
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
