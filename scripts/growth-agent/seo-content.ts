import { ContentAgent } from '../content-agent.js';
import { SEOAgent } from '../seo-agent.js';

export class SEOContentManager {
  private contentAgent: ContentAgent;
  private seoAgent: SEOAgent;

  constructor() {
    this.contentAgent = new ContentAgent();
    this.seoAgent = new SEOAgent();
  }

  async runAudit() {
    console.log('🔍 INBOUND: Running SEO Audit...');
    await this.seoAgent.scan();
  }

  async generateBlogStrategy() {
    console.log('📝 INBOUND: Generating Blog Content Strategy...');
    // In a real scenario, this would analyze keywords from the SEO audit
    // and trigger content generation.
    
    const topics = ['Benefits of Organic Potting Mix', 'How to Care for Aquatic Snails', 'Top 5 Air Purifying Plants'];
    
    for (const topic of topics) {
      console.log(`   - Scheduled: ${topic}`);
      // await this.contentAgent.generate({ type: 'blog', topic, ... });
    }
  }
}
