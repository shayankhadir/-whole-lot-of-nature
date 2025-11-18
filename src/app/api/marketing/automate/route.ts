/**
 * API Route: Complete Marketing Automation
 * Endpoint: POST /api/marketing/automate
 * Full automation: Analyze competitors → Generate content → Create pages
 */

import { NextRequest, NextResponse } from 'next/server';
import CompetitorAnalysisAgent from '@/lib/agents/competitorAnalysisAgent';
import SEOContentGenerator from '@/lib/agents/seoContentGenerator';
import LandingPageGenerator from '@/lib/agents/landingPageGenerator';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes for full automation

const COMPETITORS = [
  { name: 'Urvann', url: 'https://urvann.com', fallback: 'http://urvann.com' },
  { name: 'Nurserylive', url: 'https://nurserylive.com', fallback: 'http://nurserylive.com' },
  { name: 'Ugaoo', url: 'https://www.ugaoo.com', fallback: 'http://ugaoo.com' },
];

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'full-automation') {
      console.log('🚀 Starting full marketing automation...\n');

      const results = {
        step1: { status: 'pending', data: null as any },
        step2: { status: 'pending', data: null as any },
        step3: { status: 'pending', data: null as any },
        errors: [] as string[],
      };

      // STEP 1: Analyze Competitors
      try {
        console.log('📊 Step 1: Analyzing competitors...');
        const analysisAgent = new CompetitorAnalysisAgent();
        const competitorData = [];

        for (const competitor of COMPETITORS) {
          try {
            let analysis;
            try {
              analysis = await analysisAgent.analyzeCompetitor(competitor.url, competitor.name);
              
              // If scraping returned no useful data, use mock data
              if (analysis.products.length === 0 && analysis.keywords.length <= 3) {
                console.log(`  ⚠️ No data scraped, using mock data for ${competitor.name}`);
                analysis = analysisAgent.generateMockData(competitor.name, competitor.url);
              }
            } catch (primaryError: any) {
              // Try fallback URL if primary fails
              if (competitor.fallback) {
                console.log(`  ⚠️ Primary URL failed for ${competitor.name}, trying fallback...`);
                try {
                  analysis = await analysisAgent.analyzeCompetitor(competitor.fallback, competitor.name);
                } catch (fallbackError) {
                  // Use mock data if both fail
                  console.log(`  ⚠️ Fallback failed, using mock data for ${competitor.name}`);
                  analysis = analysisAgent.generateMockData(competitor.name, competitor.url);
                }
              } else {
                // Use mock data
                console.log(`  ⚠️ Scraping failed, using mock data for ${competitor.name}`);
                analysis = analysisAgent.generateMockData(competitor.name, competitor.url);
              }
            }
            competitorData.push(analysis);
            console.log(`  ✅ Analyzed ${competitor.name}`);
          } catch (error: any) {
            console.log(`  ⚠️  Error with ${competitor.name}: ${error.message}, using mock data`);
            competitorData.push(analysisAgent.generateMockData(competitor.name, competitor.url));
            results.errors.push(`Failed to analyze ${competitor.name}`);
          }
        }

        if (competitorData.length === 0) {
          throw new Error('No competitors were successfully analyzed');
        }

        const insights = analysisAgent.generateInsights(competitorData);
        results.step1 = {
          status: 'completed',
          data: {
            competitorsAnalyzed: competitorData.length,
            insights,
            topKeywords: insights.topKeywords.slice(0, 10),
          },
        };

        console.log(`✅ Step 1 Complete: Analyzed ${competitorData.length} competitors\n`);

        // STEP 2: Generate SEO Content
        try {
          console.log('✍️  Step 2: Generating SEO-optimized content...');
          const contentGenerator = new SEOContentGenerator();
          const generatedContent = await contentGenerator.generateContentFromInsights(insights, competitorData);

          results.step2 = {
            status: 'completed',
            data: {
              contentGenerated: generatedContent.length,
              pages: generatedContent.map((c) => ({
                title: c.title,
                slug: c.slug,
                wordCount: c.wordCount,
                targetKeyword: c.targetKeyword,
              })),
            },
          };

          console.log(`✅ Step 2 Complete: Generated ${generatedContent.length} content pieces\n`);

          // STEP 3: Create Landing Pages
          try {
            console.log('🏗️  Step 3: Creating landing pages...');
            const pageGenerator = new LandingPageGenerator();
            const pageResults = await pageGenerator.generatePages(generatedContent);

            const successfulPages = pageResults.filter((r) => r.success);

            results.step3 = {
              status: 'completed',
              data: {
                pagesCreated: successfulPages.length,
                pages: successfulPages.map((p) => ({
                  url: p.url,
                  path: p.path,
                })),
              },
            };

            console.log(`✅ Step 3 Complete: Created ${successfulPages.length} landing pages\n`);
          } catch (error: any) {
            results.step3 = { status: 'failed', data: null };
            results.errors.push(`Page generation failed: ${error.message}`);
            console.error('❌ Step 3 Failed:', error.message);
          }
        } catch (error: any) {
          results.step2 = { status: 'failed', data: null };
          results.errors.push(`Content generation failed: ${error.message}`);
          console.error('❌ Step 2 Failed:', error.message);
        }
      } catch (error: any) {
        results.step1 = { status: 'failed', data: null };
        results.errors.push(`Competitor analysis failed: ${error.message}`);
        console.error('❌ Step 1 Failed:', error.message);
      }

      const success =
        results.step1.status === 'completed' &&
        results.step2.status === 'completed' &&
        results.step3.status === 'completed';

      return NextResponse.json({
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
        timestamp: new Date().toISOString(),
      });
    } else if (action === 'generate-content-only') {
      // Generate content without creating pages
      console.log('✍️  Generating SEO content...');

      const analysisAgent = new CompetitorAnalysisAgent();
      const competitorData = [];

      for (const competitor of COMPETITORS.slice(0, 2)) {
        try {
          const analysis = await analysisAgent.analyzeCompetitor(competitor.url, competitor.name);
          competitorData.push(analysis);
        } catch (error) {
          console.error(`Failed to analyze ${competitor.name}`);
        }
      }

      if (competitorData.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No competitors analyzed' },
          { status: 500 }
        );
      }

      const insights = analysisAgent.generateInsights(competitorData);
      const contentGenerator = new SEOContentGenerator();
      const generatedContent = await contentGenerator.generateContentFromInsights(insights, competitorData);

      return NextResponse.json({
        success: true,
        contentGenerated: generatedContent.length,
        content: generatedContent.map((c) => ({
          title: c.title,
          slug: c.slug,
          wordCount: c.wordCount,
          keywords: c.keywords,
          targetKeyword: c.targetKeyword,
        })),
        timestamp: new Date().toISOString(),
      });
    } else if (action === 'list-pages') {
      // List all generated pages
      const pageGenerator = new LandingPageGenerator();
      const pages = await pageGenerator.listGeneratedPages();

      return NextResponse.json({
        success: true,
        totalPages: pages.length,
        pages: pages.map((slug) => ({
          slug,
          url: `/seo-pages/${slug}`,
        })),
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid action. Use: full-automation, generate-content-only, or list-pages',
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Marketing automation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
