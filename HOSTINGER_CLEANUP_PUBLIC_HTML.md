# 🔍 Finding & Cleaning public_html on Hostinger

**Issue:** public_html not empty or can't find it  
**Solution:** Step-by-step directory navigation and cleanup

---

## 🔎 STEP 1: SSH Into Hostinger

```bash
ssh -p 65002 u951576049@46.28.45.97
```

Password: `Wholelotofnature@123`

---

## 🔎 STEP 2: Find Your public_html Directory

### Option A: Check Current Location
```bash
pwd
```

Should show something like: `/home/u951576049`

### Option B: List Home Directory
```bash
ls -la /home/u951576049/
```

Look for folders like:
- `public_html` ✅
- `www` ✅
- `domain.com` ✅
- `wholelotofnature.com` ✅

### Option C: Find All public_html Directories
```bash
find /home/u951576049 -type d -name "public_html" 2>/dev/null
```

This shows all public_html folders

---

## 📋 STEP 3: Navigate to public_html

Once you find it, navigate there:

```bash
cd /home/u951576049/public_html
```

Or if it's in a different location:
```bash
cd /home/u951576049/wholelotofnature.com/public_html
```

Or:
```bash
cd /home/u951576049/www
```

---

## 📋 STEP 4: Check What's Inside

```bash
pwd  # Verify location
ls -la  # List all files
```

You should see files or folders like:
- `index.html`
- `.htaccess`
- Other site files
- Folders

---

## 🗑️ STEP 5: BACKUP FIRST (Optional but Safe)

Before deleting, backup what's there:

```bash
# Create backup folder
mkdir ~/backup_public_html_old

# Copy everything to backup
cp -r /home/u951576049/public_html/* ~/backup_public_html_old/

echo "✅ Backup created in ~/backup_public_html_old"
```

---

## 🗑️ STEP 6: DELETE ALL FILES (If Directory is Not Empty)

**⚠️ This will DELETE everything in public_html**

### Option A: Delete Everything Safely
```bash
cd /home/u951576049/public_html

# Delete all files and folders
rm -rf *

# Verify it's empty
ls -la
# Should show: (no files)
```

### Option B: Delete Specific File Types
```bash
cd /home/u951576049/public_html

# Delete just HTML files
rm -f *.html

# Delete just PHP files
rm -f *.php

# Delete folders
rm -rf public/
rm -rf app/
```

---

## ✅ STEP 7: Verify Directory is Empty

```bash
ls -la /home/u951576049/public_html
```

Should show ONLY:
```
total 8
drwxr-xr-x  2 u951576049 u951576049 4096 Nov 28 12:00 .
drwx--x--x 10 u951576049 u951576049 4096 Nov 28 11:59 ..
```

(Just dots, no files) ✅

---

## 🚀 STEP 8: Now Deploy Your Project

Once empty, go back to Hostinger dashboard:

1. **Hosting → Advanced → Git**
2. **Enter:**
   - Repository: `https://github.com/shayankhadir/-whole-lot-of-nature.git`
   - Branch: `copilot/analyze-competitors-and-optimize`
   - Directory: (leave blank)
3. **Click Deploy**

---

## 🆘 TROUBLESHOOTING

### "Permission Denied" Error
```bash
# Change to public_html
cd /home/u951576049/public_html

# Fix permissions
chmod 755 .
chmod 755 *

# Try delete again
rm -rf *
```

### "Directory Not Found"
```bash
# Check all possible locations
ls -la /home/u951576049/
find /home -type d -name "public_html" 2>/dev/null
find /home -type d -name "www" 2>/dev/null
```

### "Can't Delete - File Locked"
```bash
# Try different approach
cd /home/u951576049/public_html
find . -type f -exec rm {} \;
find . -type d -exec rmdir {} \;
```

---

## 📋 COMPLETE COMMAND SEQUENCE

Copy-paste this all at once:

```bash
# 1. SSH in (run from local computer)
ssh -p 65002 u951576049@46.28.45.97

# 2. Once SSH'd in, run these:
cd /home/u951576049/public_html
pwd
ls -la

# 3. If not empty, delete:
rm -rf *

# 4. Verify empty:
ls -la

# 5. You should see only . and ..
```

---

## ✅ SUCCESS INDICATORS

When ready to deploy, you should see:

```bash
$ pwd
/home/u951576049/public_html

$ ls -la
total 8
drwxr-xr-x  2 u951576049 u951576049 4096 Nov 28 12:00 .
drwx--x--x 10 u951576049 u951576049 4096 Nov 28 11:59 ..
```

**No files = Ready to deploy! ✅**

---

## 🎯 NEXT STEPS AFTER CLEANUP

1. Verify directory is empty (above)
2. Go to Hostinger Dashboard
3. Hosting → Advanced → Git
4. Enter repository details
5. Click Deploy
6. Wait 5-10 minutes
7. Your project deploys automatically

---

**Need help? Run the commands and tell me what you see!** 🚀
