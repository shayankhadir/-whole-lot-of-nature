# Quick Setup: 5 Posts/Day Auto-Publishing

## ✅ What's New

Your system now automatically:
- **Generates** 5 blog posts per day
- **Stores** them as DRAFTS in WordPress
- **Publishes** 1 post every 2 hours automatically

Result: **5 fresh posts on your website each day, spread throughout the day!**

---

## 🚀 Start Using It (3 Steps)

### Step 1: Execute Agent to Generate Today's Posts

**PowerShell:**
```powershell
curl.exe -X POST http://localhost:3001/api/agent/run?action=execute
```

**Or just visit in browser:**
```
http://localhost:3001/api/agent/run?action=execute
```

**What happens:**
- Agent scrapes trending topics
- Generates 5 blog posts
- Saves as DRAFT in WordPress
- Takes 2-3 minutes

### Step 2: Start Auto-Publishing

**PowerShell:**
```powershell
curl.exe -X POST http://localhost:3001/api/publisher/schedule?action=start
```

**Or just visit in browser:**
```
http://localhost:3001/api/publisher/schedule?action=start
```

**What happens:**
- System starts publishing drafts
- 1 post every 2 hours
- All 5 posts go live over 8-10 hours
- Completely automatic

### Step 3: Watch It Work

Check status:

**PowerShell:**
```powershell
curl.exe -X POST http://localhost:3001/api/publisher/schedule?action=status
```

**Or just visit in browser:**
```
http://localhost:3001/api/publisher/schedule?action=status
```

Check WordPress:
- `WordPress → Posts → Published`
- Should see posts publishing every 2 hours

---

## 📊 What Happens

```
Time        Action                          Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

00:00  Agent generates 5 posts            All as DRAFT
       Publisher starts                   Ready to publish

02:00  Post 1 publishes                   ✅ LIVE
04:00  Post 2 publishes                   ✅ LIVE
06:00  Post 3 publishes                   ✅ LIVE
08:00  Post 4 publishes                   ✅ LIVE
10:00  Post 5 publishes                   ✅ LIVE
```

---

## ⚙️ Configuration

Default settings (in `.env.local`):

```bash
# Generate 5 posts per day
TREND_AGENT_INTERVAL=daily
TREND_MAX_POSTS_PER_RUN=5

# Publish 1 post every 2 hours
PUBLISH_INTERVAL=120
MAX_POSTS_PER_INTERVAL=1
```

### Want to Change It?

**Publish faster (every 30 min):**
```bash
PUBLISH_INTERVAL=30
```

**Publish slower (every 4 hours):**
```bash
PUBLISH_INTERVAL=240
```

**Publish all 5 at once:**
```bash
PUBLISH_INTERVAL=10
MAX_POSTS_PER_INTERVAL=5
```

---

## 🔧 API Commands

**⚠️ NOTE: Server is running on port 3001 (not 3000)**

### PowerShell (Windows) - Copy & Paste These:

```powershell
# Start publishing
curl.exe -X POST http://localhost:3001/api/publisher/schedule?action=start

# Stop publishing
curl.exe -X POST http://localhost:3001/api/publisher/schedule?action=stop

# Publish next batch now (don't wait)
curl.exe -X POST http://localhost:3001/api/publisher/schedule?action=publish-now

# Check status
curl.exe -X POST http://localhost:3001/api/publisher/schedule?action=status

# Generate posts for today
curl.exe -X POST http://localhost:3001/api/agent/run?action=execute

# Get statistics
curl.exe http://localhost:3001/api/agent/run?action=stats
```

### Or Use Browser (Easiest!)

Just visit these URLs in your browser:

```
Check Status:
http://localhost:3001/api/publisher/schedule?action=status

Start Publishing:
http://localhost:3001/api/publisher/schedule?action=start

Stop Publishing:
http://localhost:3001/api/publisher/schedule?action=stop

Generate Posts:
http://localhost:3001/api/agent/run?action=execute
```

---

## 📈 Daily Workflow

**Every Morning:**
1. Run: `curl.exe -X POST http://localhost:3001/api/agent/run?action=execute`
2. Wait 2-3 min for posts to generate
3. Run: `curl.exe -X POST http://localhost:3001/api/publisher/schedule?action=start`
4. Posts will auto-publish throughout the day

**Or use Browser (Easier):**
1. Visit: `http://localhost:3001/api/agent/run?action=execute`
2. Wait 2-3 min for posts to generate
3. Visit: `http://localhost:3001/api/publisher/schedule?action=start`
4. Posts will auto-publish throughout the day

**Throughout Day:**
- 1 new post automatically published every 2 hours
- All visible on your website
- SEO-friendly (spread out, not all at once)

**Next Morning:**
- Repeat - new set of 5 posts
- Previous day's 5 posts are already live

---

## ✅ Expected Results

After setting up and running for 1 day:

**In WordPress:**
```
Posts:
✅ Post 1: Published 00:00 - LIVE
✅ Post 2: Published 02:00 - LIVE
✅ Post 3: Published 04:00 - LIVE
✅ Post 4: Published 06:00 - LIVE
✅ Post 5: Published 08:00 - LIVE
```

**On Your Website:**
- 5 new blog posts visible
- All published throughout the day
- Titles like:
  * "Best Indoor Plants for Low Light"
  * "Sustainable Gardening Tips"
  * "Plant Propagation Guide"
  * etc.

**SEO Benefit:**
- Spread throughout day = better distribution
- Natural publishing pattern
- Search engines like consistent content

---

## 🎯 Current System

| Component | Function | Status |
|-----------|----------|--------|
| Trend Agent | Generate 5 posts/day | ✅ Daily |
| Draft Publisher | Auto-publish every 2 hrs | ✅ Active |
| WordPress | Store & publish posts | ✅ Ready |
| Dashboard | Monitor everything | ✅ Coming soon |

---

## Files Created

```
src/lib/agents/automaticDraftPublisher.ts
  ↳ Handles automatic publishing logic
  ↳ Fetches drafts from WordPress
  ↳ Publishes on schedule

src/app/api/publisher/schedule/route.ts
  ↳ API endpoints for control
  ↳ start, stop, publish-now, status
```

---

## Next Steps

1. **Execute agent:** `curl -X POST .../api/agent/run?action=execute`
2. **Start publisher:** `curl -X POST .../api/publisher/schedule?action=start`
3. **Check status:** `curl -X POST .../api/publisher/schedule?action=status`
4. **Watch WordPress:** Posts → Published filter (refresh every 2 hours)

---

## Still Manual?

If you prefer doing things manually:

```bash
# Just generate posts
curl -X POST http://localhost:3000/api/agent/run?action=execute

# Then manually publish in WordPress
# WordPress → Posts → Draft → Click "Publish"
```

No problem! System works either way.

---

## Full Documentation

See: `AUTOMATIC_DAILY_PUBLISHING.md` for complete details, troubleshooting, and advanced config.

---

**Your 5 posts/day auto-publishing system is ready! 🌿**

**Start with:** `curl -X POST http://localhost:3000/api/publisher/schedule?action=start`
