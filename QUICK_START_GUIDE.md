# 🌿 Trend Agent - Quick Reference Guide

## 🎯 What This Does

Your website now has an **automated AI-powered content generator** that:
- Scrapes trending topics (plants, gardening, nature)
- Generates SEO-optimized blog posts
- Publishes to WordPress automatically
- Monitors performance on a dashboard

---

## 🚀 Get Started in 3 Steps

### Step 1: Access Dashboard
```
https://your-site.com/admin/trends
```

### Step 2: View Statistics
See trends collected, posts generated, success rate

### Step 3: Execute Run
Click "Execute Agent Run" to generate content

---

## 📱 Main Features

| Feature | What It Does | Location |
|---------|-------------|----------|
| **Dashboard** | Monitor stats & run agent | `/admin/trends` |
| **Trends API** | Fetch trending topics | `/api/trends` |
| **Generate API** | Create blog posts | `/api/generate-blog-post` |
| **Agent API** | Control pipeline | `/api/agent/run` |

---

## 🔧 Quick Setup (Optional)

### Enable WordPress Publishing
Edit `.env.local`:
```env
WORDPRESS_SITE_URL=https://admin.wholelotofnature.com
WORDPRESS_USERNAME=your_username
WORDPRESS_PASSWORD=app_password
```

### Automatic Scheduling
Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/agent/run?action=execute",
    "schedule": "0 9 * * 1,3,5"
  }]
}
```

---

## 📊 Expected Results

**Per Run:**
- 30-50 trends collected
- 3-5 blog posts generated
- 2,000-3,000 words each
- 10-15 minute read time

**Per Week (3 runs):**
- 15 new blog posts
- 50,000+ words
- All SEO-optimized
- Auto-published

---

## 🔗 API Examples

### Get Trends
```bash
curl https://your-site.com/api/trends?limit=20
```

### Generate Post
```bash
curl -X POST https://your-site.com/api/generate-blog-post \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Indoor Plants",
    "keyword": "best indoor plants"
  }'
```

### Run Agent
```bash
curl -X POST https://your-site.com/api/agent/run?action=execute
```

### Get Stats
```bash
curl https://your-site.com/api/agent/run?action=stats
```

---

## 📈 Performance Metrics

Track on dashboard:
- **Total Runs**: How many times agent has executed
- **Success Rate**: Percentage of successful runs
- **Total Posts**: Blog posts generated so far
- **Total Published**: Posts published to WordPress
- **Avg Posts/Run**: Average posts per execution

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| No data on dashboard | Execute agent run first |
| Posts not publishing | Check WordPress credentials in .env.local |
| No trends collected | Check internet connection |
| Slow performance | Run during off-peak hours |

---

## 📚 Full Documentation

- **Setup Guide**: `TREND_AGENT_SETUP.md`
- **Implementation Details**: `TREND_AGENT_IMPLEMENTATION.md`
- **Complete Summary**: `TREND_AGENT_SUMMARY.md`

---

## ✨ What's Generated

Each blog post includes:

✅ SEO-optimized title & meta description
✅ Proper H1, H2, H3 heading structure
✅ 2,000-3,000 words of content
✅ Keywords & LSI keywords
✅ Internal linking suggestions
✅ Schema.org structured data
✅ Featured image from Unsplash
✅ Categories & tags
✅ CTA with link to products

---

## 🎯 Dashboard at a Glance

```
┌─────────────────────────────────┐
│  Trend Agent Dashboard          │
├─────────────────────────────────┤
│                                 │
│  Total Runs: 24                 │
│  Success Rate: 96%              │
│  Total Posts: 115               │
│  Published: 110                 │
│                                 │
│  [Execute Agent Run] ▶          │
│                                 │
│  Latest Run: #24 (completed)    │
│  Trends: 45 | Posts: 5 ✓        │
│                                 │
│  Recent Runs History            │
│  ─────────────────────────────  │
│  Run #24  ✓ completed           │
│  Run #23  ✓ completed           │
│  Run #22  ✓ completed           │
│  ...                            │
│                                 │
└─────────────────────────────────┘
```

---

## 🔄 Workflow

```
┌─────────────────────────────────────────┐
│ 1. Collect Trends                       │
│    (Reddit, Google, Medium, YouTube)    │
├─────────────────────────────────────────┤
│ 2. Generate SEO-Optimized Posts         │
│    (2,000-3,000 words each)             │
├─────────────────────────────────────────┤
│ 3. Publish to WordPress                 │
│    (auto categories, tags, images)      │
├─────────────────────────────────────────┤
│ 4. Track Results                        │
│    (dashboard statistics)               │
└─────────────────────────────────────────┘
```

---

## 💡 Pro Tips

1. **First Run**: Execute manually to test, then set up scheduling
2. **WordPress**: Enable if you want auto-publishing; leave disabled for drafts only
3. **Monitoring**: Check dashboard weekly to track growth
4. **Keywords**: Review what's trending in your analytics
5. **Schedule**: Run at off-peak hours (early morning or late evening)

---

## 🎓 Learning Resources

**Understanding the System:**
1. Trends = Data collected from multiple sources
2. Posts = AI-generated content from trends
3. Publishing = Auto-post to WordPress (optional)
4. Dashboard = Monitor everything in real-time

**Customization:**
- Edit subreddits in `src/lib/agents/trendScraper.ts`
- Adjust content length in `src/lib/agents/blogPostGenerator.ts`
- Change publishing frequency in config

---

## ✅ Deployment Status

✅ **Code**: Committed to GitHub  
✅ **Build**: Verified working  
✅ **APIs**: All functional  
✅ **Dashboard**: Live at `/admin/trends`  
⏳ **WordPress**: Optional setup  
⏳ **Scheduling**: Optional setup  

---

## 🚀 Ready to Go!

Your system is live and ready to generate traffic-driving content automatically.

**Start here:** Visit `https://your-site.com/admin/trends`

Questions? Check the documentation files for detailed guidance.

---

**Status**: ✅ Production Ready | **Version**: 1.0.0 | **Date**: Nov 2024
