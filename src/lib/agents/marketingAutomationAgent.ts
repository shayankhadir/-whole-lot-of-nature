/**
 * Marketing Automation Agent
 * Coordinates competitor analysis, SEO content generation, and landing page creation.
 */

import CompetitorAnalysisAgent, {
  CompetitorData,
  CompetitorInsights,
} from '@/lib/agents/competitorAnalysisAgent';
import SEOContentGenerator, { SEOContent } from '@/lib/agents/seoContentGenerator';
import LandingPageGenerator from '@/lib/agents/landingPageGenerator';

export type AutomationStepStatus = 'pending' | 'completed' | 'failed';

export interface AutomationStep<T = unknown> {
  status: AutomationStepStatus;
  data: T | null;
  error?: string;
}

export interface FullAutomationResults {
  step1: AutomationStep<{
    competitorsAnalyzed: number;
    insights: CompetitorInsights;
    topKeywords: string[];
    competitors: CompetitorData[];
  }>;
  step2: AutomationStep<{
    contentGenerated: number;
    pages: Array<{ title: string; slug: string; wordCount: number; targetKeyword: string }>;
  }>;
  step3: AutomationStep<{
    pagesCreated: number;
    pages: Array<{ url: string; path: string }>;
  }>;
  errors: string[];
}

export interface FullAutomationResponse {
  success: boolean;
  message: string;
  results: FullAutomationResults;
  summary: {
    competitorsAnalyzed: number;
    contentGenerated: number;
    pagesCreated: number;
    errors: number;
  };
}

export interface GenerateContentResponse {
  success: boolean;
  contentGenerated: number;
  content: Array<{
    title: string;
    slug: string;
    wordCount: number;
    keywords: string[];
    targetKeyword: string;
  }>;
}

export interface MarketingAutomationAgentOptions {
  competitors?: CompetitorConfig[];
}

export interface CompetitorConfig {
  name: string;
  url: string;
  fallback?: string;
}

const DEFAULT_COMPETITORS: CompetitorConfig[] = [
  { name: 'Urvann', url: 'https://urvann.com', fallback: 'http://urvann.com' },
  { name: 'Nurserylive', url: 'https://nurserylive.com', fallback: 'http://nurserylive.com' },
  { name: 'Ugaoo', url: 'https://www.ugaoo.com', fallback: 'http://ugaoo.com' },
];

class MarketingAutomationAgent {
  private competitorAgent = new CompetitorAnalysisAgent();
  private contentGenerator = new SEOContentGenerator();
  private landingGenerator = new LandingPageGenerator();
  private competitors: CompetitorConfig[];

  constructor(options?: MarketingAutomationAgentOptions) {
    this.competitors = options?.competitors && options.competitors.length > 0
      ? options.competitors
      : DEFAULT_COMPETITORS;
  }

  async runFullAutomation(): Promise<FullAutomationResponse> {
    console.log('🚀 Starting full marketing automation run...');

    const results: FullAutomationResults = {
      step1: { status: 'pending', data: null },
      step2: { status: 'pending', data: null },
      step3: { status: 'pending', data: null },
      errors: [],
    };

    // STEP 1: Competitor analysis
    const analysis = await this.collectCompetitorData(this.competitors);
    results.errors.push(...analysis.errors);

    if (!analysis.insights) {
      results.step1 = {
        status: 'failed',
        data: null,
        error: 'Failed to generate competitor insights',
      };

      return this.buildResponse(results);
    }

    results.step1 = {
      status: 'completed',
      data: {
        competitorsAnalyzed: analysis.data.length,
        insights: analysis.insights,
        topKeywords: analysis.insights.topKeywords.slice(0, 10),
        competitors: analysis.data,
      },
    };

    // STEP 2: Generate SEO content
    try {
      console.log('✍️  Generating SEO content from insights...');
      const generatedContent = await this.contentGenerator.generateContentFromInsights(
        analysis.insights,
        analysis.data,
      );

      results.step2 = {
        status: 'completed',
        data: {
          contentGenerated: generatedContent.length,
          pages: generatedContent.map((content) => ({
            title: content.title,
            slug: content.slug,
            wordCount: content.wordCount,
            targetKeyword: content.targetKeyword,
          })),
        },
      };

      // STEP 3: Generate landing pages
      try {
        console.log('🏗️  Generating landing pages...');
        const pageResults = await this.landingGenerator.generatePages(generatedContent);
        const successfulPages = pageResults.filter((page) => page.success);

        results.step3 = {
          status: 'completed',
          data: {
            pagesCreated: successfulPages.length,
            pages: successfulPages.map((page) => ({ url: page.url, path: page.path })),
          },
        };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('❌ Error generating landing pages:', message);
        results.step3 = {
          status: 'failed',
          data: null,
          error: message,
        };
        results.errors.push(`Page generation failed: ${message}`);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('❌ Error generating SEO content:', message);
      results.step2 = {
        status: 'failed',
        data: null,
        error: message,
      };
      results.errors.push(`Content generation failed: ${message}`);
    }

    return this.buildResponse(results);
  }

  async generateContentOnly(competitorLimit: number = 2): Promise<GenerateContentResponse> {
    console.log('✍️  Generating SEO content (content only mode)...');

    const competitorSubset = this.competitors.slice(0, competitorLimit);
    const analysis = await this.collectCompetitorData(competitorSubset);

    if (!analysis.insights) {
      return {
        success: false,
        contentGenerated: 0,
        content: [],
      };
    }

    const generatedContent = await this.contentGenerator.generateContentFromInsights(
      analysis.insights,
      analysis.data,
    );

    return {
      success: true,
      contentGenerated: generatedContent.length,
      content: generatedContent.map((content) => ({
        title: content.title,
        slug: content.slug,
        wordCount: content.wordCount,
        keywords: content.keywords,
        targetKeyword: content.targetKeyword,
      })),
    };
  }

  async listGeneratedPages(): Promise<string[]> {
    return this.landingGenerator.listGeneratedPages();
  }

  private async collectCompetitorData(
    competitors: CompetitorConfig[],
  ): Promise<{ data: CompetitorData[]; insights: CompetitorInsights | null; errors: string[] }> {
    const competitorData: CompetitorData[] = [];
    const errors: string[] = [];

    for (const competitor of competitors) {
      try {
        let analysis = await this.competitorAgent.analyzeCompetitor(competitor.url, competitor.name);

        if (this.isAnalysisEmpty(analysis)) {
          console.log(`  ⚠️ Limited data for ${competitor.name}, checking fallback...`);
          analysis = await this.tryFallbackOrMock(competitor, analysis);
        }

        competitorData.push(analysis);
        console.log(`  ✅ Analyzed ${competitor.name}`);
      } catch (error: unknown) {
        console.log(`  ⚠️ Error with ${competitor.name}: ${error instanceof Error ? error.message : String(error)}`);
        competitorData.push(
          this.competitorAgent.generateMockData(competitor.name, competitor.url),
        );
        errors.push(`Failed to analyze ${competitor.name}`);
      }
    }

    if (competitorData.length === 0) {
      return { data: [], insights: null, errors };
    }

    const insights = this.competitorAgent.generateInsights(competitorData);
    return { data: competitorData, insights, errors };
  }

  private isAnalysisEmpty(analysis: CompetitorData): boolean {
    return analysis.products.length === 0 && analysis.keywords.length <= 3;
  }

  private async tryFallbackOrMock(
    competitor: CompetitorConfig,
    currentAnalysis: CompetitorData,
  ): Promise<CompetitorData> {
    if (!competitor.fallback) {
      console.log(`  ⚠️ No fallback for ${competitor.name}, using mock data.`);
      return this.competitorAgent.generateMockData(competitor.name, competitor.url);
    }

    try {
      console.log(`  🔁 Trying fallback URL for ${competitor.name}...`);
      const fallbackAnalysis = await this.competitorAgent.analyzeCompetitor(
        competitor.fallback,
        competitor.name,
      );
      if (this.isAnalysisEmpty(fallbackAnalysis)) {
        return this.competitorAgent.generateMockData(competitor.name, competitor.url);
      }
      return fallbackAnalysis;
    } catch (error) {
      console.log(`  ⚠️ Fallback failed for ${competitor.name}, using mock data.`);
      return this.competitorAgent.generateMockData(competitor.name, competitor.url);
    }
  }

  private buildResponse(results: FullAutomationResults): FullAutomationResponse {
    const success =
      results.step1.status === 'completed' &&
      results.step2.status === 'completed' &&
      results.step3.status === 'completed';

    return {
      success,
      message: success
        ? 'Marketing automation completed successfully!'
        : 'Marketing automation completed with errors',
      results,
      summary: {
        competitorsAnalyzed: results.step1.data?.competitorsAnalyzed || 0,
        contentGenerated: results.step2.data?.contentGenerated || 0,
        pagesCreated: results.step3.data?.pagesCreated || 0,
        errors: results.errors.length,
      },
    };
  }
}

export default MarketingAutomationAgent;
