# Publishing Strategy Configuration Guide

## Current Status
**Current Strategy:** `draft` (Posts saved as drafts in WordPress, not published)
**WordPress Credentials:** ✅ Already configured

---

## 3 Publishing Options Explained

### 1️⃣ DRAFT (Current - Safest Option) 🟡

```typescript
publishStrategy: 'draft'
```

**What happens:**
- Agent scrapes trends ✅
- Agent generates blog posts ✅
- Posts created in WordPress **AS DRAFTS** 📝
- You manually review and publish ✅

**Where to see them:**
- WordPress Dashboard → Posts → Search for "Draft"
- Admin Dashboard → Shows count under "Published"

**Pros:**
✅ Complete quality control
✅ You review every post before going live
✅ Safe for testing
✅ Time to add AI content later

**Cons:**
❌ Manual work to publish each post
❌ Posts don't go live automatically

**Best for:** Getting started, ensuring quality

---

### 2️⃣ SCHEDULED (Automatic Publishing) 📅

```typescript
publishStrategy: 'scheduled'
scheduleTime: '09:00' // 9 AM daily
```

**What happens:**
- Agent scrapes trends ✅
- Agent generates blog posts ✅
- Posts scheduled to publish **at specific time** ⏰
- Automatically goes live at scheduled time 🚀

**Where to see them:**
- WordPress Dashboard → Posts → Search for "Scheduled"
- Will automatically publish at set time

**Pros:**
✅ Fully automatic
✅ No manual intervention needed
✅ You can control publishing time
✅ Consistent posting schedule

**Cons:**
❌ Less control over individual posts
⚠️ Posts go live even if you didn't review

**Best for:** Established routine, daily content schedule

---

### 3️⃣ IMMEDIATE (Instant Publishing) ⚡

```typescript
publishStrategy: 'immediate'
```

**What happens:**
- Agent scrapes trends ✅
- Agent generates blog posts ✅
- Posts published **instantly** to live site 📡
- Goes live immediately (no review)

**Where to see them:**
- WordPress Dashboard → Posts → Published
- Immediately visible on your website

**Pros:**
✅ Fastest publishing
✅ Completely automated
✅ Maximum efficiency

**Cons:**
❌ No review before publishing
❌ If quality is bad, it's live
⚠️ Not recommended yet (wait for AI integration)

**Best for:** After AI integration, trusted system, high confidence

---

## How to Change Strategy

### Option 1: Environment Variables (Best)

Edit your `.env.local` file:

```bash
# Current
PUBLISH_STRATEGY=draft

# Change to one of these:
PUBLISH_STRATEGY=scheduled
PUBLISH_STRATEGY=immediate

# If using scheduled, add publish time:
PUBLISH_TIME=09:00  # 9 AM
PUBLISH_DAYS=1      # Daily (1 = daily, 7 = weekly)
```

Then restart the dev server.

---

### Option 2: Direct API Configuration

In `src/app/api/agent/run/route.ts`, find this section:

```typescript
agent = new ScheduledTrendAgent({
  runInterval: 'weekly',
  publishStrategy: 'draft',  // ← CHANGE HERE
  maxPostsPerRun: 5,
  wordPressConfig: { ... }
});
```

Change to:

```typescript
agent = new ScheduledTrendAgent({
  runInterval: 'weekly',
  publishStrategy: 'scheduled',  // ← Changed to scheduled
  maxPostsPerRun: 5,
  wordPressConfig: { ... }
});
```

Restart dev server.

---

## Recommended Timeline

### Week 1: Testing Phase 🟡
```typescript
publishStrategy: 'draft'
```
- Run agent daily
- Review all generated posts
- Check quality
- Publish manually when satisfied

### Week 2-3: Scheduled Phase 📅
```typescript
publishStrategy: 'scheduled'
scheduleTime: '09:00'
```
- Set up automatic daily publishing
- Monitor WordPress for issues
- Build content library

### Week 4+: AI Integration ⚡
```typescript
publishStrategy: 'immediate'
```
- After you add AI integration
- High confidence in quality
- Fully automated

---

## Testing Each Strategy

### Test Draft Mode (Current)
```bash
curl -X POST http://localhost:3000/api/agent/run?action=execute

# Then check WordPress:
# - Should see 5 new DRAFT posts
# - Check: Posts → Draft filter
```

### Test Scheduled Mode
```bash
# Change .env to:
PUBLISH_STRATEGY=scheduled
PUBLISH_TIME=09:00

# Restart server, then:
curl -X POST http://localhost:3000/api/agent/run?action=execute

# Then check WordPress:
# - Should see 5 new SCHEDULED posts
# - Check: Posts → All Posts (look for date)
```

### Test Immediate Mode
```bash
# Change .env to:
PUBLISH_STRATEGY=immediate

# Restart server, then:
curl -X POST http://localhost:3000/api/agent/run?action=execute

# Then check WordPress:
# - Should see 5 new PUBLISHED posts
# - Check: Posts → Published filter
# - Should be visible on website homepage
```

---

## Monitoring Dashboard

**Access:** `http://localhost:3000/admin/trends`

Shows:
- Total Runs: How many times agent has run
- Success Rate: % of successful runs
- Total Posts: All posts ever generated
- Published: Posts actually live on site (varies by strategy)
- Latest Run Details: Status of most recent run

**Strategy Impact on Dashboard:**
- Draft: "Published" count = 0 (they're drafts, not published)
- Scheduled: "Published" count = 0 (not yet published time)
- Immediate: "Published" count = # of posts (all published)

---

## Troubleshooting

### Posts showing "Published: 0" but they exist in WordPress
**Cause:** Using DRAFT strategy (working as intended!)
**Solution:** Either:
1. Manually publish them in WordPress
2. Change to SCHEDULED or IMMEDIATE strategy

### Posts not appearing in WordPress
**Cause:** WordPress credentials incorrect
**Solution:** Verify in `.env`:
```bash
WORDPRESS_SITE_URL=https://admin.wholelotofnature.com
WORDPRESS_USERNAME=your_username
WORDPRESS_PASSWORD=your_app_password
```

### Change strategy but still seeing old behavior
**Cause:** Dev server not restarted
**Solution:**
```bash
# Stop dev server (Ctrl+C)
# Change .env
# Run: npm run dev
```

---

## Current Workflow with Draft Strategy

```
1. You run: curl -X POST /api/agent/run?action=execute
   ↓
2. Agent collects 5-7 trends
   ↓
3. Agent generates 5 blog posts
   ↓
4. Posts saved as DRAFTS in WordPress
   ↓
5. You see notification in admin dashboard
   ↓
6. You go to WordPress dashboard
   ↓
7. You find the draft posts
   ↓
8. You review them
   ↓
9. You click "Publish" for each post
   ↓
10. Posts go live on your website ✅
```

---

## Quick Reference

| Strategy | Auto Publish | Review First | Best For |
|----------|-------------|-------------|----------|
| Draft 🟡 | ❌ No | ✅ Yes | Testing, QA |
| Scheduled 📅 | ✅ Yes (at time) | ❌ No | Regular schedule |
| Immediate ⚡ | ✅ Yes (now) | ❌ No | High trust |

**Current:** Draft 🟡
**Recommended Next:** Scheduled 📅 (after testing)
**Final:** Immediate ⚡ (after AI integration)

---

## Next Steps

1. **Test current Draft strategy** - Run agent, check WordPress
2. **Once comfortable** - Change to Scheduled
3. **After AI integration** - Change to Immediate
4. **Setup cron job** - For automatic daily runs

Questions? Check `/admin/trends` dashboard or review error logs when agent runs.
