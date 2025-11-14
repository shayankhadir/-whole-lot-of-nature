# How to Monitor Your Blog Publishing System

## 🎯 Real-Time Monitoring Dashboard

**Access:** `http://localhost:3000/admin/trends`

This is your **ONE-STOP SHOP** to see everything the agent is doing.

---

## What You'll See on the Dashboard

### Top Stats Box
```
┌─────────────────────────────────────────────────┐
│ Trend Agent Dashboard                           │
│ Monitor and manage automated content generation │
└─────────────────────────────────────────────────┘
```

### Key Metrics (Real-time Updates Every 30 Seconds)

**Total Runs** 📊
- How many times the agent has executed
- Example: 5 runs completed

**Success Rate** ✅
- Percentage of successful runs
- Example: 100% (all runs worked)

**Total Trends** 🔍
- Total trends collected from all sources
- Example: 23 trends (from Reddit, Google, YouTube, Medium)

**Total Posts** 📝
- Total blog posts ever generated
- Example: 24 posts

**Published** 🚀
- Posts actually live on your site
- Example: 5 published (depends on strategy)

**Avg Posts/Run** 📈
- Average posts generated per run
- Example: 4.8 posts per run

---

## The Red "Execute Agent Run" Button

**Located:** Top of dashboard, right below stats

```
┌──────────────────────────┐
│ 🔄 Execute Agent Run    │
└──────────────────────────┘
```

**What it does:**
1. Click button
2. Agent starts collecting trends
3. Button shows "Running..." with spinner
4. Wait 2-3 minutes...
5. Button returns to normal
6. New stats appear on dashboard

**What happens behind the scenes:**
```
Button Click
    ↓
Scrape Reddit (r/gardening, r/plants, etc.) ✅
Scrape Google Trends (India region) ✅
Scrape YouTube (gardening, plant care, etc.) ✅
Scrape Medium (gardening, sustainability, etc.) ✅
    ↓
Generate 5 SEO-optimized blog posts ✅
    ↓
Publish to WordPress as DRAFTS ✅
    ↓
Dashboard updates with new stats ✅
    ↓
Complete!
```

---

## Latest Run Details Section

After you click "Execute Agent Run", you'll see a detailed report:

```
┌─────────────────────────────────────────┐
│ ✅ Latest Run: run-1731547234567       │
├─────────────────────────────────────────┤
│ Status: COMPLETED                       │
│ Trends Collected: 7                     │
│ Posts Generated: 5                      │
│ Posts Published: 5                      │
│ Errors: 0                               │
│ Time: 2 min 34 sec                      │
└─────────────────────────────────────────┘
```

**What each means:**

| Metric | Meaning |
|--------|---------|
| Status: COMPLETED | ✅ Run finished successfully |
| Status: RUNNING | ⏳ Still collecting/generating |
| Status: FAILED | ❌ Something went wrong |
| Trends Collected | How many trending topics found |
| Posts Generated | How many blog posts created |
| Posts Published | How many went to WordPress |
| Errors | Number of issues (0 is good) |

---

## Run History Section

Shows last 5 runs in a table:

```
Run ID                  | Trends | Posts | Published | Status
run-1731547234567      |   7    |   5   |     5     | ✅ Completed
run-1731460834567      |   6    |   5   |     5     | ✅ Completed
run-1731374434567      |   8    |   5   |     5     | ✅ Completed
run-1731288034567      |   5    |   4   |     4     | ✅ Completed
run-1731201634567      |   7    |   5   |     5     | ✅ Completed
```

**What to look for:**
- ✅ All showing "Completed" = System working perfectly
- 🟡 Mix of statuses = Some issues, but recoverable
- ❌ Many failures = Investigate error logs

---

## Status Indicators

### 🟢 Green = Everything Good
- Status: "COMPLETED"
- Errors: "0"
- Posts Generated > 0

### 🟡 Yellow = Caution
- Status: "RUNNING" (still processing)
- Some trends but fewer posts
- Minor errors

### 🔴 Red = Issues
- Status: "FAILED"
- Errors: > 0
- Posts Generated: 0

---

## Verifying on WordPress

After running the agent, check WordPress to confirm:

**Step 1:** Log in to WordPress
- URL: `https://admin.wholelotofnature.com`

**Step 2:** Go to Posts
- Left menu → Posts

**Step 3:** Look for new posts
- Created by agent in last run
- Should see 5 new posts

**Step 4:** Check status
- **DRAFT** = Using draft strategy (need manual publish)
- **SCHEDULED** = Using scheduled strategy (will auto-publish)
- **PUBLISHED** = Using immediate strategy (already live)

**Step 5:** Verify content
- Click a post to read it
- Check for:
  - ✅ Good title
  - ✅ Relevant content
  - ✅ Proper formatting
  - ✅ Meta description

---

## API Endpoints (For Advanced Users)

If you prefer using command line:

```bash
# Trigger a run
curl -X POST http://localhost:3000/api/agent/run?action=execute

# Get current stats
curl http://localhost:3000/api/agent/run?action=stats

# Get latest run details
curl http://localhost:3000/api/agent/run?action=latest

# Get run history (last 5)
curl http://localhost:3000/api/agent/run?action=history&limit=5

# Get all stats for last 10 runs
curl http://localhost:3000/api/agent/run?action=history&limit=10
```

---

## Typical Run Timeline

**Time: 0:00** - You click "Execute Agent Run" button
```
Status: Running...
```

**Time: 0:30** - Trends being scraped
```
System collecting from Reddit, Google Trends, YouTube, Medium...
```

**Time: 1:30** - Posts being generated
```
Converting trends to SEO-optimized blog posts...
```

**Time: 2:00** - Publishing to WordPress
```
Sending 5 posts to WordPress...
Creating as DRAFT/SCHEDULED/PUBLISHED based on strategy...
```

**Time: 2:30** - Complete!
```
✅ Completed
Trends Collected: 7
Posts Generated: 5
Posts Published: 5
Status: Completed
```

---

## Error Messages & Solutions

### "Posts Generated: 0"
**Problem:** No posts created
**Check:**
1. Did trends get collected? (Trends: > 0?)
2. Check error messages
3. Likely issue: Keyword extraction problem

**Solution:** Manual agent run to debug

---

### "Published: 0 but Posts Generated: 5"
**Problem:** Posts created but not published
**Explanation:** This is NORMAL if using DRAFT strategy!
- Posts are in WordPress as DRAFTS
- Check WordPress dashboard
- Manually publish them

**Solution:** Go to WordPress and publish, OR change to SCHEDULED/IMMEDIATE strategy

---

### "Status: FAILED"
**Problem:** Run failed
**Check:** Error message below status
**Common causes:**
- WordPress credentials wrong
- Network issue
- API rate limiting

**Solution:**
1. Check error message
2. Verify WordPress credentials in `.env`
3. Try again in 5 minutes
4. Check browser console for details

---

## Dashboard Auto-Refresh

The dashboard **automatically updates every 30 seconds** with:
- ✅ Latest stats
- ✅ New runs
- ✅ Status changes
- ✅ Error messages

You can also manually refresh: **Press F5 or click refresh button**

---

## Performance Metrics to Track

Over time, watch these:

**Total Runs** 📊
- Should increase after each manual trigger
- Or auto-increase if you set up cron job

**Success Rate** ✅
- Should stay at 100%
- If drops below 95%, investigate

**Posts/Run Ratio** 📈
- Should be ~0.7 (trending topic → blog post conversion)
- Example: 7 trends → 5 posts (some trends not unique enough)

**Publishing Status** 🚀
- If DRAFT: Should manually publish
- If SCHEDULED: Should auto-publish at time
- If IMMEDIATE: Should all be published

---

## Scheduling Agent to Run Automatically

To run the agent automatically (instead of manual clicks):

### Option 1: Browser Extension (Easy)
- Create browser automation to click button daily
- Or use IFTTT service

### Option 2: API Scheduler (Better)
```bash
# Using node-cron (already installed)
# Edit src/app/api/agent/run/route.ts to add cron config
```

### Option 3: External Service
- Use cron-job.org
- Or GitHub Actions workflow
- Calls `/api/agent/run?action=execute` daily

---

## Summary: How to Know It's Working

✅ **All these should be true:**

1. Go to `/admin/trends`
2. Click "Execute Agent Run"
3. Wait 2-3 minutes
4. See "Status: COMPLETED"
5. See "Posts Generated: 5" (or similar)
6. Check WordPress dashboard
7. See 5 new posts

**That's it! System is working! 🎉**

---

## Next: Add AI Integration

Currently the system uses template-based content generation. When you're ready:
1. Add OpenAI API key
2. Replace blog post generation with AI
3. System will generate better, more unique content
4. Then switch to IMMEDIATE publishing for full automation

**Until then:** Posts are good for SEO but generated from templates.

---

## Quick Links

| Action | Where |
|--------|-------|
| **Monitor System** | `http://localhost:3000/admin/trends` |
| **View Posts** | WordPress Dashboard → Posts |
| **Trigger Run** | Dashboard "Execute Agent Run" button |
| **Check Stats** | Dashboard shows live metrics |
| **Publish Posts** | WordPress Dashboard (if using DRAFT) |

**Everything you need is at `/admin/trends`! 🌿**
