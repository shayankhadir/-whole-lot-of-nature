# Blog Publishing Guide - Trend Agent System

## Overview

Your automated blog publishing system works in three stages:
1. **Trend Collection** - Scrapes Reddit, Google Trends, Medium, YouTube for trending topics
2. **Blog Generation** - Creates SEO-optimized blog posts from collected trends
3. **WordPress Publishing** - Auto-publishes posts to your WordPress site

---

## When Are Posts Published?

### Current Publishing Strategies

The system supports **3 different publishing strategies**:

#### 1. **DRAFT Mode** (Current Default) 🟡
Posts are created as **drafts** in WordPress - NOT automatically published
- ✅ Safe for review before publishing
- ✅ Manual quality control
- ✅ Requires you to publish manually via WordPress dashboard

**How to publish drafts:**
- Go to your WordPress dashboard → Posts
- Review draft posts created by the agent
- Click "Publish" when ready

---

#### 2. **SCHEDULED Mode** 📅
Posts are scheduled to publish at a future date/time
- ✅ Automatic publishing on schedule
- ✅ Control over publishing frequency
- ✅ Reduces manual work
- ⚠️ Requires `publishDate` configuration

**How to enable:**
```typescript
// In .env or API call
PUBLISH_STRATEGY=scheduled
PUBLISH_SCHEDULE=daily  // or 'weekly', 'twice-weekly'
```

---

#### 3. **IMMEDIATE Mode** ⚡
Posts are published **instantly** to your live site
- ✅ Fastest publishing
- ✅ Fully automatic
- ⚠️ No manual review - AI posts go live immediately
- ⚠️ Requires AI integration (you'll add later)

**How to enable:**
```typescript
// In .env
PUBLISH_STRATEGY=immediate
```

---

## How to Know the Agent is Working

### Method 1: Admin Dashboard 📊
**Access:** `http://yoursite.com/admin/trends`

Shows real-time stats:
- ✅ Total runs executed
- ✅ Success rate %
- ✅ Total trends collected
- ✅ Total posts generated
- ✅ Total posts published
- ✅ Latest run details with status

**Example dashboard shows:**
```
Total Runs: 5
Success Rate: 100%
Total Posts: 24
Published: 5
Trends Collected: 23
Avg Posts/Run: 4.8
```

---

### Method 2: Trigger Manual Run

**Option A: Via Dashboard Button**
1. Go to `/admin/trends`
2. Click "Execute Agent Run" button
3. Watch it run and collect trends in real-time
4. See results immediately on dashboard

**Option B: Via API (curl)**
```bash
curl -X POST http://localhost:3000/api/agent/run?action=execute
```

**Response:**
```json
{
  "success": true,
  "run": {
    "id": "run-1731547234567",
    "timestamp": "2024-11-13T10:20:34.567Z",
    "trendsCollected": 7,
    "postsGenerated": 5,
    "postsPublished": 5,
    "status": "completed",
    "errors": []
  }
}
```

---

### Method 3: Check WordPress

**In WordPress Dashboard:**
1. Go to **Posts**
2. Look for new posts with titles like:
   - "Best Indoor Plants for Low Light: Complete Guide"
   - "Sustainable Gardening Tips for 2024"
   - "Plant Propagation Methods: A Beginner's Guide"
3. Check post **date/status**:
   - 🟡 **Draft** = Generated but not yet published
   - 🟢 **Published** = Live on your site
   - 📅 **Scheduled** = Will publish at set time

---

### Method 4: API Stats Endpoint

```bash
# Get system statistics
curl http://localhost:3000/api/agent/run?action=stats

# Response
{
  "success": true,
  "stats": {
    "totalRuns": 5,
    "successfulRuns": 5,
    "totalTrends": 23,
    "totalPosts": 24,
    "totalPublished": 5,
    "averagePostsPerRun": 4.8,
    "successRate": 100
  }
}
```

---

## Current Setup Status

### ✅ Already Configured

**WordPress Connection:**
```
WORDPRESS_SITE_URL=https://admin.wholelotofnature.com ✅
WORDPRESS_USERNAME=set ✅
WORDPRESS_PASSWORD=set ✅
```

**Agent Configuration:**
```
Run Interval: weekly (can change to 'daily' or 'twice-weekly')
Max Posts Per Run: 5
Publish Strategy: draft (CURRENT - change to 'scheduled' or 'immediate')
Categories: Gardening, Plant Care, Sustainability
Max Trend Age: 7 days
```

**Trend Sources:**
- ✅ Reddit (r/gardening, r/plants, r/houseplants, r/succulents, r/Indiegardeners)
- ✅ Google Trends (India region)
- ✅ YouTube (gardening, plant care, sustainable gardening)
- ✅ Medium (gardening, plants, sustainability)

---

## Step-by-Step: Enable Automatic Publishing

### Step 1: Choose Publishing Strategy

**Option A: Scheduled Publishing (Recommended for first time)**
```bash
# Edit your .env file and add:
PUBLISH_STRATEGY=scheduled
PUBLISH_DATE_FORMAT=2024-11-20T09:00:00  # When to publish
```

**Option B: Keep Draft Mode (Most Safe)**
- Posts go to WordPress as drafts
- You review on WordPress dashboard
- Click "Publish" when ready
- No changes needed - already working!

### Step 2: Test the System

**Run manual test:**
```bash
curl -X POST http://localhost:3000/api/agent/run?action=execute
```

**Expected output:**
- 5-7 trends collected from multiple sources
- 5 blog posts generated with SEO optimization
- Posts created as DRAFTS in WordPress (or SCHEDULED if configured)

### Step 3: Verify on WordPress

1. Log in to WordPress dashboard
2. Go to **Posts**
3. Should see 5 new blog posts
4. Status shows either:
   - **Draft** (needs manual publishing)
   - **Scheduled** (will auto-publish at set time)
   - **Published** (live now)

### Step 4: Auto-Run on Schedule (Optional)

Use a cron job or external scheduler:

**Using node-cron (built-in):**
- Already available in system
- Call `/api/agent/run?action=execute` every day/week

**Using external service (Vercel Cron):**
```
# In /api/agent/run/route.ts add:
export const config = {
  runtime: 'nodejs',
  crons: ['0 9 * * *'], // 9 AM daily
};
```

---

## Troubleshooting

### "0 posts published"
**Cause:** WordPress credentials not set
**Solution:**
```bash
# Check .env has:
WORDPRESS_SITE_URL=https://admin.wholelotofnature.com
WORDPRESS_USERNAME=your_username
WORDPRESS_PASSWORD=your_app_password
```

### "Posts generated but not published"
**Cause:** `publishStrategy: 'draft'` (default)
**Solution:**
- Check WordPress dashboard for draft posts
- Manually publish them OR
- Change strategy to 'scheduled' or 'immediate'

### "API returns error"
**Check logs:**
```bash
# View terminal output where dev server is running
# Look for error messages with "Error publishing to WordPress:"
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                          │
│              /admin/trends (your monitoring)                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  /api/agent/run?action=execute
        │   (Manual trigger or cron)   │
        └──────────────┬───────────────┘
                       │
        ┌──────────────▼───────────────┐
        │  ScheduledTrendAgent starts  │
        └──────────────┬───────────────┘
                       │
        ┌──────────────▼───────────────┐
        │  1. TREND SCRAPER            │
        │  - Scrapes Reddit            │
        │  - Scrapes Google Trends     │
        │  - Scrapes YouTube           │
        │  - Scrapes Medium            │
        │  Result: 5-7 trends          │
        └──────────────┬───────────────┘
                       │
        ┌──────────────▼───────────────┐
        │  2. BLOG GENERATOR           │
        │  - Converts trends to posts  │
        │  - SEO optimization          │
        │  - Keyword extraction        │
        │  - Meta tags added           │
        │  Result: 5 blog posts        │
        └──────────────┬───────────────┘
                       │
        ┌──────────────▼───────────────┐
        │  3. WORDPRESS PUBLISHER      │
        │  Publishing Strategy:        │
        │  - DRAFT: Creates as draft   │
        │  - SCHEDULED: Schedules      │
        │  - IMMEDIATE: Publishes now  │
        └──────────────┬───────────────┘
                       │
        ┌──────────────▼───────────────┐
        │  WordPress REST API          │
        │  Your site database updates  │
        └──────────────┬───────────────┘
                       │
        ┌──────────────▼───────────────┐
        │  Dashboard updated with      │
        │  - Run stats                 │
        │  - Post counts               │
        │  - Success rate              │
        └──────────────────────────────┘
```

---

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/agents/trendScraper.ts` | Collects trends from multiple sources |
| `src/lib/agents/blogPostGenerator.ts` | Converts trends to SEO blog posts |
| `src/lib/agents/seoOptimizer.ts` | Adds SEO metadata and keywords |
| `src/lib/agents/wordPressPublisher.ts` | Publishes posts to WordPress |
| `src/lib/agents/scheduledTrendAgent.ts` | Orchestrates the complete pipeline |
| `src/app/api/agent/run/route.ts` | API endpoint to trigger/monitor agent |
| `src/components/admin/TrendAgentDashboard.tsx` | Admin monitoring interface |
| `src/app/admin/trends/page.tsx` | Dashboard page |

---

## Next Steps

### 🎯 Immediate (Already Working)
- ✅ Trends scraping - working
- ✅ Blog generation - working
- ✅ WordPress publishing - configured
- ✅ Admin dashboard - ready at `/admin/trends`

### 📋 Add AI Integration (You mentioned)
When ready, you'll add:
- OpenAI API key to generate better content
- Replace placeholder post generation with AI-powered content
- Higher quality posts automatically

### 📅 Setup Scheduling (Optional)
- Configure cron job for automatic daily/weekly runs
- Or use `/api/agent/run?action=execute` endpoint with external scheduler

---

## Quick Commands

```bash
# Execute manual agent run
curl -X POST http://localhost:3000/api/agent/run?action=execute

# Get statistics
curl http://localhost:3000/api/agent/run?action=stats

# Get latest run details
curl http://localhost:3000/api/agent/run?action=latest

# Get last 5 runs history
curl http://localhost:3000/api/agent/run?action=history&limit=5

# View dashboard
# Open browser: http://localhost:3000/admin/trends
```

---

## Contact Publishing Status Right Now

📊 **Go to:** `http://localhost:3000/admin/trends`

You'll see:
- How many agent runs have completed
- Total trends collected
- Total blog posts generated
- Total posts published to WordPress
- Status of the latest run
- Button to execute another run immediately

**That's your real-time view of the publishing system! 🎉**
