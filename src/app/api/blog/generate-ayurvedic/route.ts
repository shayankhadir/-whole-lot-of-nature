/**
 * API Route: Generate Ayurvedic Blog Content
 * Endpoint: POST /api/blog/generate-ayurvedic
 * 
 * Generates SEO-optimized blog posts about Ayurvedic tips, remedies, and wellness
 */

import { NextRequest, NextResponse } from 'next/server';
import BlogPostGenerator from '@/lib/agents/blogPostGenerator';
import AYURVEDIC_BLOG_TOPICS, { toTrendData, getRandomTopics } from '@/data/ayurvedicBlogTopics';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Security Check
    const authHeader = request.headers.get('x-admin-key');
    if (authHeader !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { topicIndex, category, random } = body;

    const generator = new BlogPostGenerator();
    let selectedTopic;

    if (typeof topicIndex === 'number' && AYURVEDIC_BLOG_TOPICS[topicIndex]) {
      // Use specific topic by index
      selectedTopic = AYURVEDIC_BLOG_TOPICS[topicIndex];
    } else if (category) {
      // Filter by category and pick random
      const categoryTopics = AYURVEDIC_BLOG_TOPICS.filter(t => t.category === category);
      if (categoryTopics.length === 0) {
        return NextResponse.json(
          { success: false, error: `No topics found for category: ${category}` },
          { status: 400 }
        );
      }
      selectedTopic = categoryTopics[Math.floor(Math.random() * categoryTopics.length)];
    } else if (random) {
      // Pick random topic
      const randomTopics = getRandomTopics(1);
      selectedTopic = randomTopics[0];
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Please provide topicIndex, category, or set random: true',
          availableTopics: AYURVEDIC_BLOG_TOPICS.map((t, i) => ({
            index: i,
            title: t.title,
            category: t.category,
          })),
        },
        { status: 400 }
      );
    }

    // Convert to TrendData and generate post
    const trendData = toTrendData(selectedTopic);
    const post = await generator.generateFromTrend(trendData);

    return NextResponse.json({
      success: true,
      post: {
        ...post,
        relatedProducts: selectedTopic.relatedProducts,
        targetAudience: selectedTopic.targetAudience,
        ayurvedicCategory: selectedTopic.category,
      },
      topic: {
        title: selectedTopic.title,
        keywords: selectedTopic.keywords,
        description: selectedTopic.description,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const err = error as Error;
    console.error('Error generating Ayurvedic blog post:', err);

    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Ayurvedic Blog Generator API',
    usage: {
      method: 'POST',
      body: {
        topicIndex: 'number - specific topic index (0-9)',
        category: 'string - tips, remedies, wellness, recipes, lifestyle',
        random: 'boolean - pick a random topic',
      },
      headers: {
        'x-admin-key': 'Your admin secret key',
        'Content-Type': 'application/json',
      },
    },
    availableTopics: AYURVEDIC_BLOG_TOPICS.map((t, i) => ({
      index: i,
      title: t.title,
      category: t.category,
      keywords: t.keywords,
    })),
    categories: ['tips', 'remedies', 'wellness', 'recipes', 'lifestyle'],
  });
}
