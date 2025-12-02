# Quick Start: Cloud Agent Setup

Follow these steps to activate automated cloud agents for your Whole Lot of Nature deployment.

## Step 1: Generate API Secret

Run this command to generate a secure API secret:

```bash
openssl rand -base64 32
```

Copy the output - you'll need it for the next steps.

## Step 2: Add GitHub Secrets

1. Go to your GitHub repository: https://github.com/shayankhadir/-whole-lot-of-nature
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these two secrets:

   **Secret 1:**
   - Name: `DEPLOYMENT_URL`
   - Value: `https://wholelotofnature.com` (or your Vercel URL)

   **Secret 2:**
   - Name: `AGENT_API_SECRET`
   - Value: (paste the secret from Step 1)

## Step 3: Add Environment Variable to Vercel

1. Go to your Vercel dashboard: https://vercel.com
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - Name: `AGENT_API_SECRET`
   - Value: (paste the same secret from Step 1)
   - Environment: **Production** (and Preview/Development if needed)
5. Click **Save**
6. **Redeploy** your application for the change to take effect

## Step 4: Test Manual Execution

1. Go to GitHub repository → **Actions** tab
2. Click on **Cloud Agents** workflow on the left
3. Click **Run workflow** button (top right)
4. Leave agents field empty to run all agents
5. Click **Run workflow**
6. Wait for the workflow to complete
7. Review the logs to ensure agents executed successfully

## Step 5: Monitor Automatic Runs

The agents will now run automatically **every day at 2 AM UTC**.

To check scheduled runs:
1. Go to **Actions** tab
2. Look for **Cloud Agents** workflow runs
3. Click on any run to see detailed logs

## Customizing the Schedule

To change when agents run, edit `.github/workflows/cloud-agents.yml`:

```yaml
schedule:
  - cron: '0 2 * * *'  # Daily at 2 AM UTC
```

Common schedules:
- `0 */6 * * *` - Every 6 hours
- `0 9 * * 1-5` - Weekdays at 9 AM UTC
- `0 0 * * 0` - Weekly on Sunday at midnight

## Troubleshooting

### 401 Unauthorized Error
- Verify `AGENT_API_SECRET` matches in both GitHub Secrets and Vercel
- Ensure you redeployed Vercel after adding the environment variable

### Agents Not Running
- Check that all WordPress credentials are set in Vercel
- Verify WordPress site is accessible
- Review agent-specific logs in the workflow output

### Need Help?

See full documentation: [CLOUD_AGENT_DELEGATION.md](./CLOUD_AGENT_DELEGATION.md)

---

**Estimated Setup Time:** 5-10 minutes  
**Next Scheduled Run:** Daily at 2 AM UTC (after setup)
