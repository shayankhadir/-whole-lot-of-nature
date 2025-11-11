const appId = '1824242505131163';
const appSecret = '697d402f5317e6db29b39175158d5b10';

async function testInstagramAPI() {
  console.log('Testing Instagram Graph API...');
  
  try {
    // Step 1: Get access token
    console.log('\n1. Requesting access token...');
    const tokenResponse = await fetch(
      `https://graph.instagram.com/v18.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&grant_type=client_credentials`,
      { method: 'GET' }
    );

    if (!tokenResponse.ok) {
      throw new Error(`Failed to get access token: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    console.log('✅ Access token obtained:', tokenData.access_token.slice(0, 20) + '...');

    // Step 2: Get media
    console.log('\n2. Fetching Instagram feed...');
    const feedResponse = await fetch(
      `https://graph.instagram.com/v18.0/me/media?fields=id,caption,media_type,media_url,permalink,timestamp,like_count&access_token=${tokenData.access_token}`,
      { method: 'GET' }
    );

    if (!feedResponse.ok) {
      throw new Error(`Failed to fetch feed: ${feedResponse.statusText}`);
    }

    const feedData = await feedResponse.json();
    console.log('✅ Instagram feed fetched!');
    console.log(`   Found ${feedData.data.length} posts`);

    if (feedData.data.length > 0) {
      console.log('\n📸 Sample post:');
      const post = feedData.data[0];
      console.log(`   - ID: ${post.id}`);
      console.log(`   - Caption: ${post.caption?.slice(0, 50) || 'N/A'}...`);
      console.log(`   - Media Type: ${post.media_type}`);
      console.log(`   - Likes: ${post.like_count}`);
      console.log(`   - Posted: ${post.timestamp}`);
    } else {
      console.log('\n⚠️  No posts found in feed');
    }

    console.log('\n✅ Instagram API integration is working!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testInstagramAPI();
