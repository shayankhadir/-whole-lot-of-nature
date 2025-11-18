/**
 * API Route: Create Test Draft Blog Posts
 * Endpoint: POST /api/blog/create-test-drafts
 * Creates sample draft posts directly in WordPress for testing
 */

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

const samplePosts = [
  {
    title: 'Top 10 Easy-Care Indoor Plants for Beginners',
    content: `<h2>Introduction to Low-Maintenance Indoor Plants</h2>
<p>Starting your indoor plant journey doesn't have to be complicated. These 10 plants are perfect for beginners because they're forgiving, adaptable, and beautiful.</p>

<h2>1. Snake Plant (Sansevieria)</h2>
<p>The snake plant is virtually indestructible. It tolerates low light, irregular watering, and can survive weeks of neglect. Perfect for busy plant parents!</p>

<h3>Care Tips:</h3>
<ul>
<li>Water every 2-3 weeks</li>
<li>Thrives in indirect light</li>
<li>Great for air purification</li>
</ul>

<h2>2. Pothos (Epipremnum aureum)</h2>
<p>Known as "Devil's Ivy," pothos is a trailing vine that grows quickly and looks stunning in hanging planters.</p>

<h2>3. ZZ Plant (Zamioculcas zamiifolia)</h2>
<p>The ZZ plant's glossy leaves and upright growth make it a stunning addition to any room.</p>

<h2>Conclusion</h2>
<p>These plants are your perfect starting point. Choose one or two and watch your confidence grow along with your green friends!</p>`,
    excerpt: 'Discover the 10 most beginner-friendly indoor plants that are nearly impossible to kill. Perfect for starting your plant parent journey!',
    categories: ['Plant Care', 'Indoor Plants'],
    tags: ['beginner plants', 'easy care', 'indoor gardening', 'low maintenance'],
  },
  {
    title: 'The Complete Guide to Organic Soil Mixes for Container Gardens',
    content: `<h2>Why Soil Quality Matters</h2>
<p>Container gardening success starts with the right soil mix. Unlike ground soil, container soil needs special properties for drainage, aeration, and nutrition.</p>

<h2>Essential Components of Container Soil</h2>
<h3>1. Coco Peat</h3>
<p>Coco peat retains moisture while providing excellent aeration. It's sustainable and pH-neutral.</p>

<h3>2. Vermicompost</h3>
<p>Rich in nutrients and beneficial microorganisms, vermicompost is nature's perfect fertilizer.</p>

<h3>3. Perlite or Vermiculite</h3>
<p>These minerals improve drainage and prevent soil compaction.</p>

<h2>DIY Soil Mix Recipe</h2>
<p>Mix 40% coco peat, 30% vermicompost, 20% garden soil, and 10% perlite for the perfect all-purpose container mix.</p>

<h2>Troubleshooting Common Issues</h2>
<p>If your plants show yellowing leaves, you might have drainage issues. Add more perlite to improve airflow.</p>`,
    excerpt: 'Learn how to create the perfect organic soil mix for your container garden. This complete guide covers everything from ingredients to troubleshooting.',
    categories: ['Soil & Fertilizers', 'Gardening Tips'],
    tags: ['organic soil', 'container gardening', 'diy soil mix', 'compost'],
  },
  {
    title: '7 Flowering Plants That Bloom All Year Round in India',
    content: `<h2>Year-Round Color for Your Garden</h2>
<p>Imagine having flowers blooming in your garden every single month! These 7 plants make it possible in India's climate.</p>

<h2>1. Hibiscus (Gudhal)</h2>
<p>The classic Indian flowering plant produces large, vibrant blooms daily. Available in red, pink, orange, and white.</p>

<h3>Growing Tips:</h3>
<ul>
<li>Full sun exposure</li>
<li>Regular watering in summer</li>
<li>Prune after monsoon</li>
</ul>

<h2>2. Crossandra (Aboli)</h2>
<p>These orange-red flowers are perfect for shaded areas and bloom prolifically.</p>

<h2>3. Ixora (Rukmini)</h2>
<p>Dense clusters of flowers in vibrant colors make Ixora a garden favorite.</p>

<h2>4. Periwinkle (Sadabahar)</h2>
<p>As the Hindi name suggests, this truly blooms "always" - throughout the year!</p>

<h2>Creating a Blooming Calendar</h2>
<p>Plant 2-3 of these varieties to ensure continuous blooms and a vibrant garden year-round.</p>`,
    excerpt: 'Discover 7 beautiful flowering plants that bloom throughout the year in Indian climate. Create a garden that's always in bloom!',
    categories: ['Flowering Plants', 'Indian Gardening'],
    tags: ['year-round flowers', 'indian plants', 'flowering', 'garden design'],
  },
  {
    title: 'Monsoon Gardening: Best Plants to Grow During Rainy Season',
    content: `<h2>Embrace the Monsoon Magic</h2>
<p>The monsoon season is perfect for gardening! Higher humidity and regular rainfall create ideal conditions for many plants.</p>

<h2>Top Monsoon Vegetables</h2>
<h3>Leafy Greens</h3>
<p>Spinach, fenugreek (methi), and coriander thrive in monsoon conditions. They're quick-growing and perfect for beginners.</p>

<h3>Tomatoes</h3>
<p>Start tomatoes at the beginning of monsoon for a harvest before winter.</p>

<h2>Flowering Plants for Monsoon</h2>
<p>Balsam, marigold, and zinnias love the monsoon season and will reward you with vibrant blooms.</p>

<h2>Monsoon Care Tips</h2>
<ul>
<li>Ensure proper drainage to prevent waterlogging</li>
<li>Watch for fungal diseases</li>
<li>Stake tall plants before heavy rains</li>
</ul>

<h2>Post-Monsoon Planning</h2>
<p>Use monsoon to establish plants that will flourish in the cooler months ahead.</p>`,
    excerpt: 'Make the most of monsoon season with these perfect plants for rainy weather. Learn what to grow and how to care for your monsoon garden.',
    categories: ['Seasonal Gardening', 'Vegetable Garden'],
    tags: ['monsoon', 'rainy season', 'seasonal planting', 'indian weather'],
  },
  {
    title: 'Natural Pest Control: Organic Solutions for Your Garden',
    content: `<h2>Say Goodbye to Chemical Pesticides</h2>
<p>Protect your plants naturally with these organic pest control methods that are safe for you, your family, and the environment.</p>

<h2>Common Garden Pests and Solutions</h2>
<h3>Aphids</h3>
<p>These tiny insects cluster on new growth. Spray them with a neem oil solution mixed with water.</p>

<h3>Whiteflies</h3>
<p>Yellow sticky traps work wonders. Place them near affected plants.</p>

<h3>Caterpillars</h3>
<p>Hand-pick or use Bacillus thuringiensis (Bt), a natural bacterial pesticide.</p>

<h2>DIY Organic Sprays</h2>
<h3>Neem Oil Spray</h3>
<p>Mix 5ml neem oil with 1 liter water and a few drops of liquid soap. Spray weekly.</p>

<h3>Garlic-Chili Spray</h3>
<p>Blend garlic and green chilies with water, strain, and spray on plants.</p>

<h2>Prevention is Key</h2>
<p>Healthy plants resist pests better. Focus on good nutrition, proper watering, and adequate sunlight.</p>`,
    excerpt: 'Discover safe, organic pest control methods for your garden. These natural solutions protect your plants without harmful chemicals.',
    categories: ['Plant Care', 'Organic Gardening'],
    tags: ['pest control', 'organic', 'natural pesticides', 'plant health'],
  },
];

export async function POST(request: NextRequest) {
  try {
    const baseUrl = `${process.env.WORDPRESS_SITE_URL || process.env.WORDPRESS_URL}/wp-json/wp/v2`;
    const username = process.env.WORDPRESS_USERNAME;
    const password = process.env.WORDPRESS_PASSWORD || process.env.WORDPRESS_APP_PASSWORD?.replace(/ /g, '');

    if (!baseUrl || !username || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'WordPress configuration missing',
          details: {
            hasUrl: !!baseUrl,
            hasUsername: !!username,
            hasPassword: !!password,
          },
        },
        { status: 500 }
      );
    }

    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
    const results = [];

    for (const post of samplePosts) {
      try {
        // First, get or create categories
        const categoryIds: number[] = [];
        for (const catName of post.categories) {
          try {
            // Check if category exists
            const catSearchResponse = await axios.get(`${baseUrl}/categories`, {
              params: { search: catName, per_page: 1 },
              headers: { Authorization: authHeader },
            });

            let categoryId;
            if (catSearchResponse.data.length > 0) {
              categoryId = catSearchResponse.data[0].id;
            } else {
              // Create category
              const catCreateResponse = await axios.post(
                `${baseUrl}/categories`,
                { name: catName },
                { headers: { Authorization: authHeader, 'Content-Type': 'application/json' } }
              );
              categoryId = catCreateResponse.data.id;
            }
            categoryIds.push(categoryId);
          } catch (catError) {
            console.error(`Error with category ${catName}:`, catError);
          }
        }

        // Create the draft post
        const postData = {
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          status: 'draft',
          categories: categoryIds.length > 0 ? categoryIds : undefined,
        };

        const response = await axios.post(`${baseUrl}/posts`, postData, {
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json',
          },
        });

        results.push({
          success: true,
          postId: response.data.id,
          title: post.title,
          editUrl: response.data.link?.replace(/\/$/, '') + '/wp-admin/post.php?post=' + response.data.id + '&action=edit',
        });

        console.log(`✅ Created draft: "${post.title}" (ID: ${response.data.id})`);

        // Small delay between posts
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error: any) {
        results.push({
          success: false,
          title: post.title,
          error: error.response?.data?.message || error.message,
        });
        console.error(`❌ Failed to create: "${post.title}"`, error.response?.data || error.message);
      }
    }

    const successCount = results.filter((r) => r.success).length;

    return NextResponse.json({
      success: successCount > 0,
      message: `Created ${successCount} of ${samplePosts.length} draft posts`,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error creating test drafts:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.response?.data,
      },
      { status: 500 }
    );
  }
}
