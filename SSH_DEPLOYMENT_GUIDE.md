# 🔑 YOUR HOSTINGER SSH CREDENTIALS & QUICK DEPLOY GUIDE

**Generated:** November 26, 2025  
**Server:** Hostinger  
**Status:** Ready to deploy

---

## 🔐 YOUR SSH CREDENTIALS

```
IP Address:    46.28.45.97
Port:          65002
Username:      u951576049
Password:      Wholelotofnature@123
```

---

## ⚡ QUICK DEPLOY (Copy & Paste Commands)

### **STEP 1: Connect to Your Server**

```bash
ssh -p 65002 u951576049@46.28.45.97
# When prompted for password, enter: Wholelotofnature@123
```

### **STEP 2: Navigate to Project Directory**

```bash
cd /home/u951576049/public_html
# or
cd ~/public_html
```

### **STEP 3: Clone Your Repository**

```bash
# Option A: Clone from GitHub
git clone https://github.com/shayankhadir/-whole-lot-of-nature.git .
# (The dot means clone into current directory)

# Option B: If repository already exists, pull latest
git pull origin copilot/analyze-competitors-and-optimize
```

### **STEP 4: Install Dependencies**

```bash
npm install
# This takes 3-5 minutes
```

### **STEP 5: Build for Production**

```bash
npm run build
# This takes 2-3 minutes
```

### **STEP 6: Start Application with PM2**

```bash
# Install PM2 globally (if not already installed)
npm install -g pm2

# Start your application
pm2 start npm --name "whole-lot-of-nature" -- start

# Make it persist after server reboot
pm2 save
pm2 startup

# View status
pm2 status
pm2 logs whole-lot-of-nature
```

### **STEP 7: Verify Deployment**

```bash
# Check if application is running
pm2 status

# View live logs
pm2 logs whole-lot-of-nature

# Test connectivity
curl http://localhost:3000
# Should return HTML (status 200)
```

---

## 📋 ENVIRONMENT VARIABLES (Add via Hostinger Dashboard)

**Hostinger Dashboard → Hosting → Advanced → Environment Variables**

Add these 19 variables:

```bash
# AI/Content
PERPLEXITY_API_KEY=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

# WordPress Core
WORDPRESS_API_URL=https://admin.wholelotofnature.com/wp-json
WORDPRESS_URL=https://admin.wholelotofnature.com
WORDPRESS_SITE_URL=https://admin.wholelotofnature.com
WORDPRESS_USERNAME=zebbroka@gmail.com
WORDPRESS_APP_PASSWORD=Jm2r 8rVf 1vqw RwGx pIq9 aL7c

# WooCommerce
WC_CONSUMER_KEY=ck_7c14b9262866f37bee55394c53c727cf4a6c987f
WC_CONSUMER_SECRET=cs_25c1e29325113145d0c13913007cc1a92d965bce

# Frontend URLs - CHANGE FROM LOCALHOST!
NEXT_PUBLIC_SITE_URL=https://wholelotofnature.com
NEXT_PUBLIC_API_URL=https://admin.wholelotofnature.com/wp-json
NEXT_PUBLIC_WORDPRESS_URL=https://admin.wholelotofnature.com

# Instagram
INSTAGRAM_ACCESS_TOKEN=EAAZA7I46ApJsBP1NOqmyZCodaue1J39iqIrZBfnt2SLc6lfSYgSzAFhzCteOz99xjDx2racR9KmEK8DWIEPpQ1aXTyYTV7rvvqbJGZAr6QoeqpTfhQsf8CnrNFCWfThEuk5F8VxyIdBWt15lWZC6amZC6rXsOaxb0zstQIkg8BCfM2aejm2N1Qa93SUrGOGc3zG2fH31cXGn6iRQjlpH74qnygEpYKkOeUXUbkVC5OR39lJSm1sDqjwSHFNKZBfnvOs6PGtgGitPHWEHiQCOJya
INSTAGRAM_BUSINESS_ACCOUNT_ID=852065054661900
INSTAGRAM_APP_ID=1824242505131163
INSTAGRAM_APP_SECRET=697d402f5317e6db29b39175158d5b10

# System/Security
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
REVALIDATE_SECRET=a7f3c8e9d2b1f4e6a9c3b8d1e4f7a2c5b8e9d0f1a2b3c4d5e6f7a8b9c0d1e2

# SEO
NEXT_PUBLIC_GSC_VERIFICATION=6tuH6YnXi1idUfoqCATuz4a05rpWhoPqX5YXO7jW74U
```

---

## 🔄 COMMON COMMANDS

### Monitor Application
```bash
# View running processes
pm2 status

# View live logs
pm2 logs whole-lot-of-nature

# Monitor CPU/Memory
pm2 monit

# View all PM2 applications
pm2 list
```

### Restart/Stop/Start
```bash
# Restart application
pm2 restart whole-lot-of-nature

# Stop application
pm2 stop whole-lot-of-nature

# Start application
pm2 start whole-lot-of-nature

# Kill all processes
pm2 kill
```

### Git Operations
```bash
# Check git status
git status

# Pull latest changes
git pull origin copilot/analyze-competitors-and-optimize

# View git log
git log --oneline -10

# See what changed
git diff
```

### Build & Deploy
```bash
# Install new packages
npm install

# Build for production
npm run build

# Start dev server (local testing only)
npm run dev

# Run lint checks
npm run lint
```

---

## ⚠️ TROUBLESHOOTING

### Application won't start
```bash
# Check if port is in use
lsof -i :3000

# Kill existing process
kill -9 <PID>

# Restart PM2
pm2 kill
pm2 start npm --name "whole-lot-of-nature" -- start
```

### Build fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Variables not working
```bash
# Restart after adding variables in Hostinger dashboard
pm2 restart whole-lot-of-nature

# Check if variables are set
pm2 logs whole-lot-of-nature
```

### Check server resources
```bash
# Disk space
df -h

# Memory usage
free -h

# CPU usage
top

# Check running processes
ps aux | grep node
```

---

## 📊 DEPLOYMENT CHECKLIST

- [ ] SSH into server successfully
- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Run `npm run build` (should complete with 0 errors)
- [ ] Add all 19 environment variables in Hostinger dashboard
- [ ] Start with PM2: `pm2 start npm --name "whole-lot-of-nature" -- start`
- [ ] Run `pm2 save` and `pm2 startup`
- [ ] Visit domain in browser: https://wholelotofnature.com
- [ ] Verify no errors in console (F12)
- [ ] Test core functionality (products, search, etc.)
- [ ] Monitor logs: `pm2 logs`

---

## 🎯 NEXT STEPS (In Order)

1. **Connect to SSH:**
   ```bash
   ssh -p 65002 u951576049@46.28.45.97
   ```

2. **Navigate to project:**
   ```bash
   cd /home/u951576049/public_html
   ```

3. **Clone repository:**
   ```bash
   git clone https://github.com/shayankhadir/-whole-lot-of-nature.git .
   ```

4. **Install & build:**
   ```bash
   npm install
   npm run build
   ```

5. **Add environment variables** via Hostinger dashboard (19 variables above)

6. **Start application:**
   ```bash
   npm install -g pm2
   pm2 start npm --name "whole-lot-of-nature" -- start
   pm2 save
   pm2 startup
   ```

7. **Monitor:**
   ```bash
   pm2 logs whole-lot-of-nature
   ```

8. **Visit:** https://wholelotofnature.com

---

## ✅ EXPECTED SUCCESS

```
✅ npm install completes
✅ npm run build passes (0 errors)
✅ PM2 shows "online" status
✅ https://wholelotofnature.com loads
✅ Products display
✅ No console errors
✅ API responding
```

---

## 📞 EMERGENCY COMMANDS

```bash
# If everything breaks, start fresh
pm2 kill
rm -rf node_modules
npm install
npm run build
pm2 start npm --name "whole-lot-of-nature" -- start
pm2 logs whole-lot-of-nature
```

---

## 💡 TIPS

1. **Keep terminal window open** while monitoring logs
2. **Add variables first**, then restart app
3. **Check logs frequently:** `pm2 logs` shows all errors
4. **Restart after changes:** `pm2 restart whole-lot-of-nature`
5. **Save PM2:** `pm2 save` + `pm2 startup` for auto-start on reboot

---

**Your Hostinger deployment is ready to go! 🚀**

Good luck with your launch! 🎉
