const apiUrl = 'http://localhost:3000/api/generate-blog-post';

const trendyTopics = [
  {
    title: 'Indoor Plant Trending Now: 5 Must-Have Plants for Modern Homes in 2025',
    keywords: ['indoor plants 2025', 'trending houseplants', 'modern home plants', 'air purifying plants'],
    description: 'Discover the hottest indoor plants taking over social media and modern homes this year'
  },
  {
    title: 'Zero-Waste Gardening: Sustainable Soil Mixes & Eco-Friendly Practices',
    keywords: ['sustainable gardening', 'eco-friendly soil', 'zero waste plants', 'organic gardening'],
    description: 'Learn how to garden sustainably with our premium organic soil mixes and eco-conscious practices'
  },
  {
    title: 'Plant Propagation Hacks: Grow Your Collection for Free Using Simple Techniques',
    keywords: ['plant propagation', 'propagate plants at home', 'free plant growing', 'plant cloning'],
    description: 'Master the art of plant propagation and multiply your plant collection without spending extra'
  },
  {
    title: 'Summer Plant Care Guide: How to Keep Your Plants Thriving in Heat & Humidity',
    keywords: ['summer plant care', 'watering schedule summer', 'heat resistant plants', 'humid climate plants'],
    description: 'Expert tips to protect your plants during hot summers with proper watering and care routines'
  },
  {
    title: 'The Complete Beginner Guide to Rare Plants: Where to Start Your Rare Plant Journey',
    keywords: ['rare plants for beginners', 'exotic houseplants', 'plant collection starter', 'rare plant care'],
    description: 'Everything you need to know about collecting rare plants safely and successfully as a beginner'
  }
];

async function generateBlogs() {
  console.log('🌱 Starting Blog Post Generation...\n');
  
  for (let i = 0; i < trendyTopics.length; i++) {
    const topic = trendyTopics[i];
    const keyword = topic.keywords[0];
    console.log(`📝 Generating Blog ${i + 1}/5: "${topic.title}"`);
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.title,
          keyword: keyword,
          description: topic.description
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Success! Generated blog post`);
        console.log(`   Title: ${data.post?.title || topic.title}`);
        console.log(`   Words: ${data.post?.wordCount || 'unknown'}\n`);
      } else {
        console.log(`⚠️  Response: ${response.status}`);
        const error = await response.text();
        console.log(`   Error: ${error.substring(0, 150)}\n`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}\n`);
    }
    
    // Wait between requests to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('🎉 Blog Generation Complete!\n');
}

generateBlogs().catch(console.error);
