import { WooCommerceService } from '@/lib/services/woocommerceService';
import type { WooCommerceCustomer, WooCommerceOrder } from '@/lib/services/woocommerceService';
import BacklinkAgent from '@/lib/agents/backlinkAgent';

export interface Lead {
  id: string;
  name: string;
  role: string;
  company: string;
  source: 'LinkedIn' | 'Instagram' | 'Directory' | 'Customer' | 'Partner';
  niche: string;
  contact?: string;
  score?: number;
  status: 'NEW' | 'HOT' | 'CONTACTED' | 'CONVERTED' | 'COLD';
  lastContacted?: string;
  insights?: {
    ordersCount?: number;
    totalSpent?: number;
    recentOrderItems?: string[];
    persona?: string;
    summary?: string;
  };
}

interface LeadGenOptions {
  nicheKeywords?: string[];
  includeCustomers?: boolean;
  includeBacklinkOpportunities?: boolean;
  customerLimit?: number;
  backlinkLimit?: number;
}

export class LeadGenerationAgent {
  private nicheKeywords: string[];
  private includeCustomers: boolean;
  private includeBacklinkOpportunities: boolean;
  private customerLimit: number;
  private backlinkLimit: number;

  constructor(options: LeadGenOptions = {}) {
    this.nicheKeywords = options.nicheKeywords || ['gardening', 'interior design', 'aquascaping'];
    this.includeCustomers = options.includeCustomers ?? true;
    this.includeBacklinkOpportunities = options.includeBacklinkOpportunities ?? true;
    this.customerLimit = options.customerLimit ?? 50;
    this.backlinkLimit = options.backlinkLimit ?? 10;
  }

  async findLeads(): Promise<Lead[]> {
    console.log(`LEAD GEN: Scanning for leads in niches: ${this.nicheKeywords.join(', ')}...`);

    const leadPool: Lead[] = [];

    if (this.includeCustomers) {
      try {
        const customers = await WooCommerceService.getCustomers(this.customerLimit);
        const rankedCustomers = [...customers]
          .sort((a, b) => (b.orders_count || 0) - (a.orders_count || 0))
          .slice(0, Math.min(12, customers.length));

        const orderMap = new Map<number, WooCommerceOrder[]>();
        await Promise.all(
          rankedCustomers.map(async (customer) => {
            try {
              const orders = await WooCommerceService.getOrdersForCustomer(customer.id, 3);
              orderMap.set(customer.id, orders);
            } catch (error) {
              console.warn('LEAD GEN: Failed to fetch orders for customer', customer.id, error);
            }
          })
        );

        customers.forEach((customer: WooCommerceCustomer) => {
          const totalSpent = parseFloat(customer.total_spent || '0');
          const ordersCount = customer.orders_count || 0;
          const recentOrders = orderMap.get(customer.id) || [];
          const recentOrderItems = recentOrders
            .flatMap((order) => order.line_items || [])
            .map((item) => item.name)
            .slice(0, 4);
          const score = Math.min(95, 40 + ordersCount * 10 + Math.round(totalSpent / 100));
          const status: Lead['status'] = score >= 70 ? 'HOT' : 'NEW';

          leadPool.push({
            id: `CUST-${customer.id}`,
            name: `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || customer.email,
            role: ordersCount > 1 ? 'Repeat Customer' : 'Customer',
            company: customer.billing?.city ? `${customer.billing.city} Customer` : 'Individual',
            source: 'Customer',
            niche: ordersCount > 1 ? 'Plant enthusiasts' : 'Plant buyers',
            contact: customer.email,
            score,
            status,
            insights: {
              ordersCount,
              totalSpent,
              recentOrderItems,
            },
          });
        });
      } catch (error) {
        console.error('LEAD GEN: Failed to fetch WooCommerce customers:', error);
      }
    }

    if (this.includeBacklinkOpportunities) {
      try {
        const backlinkAgent = new BacklinkAgent();
        const report = await backlinkAgent.runAnalysis();
        report.opportunities.slice(0, this.backlinkLimit).forEach((opportunity) => {
          const score = Math.min(95, 50 + Math.round(opportunity.estimatedAuthority * 0.4));
          const status: Lead['status'] = score >= 75 ? 'HOT' : 'NEW';

          leadPool.push({
            id: `PARTNER-${opportunity.domain}`,
            name: opportunity.domain,
            role: 'Editor / Community Manager',
            company: opportunity.domain,
            source: 'Partner',
            niche: opportunity.keyword,
            contact: opportunity.outreachUrl,
            score,
            status,
          });
        });
      } catch (error) {
        console.error('LEAD GEN: Failed to analyze backlink opportunities:', error);
      }
    }

    const uniqueLeads = new Map<string, Lead>();
    leadPool.forEach((lead) => {
      if (!uniqueLeads.has(lead.id)) {
        uniqueLeads.set(lead.id, lead);
      }
    });

    const leads = Array.from(uniqueLeads.values());
    console.log(`LEAD GEN: Found ${leads.length} potential leads.`);
    return leads;
  }
}
