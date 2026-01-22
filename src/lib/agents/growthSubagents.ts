import { WooCommerceService, type WooCommerceProduct } from '@/lib/services/woocommerceService';
import type { Lead } from '@/lib/agents/leadGenAgent';
import { aiService } from '@/lib/ai/aiService';

const DEFAULT_KEYWORDS = [
  'indoor plants',
  'air purifying plants',
  'low light plants',
  'organic soil mix',
  'planters',
  'balcony gardening',
  'office plants',
];

const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'your', 'best', 'top', 'new', 'set', 'plant', 'plants', 'care',
  'indoor', 'outdoor', 'garden', 'gardening', 'of', 'in', 'to', 'a', 'an', 'on', 'by', 'mix', 'kit',
]);

export interface NicheResearchResult {
  keywords: string[];
  segments: string[];
  topProducts: string[];
}

interface PersonaInsight {
  persona: string;
  painPoints: string[];
  motivations: string[];
  recommendedOffer: string;
  nextBestAction: string;
  summary: string;
}

export class NicheResearchAgent {
  async run(): Promise<NicheResearchResult> {
    try {
      const products = await WooCommerceService.getProducts(60);
      return this.buildInsights(products);
    } catch (error) {
      console.error('[NicheResearchAgent] Failed to fetch products:', error);
      return {
        keywords: DEFAULT_KEYWORDS,
        segments: ['Indoor plants', 'Soil mixes', 'Planters'],
        topProducts: [],
      };
    }
  }

  private buildInsights(products: WooCommerceProduct[]): NicheResearchResult {
    if (!products.length) {
      return {
        keywords: DEFAULT_KEYWORDS,
        segments: ['Indoor plants', 'Soil mixes', 'Planters'],
        topProducts: [],
      };
    }

    const categoryCounts = new Map<string, number>();
    const keywordCounts = new Map<string, number>();

    products.forEach((product) => {
      product.categories?.forEach((category) => {
        categoryCounts.set(category.name, (categoryCounts.get(category.name) || 0) + 1);
      });

      product.name
        .toLowerCase()
        .replace(/[^a-z\s]/g, '')
        .split(' ')
        .filter((word) => word.length > 2 && !STOPWORDS.has(word))
        .forEach((word) => {
          keywordCounts.set(word, (keywordCounts.get(word) || 0) + 1);
        });
    });

    const segments = Array.from(categoryCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);

    const keywords = Array.from(keywordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word)
      .concat(DEFAULT_KEYWORDS)
      .filter((value, index, array) => array.indexOf(value) === index)
      .slice(0, 12);

    const topProducts = products
      .filter((product) => product.featured || product.average_rating)
      .slice(0, 6)
      .map((product) => product.name);

    return { keywords, segments, topProducts };
  }
}

export class CustomerInsightAgent {
  enrich(leads: Lead[], niche: NicheResearchResult): Lead[] {
    return leads.map((lead) => {
      if (lead.source !== 'Customer') return lead;

      const ordersCount = lead.insights?.ordersCount || 0;
      const totalSpent = lead.insights?.totalSpent || 0;
      const persona = ordersCount >= 3 ? 'VIP plant parent' : ordersCount >= 2 ? 'Repeat buyer' : 'First-time buyer';
      const summary = `Persona: ${persona}. Orders: ${ordersCount}. Total spent: ₹${Math.round(totalSpent)}.`;

      return {
        ...lead,
        niche: lead.niche || niche.segments[0] || 'Indoor plants',
        insights: {
          ...lead.insights,
          persona,
          summary,
        },
      };
    });
  }
}

export class LeadQualificationAgent {
  constructor(private readonly nicheKeywords: string[]) {}

  qualify(leads: Lead[]): Lead[] {
    return leads.map((lead) => {
      let score = lead.score ?? 50;

      if (lead.source === 'Customer') score += 10;
      if (lead.source === 'Partner') score += 6;
      if (lead.source === 'LinkedIn') score += 4;

      const nicheText = `${lead.niche || ''} ${lead.company || ''}`.toLowerCase();
      if (this.nicheKeywords.some((keyword) => nicheText.includes(keyword))) {
        score += 6;
      }

      if (lead.insights?.ordersCount) score += Math.min(10, lead.insights.ordersCount * 2);
      if (lead.insights?.totalSpent) score += Math.min(10, Math.round(lead.insights.totalSpent / 1000));

      const status: Lead['status'] = score >= 85 ? 'HOT' : score >= 60 ? 'NEW' : 'COLD';

      return {
        ...lead,
        score: Math.min(95, score),
        status,
      };
    });
  }
}

export class PersonaRefinementAgent {
  async refine(leads: Lead[], niche: NicheResearchResult): Promise<Lead[]> {
    if (!aiService.isConfigured()) {
      return leads.map((lead) => ({
        ...lead,
        insights: {
          ...lead.insights,
          persona: lead.insights?.persona || 'Plant enthusiast',
          summary: lead.insights?.summary || `Top interest: ${lead.niche || niche.segments[0] || 'Indoor plants'}.`,
        },
      }));
    }

    const topProducts = niche.topProducts.slice(0, 4).join(', ') || 'Indoor plants, soil mixes, planters';

    const refined = await Promise.all(
      leads.map(async (lead, index) => {
        if (index > 4) return lead;

        const prompt = `Create a short, actionable persona summary for this lead.\n\nLead:\n- Name: ${lead.name}\n- Source: ${lead.source}\n- Role: ${lead.role}\n- Company: ${lead.company}\n- Niche: ${lead.niche}\n- Contact: ${lead.contact || 'unknown'}\n- Insights: ${lead.insights?.summary || 'N/A'}\n\nBusiness context:\n- Brand: Whole Lot of Nature (premium plants, soil, planters in Bangalore)\n- Top products: ${topProducts}\n- Keywords: ${niche.keywords.slice(0, 6).join(', ')}\n\nReturn valid JSON with keys: persona, painPoints (array), motivations (array), recommendedOffer, nextBestAction, summary.`;

        const response = await aiService.complete(prompt, {
          temperature: 0.3,
          maxTokens: 400,
          systemPrompt: 'You are a growth strategist specializing in plant retail. Return concise JSON only.',
        });

        const parsed = this.safeParsePersona(response);
        if (!parsed) return lead;

        return {
          ...lead,
          insights: {
            ...lead.insights,
            persona: parsed.persona,
            summary: parsed.summary,
          },
        };
      })
    );

    return refined;
  }

  private safeParsePersona(input: string): PersonaInsight | null {
    try {
      const jsonStart = input.indexOf('{');
      const jsonEnd = input.lastIndexOf('}');
      if (jsonStart === -1 || jsonEnd === -1) return null;
      const slice = input.slice(jsonStart, jsonEnd + 1);
      const parsed = JSON.parse(slice) as PersonaInsight;
      if (!parsed.persona || !parsed.summary) return null;
      return parsed;
    } catch {
      return null;
    }
  }
}
