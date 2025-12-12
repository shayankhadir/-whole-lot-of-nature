# Buffer Setup Instructions for Instagram Automation

## Step 1: Sign Up for Buffer

1. Go to: https://buffer.com/pricing
2. Choose **"Essentials"** plan ($6/month) or start with free trial
3. Click "Start Free Trial" or "Get Started"

## Step 2: Connect Your Instagram Account

1. After signing up, go to: https://buffer.com/app
2. Click "Connect a Channel"
3. Select **Instagram Business**
4. Follow prompts to connect:
   - Must have Facebook Business Page
   - Must have Instagram Business Account (not personal)
   - Link Instagram to Facebook Page first

## Step 3: Get Your Buffer API Access Token

1. Go to: https://buffer.com/developers/api
2. Click **"Create an Access Token"**
3. Log in with your Buffer credentials
4. Copy the Access Token (looks like: `1/abc123def456...`)

## Step 4: Add Token to Your Project

1. Open your project root folder
2. Find or create `.env.local` file
3. Add this line:
   ```
   BUFFER_ACCESS_TOKEN=your_token_here
   ```
4. Save the file
5. Restart your dev server

## Step 5: Test Connection

Run this in PowerShell:
```powershell
# Restart server to load new token
Get-Process node | Stop-Process -Force
npm run dev

# Wait 10 seconds, then test
Start-Sleep -Seconds 10
Invoke-WebRequest -Method GET -Uri "http://localhost:3000/api/instagram/buffer-test"
```

## Step 6: Start Automating!

1. Go to: http://localhost:3000/blog-agent
2. Click: **Social Media** tab
3. Click: **Buffer Integration** section
4. Click: **"Connect Buffer & Auto-Schedule"**

Your Instagram posts will now automatically schedule to Buffer.

## Troubleshooting

**"Instagram not connected"**
- Make sure you have Instagram Business (not personal)
- Link to Facebook Business Page first
- Reconnect in Buffer settings

**"Invalid token"**
- Check .env.local has correct token
- Make sure no extra spaces
- Restart dev server after adding token

**"No profiles found"**
- Go to buffer.com/app and verify Instagram is connected
- Check it shows "Instagram" (not "Instagram Personal")
