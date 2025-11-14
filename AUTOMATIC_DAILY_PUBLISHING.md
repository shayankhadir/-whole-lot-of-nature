# Automatic Daily Blog Publishing Setup

## Overview

Your system now has **2 separate automated processes**:

1. **Trend Agent** - Generates 5 blog posts per day (saves as DRAFT)
2. **Draft Publisher** - Publishes 1 post every 2 hours (5 posts × 4.8 hours = full coverage per day)

---

## Configuration

### Environment Variables (.env.local)

```bash
# WordPress credentials (already set)
WORDPRESS_SITE_URL=https://admin.wholelotofnature.com
WORDPRESS_USERNAME=your_username
WORDPRESS_PASSWORD=your_password

# Trend Agent (NEW)
TREND_AGENT_INTERVAL=daily        # Generate 5 posts daily
TREND_MAX_POSTS_PER_RUN=5         # 5 posts per generation

# Automatic Publisher (NEW)
PUBLISH_INTERVAL=120              # Publish every 2 hours (120 minutes)
MAX_POSTS_PER_INTERVAL=1          # Publish 1 post per interval
```

### Timing Breakdown

```
PUBLISH_INTERVAL=120 (minutes) = Every 2 hours

Timeline (if you generate 5 posts):
00:00  - Post 1 published ✅
02:00  - Post 2 published ✅
04:00  - Post 3 published ✅
06:00  - Post 4 published ✅
08:00  - Post 5 published ✅

All 5 posts from that day = LIVE by 8 hours later
```

### Optional: Adjust Publishing Speed

**Every 30 minutes (very fast):**
```bash
PUBLISH_INTERVAL=30
MAX_POSTS_PER_INTERVAL=1
# 5 posts in 2.5 hours
```

**Every 4 hours (slower):**
```bash
PUBLISH_INTERVAL=240
MAX_POSTS_PER_INTERVAL=1
# 5 posts in 20 hours (spread throughout day/night)
```

**Every hour (1 post/hour):**
```bash
PUBLISH_INTERVAL=60
MAX_POSTS_PER_INTERVAL=1
# 5 posts in 5 hours
```

**Every 2 hours (2 posts):**
```bash
PUBLISH_INTERVAL=120
MAX_POSTS_PER_INTERVAL=2
# 5 posts in 2.5 hours
```

---

## API Endpoints

### Start Automatic Publishing

```bash
curl -X POST http://localhost:3000/api/publisher/schedule?action=start
```

**Response:**
```json
{
  "success": true,
  "message": "Automatic publishing schedule started",
  "status": {
    "active": true,
    "interval": 120,
    "nextPublishTime": "2024-11-14T06:00:00Z"
  }
}
```

### Stop Automatic Publishing

```bash
curl -X POST http://localhost:3000/api/publisher/schedule?action=stop
```

**Response:**
```json
{
  "success": true,
  "message": "Automatic publishing schedule stopped"
}
```

### Publish Next Batch Now

```bash
curl -X POST http://localhost:3000/api/publisher/schedule?action=publish-now
```

**Response:**
```json
{
  "success": true,
  "result": {
    "success": true,
    "postsPublished": 1,
    "postIds": [123],
    "nextPublishTime": "2024-11-14T06:00:00Z"
  }
}
```

### Check Publishing Status

```bash
curl -X POST http://localhost:3000/api/publisher/schedule?action=status
```

**Response:**
```json
{
  "success": true,
  "status": {
    "active": true,
    "interval": 120,
    "nextPublishTime": "2024-11-14T06:00:00Z"
  }
}
```

---

## Setup Steps

### Step 1: Update Environment Variables

Edit `.env.local`:

```bash
# Set to daily generation
TREND_AGENT_INTERVAL=daily
TREND_MAX_POSTS_PER_RUN=5

# Set publishing interval (2 hours default)
PUBLISH_INTERVAL=120
MAX_POSTS_PER_INTERVAL=1
```

### Step 2: Restart Dev Server

```bash
npm run dev
```

### Step 3: Start Automatic Publishing

**Option A: Via API**
```bash
curl -X POST http://localhost:3000/api/publisher/schedule?action=start
```

**Option B: From Dashboard** (coming in next update)
- Will add toggle button to admin dashboard

### Step 4: Verify It's Working

Check status:
```bash
curl -X POST http://localhost:3000/api/publisher/schedule?action=status
```

Look for:
```json
"active": true
```

---

## Complete Workflow

```
┌─ DAILY ────────────────────────────────────┐
│                                            │
│  Trend Agent Generates 5 Posts             │
│  Status: DRAFT in WordPress                │
│  Time: Once per day                        │
│                                            │
│  ┌─ EVERY 2 HOURS ─────────────────────┐  │
│  │                                     │  │
│  │ Publisher Grabs 1 Draft Post        │  │
│  │ Publishes it (Status: PUBLISHED)    │  │
│  │ Post goes LIVE on website           │  │
│  │                                     │  │
│  │ Hour 0:  Post 1 ✅ LIVE            │  │
│  │ Hour 2:  Post 2 ✅ LIVE            │  │
│  │ Hour 4:  Post 3 ✅ LIVE            │  │
│  │ Hour 6:  Post 4 ✅ LIVE            │  │
│  │ Hour 8:  Post 5 ✅ LIVE            │  │
│  │                                     │  │
│  └─────────────────────────────────────┘  │
│                                            │
└────────────────────────────────────────────┘

Result: 5 new posts published daily, spread throughout the day
```

---

## What This Achieves

✅ **5 posts per day** - Consistent content schedule
✅ **Published automatically** - No manual work
✅ **Spread throughout day** - Better SEO (not all at once)
✅ **Consistent posting times** - Predictable schedule
✅ **Always drafts first** - Quality control option
✅ **Easy to adjust** - Change interval anytime

---

## Monitoring

### Dashboard Updates

The admin dashboard will show:
```
New Section: Automatic Publishing Status
├─ Active: YES
├─ Interval: 120 minutes (2 hours)
├─ Last Published: 2024-11-14 04:00:00
├─ Next Publish: 2024-11-14 06:00:00
├─ Posts Published Today: 3
└─ Posts Pending: 2
```

### WordPress Evidence

**In WordPress → Posts:**
- ✅ Old posts show "DRAFT" status (not yet published)
- ✅ Recent posts show "PUBLISHED" status (auto-published)
- ✅ Timestamps show 2-hour intervals

**Example:**
```
Post 1: Published 00:00 ✅ LIVE
Post 2: Published 02:00 ✅ LIVE
Post 3: Published 04:00 ✅ LIVE
Post 4: Draft (not yet published) 🟡
Post 5: Draft (not yet published) 🟡
```

---

## Advanced: Custom Schedules

### Publish All 5 Posts Immediately

```bash
PUBLISH_INTERVAL=10           # Every 10 minutes
MAX_POSTS_PER_INTERVAL=1      # 1 post per interval
# Result: All 5 published in ~50 minutes
```

### Space Posts Across Full Day (24 hours)

```bash
PUBLISH_INTERVAL=480          # Every 8 hours
MAX_POSTS_PER_INTERVAL=1      # 1 post per interval
# Result: 5 posts over 32+ hours
```

### Publish 5 Times Daily (Every Morning)

```bash
PUBLISH_INTERVAL=1440         # Every 24 hours (1 day)
MAX_POSTS_PER_INTERVAL=5      # All 5 at once
# Result: All 5 published at same time each day
```

---

## Troubleshooting

### "Status shows active=false"

**Problem:** Publishing not running
**Solution:**
```bash
# Restart it
curl -X POST http://localhost:3000/api/publisher/schedule?action=start
```

### "No posts publishing"

**Problem:** No draft posts available
**Solution:**
1. Generate posts first: `/admin/trends` → "Execute Agent Run"
2. Wait 2-3 minutes for posts to be created as drafts
3. Check WordPress: Posts → Draft filter
4. Then start publisher

### "Posts publishing but too fast/slow"

**Problem:** Publishing interval wrong
**Solution:**
Edit `.env.local`:
```bash
# Change PUBLISH_INTERVAL
PUBLISH_INTERVAL=240  # From 120 to 240 (4 hours instead of 2)
```
Restart dev server.

---

## Daily Workflow

### Morning (Start Fresh)

```bash
# 1. Execute agent to generate 5 new posts for the day
curl -X POST http://localhost:3000/api/agent/run?action=execute

# 2. Check WordPress - should see 5 new DRAFT posts
# WordPress → Posts → Draft filter

# 3. Verify publisher is running
curl -X POST http://localhost:3000/api/publisher/schedule?action=status

# 4. If not running, start it
curl -X POST http://localhost:3000/api/publisher/schedule?action=start
```

### Throughout the Day

```
Every 2 hours: 1 post auto-publishes
Every check: Dashboard shows updated stats
Every 8 hours: All 5 posts are LIVE
```

### Evening (Check Status)

```bash
# 1. Check how many published today
curl -X POST http://localhost:3000/api/publisher/schedule?action=status

# 2. Check WordPress for published posts
# WordPress → Posts → Published filter

# 3. Next morning: Repeat
```

---

## File Reference

| File | Purpose |
|------|---------|
| `src/lib/agents/automaticDraftPublisher.ts` | Publisher logic |
| `src/app/api/publisher/schedule/route.ts` | API endpoints |
| `src/app/api/agent/run/route.ts` | Agent config (daily + 5 posts) |
| `src/components/admin/TrendAgentDashboard.tsx` | Dashboard (update pending) |

---

## Next Steps

1. **Update .env.local** with interval settings
2. **Restart dev server**: `npm run dev`
3. **Execute agent**: Generate 5 posts
4. **Start publisher**: `curl -X POST .../api/publisher/schedule?action=start`
5. **Monitor**: Dashboard and WordPress

---

## Expected Results (24 Hours)

```
Start of Day (00:00):
  Agent generates 5 posts as DRAFT
  All show in WordPress → Posts → Draft

Hour 00:00 - 02:00:
  Publisher waits
  Dashboard shows: Pending 5

Hour 02:00:
  Post 1 published ✅ LIVE
  Dashboard: Published 1, Pending 4

Hour 04:00:
  Post 2 published ✅ LIVE
  Dashboard: Published 2, Pending 3

Hour 06:00:
  Post 3 published ✅ LIVE
  Dashboard: Published 3, Pending 2

Hour 08:00:
  Post 4 published ✅ LIVE
  Dashboard: Published 4, Pending 1

Hour 10:00:
  Post 5 published ✅ LIVE
  Dashboard: Published 5, Pending 0

Result: 5 blog posts live, spread over 10 hours! 🎉
```

---

## Production Ready?

Not yet - this needs:
- [ ] Database for persistence (in-memory currently)
- [ ] Cron job for daily agent runs (manual now)
- [ ] Enhanced dashboard UI (update coming)
- [ ] Error logging (basic console only)

But for now: **Fully functional for testing! 🚀**

---

## Quick Commands

```bash
# Start publisher
curl -X POST http://localhost:3000/api/publisher/schedule?action=start

# Stop publisher
curl -X POST http://localhost:3000/api/publisher/schedule?action=stop

# Publish now
curl -X POST http://localhost:3000/api/publisher/schedule?action=publish-now

# Check status
curl -X POST http://localhost:3000/api/publisher/schedule?action=status

# Generate posts
curl -X POST http://localhost:3000/api/agent/run?action=execute

# Get agent stats
curl http://localhost:3000/api/agent/run?action=stats
```

---

**Your automatic daily publishing system is ready! 🌿**
