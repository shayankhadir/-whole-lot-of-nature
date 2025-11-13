# Trend Agent Configuration

## Environment Variables

Add these to your `.env.local` file to enable WordPress publishing:

```env
# WordPress Configuration (Optional - required for auto-publishing)
WORDPRESS_SITE_URL=https://your-site.com
WORDPRESS_USERNAME=your_api_user
WORDPRESS_PASSWORD=your_app_password

# OpenAI Configuration (Optional - for enhanced content generation)
OPENAI_API_KEY=sk-your-api-key

# Reddit Configuration (Optional - for enhanced Reddit scraping)
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
```

## Setup Instructions

### 1. Trend Scraping

The trend scraper collects data from:
- **Reddit**: Gardening and plant subreddits
- **Google Trends**: Popular search terms
- **YouTube**: Video titles and descriptions
- **Medium**: Popular articles
- **Quora**: Common questions

**No setup required** - starts working immediately!

### 2. SEO Optimization

The SEO optimizer generates:
- Optimized titles (50-60 characters)
- Meta descriptions (150-160 characters)
- Keyword research and LSI keywords
- Schema.org structured data
- Internal linking suggestions
- Readability scoring

**No setup required** - works out of the box!

### 3. Blog Post Generation

Automatically creates:
- SEO-optimized introductions
- Well-structured content with proper headings
- Step-by-step guides
- FAQ sections
- Engaging conclusions with CTAs

**No API required** - uses intelligent templates!

### 4. WordPress Publishing (Optional)

To auto-publish posts to WordPress:

1. **Create Application Password in WordPress**:
   - Go to: `Your Site Admin > Users > Profile`
   - Scroll to "Application Passwords"
   - Create a new app password for "Trend Agent"
   - Copy the generated password

2. **Set Environment Variables**:
   ```env
   WORDPRESS_SITE_URL=https://your-site.com
   WORDPRESS_USERNAME=your_admin_username
   WORDPRESS_PASSWORD=app_password_from_step_1
   ```

3. **Configure Publishing Strategy**:
   - Edit `/src/lib/agents/scheduledTrendAgent.ts`
   - Change `publishStrategy` from `'draft'` to `'scheduled'` or `'immediate'`

### 5. Access the Dashboard

Navigate to:
```
https://your-site.com/admin/trends
```

This shows:
- Real-time statistics
- Run history
- Manual run trigger
- Error logs
- Performance metrics

## API Endpoints

### Get Trends
```bash
GET /api/trends
GET /api/trends?category=plants
GET /api/trends?keyword=indoor+plants
GET /api/trends?limit=50
```

### Generate Blog Post
```bash
POST /api/generate-blog-post
{
  "topic": "Indoor Plant Care",
  "keyword": "best indoor plants for beginners",
  "description": "A comprehensive guide..."
}
```

### Execute Agent Run
```bash
POST /api/agent/run?action=execute
GET /api/agent/run?action=stats
GET /api/agent/run?action=history&limit=10
GET /api/agent/run?action=latest
```

## Schedule Automated Runs

To run the agent automatically, set up a cron job (using a service like:

### Option 1: Vercel Cron (Recommended for Vercel deployments)

Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/agent-run",
      "schedule": "0 9 * * 1,3,5"
    }
  ]
}
```

### Option 2: External Cron Service

Use services like:
- [EasyCron](https://www.easycron.com/)
- [cron-job.org](https://cron-job.org/)
- [healthchecks.io](https://healthchecks.io/)

Configure to call: `https://your-site.com/api/agent/run?action=execute`

### Option 3: Local Development with Node-Schedule

Create `/src/jobs/agent.js`:
```javascript
const schedule = require('node-schedule');
const fetch = require('node-fetch');

// Run every Tuesday, Wednesday, Friday at 9 AM
schedule.scheduleJob('0 9 * * 2,3,5', async () => {
  console.log('Running trend agent...');
  await fetch('http://localhost:3000/api/agent/run?action=execute', {
    method: 'POST'
  });
});
```

## Usage Examples

### Example 1: Fetch Recent Trends
```javascript
const response = await fetch('/api/trends?limit=10');
const { trends } = await response.json();

trends.forEach(trend => {
  console.log(`${trend.title} (${trend.source})`);
  console.log(`Engagement: ${trend.engagement}`);
  console.log(`Keywords: ${trend.keywords.join(', ')}\n`);
});
```

### Example 2: Generate and Publish a Post
```javascript
// Generate post from a trend
const genResponse = await fetch('/api/generate-blog-post', {
  method: 'POST',
  body: JSON.stringify({
    topic: 'Indoor Plant Propagation',
    keyword: 'how to propagate plants',
    description: 'Learn easy methods to propagate indoor plants'
  })
});

const { post } = await genResponse.json();
console.log(`Generated: ${post.title}`);
console.log(`Word count: ${post.wordCount}`);
console.log(`Read time: ${post.estimatedReadTime} minutes`);
```

### Example 3: Run Full Agent Pipeline
```javascript
// Execute complete trend scraping → post generation → publishing
const response = await fetch('/api/agent/run?action=execute', {
  method: 'POST'
});

const { run } = await response.json();
console.log(`Collected: ${run.trendsCollected} trends`);
console.log(`Generated: ${run.postsGenerated} posts`);
console.log(`Published: ${run.postsPublished} posts`);
```

## Monitoring & Troubleshooting

### Check Agent Statistics
```
GET /api/agent/run?action=stats
```

### View Run History
```
GET /api/agent/run?action=history&limit=20
```

### Manual Test Run
1. Open `/admin/trends`
2. Click "Execute Agent Run"
3. Monitor progress in real-time
4. Check the error logs

### Common Issues

**WordPress Connection Failed**
- Verify WordPress site URL is correct
- Ensure username/password are correct
- Check if Application Password is still valid
- Verify user has publishing permissions

**No Trends Being Collected**
- Check internet connection
- Verify Reddit isn't being rate-limited
- Try running with `maxResults: 100`
- Check browser console for CORS errors

**Posts Not Publishing**
- Verify WordPress REST API is enabled
- Check category and tag creation
- Review error logs in dashboard
- Test with `publishStrategy: 'draft'` first

## Performance Tips

1. **Optimize Trend Scraping**:
   - Set `maxResults` to 50 for faster execution
   - Run during off-peak hours
   - Cache trends for 24 hours

2. **Improve Publishing**:
   - Use `publishStrategy: 'scheduled'` to avoid server load
   - Batch publish 3-5 posts per run
   - Add delay between API calls (1 second)

3. **Monitor Results**:
   - Check dashboard every week
   - Review blog analytics
   - Adjust keywords based on performance

## Advanced Configuration

### Custom Subreddits
Edit `src/lib/agents/trendScraper.ts`:
```typescript
redditSubreddits: ['gardening', 'plants', 'homegardens', 'permaculture']
```

### Target Different Languages
```typescript
googleTrendsRegion: 'IN' // India
// Or: 'US', 'GB', 'CA', 'AU', etc.
```

### Adjust Publishing Frequency
```typescript
runInterval: 'daily' // or 'weekly', 'twice-weekly'
```

## Support

For issues or questions:
1. Check the dashboard error logs
2. Review API endpoint responses
3. Verify environment configuration
4. Check browser console for client-side errors

---

**Last Updated**: November 2024
**Version**: 1.0.0
