# 🚀 Hostinger Git Repository Deployment - Exact Values

## What to Enter in Hostinger Dashboard

You're in: **Hosting → Advanced → Git**

---

## 📋 FIELD 1: Repository

**What to enter:**
```
https://github.com/shayankhadir/-whole-lot-of-nature.git
```

**Explanation:** This is your public GitHub repository URL (already has .git at the end ✅)

---

## 📋 FIELD 2: Branch

**What to enter:**
```
copilot/analyze-competitors-and-optimize
```

**Why?** This is your current development branch where all the code is (NOT master)

**To verify your branch name:**
```bash
git branch
# Should show: * copilot/analyze-competitors-and-optimize
```

---

## 📋 FIELD 3: Directory (optional)

**What to enter:**
```
(leave BLANK)
```

**Why?** This deploys directly to `/public_html` which is what you want.

**Important:** Make sure `/public_html` is EMPTY before deploying:
- Delete any existing files/folders in public_html
- Then deploy
- Git will populate it with your project files

---

## ⚠️ CRITICAL STEPS BEFORE CLICKING DEPLOY

1. **Verify public_html is empty:**
   ```bash
   ssh -p 65002 u951576049@46.28.45.97
   ls -la /home/u951576049/public_html
   # Should be empty or only have .htaccess
   ```

2. **If not empty, delete contents:**
   ```bash
   rm -rf /home/u951576049/public_html/*
   ```

3. **Then go back to Hostinger dashboard and click Deploy**

---

## 📊 Complete Form Summary

| Field | Value |
|-------|-------|
| **Repository URL** | `https://github.com/shayankhadir/-whole-lot-of-nature.git` |
| **Branch** | `copilot/analyze-competitors-and-optimize` |
| **Directory** | (leave blank) |

---

## ✅ AFTER CLICKING DEPLOY

### Step 1: Wait for Deployment
- Hostinger will pull your repo
- Install node_modules
- This takes 5-10 minutes
- Watch the deployment log

### Step 2: After Deployment Completes
```bash
# SSH in and verify files
ssh -p 65002 u951576049@46.28.45.97
cd /home/u951576049/public_html
ls -la

# Should show:
# .git/
# .gitignore
# package.json
# src/
# public/
# ... etc
```

### Step 3: Create .env.local File

```bash
# While still SSH'd in:
nano .env.local
```

Paste all 19 environment variables (from HOSTINGER_ENV_SETUP.md)

Save: `Ctrl+X` → `Y` → `Enter`

### Step 4: Install & Build

```bash
npm install
npm run build
```

### Step 5: Start with PM2

```bash
npm install -g pm2
pm2 start npm --name "whole-lot-of-nature" -- start
pm2 save
pm2 startup
```

### Step 6: Verify It's Running

```bash
pm2 status
pm2 logs whole-lot-of-nature
```

---

## 🎯 QUICK REFERENCE

**Copy-paste these exact values:**

```
Repository: https://github.com/shayankhadir/-whole-lot-of-nature.git
Branch: copilot/analyze-competitors-and-optimize
Directory: (leave empty)
```

---

## ❌ Common Mistakes to Avoid

| Mistake | What NOT to do |
|---------|----------------|
| Wrong branch | ❌ Don't use `master` (wrong branch) |
| Directory not empty | ❌ Don't deploy if public_html has files |
| Missing .git | ❌ Don't remove .git from URL |
| Private repo without SSH | ❌ This is public, so ✅ OK to use HTTPS |

---

## 🚀 YOU'RE READY!

Just enter the values above and click Deploy. Hostinger will handle the rest!

**Total time: ~15-20 minutes from deploy click to live site** ⏱️
