/**
 * Lead Intelligence Agent - Advanced AI-Powered Lead Generation & Nurturing
 * Whole Lot of Nature - Premium Plant Store
 * 
 * Features:
 * - Multi-channel lead capture
 * - AI-powered lead scoring
 * - Automated nurturing sequences
 * - Customer journey tracking
 * - Behavioral insights
 */

import { aiService } from '@/lib/ai/aiService';
import { prisma } from '@/lib/prisma';
import { WooCommerceService, WooCommerceCustomer, WooCommerceOrder } from '@/lib/services/woocommerceService';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface Lead {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  source: LeadSource;
  status: LeadStatus;
  score: number;
  temperature: 'cold' | 'warm' | 'hot' | 'converted';
  tags: string[];
  segments: string[];
  
  // Behavioral data
  behavior: LeadBehavior;
  
  // E-commerce data
  ecommerce?: LeadEcommerceData;
  
  // AI insights
  aiInsights?: LeadAIInsights;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt?: Date;
  lastContactedAt?: Date;
  convertedAt?: Date;
}

export type LeadSource = 
  | 'website_form'
  | 'popup'
  | 'newsletter'
  | 'woocommerce'
  | 'chat_widget'
  | 'instagram'
  | 'facebook'
  | 'google_ads'
  | 'organic_search'
  | 'referral'
  | 'manual'
  | 'api';

export type LeadStatus = 
  | 'new'
  | 'contacted'
  | 'engaged'
  | 'qualified'
  | 'opportunity'
  | 'customer'
  | 'churned'
  | 'unsubscribed';

export interface LeadBehavior {
  pageViews: number;
  productViews: string[];
  cartAdds: string[];
  cartAbandons: number;
  emailOpens: number;
  emailClicks: number;
  chatInteractions: number;
  referrals: number;
  lastPages: string[];
  sessionDuration: number; // minutes
  deviceType: 'mobile' | 'desktop' | 'tablet' | 'unknown';
}

export interface LeadEcommerceData {
  ordersCount: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate?: Date;
  lastOrderItems: string[];
  preferredCategories: string[];
  wishlistItems: string[];
  cartValue: number;
}

export interface LeadAIInsights {
  persona: string;
  predictedLifetimeValue: number;
  churnRisk: 'low' | 'medium' | 'high';
  nextBestAction: string;
  recommendedProducts: string[];
  personalizedMessage: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  engagementLevel: 'low' | 'medium' | 'high';
  purchaseProbability: number; // 0-100
}

export interface LeadScoreWeights {
  emailEngagement: number;
  websiteActivity: number;
  ecommerceActivity: number;
  recency: number;
  sourceQuality: number;
  socialEngagement: number;
}

export interface NurturingCampaign {
  id: string;
  name: string;
  type: 'welcome' | 'abandoned_cart' | 'post_purchase' | 're_engagement' | 'seasonal' | 'birthday';
  status: 'active' | 'paused' | 'completed';
  triggers: CampaignTrigger[];
  steps: CampaignStep[];
  audienceTags: string[];
  startedAt: Date;
  stats: CampaignStats;
}

export interface CampaignTrigger {
  type: 'tag_added' | 'score_reached' | 'days_since_activity' | 'cart_abandoned' | 'purchase_made';
  value: string | number;
}

export interface CampaignStep {
  id: string;
  type: 'email' | 'sms' | 'notification' | 'wait' | 'condition';
  delayDays: number;
  content?: {
    subject?: string;
    body?: string;
    template?: string;
  };
  condition?: {
    field: string;
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
    value: string | number;
  };
}

export interface CampaignStats {
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
  revenue: number;
}

export interface LeadGenReport {
  generatedAt: Date;
  totalLeads: number;
  newLeadsThisWeek: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  convertedThisMonth: number;
  topSources: { source: LeadSource; count: number }[];
  topSegments: { segment: string; count: number }[];
  averageScore: number;
  recommendations: string[];
  activeCampaigns: { name: string; sent: number; converted: number }[];
}

// ============================================================================
// SCORING CONFIGURATION
// ============================================================================

const DEFAULT_SCORE_WEIGHTS: LeadScoreWeights = {
  emailEngagement: 25,
  websiteActivity: 20,
  ecommerceActivity: 30,
  recency: 15,
  sourceQuality: 5,
  socialEngagement: 5,
};

const SOURCE_QUALITY_SCORES: Record<LeadSource, number> = {
  'woocommerce': 90,        // Existing customer = highest
  'referral': 85,           // Referred leads are high quality
  'chat_widget': 80,        // High engagement
  'newsletter': 75,         // Intentional signup
  'website_form': 70,       // Intent shown
  'popup': 60,              // Medium intent
  'organic_search': 55,     // Found us naturally
  'instagram': 50,          // Social discovery
  'facebook': 50,
  'google_ads': 45,         // Paid acquisition
  'manual': 40,
  'api': 40,
};

const PLANT_BUYER_PERSONAS = {
  'plant_parent': {
    description: 'Dedicated plant enthusiast who cares deeply about their plant collection',
    triggers: ['multiple purchases', 'care guide downloads', 'chat interactions'],
    recommended_products: ['rare plants', 'premium fertilizers', 'decorative planters'],
  },
  'gifter': {
    description: 'Buys plants primarily as gifts for others',
    triggers: ['gift category purchases', 'seasonal buying patterns'],
    recommended_products: ['gift sets', 'easy care plants', 'decorative pots'],
  },
  'beginner': {
    description: 'New to plants, needs guidance and easy-care options',
    triggers: ['first purchase', 'care guide views', 'low maintenance searches'],
    recommended_products: ['snake plants', 'pothos', 'starter kits'],
  },
  'interior_designer': {
    description: 'Focused on aesthetics and home decor',
    triggers: ['large planters', 'statement plants', 'bulk orders'],
    recommended_products: ['fiddle leaf fig', 'monstera', 'designer planters'],
  },
  'wellness_seeker': {
    description: 'Interested in air purifying and health benefits',
    triggers: ['air purifying views', 'bedroom plants', 'wellness keywords'],
    recommended_products: ['air purifying plants', 'aloe vera', 'peace lily'],
  },
  'urban_gardener': {
    description: 'Balcony/terrace gardening enthusiast',
    triggers: ['outdoor plants', 'soil purchases', 'garden tools'],
    recommended_products: ['herbs', 'vegetable starters', 'outdoor planters'],
  },
};

// ============================================================================
// LEAD INTELLIGENCE AGENT CLASS
// ============================================================================

export class LeadIntelligenceAgent {
  private leads: Map<string, Lead> = new Map();
  private campaigns: Map<string, NurturingCampaign> = new Map();
  private scoreWeights: LeadScoreWeights = DEFAULT_SCORE_WEIGHTS;

  // ============================================================================
  // LEAD CAPTURE & MANAGEMENT
  // ============================================================================

  /**
   * Capture a new lead from any source
   */
  async captureLead(input: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    source: LeadSource;
    tags?: string[];
    metadata?: Record<string, unknown>;
  }): Promise<Lead> {
    const email = input.email.toLowerCase().trim();
    
    console.log(`📥 LEAD GEN: Capturing lead from ${input.source}: ${email}`);

    // Check if lead exists
    const existingLead = this.leads.get(email);
    
    if (existingLead) {
      // Update existing lead
      return this.updateLead(email, {
        ...input,
        lastActivityAt: new Date(),
      });
    }

    // Create new lead
    const lead: Lead = {
      id: this.generateLeadId(),
      email,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      source: input.source,
      status: 'new',
      score: 0,
      temperature: 'cold',
      tags: input.tags || [],
      segments: [],
      behavior: this.createEmptyBehavior(),
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActivityAt: new Date(),
    };

    // Calculate initial score
    lead.score = await this.calculateLeadScore(lead);
    lead.temperature = this.determineTemperature(lead.score);

    // Generate AI insights
    lead.aiInsights = await this.generateAIInsights(lead);

    // Assign segments
    lead.segments = this.assignSegments(lead);

    // Store lead
    this.leads.set(email, lead);

    // Trigger welcome campaign if newsletter signup
    if (input.source === 'newsletter' || input.tags?.includes('newsletter')) {
      await this.triggerCampaign(lead, 'welcome');
    }

    console.log(`✅ LEAD GEN: New lead captured - Score: ${lead.score}, Temp: ${lead.temperature}`);
    
    return lead;
  }

  /**
   * Update an existing lead
   */
  async updateLead(email: string, updates: Partial<Lead>): Promise<Lead> {
    const lead = this.leads.get(email.toLowerCase());
    
    if (!lead) {
      throw new Error(`Lead not found: ${email}`);
    }

    const updatedLead: Lead = {
      ...lead,
      ...updates,
      updatedAt: new Date(),
    };

    // Recalculate score
    updatedLead.score = await this.calculateLeadScore(updatedLead);
    updatedLead.temperature = this.determineTemperature(updatedLead.score);

    // Update AI insights if significant changes
    if (updates.behavior || updates.ecommerce) {
      updatedLead.aiInsights = await this.generateAIInsights(updatedLead);
    }

    this.leads.set(email.toLowerCase(), updatedLead);
    
    return updatedLead;
  }

  /**
   * Track lead behavior
   */
  async trackBehavior(email: string, event: {
    type: 'page_view' | 'product_view' | 'cart_add' | 'cart_abandon' | 'email_open' | 'email_click' | 'chat' | 'referral';
    data?: Record<string, unknown>;
  }): Promise<void> {
    const lead = this.leads.get(email.toLowerCase());
    if (!lead) return;

    const behavior = { ...lead.behavior };

    switch (event.type) {
      case 'page_view':
        behavior.pageViews++;
        if (event.data?.page) {
          behavior.lastPages = [event.data.page as string, ...behavior.lastPages.slice(0, 4)];
        }
        break;
      case 'product_view':
        if (event.data?.product) {
          behavior.productViews = [...new Set([event.data.product as string, ...behavior.productViews])].slice(0, 20);
        }
        break;
      case 'cart_add':
        if (event.data?.product) {
          behavior.cartAdds = [...new Set([event.data.product as string, ...behavior.cartAdds])].slice(0, 10);
        }
        break;
      case 'cart_abandon':
        behavior.cartAbandons++;
        await this.triggerCampaign(lead, 'abandoned_cart');
        break;
      case 'email_open':
        behavior.emailOpens++;
        break;
      case 'email_click':
        behavior.emailClicks++;
        break;
      case 'chat':
        behavior.chatInteractions++;
        break;
      case 'referral':
        behavior.referrals++;
        break;
    }

    await this.updateLead(email, { 
      behavior,
      lastActivityAt: new Date(),
    });
  }

  // ============================================================================
  // LEAD SCORING
  // ============================================================================

  /**
   * Calculate comprehensive lead score (0-100)
   */
  async calculateLeadScore(lead: Lead): Promise<number> {
    let score = 0;

    // 1. Email Engagement Score (max 25 points)
    const emailScore = this.calculateEmailEngagementScore(lead.behavior);
    score += emailScore * (this.scoreWeights.emailEngagement / 100);

    // 2. Website Activity Score (max 20 points)
    const websiteScore = this.calculateWebsiteActivityScore(lead.behavior);
    score += websiteScore * (this.scoreWeights.websiteActivity / 100);

    // 3. E-commerce Activity Score (max 30 points)
    const ecommerceScore = this.calculateEcommerceScore(lead.ecommerce);
    score += ecommerceScore * (this.scoreWeights.ecommerceActivity / 100);

    // 4. Recency Score (max 15 points)
    const recencyScore = this.calculateRecencyScore(lead.lastActivityAt);
    score += recencyScore * (this.scoreWeights.recency / 100);

    // 5. Source Quality Score (max 5 points)
    const sourceScore = SOURCE_QUALITY_SCORES[lead.source] || 50;
    score += (sourceScore / 100) * this.scoreWeights.sourceQuality;

    // 6. Social Engagement (max 5 points)
    if (lead.tags.includes('instagram_follower') || lead.tags.includes('facebook_follower')) {
      score += this.scoreWeights.socialEngagement;
    }

    // Bonus points
    if (lead.status === 'customer') score += 10;
    if (lead.behavior.referrals > 0) score += 5 * Math.min(lead.behavior.referrals, 3);
    if (lead.tags.includes('vip')) score += 10;

    return Math.min(100, Math.round(score));
  }

  private calculateEmailEngagementScore(behavior: LeadBehavior): number {
    let score = 0;
    
    // Email opens (max 50%)
    if (behavior.emailOpens > 0) {
      score += Math.min(50, behavior.emailOpens * 10);
    }
    
    // Email clicks are more valuable (max 50%)
    if (behavior.emailClicks > 0) {
      score += Math.min(50, behavior.emailClicks * 15);
    }

    return Math.min(100, score);
  }

  private calculateWebsiteActivityScore(behavior: LeadBehavior): number {
    let score = 0;
    
    // Page views (max 30%)
    score += Math.min(30, behavior.pageViews * 3);
    
    // Product views (max 40%)
    score += Math.min(40, behavior.productViews.length * 5);
    
    // Chat interactions (max 30%)
    score += Math.min(30, behavior.chatInteractions * 15);

    return Math.min(100, score);
  }

  private calculateEcommerceScore(ecommerce?: LeadEcommerceData): number {
    if (!ecommerce) return 0;
    
    let score = 0;
    
    // Orders count (max 30%)
    score += Math.min(30, ecommerce.ordersCount * 10);
    
    // Total spent (max 40%)
    if (ecommerce.totalSpent > 0) {
      if (ecommerce.totalSpent >= 10000) score += 40;
      else if (ecommerce.totalSpent >= 5000) score += 30;
      else if (ecommerce.totalSpent >= 2000) score += 20;
      else if (ecommerce.totalSpent >= 500) score += 10;
    }
    
    // Cart value shows intent (max 20%)
    if (ecommerce.cartValue > 0) {
      score += Math.min(20, Math.round(ecommerce.cartValue / 100));
    }
    
    // Wishlist shows interest (max 10%)
    score += Math.min(10, ecommerce.wishlistItems.length * 2);

    return Math.min(100, score);
  }

  private calculateRecencyScore(lastActivity?: Date): number {
    if (!lastActivity) return 0;
    
    const daysSinceActivity = Math.floor((Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceActivity <= 1) return 100;
    if (daysSinceActivity <= 3) return 85;
    if (daysSinceActivity <= 7) return 70;
    if (daysSinceActivity <= 14) return 50;
    if (daysSinceActivity <= 30) return 30;
    if (daysSinceActivity <= 60) return 15;
    return 5;
  }

  private determineTemperature(score: number): Lead['temperature'] {
    if (score >= 80) return 'hot';
    if (score >= 50) return 'warm';
    return 'cold';
  }

  // ============================================================================
  // AI INSIGHTS
  // ============================================================================

  /**
   * Generate AI-powered insights for a lead
   */
  async generateAIInsights(lead: Lead): Promise<LeadAIInsights> {
    // Determine persona based on behavior
    const persona = this.determinePersona(lead);
    
    // Calculate predicted values
    const predictedLifetimeValue = this.predictLifetimeValue(lead);
    const churnRisk = this.assessChurnRisk(lead);
    const purchaseProbability = this.calculatePurchaseProbability(lead);
    const engagementLevel = this.assessEngagementLevel(lead);

    // Get AI recommendations if available
    const aiRecommendations = await this.getAIRecommendations(lead, persona);

    return {
      persona,
      predictedLifetimeValue,
      churnRisk,
      nextBestAction: aiRecommendations.nextAction,
      recommendedProducts: aiRecommendations.products,
      personalizedMessage: aiRecommendations.message,
      sentiment: 'neutral',
      engagementLevel,
      purchaseProbability,
    };
  }

  private determinePersona(lead: Lead): string {
    const behavior = lead.behavior;
    const ecommerce = lead.ecommerce;

    // Check for specific persona signals
    if (ecommerce && ecommerce.ordersCount >= 3 && ecommerce.totalSpent >= 3000) {
      return 'plant_parent';
    }
    
    if (lead.tags.includes('gift') || behavior.productViews.some(p => p.toLowerCase().includes('gift'))) {
      return 'gifter';
    }
    
    if (ecommerce?.ordersCount === 1 || behavior.chatInteractions > 2) {
      return 'beginner';
    }
    
    if (behavior.productViews.some(p => 
      p.toLowerCase().includes('monstera') || 
      p.toLowerCase().includes('fiddle') ||
      p.toLowerCase().includes('designer')
    )) {
      return 'interior_designer';
    }
    
    if (behavior.productViews.some(p => 
      p.toLowerCase().includes('air purif') || 
      p.toLowerCase().includes('oxygen')
    )) {
      return 'wellness_seeker';
    }
    
    if (behavior.productViews.some(p => 
      p.toLowerCase().includes('herb') || 
      p.toLowerCase().includes('outdoor')
    )) {
      return 'urban_gardener';
    }

    return 'beginner'; // Default persona
  }

  private predictLifetimeValue(lead: Lead): number {
    const baseValue = 1000; // ₹1000 base
    let multiplier = 1;

    // Score-based multiplier
    if (lead.score >= 80) multiplier *= 3;
    else if (lead.score >= 60) multiplier *= 2;
    else if (lead.score >= 40) multiplier *= 1.5;

    // Existing customer data
    if (lead.ecommerce) {
      const aov = lead.ecommerce.averageOrderValue || 500;
      const expectedOrders = Math.max(2, lead.ecommerce.ordersCount * 1.5);
      return Math.round(aov * expectedOrders);
    }

    // Source quality adjustment
    const sourceScore = SOURCE_QUALITY_SCORES[lead.source] / 100;
    multiplier *= sourceScore;

    return Math.round(baseValue * multiplier);
  }

  private assessChurnRisk(lead: Lead): 'low' | 'medium' | 'high' {
    // No activity in 30+ days = high risk
    if (lead.lastActivityAt) {
      const daysSince = Math.floor((Date.now() - lead.lastActivityAt.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSince > 60) return 'high';
      if (daysSince > 30) return 'medium';
    }

    // Cart abandons indicate risk
    if (lead.behavior.cartAbandons >= 3) return 'high';
    if (lead.behavior.cartAbandons >= 2) return 'medium';

    // Low engagement = medium risk
    if (lead.behavior.emailOpens === 0 && lead.behavior.pageViews < 3) {
      return 'medium';
    }

    return 'low';
  }

  private calculatePurchaseProbability(lead: Lead): number {
    let probability = 10; // Base 10%

    // Cart value shows strong intent
    if (lead.ecommerce?.cartValue && lead.ecommerce.cartValue > 0) {
      probability += 30;
    }

    // Recent activity
    if (lead.lastActivityAt) {
      const daysSince = Math.floor((Date.now() - lead.lastActivityAt.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSince <= 1) probability += 20;
      else if (daysSince <= 3) probability += 15;
      else if (daysSince <= 7) probability += 10;
    }

    // Behavior signals
    probability += Math.min(15, lead.behavior.productViews.length * 3);
    probability += Math.min(10, lead.behavior.cartAdds.length * 5);

    // Score correlation
    probability += Math.round(lead.score * 0.2);

    return Math.min(95, probability);
  }

  private assessEngagementLevel(lead: Lead): 'low' | 'medium' | 'high' {
    const behavior = lead.behavior;
    const totalEngagement = 
      behavior.pageViews + 
      behavior.productViews.length * 2 + 
      behavior.emailOpens * 3 + 
      behavior.emailClicks * 5 +
      behavior.chatInteractions * 5;

    if (totalEngagement >= 30) return 'high';
    if (totalEngagement >= 10) return 'medium';
    return 'low';
  }

  private async getAIRecommendations(
    lead: Lead, 
    persona: string
  ): Promise<{ nextAction: string; products: string[]; message: string }> {
    const personaData = PLANT_BUYER_PERSONAS[persona as keyof typeof PLANT_BUYER_PERSONAS] || PLANT_BUYER_PERSONAS['beginner'];

    if (!aiService.isConfigured()) {
      return {
        nextAction: this.getDefaultNextAction(lead),
        products: personaData.recommended_products.slice(0, 3),
        message: this.getDefaultMessage(lead, persona),
      };
    }

    try {
      const prompt = `You are a marketing strategist for "Whole Lot of Nature", a premium plant store in Bangalore.

Lead Profile:
- Email: ${lead.email}
- Name: ${lead.firstName || 'Unknown'}
- Score: ${lead.score}/100
- Temperature: ${lead.temperature}
- Persona: ${persona} - ${personaData.description}
- Status: ${lead.status}
- Products Viewed: ${lead.behavior.productViews.slice(0, 5).join(', ') || 'None'}
- Cart Items: ${lead.behavior.cartAdds.slice(0, 3).join(', ') || 'None'}
- Last Order: ${lead.ecommerce?.lastOrderItems?.slice(0, 3).join(', ') || 'None'}
- Churn Risk: ${lead.aiInsights?.churnRisk || 'Unknown'}

Generate personalized recommendations to convert this lead or increase engagement.

Return ONLY valid JSON:
{
  "nextAction": "Specific actionable next step for sales/marketing team",
  "products": ["product1", "product2", "product3"],
  "message": "Personalized email/message opener (2-3 sentences, warm and helpful tone)"
}`;

      const response = await aiService.complete(prompt, {
        temperature: 0.6,
        maxTokens: 400,
        systemPrompt: 'You are a customer success expert. Return only valid JSON.',
      });

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          nextAction: parsed.nextAction || this.getDefaultNextAction(lead),
          products: Array.isArray(parsed.products) ? parsed.products : personaData.recommended_products,
          message: parsed.message || this.getDefaultMessage(lead, persona),
        };
      }
    } catch (error) {
      console.warn('AI recommendations failed:', error);
    }

    return {
      nextAction: this.getDefaultNextAction(lead),
      products: personaData.recommended_products.slice(0, 3),
      message: this.getDefaultMessage(lead, persona),
    };
  }

  private getDefaultNextAction(lead: Lead): string {
    if (lead.temperature === 'hot') {
      return 'Send personalized offer with 10% discount to close the sale';
    }
    if (lead.behavior.cartAbandons > 0) {
      return 'Send abandoned cart recovery email with free shipping offer';
    }
    if (lead.behavior.productViews.length > 5) {
      return 'Send product comparison guide for items they viewed';
    }
    if (lead.status === 'new') {
      return 'Send welcome email with plant care tips and bestsellers';
    }
    return 'Add to nurturing sequence for weekly plant tips';
  }

  private getDefaultMessage(lead: Lead, persona: string): string {
    const name = lead.firstName || 'plant lover';
    
    const messages: Record<string, string> = {
      'plant_parent': `Hi ${name}! As a dedicated plant parent, we think you'll love our new collection of rare and exotic plants. Your green family deserves the best! 🌿`,
      'gifter': `Hello ${name}! Looking for the perfect green gift? Our curated plant gift sets come beautifully packaged and include care guides - perfect for any occasion!`,
      'beginner': `Welcome to the plant world, ${name}! Starting your plant journey is exciting, and we're here to help. Our easy-care plants are perfect for beginners.`,
      'interior_designer': `Hi ${name}! Transform any space with our statement plants and designer planters. Your interiors deserve nature's finest touch.`,
      'wellness_seeker': `Hello ${name}! Breathe easier with our NASA-approved air purifying plants. Bring wellness and clean air into your home naturally.`,
      'urban_gardener': `Hey ${name}! Ready to grow your own herbs and veggies? Our balcony gardening collection has everything you need for urban farming success!`,
    };

    return messages[persona] || `Hi ${name}! Thanks for being part of the Whole Lot of Nature family. We have some exciting plants we think you'll love!`;
  }

  // ============================================================================
  // SEGMENTATION
  // ============================================================================

  private assignSegments(lead: Lead): string[] {
    const segments: string[] = [];

    // Score-based segments
    if (lead.score >= 80) segments.push('high_value');
    else if (lead.score >= 50) segments.push('engaged');
    else segments.push('nurture');

    // Source-based
    if (['instagram', 'facebook'].includes(lead.source)) {
      segments.push('social_lead');
    }
    if (lead.source === 'woocommerce') {
      segments.push('customer');
    }
    if (lead.source === 'newsletter') {
      segments.push('newsletter_subscriber');
    }

    // Behavior-based
    if (lead.behavior.cartAbandons > 0) {
      segments.push('cart_abandoner');
    }
    if (lead.behavior.productViews.length > 10) {
      segments.push('browser');
    }
    if (lead.behavior.chatInteractions > 2) {
      segments.push('chat_engaged');
    }

    // E-commerce based
    if (lead.ecommerce) {
      if (lead.ecommerce.ordersCount >= 3) segments.push('repeat_buyer');
      if (lead.ecommerce.totalSpent >= 5000) segments.push('high_spender');
      if (lead.ecommerce.cartValue > 0) segments.push('active_cart');
    }

    return [...new Set(segments)];
  }

  // ============================================================================
  // NURTURING CAMPAIGNS
  // ============================================================================

  /**
   * Trigger a nurturing campaign for a lead
   */
  async triggerCampaign(lead: Lead, campaignType: NurturingCampaign['type']): Promise<void> {
    console.log(`🎯 LEAD GEN: Triggering ${campaignType} campaign for ${lead.email}`);
    
    // Add tag for tracking
    const updatedTags = [...new Set([...lead.tags, `campaign_${campaignType}`])];
    await this.updateLead(lead.email, { tags: updatedTags });

    // In a real system, this would trigger actual email sequences
    // For now, we log the intent
    console.log(`  → Would send ${campaignType} email sequence to ${lead.email}`);
  }

  /**
   * Create a new nurturing campaign
   */
  createCampaign(config: Omit<NurturingCampaign, 'id' | 'stats' | 'startedAt'>): NurturingCampaign {
    const campaign: NurturingCampaign = {
      ...config,
      id: `campaign_${Date.now()}`,
      startedAt: new Date(),
      stats: { sent: 0, opened: 0, clicked: 0, converted: 0, revenue: 0 },
    };

    this.campaigns.set(campaign.id, campaign);
    console.log(`📬 LEAD GEN: Created campaign "${campaign.name}"`);
    
    return campaign;
  }

  // ============================================================================
  // WOOCOMMERCE INTEGRATION
  // ============================================================================

  /**
   * Sync leads from WooCommerce customers
   */
  async syncWooCommerceCustomers(limit: number = 100): Promise<{ imported: number; updated: number }> {
    console.log(`🔄 LEAD GEN: Syncing WooCommerce customers...`);
    
    let imported = 0;
    let updated = 0;

    try {
      const customers = await WooCommerceService.getCustomers(limit);
      
      for (const customer of customers) {
        if (!customer.email) continue;

        const existingLead = this.leads.get(customer.email.toLowerCase());
        
        const ecommerceData: LeadEcommerceData = {
          ordersCount: customer.orders_count || 0,
          totalSpent: parseFloat(customer.total_spent || '0'),
          averageOrderValue: customer.orders_count 
            ? parseFloat(customer.total_spent || '0') / customer.orders_count 
            : 0,
          lastOrderItems: [],
          preferredCategories: [],
          wishlistItems: [],
          cartValue: 0,
        };

        if (existingLead) {
          await this.updateLead(customer.email, {
            ecommerce: ecommerceData,
            firstName: customer.first_name || existingLead.firstName,
            lastName: customer.last_name || existingLead.lastName,
          });
          updated++;
        } else {
          await this.captureLead({
            email: customer.email,
            firstName: customer.first_name,
            lastName: customer.last_name,
            source: 'woocommerce',
            tags: ['woo-customer'],
          });
          
          // Add ecommerce data
          await this.updateLead(customer.email, { ecommerce: ecommerceData });
          imported++;
        }
      }

      console.log(`✅ LEAD GEN: Synced ${imported} new, ${updated} updated customers`);
    } catch (error) {
      console.error('WooCommerce sync failed:', error);
    }

    return { imported, updated };
  }

  // ============================================================================
  // REPORTING
  // ============================================================================

  /**
   * Generate comprehensive lead generation report
   */
  async generateReport(): Promise<LeadGenReport> {
    const leads = Array.from(this.leads.values());
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Count leads by temperature
    const hotLeads = leads.filter(l => l.temperature === 'hot').length;
    const warmLeads = leads.filter(l => l.temperature === 'warm').length;
    const coldLeads = leads.filter(l => l.temperature === 'cold').length;

    // New leads this week
    const newLeadsThisWeek = leads.filter(l => l.createdAt >= weekAgo).length;

    // Converted this month
    const convertedThisMonth = leads.filter(l => 
      l.status === 'customer' && l.convertedAt && l.convertedAt >= monthAgo
    ).length;

    // Top sources
    const sourceCounts = new Map<LeadSource, number>();
    leads.forEach(l => {
      sourceCounts.set(l.source, (sourceCounts.get(l.source) || 0) + 1);
    });
    const topSources = Array.from(sourceCounts.entries())
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top segments
    const segmentCounts = new Map<string, number>();
    leads.forEach(l => {
      l.segments.forEach(seg => {
        segmentCounts.set(seg, (segmentCounts.get(seg) || 0) + 1);
      });
    });
    const topSegments = Array.from(segmentCounts.entries())
      .map(([segment, count]) => ({ segment, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Average score
    const averageScore = leads.length > 0
      ? Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length)
      : 0;

    // Active campaigns
    const activeCampaigns = Array.from(this.campaigns.values())
      .filter(c => c.status === 'active')
      .map(c => ({
        name: c.name,
        sent: c.stats.sent,
        converted: c.stats.converted,
      }));

    // Generate recommendations
    const recommendations = this.generateRecommendations(leads, hotLeads, warmLeads, coldLeads);

    return {
      generatedAt: new Date(),
      totalLeads: leads.length,
      newLeadsThisWeek,
      hotLeads,
      warmLeads,
      coldLeads,
      convertedThisMonth,
      topSources,
      topSegments,
      averageScore,
      recommendations,
      activeCampaigns,
    };
  }

  private generateRecommendations(
    leads: Lead[],
    hot: number,
    warm: number,
    cold: number
  ): string[] {
    const recommendations: string[] = [];

    if (hot > 0) {
      recommendations.push(`🔥 ${hot} hot leads ready for conversion - prioritize personal outreach`);
    }

    if (warm > leads.length * 0.3) {
      recommendations.push('Good warm lead pipeline - focus on moving them to hot with targeted content');
    }

    if (cold > leads.length * 0.6) {
      recommendations.push('Many cold leads - consider re-engagement campaign or lead quality improvement');
    }

    const cartAbandoners = leads.filter(l => l.behavior.cartAbandons > 0).length;
    if (cartAbandoners > 5) {
      recommendations.push(`${cartAbandoners} cart abandoners - launch recovery campaign with discount offers`);
    }

    const inactiveLeads = leads.filter(l => {
      if (!l.lastActivityAt) return true;
      const daysSince = Math.floor((Date.now() - l.lastActivityAt.getTime()) / (1000 * 60 * 60 * 24));
      return daysSince > 30;
    }).length;

    if (inactiveLeads > leads.length * 0.2) {
      recommendations.push(`${inactiveLeads} inactive leads - run re-engagement campaign with fresh content`);
    }

    // Always add a growth tip
    recommendations.push('📈 Tip: Add exit-intent popup to capture more newsletter signups');

    return recommendations;
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private generateLeadId(): string {
    return `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private createEmptyBehavior(): LeadBehavior {
    return {
      pageViews: 0,
      productViews: [],
      cartAdds: [],
      cartAbandons: 0,
      emailOpens: 0,
      emailClicks: 0,
      chatInteractions: 0,
      referrals: 0,
      lastPages: [],
      sessionDuration: 0,
      deviceType: 'unknown',
    };
  }

  /**
   * Get all leads
   */
  getAllLeads(): Lead[] {
    return Array.from(this.leads.values());
  }

  /**
   * Get leads by temperature
   */
  getLeadsByTemperature(temperature: Lead['temperature']): Lead[] {
    return Array.from(this.leads.values()).filter(l => l.temperature === temperature);
  }

  /**
   * Get leads by segment
   */
  getLeadsBySegment(segment: string): Lead[] {
    return Array.from(this.leads.values()).filter(l => l.segments.includes(segment));
  }

  /**
   * Get hot leads for immediate action
   */
  getHotLeadsForAction(): Lead[] {
    return Array.from(this.leads.values())
      .filter(l => l.temperature === 'hot' && l.status !== 'customer')
      .sort((a, b) => b.score - a.score);
  }
}

// Export singleton instance
export const leadIntelligenceAgent = new LeadIntelligenceAgent();
export default LeadIntelligenceAgent;
