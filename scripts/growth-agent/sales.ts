import { Lead } from './lead-gen.js';

export class SalesAgent {
  
  scoreLead(lead: Lead): number {
    let score = 0;

    // Role-based scoring
    if (lead.role.includes('Manager') || lead.role.includes('Director')) score += 30;
    if (lead.role.includes('Designer')) score += 25;
    if (lead.role.includes('Influencer')) score += 20;

    // Source-based scoring
    if (lead.source === 'LinkedIn') score += 20; // Higher B2B intent
    if (lead.source === 'Directory') score += 15;
    if (lead.source === 'Instagram') score += 10;

    // Niche relevance
    if (lead.niche === 'Interior Design') score += 15; // High ticket potential
    if (lead.niche === 'Gardening') score += 10;

    return score;
  }

  analyzeFunnel(leads: Lead[]): Lead[] {
    console.log(`📊 SALES AGENT: Analyzing ${leads.length} leads...`);
    
    const scoredLeads = leads.map(l => {
      const score = this.scoreLead(l);
      let status = l.status;
      
      // Auto-promote high score leads to HOT if they are NEW
      if (score > 50 && status === 'NEW') {
        status = 'HOT';
      }

      return { ...l, score, status };
    });

    const hotLeads = scoredLeads.filter(l => l.status === 'HOT');

    console.log(`🔥 Hot Leads Identified: ${hotLeads.length}`);
    hotLeads.forEach(l => {
      console.log(`   - ${l.name} (${l.company}): Score ${l.score}`);
    });

    return scoredLeads; // Return all, but with updated scores/statuses
  }
}
