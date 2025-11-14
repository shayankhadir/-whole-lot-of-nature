# ⚡ QUICK START REFERENCE

## 🚀 Start Website
```bash
npm run dev
# Visit: http://localhost:3000
```

---

## 📍 Main URLs

| Page | URL |
|------|-----|
| Home | http://localhost:3000 |
| Shop | http://localhost:3000/shop |
| Blog | http://localhost:3000/blog |
| Blog Dashboard | http://localhost:3000/admin/trends |
| Inventory (NEW) | http://localhost:3000/admin/inventory |

---

## 🔌 Quick API Calls

```bash
# Get all products
curl http://localhost:3000/api/products

# Get inventory
curl http://localhost:3000/api/inventory

# Sync from WordPress
curl -X POST http://localhost:3000/api/inventory/sync

# Generate 5 blog posts
curl -X POST http://localhost:3000/api/agent/run?action=execute

# Start auto-publishing
curl -X POST http://localhost:3000/api/publisher/schedule?action=start

# Check publisher status
curl -X POST http://localhost:3000/api/publisher/schedule?action=status

# Publish now (don't wait)
curl -X POST http://localhost:3000/api/publisher/schedule?action=publish-now
```

---

## 📊 What Each Dashboard Does

### Trends Dashboard (`/admin/trends`)
- View blog generation stats
- Click "Execute Agent Run" → Generate 5 posts
- Click "📦 Inventory" → Go to inventory page

### Inventory Dashboard (`/admin/inventory`) - NEW!
- Search products by name/SKU
- Filter by stock status
- Click "🔄 Sync from WordPress" → Update inventory
- See real-time stats

---

## 🎯 Daily Routine

**Morning (any time):**
1. `curl -X POST http://localhost:3000/api/agent/run?action=execute`
2. Wait 2-3 min
3. Check WordPress Posts → Draft (5 new posts should appear)

**Then:**
1. `curl -X POST http://localhost:3000/api/publisher/schedule?action=start`
2. Posts auto-publish every 2 hours
3. Monitor on `/admin/trends`

**By end of day:** All 5 posts LIVE on website

---

## 🧪 Quick Tests

**Test 1:** Visit `/shop` → See products load?  
**Test 2:** Visit `/admin/inventory` → Click sync button → Updates?  
**Test 3:** Generate posts → See in WordPress?  
**Test 4:** Start publisher → Wait 2 hours → Posts published?

---

## ⚡ Tips

- 💾 Edit `.env.local` to change publishing interval (default: 120 min)
- 📱 Website is mobile responsive
- 🔄 Inventory syncs from WordPress automatically
- 📊 All products pull from WooCommerce in real-time
- 🎯 Blog posts generated daily at intervals you set

---

## ✅ System Status

- ✅ Website on localhost:3000
- ✅ Connected to WordPress
- ✅ Inventory syncing
- ✅ Blog generating 5/day
- ✅ Auto-publishing ready

---

**You're all set!** Start at `http://localhost:3000` 🎉

