# Instagram API Setup - Quick Reference Card

## 🎯 Goal
Set up FREE Instagram automation (no Buffer needed!)

## ⏱️ Time Required
15-20 minutes

## 📋 Checklist

### Step 1: Instagram Business Account ✓
```
Instagram App → Settings → Account
→ Switch to Professional → Business
Category: Shopping & Retail
```

### Step 2: Facebook Page ✓
```
facebook.com/pages/create
→ Business or Brand
→ Enter name → Create
```

### Step 3: Link Instagram to Facebook ✓
```
Instagram → Settings → Business → Linked Accounts
→ Facebook → Select your page → Done
```

### Step 4: Facebook Developer App ✓
```
developers.facebook.com
→ Get Started → Create App
→ Business type
→ Add Products → Instagram
```

### Step 5: Get Tokens ✓
```
Graph API Explorer (developers.facebook.com/tools/explorer)

Permissions:
☑ instagram_basic
☑ instagram_content_publish
☑ pages_show_list
☑ pages_read_engagement

Generate Access Token → Copy

Get Account ID:
1. Endpoint: me/accounts → Submit → Copy page ID
2. Endpoint: {PAGE_ID}?fields=instagram_business_account
   → Submit → Copy instagram_business_account.id
```

### Step 6: Add to Project ✓
```bash
# In .env.local:
INSTAGRAM_ACCESS_TOKEN=EAABw...your_token_here
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_account_id_here
```

```bash
# Restart server:
Ctrl+C (stop)
npm run dev (start)
```

## ✅ Test It

```
1. Open: http://localhost:3000/blog-agent
2. Click: 📱 Social Media tab
3. Scroll to: Instagram Native Automation
4. Click: 🔍 Check Instagram Connection
5. See: ✅ Connected to @your_username

SUCCESS! You're ready!
```

## 🚀 Run Automation

```
Dashboard → Social Media → Instagram Native Automation
→ 🚀 Generate & Auto-Schedule to Instagram
→ Wait 45-60 seconds
→ See: ✅ Scheduled 30/30 posts

Then check Instagram app:
Menu → Scheduled Content → See all 30 posts!
```

## 🆘 Quick Fixes

| Problem | Fix |
|---------|-----|
| "Not configured" | Add tokens to `.env.local` + restart |
| "Invalid credentials" | Regenerate token in Graph API Explorer |
| "Must be Business" | Switch account type in Instagram settings |
| Can't find ID | Use Graph API: `{PAGE_ID}?fields=instagram_business_account` |

## 💡 Pro Tips

1. **Token expires in 60 days** - Regenerate when needed
2. **Edit posts in Instagram app** - Before they publish
3. **Run monthly** - For fresh content
4. **Test first** - Use "Send Test Post" button

## 📖 Full Guide

See: `INSTAGRAM_NATIVE_API_SETUP.md` for detailed instructions

---

**🎉 FREE, DIRECT, OFFICIAL - No Buffer, No Cost!**
