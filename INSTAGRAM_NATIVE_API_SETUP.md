# 📸 Instagram Native API Setup - FREE Automation

## ✅ Why Instagram API Instead of Buffer?

**Instagram's official API is:**
- ✅ **100% FREE** (no monthly costs)
- ✅ **Direct integration** (no middleman)
- ✅ **Schedule up to 75 days** in advance
- ✅ **Full control** over your content
- ✅ **Official Meta support**

**Buffer requires:**
- ❌ $6/month subscription (Essentials plan)
- ❌ API being rebuilt (not currently available)
- ❌ Third-party dependency

---

## 🚀 Quick Setup (15-20 Minutes)

### **Prerequisites:**
1. Instagram **Business** or **Creator** account (not personal)
2. Facebook account (to manage Instagram API access)
3. Facebook Page linked to your Instagram account

---

## 📋 Step-by-Step Setup

### **Step 1: Convert to Instagram Business Account** (2 minutes)

1. Open Instagram app on your phone
2. Go to **Settings** → **Account**
3. Tap **Switch Account Type**
4. If you see "Switch to Professional Account" → Tap it
5. Choose **Business** (not Creator - Business has more API features)
6. Select your category (e.g., "Shopping & Retail" or "Home & Garden")
7. Skip contact info (you can add later)
8. Done! You now have a Business account ✅

**To verify:**
- Settings → Account → "Switch to Personal Account" should now be visible
- This confirms you have a Business account

---

### **Step 2: Create/Link Facebook Business Page** (5 minutes)

Your Instagram Business account MUST be linked to a Facebook Page.

#### **Option A: Create New Facebook Page**
1. Go to: https://www.facebook.com/pages/create
2. Click **"Get Started"**
3. Choose **"Business or Brand"**
4. Enter your business name (e.g., "Whole Lot of Nature")
5. Choose category: **"Shopping & Retail"** or **"Garden Center"**
6. Click **"Create Page"**
7. Skip profile photo for now (can add later)

#### **Option B: Use Existing Facebook Page**
1. Go to your Facebook Page
2. Click **"Settings"** → **"Instagram"**
3. Click **"Connect Account"**
4. Log in to Instagram
5. Authorize connection

---

### **Step 3: Link Instagram to Facebook Page** (3 minutes)

1. **On Instagram app:**
   - Settings → **Business** → **Linked Accounts**
   - Tap **Facebook**
   - Log in to Facebook
   - Select your Facebook Page
   - Grant permissions
   - Tap **"Done"**

2. **Verify connection:**
   - Go to your Instagram profile
   - You should see your Facebook Page name under your bio
   - Settings → Business → should show "Facebook Page: [Your Page Name]"

---

### **Step 4: Get Facebook Developer Access** (5 minutes)

1. Go to: https://developers.facebook.com/
2. Click **"Get Started"** (top right)
3. Log in with your Facebook account
4. Complete developer registration:
   - Agree to terms
   - Verify email if needed

5. Create an app:
   - Dashboard → **"Create App"**
   - Choose **"Business"** type
   - App name: "Whole Lot of Nature Automation"
   - Contact email: your email
   - Click **"Create App"**

6. Add Instagram Product:
   - In your app dashboard, scroll to **"Add Products"**
   - Find **"Instagram"** → Click **"Set Up"**
   - This adds Instagram Graph API to your app

---

### **Step 5: Get Access Token** (5 minutes)

1. **In Facebook Developer Dashboard:**
   - Go to **Tools** → **Graph API Explorer** (or search "Graph API Explorer")
   - Select your app from dropdown (top right)
   - Click **"Generate Access Token"**

2. **Select Permissions:**
   - Check these boxes:
     - ✅ `instagram_basic`
     - ✅ `instagram_content_publish`
     - ✅ `pages_show_list`
     - ✅ `pages_read_engagement`
   - Click **"Generate Access Token"**
   - Click **"Continue"** on permission dialog

3. **Copy your token:**
   - You'll see a long string starting with `EAABw...`
   - Click the **"Copy"** button
   - **Save this somewhere safe!** (you'll need it next)

4. **Get Instagram Business Account ID:**
   - In Graph API Explorer, change endpoint to:
     ```
     me/accounts
     ```
   - Click **"Submit"**
   - Find your Facebook Page in the response
   - Copy the `id` value

   - Then change endpoint to:
     ```
     {PAGE_ID}?fields=instagram_business_account
     ```
   - Replace `{PAGE_ID}` with your page ID
   - Click **"Submit"**
   - Copy the `instagram_business_account.id` value
   - **This is your Instagram Business Account ID!**

---

### **Step 6: Add to Your Project** (2 minutes)

1. Open `.env.local` in your project root
2. Add these two lines:

```bash
INSTAGRAM_ACCESS_TOKEN=EAABw...your_token_here
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_account_id_here
```

3. Save the file
4. **Restart your dev server:**
   - Stop the server (Ctrl+C in terminal)
   - Run: `npm run dev`

---

## ✅ Test Your Setup

1. Go to: http://localhost:3000/blog-agent
2. Click the **"📱 Social Media"** tab
3. Scroll to **"Instagram Native Automation"** section
4. Click **"🔍 Check Instagram Connection"**

**Expected Result:**
- ✅ Green success message
- Your Instagram username displayed
- Follower count and post count shown

**If you see an error:**
- Double-check your token and ID in `.env.local`
- Make sure you restarted the server
- Verify Instagram account is set to Business (not Personal or Creator)

---

## 🚀 Run Your First Automation

Once connected:

1. Click **"🧪 Send Test Post"**
   - This schedules ONE test post 1 hour from now
   - Check Instagram app to verify it's scheduled

2. Click **"🚀 Generate & Auto-Schedule to Instagram"**
   - This creates 30 posts
   - Schedules them over 30 days
   - At optimal times (9 AM, 12 PM, 5 PM, 7 PM)
   - Watch the progress tracker!

3. **View scheduled posts:**
   - Open Instagram app
   - Go to your profile → Menu (☰)
   - Tap **"Scheduled Content"**
   - You'll see all 30 posts ready to go!

---

## 📊 What You Get

**With Instagram Native API:**
- ✅ 30 posts/month (or more!)
- ✅ Automatic scheduling
- ✅ Optimal posting times
- ✅ Platform-specific captions
- ✅ Smart hashtags (max 30 per post)
- ✅ Free forever
- ✅ Direct Instagram integration

---

## 🔧 Troubleshooting

### **Error: "Instagram API not configured"**
- Check `.env.local` has both `INSTAGRAM_ACCESS_TOKEN` and `INSTAGRAM_BUSINESS_ACCOUNT_ID`
- Restart dev server after adding tokens

### **Error: "Invalid Instagram credentials"**
- Token might be expired (Facebook tokens expire)
- Go back to Graph API Explorer and generate a new token
- For long-lived tokens (60 days), see: https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived

### **Error: "Account must be Business account"**
- Go to Instagram → Settings → Account
- Check if you can "Switch to Professional Account"
- If yes, you're on Personal - convert to Business

### **Can't find Instagram Business Account ID**
- Make sure Instagram is linked to your Facebook Page
- In Graph API Explorer, test with: `me/accounts`
- Then use your page ID in: `{PAGE_ID}?fields=instagram_business_account`

---

## 💡 Pro Tips

1. **Extend Token Lifespan:**
   - Facebook tokens expire after 60 days
   - Generate "long-lived tokens" to extend to 60 days
   - Guide: https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived

2. **Schedule Strategically:**
   - The automation schedules at optimal times automatically
   - Instagram allows scheduling up to 75 days in advance
   - Run automation monthly for consistent content

3. **Edit Before Publishing:**
   - All scheduled posts are editable in Instagram app
   - Go to Scheduled Content → Edit any post
   - Change caption, hashtags, or delete if needed

4. **Monitor Performance:**
   - Check Instagram Insights for best performing times
   - Adjust keywords in automation for better results
   - Run automation again anytime for fresh content

---

## 🎯 Next Steps

1. ✅ Complete setup above
2. ✅ Test connection
3. ✅ Run first automation
4. ✅ Check scheduled posts in Instagram
5. ✅ Run automation monthly for consistent content
6. 📈 Monitor engagement and adjust strategy

---

## 📚 Resources

- Facebook Graph API Explorer: https://developers.facebook.com/tools/explorer/
- Instagram API Documentation: https://developers.facebook.com/docs/instagram-api
- Access Token Guide: https://developers.facebook.com/docs/facebook-login/guides/access-tokens
- Instagram Business Account: https://business.instagram.com/

---

## 🆘 Need Help?

If you get stuck:
1. Check the troubleshooting section above
2. Verify your Instagram account is Business (not Personal)
3. Make sure Facebook Page is linked to Instagram
4. Regenerate access token if it's expired
5. Restart dev server after updating `.env.local`

**Your automation is now FREE, DIRECT, and OFFICIAL!** 🎉
