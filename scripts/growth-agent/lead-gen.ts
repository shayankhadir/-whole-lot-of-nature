
export interface Lead {
  id: string;
  name: string;
  role: string;
  company: string;
  source: 'LinkedIn' | 'Instagram' | 'Directory';
  niche: string;
  contact?: string;
  score?: number;
  status: 'NEW' | 'HOT' | 'CONTACTED' | 'CONVERTED' | 'COLD';
  lastContacted?: string;
}

export class LeadGenerationAgent {
  private nicheKeywords: string[];

  constructor(nicheKeywords: string[] = ['gardening', 'interior design', 'aquascaping']) {
    this.nicheKeywords = nicheKeywords;
  }

  async findLeads(): Promise<Lead[]> {
    console.log(`🔍 LEAD GEN: Scanning for leads in niches: ${this.nicheKeywords.join(', ')}...`);
    
    // Mock Data - In production, this would scrape/API call
    // We generate random IDs to simulate new leads coming in occasionally
    const randomId = Math.floor(Math.random() * 1000);
    
    const leads: Lead[] = [
      {
        id: `L${randomId}`,
        name: 'Sarah Green',
        role: 'Interior Designer',
        company: 'Urban Spaces Design',
        source: 'LinkedIn',
        niche: 'Interior Design',
        contact: 'sarah@urbanspaces.mock',
        status: 'NEW'
      },
      {
        id: `L${randomId + 1}`,
        name: 'Green Thumb Nursery',
        role: 'Procurement Manager',
        company: 'Green Thumb Local',
        source: 'Directory',
        niche: 'Gardening',
        contact: 'orders@greenthumb.mock',
        status: 'NEW'
      },
      {
        id: `L${randomId + 2}`,
        name: 'AquaLife Enthusiast',
        role: 'Influencer',
        company: 'Instagram',
        source: 'Instagram',
        niche: 'Aquascaping',
        contact: '@aqualife_mock',
        status: 'NEW'
      }
    ];

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`✅ LEAD GEN: Found ${leads.length} potential leads.`);
    return leads;
  }
}
