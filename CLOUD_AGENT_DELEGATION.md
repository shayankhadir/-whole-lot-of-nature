# Cloud Agent Delegation

This document describes the cloud-based automation setup for running the Whole Lot of Nature agents on a schedule using GitHub Actions.

## Overview

The agents (trend, marketing, publisher, backlinks, social, email) are now configured to run automatically in the cloud via GitHub Actions workflows. This eliminates the need to manually trigger agent runs and ensures consistent execution.

## Architecture

```
┌─────────────────────┐
│  GitHub Actions     │
│  (Scheduled Daily)  │
└──────────┬──────────┘
           │ HTTPS POST
           ▼
┌─────────────────────┐
│  Vercel Deployment  │
│  Next.js API        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Agent Supervisor   │
│  (Coordinates All)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────────────────┐
│ Individual Agents:                              │
│ • Trend Agent      → Scrapes trends & blogs    │
│ • Marketing Agent  → Competitor analysis       │
│ • Publisher Agent  → Auto-publish drafts       │
│ • Backlink Agent   → Backlink opportunities    │
│ • Social Agent     → Social media calendar     │
│ • Email Agent      → Customer intelligence     │
└─────────────────────────────────────────────────┘
```

## Configuration

### Required GitHub Secrets

Add these secrets to your GitHub repository settings:

1. **DEPLOYMENT_URL** (optional)
   - The URL of your deployed Next.js application
   - Default: `https://wholelotofnature.com`
   - Example: `https://your-app.vercel.app`

2. **AGENT_API_SECRET** (required)
   - A secure random string to authenticate API calls
   - Generate with: `openssl rand -base64 32`
   - This prevents unauthorized access to agent endpoints

### Required Environment Variables

Add to your Vercel deployment (or `.env.local` for development):

```env
# Agent API Security (Production only)
AGENT_API_SECRET=your-secret-key-here

# Agent Configuration
AGENT_PUBLISH_STRATEGY=scheduled  # or 'draft' or 'immediate'

# WordPress/WooCommerce Credentials
WORDPRESS_SITE_URL=https://admin.wholelotofnature.com
WORDPRESS_USERNAME=your-username
WORDPRESS_PASSWORD=your-app-password
WC_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxxx
WC_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxxx
```

## Workflow Schedule

### Automatic Execution

The cloud agents run automatically **daily at 2 AM UTC** via GitHub Actions.

Edit `.github/workflows/cloud-agents.yml` to change the schedule:

```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
```

Common cron patterns:
- `0 */6 * * *` - Every 6 hours
- `0 9 * * 1-5` - Weekdays at 9 AM UTC
- `0 0 * * 0` - Weekly on Sunday at midnight

### Manual Execution

Trigger agents manually from GitHub Actions:

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select **Cloud Agents** workflow
4. Click **Run workflow**
5. (Optional) Specify which agents to run: `trend,marketing,publisher`
6. Click **Run workflow**

## Agent Execution Flow

When the workflow runs:

1. **GitHub Actions** sends an authenticated POST request to `/api/agent/supervisor?action=run`
2. **Agent Supervisor** validates the API key
3. **Agent Supervisor** runs each agent in sequence:
   - Trend Agent → Scrapes trends and generates blog posts
   - Marketing Agent → Analyzes competitors and creates landing pages
   - Publisher Agent → Publishes scheduled WordPress drafts
   - Backlink Agent → Finds backlink opportunities
   - Social Agent → Creates social media content calendar
   - Email Agent → Syncs WooCommerce customers and scores intent
4. **Results** are returned as JSON and logged in GitHub Actions

## API Endpoints

### Supervisor Endpoint

**POST** `/api/agent/supervisor?action=run`

Headers:
```
Authorization: Bearer YOUR_AGENT_API_SECRET
Content-Type: application/json
```

Body (optional):
```json
{
  "agents": ["trend", "marketing", "publisher"]
}
```

Response:
```json
{
  "success": true,
  "report": {
    "startedAt": "2025-12-02T02:00:00.000Z",
    "finishedAt": "2025-12-02T02:05:30.000Z",
    "results": [
      {
        "name": "trend",
        "success": true,
        "durationMs": 45230
      },
      {
        "name": "marketing",
        "success": true,
        "durationMs": 32100
      }
    ]
  }
}
```

### Individual Agent Endpoint

**POST** `/api/agent/run?action=execute`

For running individual agents directly.

**GET** `/api/agent/run?action=stats`

For getting agent statistics.

## Security

### API Key Authentication

All agent endpoints require authentication via Bearer token in production:

```bash
curl -X POST https://wholelotofnature.com/api/agent/supervisor?action=run \
  -H "Authorization: Bearer your-secret-key" \
  -H "Content-Type: application/json"
```

- **Development**: Authentication is bypassed (`NODE_ENV=development`)
- **Production**: `AGENT_API_SECRET` must be set and valid

### Best Practices

1. ✅ Use a strong, randomly generated `AGENT_API_SECRET`
2. ✅ Store secrets in GitHub Secrets, never in code
3. ✅ Rotate the API secret periodically
4. ✅ Monitor workflow execution logs for failures
5. ✅ Set up notifications for failed workflows

## Monitoring

### View Execution Logs

1. Go to **Actions** tab on GitHub
2. Click on **Cloud Agents** workflow
3. Select a specific workflow run
4. View logs for each step

### Success Indicators

Look for:
- ✅ HTTP 200-299 response codes
- ✅ `"success": true` in JSON response
- ✅ All agents showing success in results array

### Troubleshooting

**401 Unauthorized**
- Verify `AGENT_API_SECRET` is set in both GitHub Secrets and Vercel
- Check the Authorization header format: `Bearer YOUR_SECRET`

**500 Internal Server Error**
- Check Vercel deployment logs
- Verify WordPress credentials are correct
- Ensure database is accessible

**Agents fail individually**
- Check agent-specific logs in the response
- Verify required environment variables (WordPress, WooCommerce)
- Ensure external services (WordPress) are accessible

## Testing

### Test Locally

```bash
# Start development server
npm run dev

# In another terminal, test the endpoint
curl -X POST http://localhost:3000/api/agent/supervisor?action=run \
  -H "Content-Type: application/json"

# Note: Authentication is bypassed in development
```

### Test in Production

```bash
# Test with specific agents
curl -X POST https://wholelotofnature.com/api/agent/supervisor?action=run \
  -H "Authorization: Bearer $AGENT_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"agents": ["trend"]}'
```

## Maintenance

### Updating Agent Configuration

To change agent behavior:

1. Update environment variables in Vercel
2. Agent changes take effect on next scheduled run
3. Or manually trigger a run to test immediately

### Disabling Automation

To temporarily disable scheduled runs:

1. Edit `.github/workflows/cloud-agents.yml`
2. Comment out the `schedule:` section
3. Commit and push changes

Or delete/disable the workflow via GitHub Actions UI.

### Viewing Historical Runs

Agent run history is available via the API:

```bash
curl https://wholelotofnature.com/api/agent/run?action=history&limit=10
```

## Benefits of Cloud Delegation

✅ **Automatic Execution** - No manual intervention required
✅ **Reliable Scheduling** - Runs at consistent times via GitHub Actions
✅ **Scalable** - GitHub Actions provides compute resources
✅ **Monitored** - Built-in logging and status tracking
✅ **Secure** - API key authentication protects endpoints
✅ **Cost Effective** - GitHub Actions free tier is generous
✅ **Maintainable** - Configuration in source control

## Next Steps

1. Set up GitHub Secrets (`DEPLOYMENT_URL`, `AGENT_API_SECRET`)
2. Configure environment variables in Vercel
3. Test manual workflow execution
4. Monitor first scheduled run
5. Review logs and adjust as needed
6. Set up notifications for failures (optional)

---

**Last Updated:** December 2, 2025  
**Version:** 1.0.0
