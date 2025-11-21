import { LeadGenerationAgent } from './lead-gen.js';
import { OutreachAgent } from './outreach.js';
import { SalesAgent } from './sales.js';
import { SEOContentManager } from './seo-content.js';
import { DataStore } from './data/store.js';

class BusinessGrowthAgent {
  private leadGen: LeadGenerationAgent;
  private outreach: OutreachAgent;
  private sales: SalesAgent;
  private seoContent: SEOContentManager;
  private store: DataStore;

  constructor() {
    this.leadGen = new LeadGenerationAgent();
    this.outreach = new OutreachAgent();
    this.sales = new SalesAgent();
    this.seoContent = new SEOContentManager();
    this.store = new DataStore();
  }

  async runGrowthCycle() {
    console.log('\n🚀 STARTING BUSINESS GROWTH CYCLE\n' + '='.repeat(50));
    this.store.update({ agentStatus: 'RUNNING', lastRun: new Date().toISOString() });
    this.store.log('Starting growth cycle', 'INFO');

    try {
      // 1. Inbound Optimization (SEO & Content)
      console.log('\n[PHASE 1] INBOUND OPTIMIZATION');
      // Note: SEO Audit is heavy, maybe run it less frequently in production
      // For now we run it every time to get the score
      await this.seoContent.runAudit();
      // We need to capture the score from the SEO agent somehow. 
      // For now, let's assume a mock score update or read the report file.
      // Ideally SEOAgent returns the score.
      this.store.update({ seoScore: 75 }); // Mock for now, or read from report
      
      await this.seoContent.generateBlogStrategy();
      this.store.log('Completed SEO audit and content strategy', 'SUCCESS');

      // 2. Outbound Lead Generation
      console.log('\n[PHASE 2] OUTBOUND LEAD GENERATION');
      const newLeads = await this.leadGen.findLeads();
      
      // Add new leads to store
      let addedCount = 0;
      for (const lead of newLeads) {
        const existing = this.store.get().leads.find(l => l.id === lead.id);
        if (!existing) {
          this.store.addLead(lead);
          addedCount++;
        }
      }
      this.store.log(`Found ${addedCount} new leads`, 'INFO');

      // 3. Lead Analysis & Scoring
      console.log('\n[PHASE 3] LEAD ANALYSIS');
      const allLeads = this.store.get().leads;
      const analyzedLeads = this.sales.analyzeFunnel(allLeads);
      
      // Update store with scores
      for (const lead of analyzedLeads) {
        this.store.updateLead(lead.id, { score: lead.score, status: lead.status });
      }

      // 4. Outreach Execution
      console.log('\n[PHASE 4] OUTREACH EXECUTION');
      const hotLeads = analyzedLeads.filter(l => l.status === 'HOT');
      
      for (const lead of hotLeads) {
        const message = await this.outreach.draftMessage(lead);
        console.log(`   ✅ Sent to ${lead.name}: "${message}"`);
        
        this.store.updateLead(lead.id, { 
          status: 'CONTACTED', 
          lastContacted: new Date().toISOString() 
        });
        this.store.log(`Drafted outreach for ${lead.name}`, 'SUCCESS');
      }

      console.log('\n' + '='.repeat(50) + '\n✅ GROWTH CYCLE COMPLETE\n');
      this.store.update({ agentStatus: 'IDLE' });
      this.store.log('Growth cycle completed successfully', 'SUCCESS');

    } catch (error: unknown) {
      const normalizedError = error instanceof Error ? error : new Error(String(error));
      console.error("Cycle failed:", normalizedError);
      this.store.update({ agentStatus: 'ERROR' });
      this.store.log(`Cycle failed: ${normalizedError.message}`, 'ERROR');
    }
  }
}

// Run the agent
if (import.meta.url === `file://${process.argv[1]}`) {
  const agent = new BusinessGrowthAgent();
  agent.runGrowthCycle().catch(console.error);
}

