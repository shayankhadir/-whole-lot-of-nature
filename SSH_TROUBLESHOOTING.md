# 🔧 SSH Permission Denied - Troubleshooting

**Problem:** Getting "Permission denied" when entering password  
**Cause:** Password might have special characters or connection issues

---

## 🔐 Your SSH Credentials (Verify These)

```
IP:       46.28.45.97
Port:     65002
Username: u951576049
Password: Wholelotofnature@123
```

**Note:** The `@` symbol in the password is special - this might be causing issues.

---

## ✅ SOLUTION 1: Use SSH with Password Prompt (Recommended)

This method lets you paste the password properly:

```bash
ssh -p 65002 u951576049@46.28.45.97
```

When it asks for password:
```
u951576049@46.28.45.97's password: 
```

**PASTE (don't type):** Right-click and paste: `Wholelotofnature@123`

Then press `Enter`

---

## ✅ SOLUTION 2: Use SSH Key Instead (Better - No Password Needed)

Since you already added your SSH key to GitHub, you can use the same key for Hostinger:

```bash
ssh -p 65002 -i ~/.ssh/id_rsa u951576049@46.28.45.97
```

This won't ask for a password at all.

---

## 🆘 SOLUTION 3: Verify Connection with Verbose Output

This shows exactly what's happening:

```bash
ssh -v -p 65002 u951576049@46.28.45.97
```

Look for the error message. Common ones:
- `Permission denied (publickey)` → SSH key issue
- `Permission denied (password)` → Wrong password
- `Connection refused` → Wrong port/IP

---

## 🔄 SOLUTION 4: Try These One by One

### **Try 1: Double-check the password**
Make sure you're typing/pasting: `Wholelotofnature@123`
- Starts with `W` (capital)
- Has `@` symbol
- Ends with `123`

### **Try 2: Use quotes around credentials**
```bash
ssh -p 65002 "u951576049@46.28.45.97"
```

### **Try 3: Copy from this file exactly**
```bash
ssh -p 65002 u951576049@46.28.45.97
```
Then paste password when prompted: `Wholelotofnature@123`

### **Try 4: Use sshpass (if installed)**
```bash
sshpass -p 'Wholelotofnature@123' ssh -p 65002 u951576049@46.28.45.97
```

---

## 📋 EXACT STEPS TO FOLLOW

1. **Open PowerShell** (Windows Key → PowerShell)

2. **Copy this entire command:**
   ```bash
   ssh -p 65002 u951576049@46.28.45.97
   ```

3. **Right-click in PowerShell** → Paste

4. **Press Enter**

5. **When it shows:**
   ```
   u951576049@46.28.45.97's password:
   ```

6. **RIGHT-CLICK and paste the password:** `Wholelotofnature@123`

7. **Press Enter** (screen won't show password being typed - that's normal)

---

## ❌ Common Mistakes

| Mistake | Fix |
|---------|-----|
| Typing password | **Paste instead** - Right-click |
| Wrong @ symbol | Use @ (shift+2) |
| Caps lock on | Password is case-sensitive |
| Space in password | There are no spaces, just check carefully |
| Wrong port | Should be `65002` not `22` |
| Wrong IP | Should be `46.28.45.97` |
| Wrong username | Should be `u951576049` |

---

## 🎯 IF ALL ELSE FAILS

**Contact Hostinger Support and tell them:**
- Username: `u951576049`
- SSH port: `65002`
- IP: `46.28.45.97`
- Issue: "Permission denied when entering SSH password"
- Ask them to: "Verify SSH password authentication is enabled"

---

## ✅ SUCCESS SIGNS

When connected, you should see:
```
Last login: Nov 27 2025 from XXX.XXX.XXX.XXX
u951576049@in-mum-web1276 [~]:
```

Then type:
```bash
cd /home/u951576049/public_html
pwd
```

Should show: `/home/u951576049/public_html`

---

**Try Solution 1 first, then Solution 4 if that doesn't work.**
