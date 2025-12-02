666666666667#!/usr/bin/env node

/**
 * Generates 5 trendy blog posts for Whole Lot of Nature
 * Uses the blog generation agents to create SEO-optimized content
 */

const API_URL = 'http://localhost:3000';za\666666666s-]=[ ]

const trendingTopics = [
  {
    title: 'Indoor Plant Styling: How to Create a Green Wall in Your Living Room',
    keywords: ['indoor plants', 'plant styling', 'green wall', 'home decor'],
    targetAudience: 'Home decorators and plant enthusiasts'
  },
  {
    title: 'Winter Plant Care Guide: Keeping Your Plants Alive During Cold Months',
    keywords: ['winter care', 'plant maintenance', 'seasonal care', 'indoor gardening'],
    targetAudience: 'Plant parents worried about winter'
  },
  {
    title: 'Low-Light Plants That Thrive: Perfect for Offices and Apartments',
    keywords: ['low light plants', 'shade tolerant', 'office plants', 'indoor gardening'],
    targetAudience: 'Apartment dwellers and office workers'
  },
  {
    title: 'Sustainable Gardening: Organic Soil Mixes and Eco-Friendly Practices',
    keywords: ['sustainable gardening', 'organic soil', 'eco-friendly', 'composting'],
    targetAudience: 'Eco-conscious gardeners'
  },
  {
    title: 'Rare Plant Collection: Building Your Own Exotic Plant Garden at Home',
    keywords: ['rare plants', 'exotic plants', 'plant collection', 'specialty plants'],
    targetAudience: 'Serious plant collectors and enthusiasts'
  }
];

async function generateBlogPost(topic) {
  console.log(`\n📝 Generating blog post: "${topic.title}"...`);
  
  try {
    const response = await fetch(`${API_URL}/api/generate-blog-post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: topic.title,
        keywords: topic.keywords,
        targetAudience: topic.targetAudience,
        wordCount: 1200,
        seoOptimized: true
      })
    });

    if (!response.ok) {
      console.error(`❌ Failed to generate: ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log(`✅ Generated successfully`);
    console.log(`   Title: ${data.title || topic.title}`);
    console.log(`   Word Count: ${data.wordCount || 'N/A'}`);
    console.log(`   SEO Score: ${data.seoScore || 'N/A'}`);
    
    return data;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return null;
  }
}

async function publishToWordPress(blogPost) {
  if (!blogPost) return false;
  
  console.log(`\n📤 Publishing to WordPress...`);
  
  try {
    const response = await fetch(`${API_URL}/api/blog/list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: blogPost.title,
        content: blogPost.content,
        status: 'draft',
        categories: ['Tips', 'Guides'],
        tags: blogPost.keywords || []
      })
    });

    if (response.ok) {
      console.log(`✅ Published as draft`);
      return true;
    }
  } catch (error) {
    console.error(`⚠️  Publishing skipped: ${error.message}`);
  }
  
  return false;
}

async function main() {
  console.log('🚀 Starting Blog Generation Pipeline');
  console.log('=' .repeat(50));
  console.log(`📊 Topics to generate: ${trendingTopics.length}`);
  console.log('=' .repeat(50));

  const generatedBlogs = [];
  let successCount = 0;

  for (let i = 0; i < trendingTopics.length; i++) {
    const topic = trendingTopics[i];
    console.log(`\n[${i + 1}/${trendingTopics.length}] Processing topic...`);
    
    const blogPost = await generateBlogPost(topic);
    if (blogPost) {
      generatedBlogs.push(blogPost);
      successCount++;
      await publishToWordPress(blogPost);
    }
    
    // Add delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Summary
  console.log('\n' + '=' .repeat(50));
  console.log('📊 GENERATION SUMMARY');
  console.log('=' .repeat(50));
  console.log(`✅ Successfully generated: ${successCount}/${trendingTopics.length} posts`);
  console.log(`📝 Total content created: ~${successCount * 1200} words`);
  console.log('');
  console.log('Generated Posts:');
  generatedBlogs.forEach((blog, index) => {
    console.log(`${index + 1}. ${blog.title || trendingTopics[index].title}`);
  });
  console.log('');
  console.log('✨ Blog generation complete! Posts are ready as WordPress drafts.');
  console.log('📖 Review and publish them at: https://wholelotofnature.com/wp-admin/edit.php');
}

main().catch(console.error);
