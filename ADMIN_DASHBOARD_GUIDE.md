# 🚀 Admin Dashboard - Agent Control Center

## Overview

The Admin Dashboard provides a streamlined, professional interface to run and monitor all business automation agents for Whole Lot of Nature. This centralized control panel enables you to execute marketing, SEO, performance, and sales agents with a single click.

## 🎯 Features

### Agent Control Panel
- **Run Individual Agents**: Execute specific agents (Growth, SEO, Performance, WooCommerce, Content)
- **Run All Agents**: Execute all agents sequentially with one click
- **Real-time Status**: Monitor agent execution status (idle, running, success, error)
- **Last Run Tracking**: View when each agent was last executed

### Available Agents

#### 1. 🌱 Business Growth Agent
**Purpose**: Lead generation, sales scoring, and outreach management

**What it does**:
- Scans for potential B2B and B2C leads
- Scores leads based on engagement potential
- Generates personalized outreach messages
- Tracks lead status and conversion pipeline

**Access**: `/admin/growth`

**API Endpoint**: `POST /api/agents/growth/run`

**How to run**:
```bash
# Via npm
npm run growth:run

# Via API
curl -X POST http://localhost:3000/api/agents/growth/run
```

#### 2. 🔍 SEO Agent
**Purpose**: Automated SEO analysis and optimization

**What it does**:
- Scans all pages for SEO issues
- Validates meta tags, headings, images
- Checks structured data (Schema.org)
- Generates optimization recommendations
- Creates scored reports (0-100 scale)

**Access**: `/admin/seo`

**API Endpoint**: `POST /api/agents/seo/run`

**How to run**:
```bash
# Via npm
npm run seo:scan

# Via API
curl -X POST http://localhost:3000/api/agents/seo/run
```

#### 3. ⚡ Performance Agent
**Purpose**: Speed and optimization monitoring

**What it does**:
- Analyzes page load times
- Identifies performance bottlenecks
- Checks bundle sizes
- Provides optimization suggestions

**Access**: `/admin/performance` (coming soon)

**API Endpoint**: `POST /api/agents/performance/run`

**How to run**:
```bash
# Via npm
npm run perf:analyze

# Via API
curl -X POST http://localhost:3000/api/agents/performance/run
```

#### 4. 🛒 WooCommerce Sync Agent
**Purpose**: Product synchronization and validation

**What it does**:
- Syncs products from WooCommerce
- Validates product data
- Monitors inventory levels
- Backs up product data

**Access**: `/admin/woocommerce` (coming soon)

**API Endpoint**: `POST /api/agents/woo/run`

**How to run**:
```bash
# Via npm - Multiple actions available
npm run woo:sync      # Sync products
npm run woo:validate  # Validate data
npm run woo:monitor   # Monitor inventory
npm run woo:backup    # Backup data

# Via API
curl -X POST http://localhost:3000/api/agents/woo/run \
  -H "Content-Type: application/json" \
  -d '{"action": "sync"}'
```

#### 5. ✍️ Content Agent
**Purpose**: AI-powered content generation

**What it does**:
- Generates blog posts
- Creates product descriptions
- Writes social media captions
- Generates email campaigns
- Creates meta tags and titles

**Access**: `/admin/content` (coming soon)

**API Endpoint**: `POST /api/agents/content/run`

**How to run**:
```bash
# Via npm - Multiple content types
npm run content:blog     # Blog posts
npm run content:product  # Product descriptions
npm run content:social   # Social media
npm run content:meta     # Meta tags
npm run content:email    # Email campaigns

# Via API
curl -X POST http://localhost:3000/api/agents/content/run \
  -H "Content-Type: application/json" \
  -d '{"type": "blog"}'
```

## 🎨 Dashboard Pages

### Main Dashboard (`/admin`)
- Agent control panel with quick-run buttons
- Status indicators for all agents
- Navigation to detailed dashboards

### Growth Agent Dashboard (`/admin/growth`)
- Lead pipeline visualization
- SEO health score
- Outreach activity metrics
- Activity log with real-time updates
- High-priority leads list
- Run agent button

### SEO Dashboard (`/admin/seo`)
- SEO health score (0-100)
- Issue breakdown by severity
- Pages scanned count
- Quick fix recommendations

## 🔄 Running All Agents

### Via Dashboard
1. Navigate to `/admin`
2. Click "Run All Agents" button
3. Monitor individual agent status
4. View results when complete

### Via API
```bash
curl -X POST http://localhost:3000/api/agents/run-all
```

**Response format**:
```json
{
  "success": true,
  "message": "All agents completed successfully",
  "results": [
    {
      "agent": "Growth Agent",
      "success": true,
      "message": "Growth Agent completed successfully"
    },
    {
      "agent": "SEO Agent",
      "success": true,
      "message": "SEO Agent completed successfully"
    }
    // ... more agents
  ],
  "timestamp": "2025-12-02T07:30:00.000Z"
}
```

## 📊 Agent Data Storage

### Growth Agent
- **Data file**: `scripts/growth-agent/data/growth-data.json`
- **Stores**: Leads, activities, SEO score, agent status
- **Persists**: Between runs

### SEO Agent
- **Reports**: `seo-report-{date}.json`
- **Auto-generated**: On each scan
- **Excluded from git**: Via `.gitignore`

### Content Agent
- **Output folder**: `content-output/`
- **File format**: Markdown (`.md`)
- **Naming**: `{type}-{date}-{timestamp}.md`
- **Excluded from git**: Via `.gitignore`

## 🛠️ Technical Details

### API Endpoints Structure
```
/api/agents/
├── growth/run/     - Growth agent
├── seo/run/        - SEO agent
├── performance/run/ - Performance agent
├── woo/run/        - WooCommerce agent
├── content/run/    - Content agent
└── run-all/        - Run all agents
```

### Agent Execution Flow
1. User clicks "Run Agent" button
2. Frontend sends POST request to agent endpoint
3. Backend executes corresponding npm script
4. Agent runs and generates output
5. Results returned to frontend
6. UI updates with status and timestamp

### State Management
- **Frontend**: React useState for agent status
- **Backend**: File-based storage for persistence
- **Real-time**: Polling every 10 seconds (Growth dashboard)

## 🎯 Best Practices

### When to Run Agents

**Growth Agent**:
- Daily: To find new leads
- After content updates: To refresh SEO score

**SEO Agent**:
- After major content changes
- Before launching new pages
- Weekly: For ongoing optimization

**Performance Agent**:
- After code deployments
- Before production releases
- Monthly: For baseline monitoring

**WooCommerce Sync**:
- After product updates in WooCommerce
- Daily: For inventory monitoring

**Content Agent**:
- As needed for content creation
- Before marketing campaigns

### Production Deployment

1. **Environment Variables**: Ensure all required env vars are set
2. **Timeouts**: Agent runs may take 2-3 minutes
3. **Rate Limits**: Be mindful of API rate limits
4. **Monitoring**: Check agent logs for errors

## 🚀 Getting Started

### Local Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Access admin dashboard
open http://localhost:3000/admin
```

### Running Individual Agents
```bash
# Growth agent
npm run growth:run

# SEO scan
npm run seo:scan

# Performance analysis
npm run perf:analyze

# WooCommerce sync
npm run woo:sync

# Content generation (blog)
npm run content:blog
```

## 📈 Success Metrics

### Growth Agent
- Leads generated per run
- Lead score distribution
- Outreach messages sent
- Conversion rate

### SEO Agent
- SEO score improvement
- Issues resolved
- Pages optimized
- Search ranking changes

### Performance Agent
- Page load time reduction
- Bundle size optimization
- Core Web Vitals improvements

## 🔐 Security

- Admin routes should be protected with authentication
- API endpoints should validate user permissions
- Sensitive data (leads, contacts) stored securely
- Rate limiting on agent execution

## 📝 Notes

- Agent outputs are excluded from git (see `.gitignore`)
- All agents run asynchronously with appropriate timeouts
- Failed agents return error details for debugging
- Agent status persists across page refreshes

## 🤝 Support

For issues or questions:
1. Check agent logs in console
2. Review generated reports in respective folders
3. Verify environment variables are set
4. Check API endpoint responses

---

**Version**: 1.0.0  
**Last Updated**: December 2, 2025  
**Maintained by**: Whole Lot of Nature Team
