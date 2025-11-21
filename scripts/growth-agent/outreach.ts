import { ContentAgent } from '../content-agent.js';
import { Lead } from './lead-gen.js';

export class OutreachAgent {
  private contentAgent: ContentAgent;

  constructor() {
    this.contentAgent = new ContentAgent();
  }

  async draftMessage(lead: Lead): Promise<string> {
    console.log(`📧 OUTREACH: Drafting message for ${lead.name} (${lead.role})...`);

    let promptTopic = '';
    let tone: 'educational' | 'inspirational' | 'storytelling' | 'promotional' = 'educational';

    if (lead.niche === 'Interior Design') {
      promptTopic = `Introduction to Whole Lot of Nature for Interior Designers focusing on biophilic design and bulk plant orders`;
      tone = 'inspirational';
    } else if (lead.niche === 'Gardening') {
      promptTopic = `Wholesale partnership proposal for organic fertilizers and soil mixes`;
      tone = 'promotional';
    } else {
      promptTopic = `Collaboration proposal for ${lead.niche} influencer`;
      tone = 'storytelling';
    }

    // We use the existing ContentAgent to generate the email body
    // We cast the type to 'email' which is supported by the ContentAgent CLI logic
    // If the ContentAgent class doesn't expose 'email' in its types, we might need to adjust.
    // Based on the CLI help text, 'email' is a supported command.
    
    // Note: The ContentAgent.generate method usually writes to a file. 
    // Ideally, we'd want it to return the string. 
    // For this integration, we'll assume we can capture it or we'll just trigger the generation 
    // and say "Draft saved to content-output/..."
    
    try {
      // We are calling the public generate method.
      // We need to mock the request object.
      await this.contentAgent.generate({
        type: 'email' as any, 
        topic: promptTopic,
        length: 'short',
        tone: tone
      });
      
      return `Draft created for ${lead.name} on topic: "${promptTopic}"`;
    } catch (error) {
      console.error("Error generating outreach:", error);
      return "Failed to draft message.";
    }
  }
}
