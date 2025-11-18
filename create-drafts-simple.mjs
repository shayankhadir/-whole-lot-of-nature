import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const baseUrl = `${process.env.WORDPRESS_SITE_URL || process.env.WORDPRESS_URL}/wp-json/wp/v2`;
const username = process.env.WORDPRESS_USERNAME;
const password = (process.env.WORDPRESS_PASSWORD || process.env.WORDPRESS_APP_PASSWORD)?.replace(/ /g, '');

const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

const samplePosts = [
  {
    title: 'Complete Guide to Growing Tomatoes at Home in India',
    content: `<h2>Why Grow Tomatoes at Home?</h2>
<p>Homegrown tomatoes are fresher, tastier, and free from harmful pesticides. With India's diverse climate, you can grow tomatoes almost year-round in many regions. This comprehensive guide will help you cultivate juicy, organic tomatoes right on your balcony or terrace.</p>

<h2>Best Time to Plant Tomatoes in India</h2>
<p>The ideal planting time varies by region:</p>
<ul>
<li><strong>North India:</strong> February-March (spring) and September-October (autumn)</li>
<li><strong>South India:</strong> October-November for best results</li>
<li><strong>Coastal Regions:</strong> Avoid monsoon season; plant in October-November</li>
</ul>

<h2>Choosing the Right Tomato Varieties</h2>
<h3>Popular Varieties for Indian Climate</h3>
<p><strong>Pusa Ruby:</strong> Heat-tolerant, disease-resistant, perfect for North India. Produces medium-sized red fruits in 70-75 days.</p>
<p><strong>Arka Vikas:</strong> Developed by IIHR Bangalore, this variety is excellent for South Indian conditions with good disease resistance.</p>
<p><strong>Cherry Tomatoes:</strong> Perfect for containers, these small tomatoes are prolific producers and great for salads.</p>

<h2>Step-by-Step Planting Guide</h2>
<h3>1. Container Selection</h3>
<p>Choose containers at least 12 inches deep with drainage holes. Bigger is better - 15-20 liters is ideal for one plant.</p>

<h3>2. Soil Preparation</h3>
<p>Create the perfect mix:</p>
<ul>
<li>50% garden soil or coco peat</li>
<li>30% vermicompost or cow dung manure</li>
<li>20% river sand or perlite for drainage</li>
<li>Add a handful of neem cake for pest prevention</li>
</ul>

<h3>3. Seed Starting or Transplanting</h3>
<p>You can start from seeds or purchase seedlings from nurseries. If starting from seeds, sow in seed trays first and transplant when seedlings reach 4-5 inches tall.</p>

<h2>Essential Care Requirements</h2>
<h3>Watering Schedule</h3>
<p>Tomatoes need consistent moisture but hate waterlogged soil. Water daily in summer mornings, checking that the top inch of soil is dry. Reduce watering in winter to every 2-3 days.</p>

<h3>Sunlight Requirements</h3>
<p>Tomatoes are sun-lovers! Provide at least 6-8 hours of direct sunlight daily. Morning sun is particularly beneficial.</p>

<h3>Fertilization</h3>
<p>Feed every 15 days with organic options:</p>
<ul>
<li>Diluted cow dung manure tea</li>
<li>Banana peel fertilizer (rich in potassium for fruit development)</li>
<li>Seaweed extract or compost tea</li>
</ul>

<h2>Support and Pruning</h2>
<p>Install bamboo stakes or cages when plants reach 12 inches tall. Prune suckers (shoots growing between main stem and branches) to direct energy toward fruit production.</p>

<h2>Common Problems and Solutions</h2>
<h3>Blossom End Rot</h3>
<p>Dark spots on bottom of fruits indicate calcium deficiency. Add crushed eggshells to soil and maintain consistent watering.</p>

<h3>Pests: Aphids and Whiteflies</h3>
<p>Spray neem oil solution (5ml per liter water) weekly as prevention. For severe infestations, use soap water spray.</p>

<h3>Fungal Diseases</h3>
<p>Avoid overhead watering and ensure good air circulation. Remove affected leaves immediately and apply organic fungicides if needed.</p>

<h2>Harvesting Your Tomatoes</h2>
<p>Most varieties are ready to harvest 60-80 days after transplanting. Pick tomatoes when they're fully colored but still firm. Harvest regularly to encourage more fruit production.</p>

<h2>Pro Tips for Maximum Yield</h2>
<ul>
<li>Plant marigolds nearby to repel pests naturally</li>
<li>Add Epsom salt (1 tablespoon per plant monthly) for magnesium boost</li>
<li>Mulch with dried leaves to retain moisture and prevent weeds</li>
<li>Rotate crops - don't plant tomatoes in the same soil consecutively</li>
</ul>

<h2>Conclusion</h2>
<p>Growing tomatoes at home is incredibly rewarding. With proper care and attention, a single plant can yield 4-5 kg of delicious tomatoes throughout the season. Start your tomato garden today and enjoy farm-fresh produce right from your balcony!</p>`,
    excerpt: 'Learn how to grow juicy, organic tomatoes at home with this complete guide for Indian climate. From seed selection to harvest, master tomato gardening with expert tips and tricks.',
    tags: ['tomato gardening', 'vegetable garden', 'balcony gardening', 'organic vegetables', 'home farming', 'kitchen garden'],
    featuredImage: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=1200&h=630',
  },
  {
    title: 'Indoor Air-Purifying Plants: NASA-Approved Plants for Your Home',
    content: `<h2>The Science of Air-Purifying Plants</h2>
<p>NASA's Clean Air Study revolutionized our understanding of indoor plants. These green companions don't just beautify spaces—they actively remove harmful toxins like formaldehyde, benzene, and trichloroethylene from indoor air. Let's explore the best air-purifying plants for Indian homes.</p>

<h2>Top 10 NASA-Approved Air-Purifying Plants</h2>

<h3>1. Snake Plant (Sansevieria trifasciata)</h3>
<p><strong>Toxins Removed:</strong> Formaldehyde, nitrogen oxide, benzene, xylene, toluene</p>
<p><strong>Why It's Perfect:</strong> Releases oxygen at night (unlike most plants), making it ideal for bedrooms. Extremely low-maintenance and tolerates neglect.</p>
<p><strong>Care Tips:</strong></p>
<ul>
<li>Water every 2-3 weeks; allow soil to dry completely</li>
<li>Survives in low to bright indirect light</li>
<li>Toxic to pets, so keep away from curious cats and dogs</li>
</ul>

<h3>2. Peace Lily (Spathiphyllum)</h3>
<p><strong>Toxins Removed:</strong> Ammonia, benzene, formaldehyde, trichloroethylene</p>
<p><strong>Why It's Perfect:</strong> Beautiful white flowers and excellent for bathrooms where it thrives in humidity.</p>
<p><strong>Care Tips:</strong></p>
<ul>
<li>Prefers low to medium light</li>
<li>Water when leaves start to droop slightly</li>
<li>Mist leaves weekly for humidity</li>
</ul>

<h3>3. Spider Plant (Chlorophytum comosum)</h3>
<p><strong>Toxins Removed:</strong> Formaldehyde, xylene, carbon monoxide</p>
<p><strong>Why It's Perfect:</strong> Produces baby plantlets you can propagate endlessly. Excellent for beginners.</p>
<p><strong>Care Tips:</strong></p>
<ul>
<li>Bright, indirect light for best growth</li>
<li>Water 2-3 times weekly in summer</li>
<li>Brown leaf tips indicate chlorine in water—use filtered water</li>
</ul>

<h3>4. Areca Palm (Dypsis lutescens)</h3>
<p><strong>Toxins Removed:</strong> Formaldehyde, xylene, toluene</p>
<p><strong>Why It's Perfect:</strong> Adds humidity to air while purifying. Creates a tropical ambiance.</p>
<p><strong>Care Tips:</strong></p>
<ul>
<li>Needs bright, indirect sunlight</li>
<li>Keep soil consistently moist but not waterlogged</li>
<li>Fertilize monthly during growing season</li>
</ul>

<h3>5. Money Plant (Epipremnum aureum/Pothos)</h3>
<p><strong>Toxins Removed:</strong> Formaldehyde, benzene, xylene, carbon monoxide</p>
<p><strong>Why It's Perfect:</strong> Grows rapidly, looks beautiful trailing from shelves, and is considered auspicious in Indian homes.</p>
<p><strong>Care Tips:</strong></p>
<ul>
<li>Thrives in water or soil</li>
<li>Low to bright indirect light</li>
<li>Prune regularly to encourage bushier growth</li>
</ul>

<h3>6. Aloe Vera</h3>
<p><strong>Toxins Removed:</strong> Formaldehyde, benzene</p>
<p><strong>Why It's Perfect:</strong> Dual purpose—purifies air AND provides medicinal gel for skin care and burns.</p>
<p><strong>Care Tips:</strong></p>
<ul>
<li>Needs bright, indirect sunlight</li>
<li>Water deeply but infrequently (every 2-3 weeks)</li>
<li>Use well-draining cactus soil mix</li>
</ul>

<h3>7. Boston Fern (Nephrolepis exaltata)</h3>
<p><strong>Toxins Removed:</strong> Formaldehyde, xylene</p>
<p><strong>Why It's Perfect:</strong> Acts as a natural humidifier, perfect for dry Indian homes during winter.</p>
<p><strong>Care Tips:</strong></p>
<ul>
<li>Needs high humidity—mist daily or place on pebble tray</li>
<li>Keep soil consistently moist</li>
<li>Indirect light; avoid direct sun</li>
</ul>

<h3>8. Rubber Plant (Ficus elastica)</h3>
<p><strong>Toxins Removed:</strong> Formaldehyde</p>
<p><strong>Why It's Perfect:</strong> Large, glossy leaves create dramatic visual impact while cleaning air efficiently.</p>
<p><strong>Care Tips:</strong></p>
<ul>
<li>Bright, indirect light</li>
<li>Water when top 2 inches of soil dry out</li>
<li>Wipe leaves monthly to remove dust</li>
</ul>

<h3>9. Dracaena (Multiple varieties)</h3>
<p><strong>Toxins Removed:</strong> Benzene, formaldehyde, trichloroethylene, xylene</p>
<p><strong>Why It's Perfect:</strong> Available in many colorful varieties, grows tall, and is very effective at removing multiple toxins.</p>
<p><strong>Care Tips:</strong></p>
<ul>
<li>Moderate to bright indirect light</li>
<li>Allow soil to dry between waterings</li>
<li>Sensitive to fluoride—use filtered water</li>
</ul>

<h3>10. Bamboo Palm (Chamaedorea seifrizii)</h3>
<p><strong>Toxins Removed:</strong> Formaldehyde, benzene, trichloroethylene</p>
<p><strong>Why It's Perfect:</strong> Adds elegance, grows well indoors, and is pet-safe.</p>
<p><strong>Care Tips:</strong></p>
<ul>
<li>Prefers bright, indirect light</li>
<li>Keep soil evenly moist</li>
<li>Mist regularly for humidity</li>
</ul>

<h2>How Many Plants Do You Need?</h2>
<p>NASA recommends 1-2 good-sized plants per 100 square feet of indoor space for optimal air purification. For a typical Indian bedroom (120 sq ft), 2-3 plants are ideal.</p>

<h2>Placement Tips for Maximum Benefit</h2>
<ul>
<li><strong>Bedroom:</strong> Snake Plant, Aloe Vera (release oxygen at night)</li>
<li><strong>Living Room:</strong> Areca Palm, Rubber Plant (make visual statements)</li>
<li><strong>Bathroom:</strong> Peace Lily, Boston Fern (love humidity)</li>
<li><strong>Kitchen:</strong> Pothos, Spider Plant (tolerate temperature fluctuations)</li>
<li><strong>Home Office:</strong> Dracaena, Bamboo Palm (reduce fatigue)</li>
</ul>

<h2>Common Mistakes to Avoid</h2>
<ul>
<li>Overwatering (leading cause of death for indoor plants)</li>
<li>Keeping plants in dark corners without assessing light needs</li>
<li>Using unfiltered tap water with high chemical content</li>
<li>Neglecting to dust leaves (dusty leaves can't photosynthesize properly)</li>
<li>Not repotting when plants become root-bound</li>
</ul>

<h2>Conclusion</h2>
<p>Transform your home into a healthier sanctuary with these NASA-approved air-purifying plants. Not only will they clean your indoor air, but they'll also reduce stress, boost mood, and create a connection with nature right in your living space. Start with 2-3 easy-care varieties and watch your indoor jungle grow!</p>`,
    excerpt: 'Discover the top 10 NASA-approved air-purifying plants perfect for Indian homes. Learn which plants remove specific toxins and how to care for them effectively.',
    tags: ['air purifying plants', 'indoor plants', 'NASA plants', 'healthy home', 'plant care', 'indoor gardening'],
    featuredImage: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=1200&h=630',
  },
  {
    title: 'Monsoon Gardening Guide: Best Plants and Tips for Rainy Season',
    content: `<h2>Embrace the Magic of Monsoon Gardening</h2>
<p>The monsoon season transforms India into a lush paradise. For gardeners, it's the most productive time of year—when seeds germinate faster, plants grow vigorously, and nature comes alive. This comprehensive guide will help you make the most of the rainy season.</p>

<h2>Why Monsoon is Perfect for Gardening</h2>
<ul>
<li>Natural irrigation reduces watering efforts</li>
<li>High humidity promotes faster seed germination</li>
<li>Cooler temperatures reduce plant stress</li>
<li>Perfect time to establish new plants before winter</li>
<li>Soil is easier to work with when moist</li>
</ul>

<h2>Best Vegetables to Grow in Monsoon</h2>

<h3>Leafy Greens (45-60 days to harvest)</h3>
<p><strong>Spinach (Palak):</strong> Sow directly in beds or containers. Harvest leaves continuously for 2-3 months.</p>
<p><strong>Fenugreek (Methi):</strong> Germination in 3-5 days. Ready to harvest in just 20-30 days. Perfect for beginners.</p>
<p><strong>Coriander (Dhania):</strong> Use coriander seeds from your kitchen. Soak overnight before sowing for faster germination.</p>
<p><strong>Amaranth (Lal Saag):</strong> Thrives in monsoon humidity. Highly nutritious and grows rapidly.</p>

<h3>Gourds and Climbers</h3>
<p><strong>Bottle Gourd (Lauki):</strong> Start in early monsoon. Needs strong trellis support. Harvest in 60-80 days.</p>
<p><strong>Ridge Gourd (Turai):</strong> Fast-growing vine perfect for vertical gardening. Produces abundantly.</p>
<p><strong>Bitter Gourd (Karela):</strong> Medicinal vegetable that loves monsoon conditions. Ensure good drainage.</p>

<h3>Other Monsoon Vegetables</h3>
<p><strong>Okra (Bhindi):</strong> Sow seeds directly. Harvest pods when tender for best taste.</p>
<p><strong>Radish (Mooli):</strong> Fast-growing root vegetable ready in 30-40 days. Sow every 2 weeks for continuous harvest.</p>
<p><strong>Tomatoes:</strong> Plant early monsoon in North India. Choose disease-resistant varieties.</p>

<h2>Beautiful Monsoon Flowering Plants</h2>

<h3>Annuals (Complete lifecycle in one season)</h3>
<p><strong>Balsam (Gul Mehendi):</strong> Colorful flowers in pink, red, white. Self-seeding annual that returns yearly.</p>
<p><strong>Marigold (Genda):</strong> Start from seeds or buy seedlings. Blooms for months and repels pests.</p>
<p><strong>Zinnia:</strong> Available in vibrant colors. Excellent cut flowers. Attracts butterflies.</p>
<p><strong>Cosmos:</strong> Delicate, daisy-like flowers. Thrives with minimal care. Creates beautiful borders.</p>

<h3>Perennials (Return year after year)</h3>
<p><strong>Canna Lily:</strong> Bold, tropical flowers in red, yellow, orange. Grows from rhizomes.</p>
<p><strong>Ginger Lily (Hedychium):</strong> Fragrant white or yellow flowers. Loves monsoon moisture.</p>
<p><strong>Rain Lily (Zephyranthes):</strong> Magical flowers that bloom after rain showers. Low maintenance.</p>

<h2>Essential Monsoon Gardening Tips</h2>

<h3>1. Drainage is Critical</h3>
<p>Waterlogging kills more plants during monsoon than anything else. Solutions:</p>
<ul>
<li>Raise beds by 6-8 inches if ground gets waterlogged</li>
<li>Ensure all containers have multiple drainage holes</li>
<li>Add 20-30% sand or perlite to soil mix for better drainage</li>
<li>Create channels for excess water to flow away</li>
</ul>

<h3>2. Disease Prevention</h3>
<p>High humidity invites fungal diseases. Preventive measures:</p>
<ul>
<li>Avoid overhead watering (rain is enough!)</li>
<li>Ensure good air circulation between plants</li>
<li>Remove dead or diseased leaves immediately</li>
<li>Spray neem oil solution fortnightly as preventive</li>
<li>Apply wood ash around plants to prevent fungal growth</li>
</ul>

<h3>3. Pest Management</h3>
<p>Monsoon brings pests along with prosperity:</p>
<ul>
<li><strong>Slugs and Snails:</strong> Place crushed eggshells or coffee grounds around plants</li>
<li><strong>Aphids:</strong> Spray soapy water or neem oil solution</li>
<li><strong>Caterpillars:</strong> Hand-pick in morning or use Bt (Bacillus thuringiensis)</li>
</ul>

<h3>4. Staking and Support</h3>
<p>Wind and heavy rain can damage plants. Install stakes, trellises, and cages before storms hit. Tie plants loosely to allow growth while providing support.</p>

<h3>5. Fertilization Schedule</h3>
<p>Heavy rains wash away nutrients. Compensate by:</p>
<ul>
<li>Adding compost or vermicompost monthly</li>
<li>Using slow-release organic fertilizers like neem cake</li>
<li>Foliar feeding with seaweed extract every 15 days</li>
<li>Mulching to prevent nutrient leaching</li>
</ul>

<h2>Container Gardening in Monsoon</h2>
<p>Perfect for apartment dwellers:</p>
<ul>
<li>Use containers with excellent drainage</li>
<li>Place pots in partially covered areas to control water exposure</li>
<li>Elevate containers on bricks to improve drainage</li>
<li>Use lighter, well-draining potting mix (not heavy garden soil)</li>
<li>Group pots together for better humidity management</li>
</ul>

<h2>Post-Monsoon Preparation</h2>
<p>As monsoon ends, transition your garden:</p>
<ul>
<li>Start seeds for winter vegetables (cauliflower, cabbage, peas)</li>
<li>Divide and replant monsoon perennials</li>
<li>Collect seeds from annuals for next year</li>
<li>Clean and sanitize tools to prevent disease spread</li>
<li>Prepare beds for winter planting</li>
</ul>

<h2>Region-Specific Tips</h2>
<p><strong>North India:</strong> Monsoon is shorter and less intense. Focus on quick-growing crops and be prepared for dry spells.</p>
<p><strong>South India:</strong> Longer monsoon season allows multiple successions of leafy greens. Watch for waterlogging in low-lying areas.</p>
<p><strong>Coastal Regions:</strong> Higher humidity increases fungal disease risk. Prioritize disease-resistant varieties and good air circulation.</p>

<h2>Conclusion</h2>
<p>Monsoon gardening is incredibly rewarding when done right. The key is working with nature—providing drainage while celebrating the abundance of water, preventing diseases while enjoying the lush growth, and selecting plants that thrive in monsoon magic. Start your monsoon garden today and experience the joy of harvesting fresh vegetables and enjoying beautiful blooms during India's most enchanting season!</p>`,
    excerpt: 'Master monsoon gardening with this complete guide to vegetables, flowers, and care tips for the rainy season. Learn what to grow and how to prevent common monsoon gardening problems.',
    tags: ['monsoon gardening', 'rainy season', 'seasonal planting', 'indian gardening', 'vegetable garden', 'flowering plants'],
    featuredImage: 'https://images.unsplash.com/photo-1534710961216-75c88202f43e?w=1200&h=630',
  },
];

async function createDrafts() {
  console.log('Creating draft posts...\n');
  console.log('WordPress URL:', baseUrl);
  console.log('Username:', username);
  console.log('Has password:', !!password);
  console.log('---\n');

  for (const post of samplePosts) {
    try {
      // First, create/get tags
      const tagIds = [];
      if (post.tags && post.tags.length > 0) {
        for (const tagName of post.tags) {
          try {
            // Check if tag exists
            const tagSearchResponse = await axios.get(`${baseUrl}/tags`, {
              params: { search: tagName, per_page: 1 },
              headers: { Authorization: authHeader },
            });

            let tagId;
            if (tagSearchResponse.data.length > 0) {
              tagId = tagSearchResponse.data[0].id;
            } else {
              // Create new tag
              const tagCreateResponse = await axios.post(
                `${baseUrl}/tags`,
                { name: tagName },
                {
                  headers: {
                    Authorization: authHeader,
                    'Content-Type': 'application/json',
                  },
                }
              );
              tagId = tagCreateResponse.data.id;
            }
            tagIds.push(tagId);
          } catch (tagError) {
            console.error(`   ⚠️  Error with tag "${tagName}":`, tagError.response?.data?.message || tagError.message);
          }
        }
      }

      // Handle featured image
      let featuredMediaId = null;
      if (post.featuredImage) {
        try {
          // Download image from URL
          const imageResponse = await axios.get(post.featuredImage, {
            responseType: 'arraybuffer',
          });

          // Upload to WordPress
          const imageFileName = `${post.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`;
          const uploadResponse = await axios.post(
            `${baseUrl}/media`,
            imageResponse.data,
            {
              headers: {
                Authorization: authHeader,
                'Content-Type': 'image/jpeg',
                'Content-Disposition': `attachment; filename="${imageFileName}"`,
              },
            }
          );
          featuredMediaId = uploadResponse.data.id;
          console.log(`   🖼️  Featured image uploaded (ID: ${featuredMediaId})`);
        } catch (imageError) {
          console.error(`   ⚠️  Could not upload featured image:`, imageError.response?.data?.message || imageError.message);
        }
      }

      // Create the post
      const postData = {
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        status: 'draft',
        tags: tagIds.length > 0 ? tagIds : undefined,
        featured_media: featuredMediaId || undefined,
      };

      const response = await axios.post(`${baseUrl}/posts`, postData, {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
      });

      console.log(`✅ Created: "${post.title}"`);
      console.log(`   ID: ${response.data.id}`);
      console.log(`   Tags: ${post.tags ? post.tags.join(', ') : 'none'}`);
      console.log(`   Edit: ${baseUrl.replace('/wp-json/wp/v2', '')}/wp-admin/post.php?post=${response.data.id}&action=edit\n`);
      
      // Small delay to avoid overwhelming the server
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Failed: "${post.title}"`);
      console.error(`   Error: ${error.response?.data?.message || error.message}\n`);
    }
  }
}

createDrafts().catch(console.error);
