const { GraphQLClient } = require('graphql-request');

const endpoint = 'https://wholelotofnature.com/graphql';

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    'Content-Type': 'application/json',
  },
});

async function testGraphQL() {
  console.log('🔄 Testing GraphQL Connection...\n');

  try {
    const query = `
      query GetPosts {
        posts {
          nodes {
            id
            title
            slug
            date
          }
        }
      }
    `;

    const data = await graphQLClient.request(query);

    console.log('✅ GraphQL Request Successful!');
    console.log(`Posts found: ${data.posts.nodes.length}`);

    if (data.posts.nodes.length > 0) {
      console.log('\n📝 Sample Post:');
      const post = data.posts.nodes[0];
      console.log(`  - Title: ${post.title}`);
      console.log(`  - Slug: ${post.slug}`);
      console.log(`  - Date: ${post.date}`);
    }
  } catch (error) {
    console.error('❌ GraphQL Error:', error.message);
  }
}

testGraphQL();
