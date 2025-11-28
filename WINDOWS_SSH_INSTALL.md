# 🔧 SSH Not Installed - Solutions for Windows

**Problem:** `ssh: The term 'ssh' is not recognized`  
**Cause:** OpenSSH not installed on your Windows  
**Solution:** Use one of the options below

---

## ✅ SOLUTION 1: Use Windows Terminal (Easiest - Already Have SSH)

Windows 11 includes SSH by default in Terminal.

### Steps:

1. **Press:** `Windows Key`
2. **Search:** `Terminal`
3. **Click:** "Terminal"

A new terminal opens (it's better than PowerShell)

4. **Copy-paste this:**
```bash
ssh -p 65002 u951576049@46.28.45.97
```

5. **Paste password when asked:** `Wholelotofnature@123`

✅ **This should work!**

---

## ✅ SOLUTION 2: Use Git Bash (If You Have Git Installed)

Git Bash includes SSH.

### Steps:

1. **Right-click on your desktop**
2. **Click:** "Git Bash Here"
3. **Navigate to project:**
```bash
cd "/c/Users/USER/Documents/whole lot of nature/Whole lot of nature/whole-lot-of-nature"
```

4. **SSH in:**
```bash
ssh -p 65002 u951576049@46.28.45.97
```

✅ **Should work!**

---

## ✅ SOLUTION 3: Install OpenSSH on Windows

### For Windows 10/11:

1. **Press:** `Windows Key`
2. **Search:** "Optional features"
3. **Click:** "Add an optional feature"
4. **Search:** "OpenSSH Client"
5. **Click it** and **Install**
6. **Restart computer**
7. **Open PowerShell again** and try SSH

---

## ✅ SOLUTION 4: Use PuTTY (Simple GUI Alternative)

If all else fails, use PuTTY - a GUI SSH client:

### Steps:

1. **Download:** https://www.putty.org/
2. **Install it**
3. **Open PuTTY**
4. **Fill in:**
   - **Host Name:** `46.28.45.97`
   - **Port:** `65002`
   - **Connection type:** SSH

5. **Click:** "Open"
6. **When asked for username:** `u951576049`
7. **When asked for password:** `Wholelotofnature@123`

✅ **You're in!**

---

## 🎯 RECOMMENDED (Fastest)

### Try this order:

1. **First:** Use Windows Terminal (Solution 1) - Takes 30 seconds
2. **If not available:** Use Git Bash (Solution 2) - Takes 1 minute
3. **If needed:** Install OpenSSH (Solution 3) - Takes 5 minutes
4. **Last resort:** Use PuTTY (Solution 4) - Takes 10 minutes

---

## 🚀 What To Do After SSH Works

Once you're connected, you should see:
```
u951576049@in-mum-web1276 [~]:
```

Then run:
```bash
cd /home/u951576049/public_html
nano .env.local
```

And paste all 19 environment variables.

---

## 📋 Quick Command Reference (After SSH Works)

```bash
# Check location
pwd

# List files
ls -la

# Create .env.local
nano .env.local

# Verify file created
cat .env.local

# Install dependencies
npm install

# Build app
npm run build

# Start with PM2
pm2 start npm --name "whole-lot-of-nature" -- start

# View logs
pm2 logs whole-lot-of-nature
```

---

**Try Solution 1 (Windows Terminal) first - it's the fastest! 🚀**
