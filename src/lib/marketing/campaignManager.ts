/**
 * Campaign Manager
 * Manages promotional campaigns and tracks their performance
 */

import { prisma } from '@/lib/prisma';
import type { 
  CampaignType, 
  PromoCampaignStatus,
  PromoCampaign 
} from '@prisma/client';
import { logAgentAction } from '@/lib/services/agentLogger';
import { automationEngine } from './automationEngine';

export interface CreateCampaignInput {
  name: string;
  description?: string;
  type: CampaignType;
  discountCode?: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrderValue?: number;
  maxUses?: number;
  targetAudience?: {
    segments?: string[];
    tags?: string[];
    minPurchases?: number;
    lastPurchaseDays?: number;
  };
  channels: ('email' | 'sms' | 'social' | 'push')[];
  startDate: Date;
  endDate: Date;
}

export interface CampaignStats {
  campaign: PromoCampaign;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  emailStats: {
    sent: number;
    opened: number;
    clicked: number;
    openRate: number;
    clickRate: number;
  };
  socialStats: {
    reach: number;
    engagement: number;
    engagementRate: number;
  };
  conversionRate: number;
  roi: number;
}

/**
 * Campaign Manager Class
 */
export class CampaignManager {
  
  /**
   * Create a new promotional campaign
   */
  async createCampaign(input: CreateCampaignInput): Promise<PromoCampaign> {
    // Validate discount code uniqueness if provided
    if (input.discountCode) {
      const existing = await prisma.promoCampaign.findUnique({
        where: { discountCode: input.discountCode }
      });
      
      if (existing) {
        throw new Error(`Discount code ${input.discountCode} already exists`);
      }
    }
    
    const campaign = await prisma.promoCampaign.create({
      data: {
        name: input.name,
        description: input.description,
        type: input.type,
        discountCode: input.discountCode,
        discountPercent: input.discountPercent,
        discountAmount: input.discountAmount,
        minOrderValue: input.minOrderValue,
        maxUses: input.maxUses,
        targetAudience: input.targetAudience,
        channels: input.channels,
        startDate: input.startDate,
        endDate: input.endDate,
        status: 'DRAFT'
      }
    });
    
    await logAgentAction({
      agent: 'marketing',
      action: 'item_created',
      status: 'SUCCESS',
      message: `Campaign "${input.name}" created`,
      metadata: { campaignId: campaign.id, type: input.type }
    });
    
    return campaign;
  }
  
  /**
   * Activate a campaign
   */
  async activateCampaign(campaignId: string): Promise<PromoCampaign> {
    const campaign = await prisma.promoCampaign.findUnique({
      where: { id: campaignId }
    });
    
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    
    if (campaign.status !== 'DRAFT' && campaign.status !== 'PAUSED') {
      throw new Error(`Cannot activate campaign with status: ${campaign.status}`);
    }
    
    const now = new Date();
    const status: PromoCampaignStatus = now >= campaign.startDate ? 'ACTIVE' : 'SCHEDULED';
    
    const updated = await prisma.promoCampaign.update({
      where: { id: campaignId },
      data: { status }
    });
    
    // If activating now, trigger campaign launch workflows
    if (status === 'ACTIVE') {
      await this.launchCampaign(updated);
    }
    
    await logAgentAction({
      agent: 'marketing',
      action: 'item_updated',
      status: 'SUCCESS',
      message: `Campaign "${campaign.name}" ${status.toLowerCase()}`,
      metadata: { campaignId, status }
    });
    
    return updated;
  }
  
  /**
   * Launch campaign - send emails, schedule posts
   */
  private async launchCampaign(campaign: PromoCampaign): Promise<void> {
    const channels = campaign.channels as string[] || [];
    const audience = campaign.targetAudience as Record<string, unknown> || {};
    
    // Get target contacts
    const contacts = await this.getTargetContacts(audience);
    
    // Email channel
    if (channels.includes('email') && contacts.length > 0) {
      for (const contact of contacts) {
        await automationEngine.handleTrigger({
          trigger: 'CUSTOM_EVENT',
          contactId: contact.id,
          email: contact.email,
          data: {
            eventType: 'campaign_launch',
            campaignId: campaign.id,
            campaignName: campaign.name,
            discountCode: campaign.discountCode,
            discountPercent: campaign.discountPercent
          }
        });
      }
    }
    
    // Social channel - schedule promotional post
    if (channels.includes('social')) {
      const content = this.generateSocialContent(campaign);
      
      await prisma.scheduledPost.create({
        data: {
          platform: 'INSTAGRAM',
          content: content.text,
          hashtags: content.hashtags,
          scheduledAt: new Date(),
          status: 'SCHEDULED',
          metadata: { campaignId: campaign.id }
        }
      });
      
      // Also Facebook
      await prisma.scheduledPost.create({
        data: {
          platform: 'FACEBOOK',
          content: content.text,
          scheduledAt: new Date(),
          status: 'SCHEDULED',
          metadata: { campaignId: campaign.id }
        }
      });
    }
    
    // Initialize analytics for today
    await prisma.campaignAnalytics.upsert({
      where: {
        campaignId_date: {
          campaignId: campaign.id,
          date: new Date(new Date().toISOString().split('T')[0])
        }
      },
      create: {
        campaignId: campaign.id,
        date: new Date(new Date().toISOString().split('T')[0]),
        emailsSent: contacts.length
      },
      update: {
        emailsSent: { increment: contacts.length }
      }
    });
  }
  
  /**
   * Get target contacts based on audience rules
   */
  private async getTargetContacts(audience: Record<string, unknown>): Promise<Array<{ id: string; email: string }>> {
    const where: Record<string, unknown> = {
      newsletterStatus: 'ACTIVE'
    };
    
    // Filter by tags
    if (audience.tags && Array.isArray(audience.tags)) {
      where.tags = { hasSome: audience.tags };
    }
    
    // Filter by purchase history
    if (audience.minPurchases) {
      where.purchaseCount = { gte: audience.minPurchases };
    }
    
    // Filter by last purchase date
    if (audience.lastPurchaseDays) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - (audience.lastPurchaseDays as number));
      where.lastPurchaseAt = { gte: cutoff };
    }
    
    try {
      const contacts = await prisma.emailContact.findMany({
        where,
        select: { id: true, email: true },
        take: 1000 // Limit batch size
      });
      
      return contacts;
    } catch (error) {
      console.error('[Campaign] Failed to get contacts:', error);
      return [];
    }
  }
  
  /**
   * Generate social media content for campaign
   */
  private generateSocialContent(campaign: PromoCampaign): { text: string; hashtags: string[] } {
    const discount = campaign.discountPercent 
      ? `${campaign.discountPercent}% OFF`
      : campaign.discountAmount 
        ? `₹${campaign.discountAmount} OFF`
        : 'Special Offer';
    
    const typeEmojis: Record<CampaignType, string> = {
      FLASH_SALE: '⚡',
      SEASONAL: '🌸',
      LOYALTY_REWARD: '💚',
      WIN_BACK: '🔙',
      PRODUCT_LAUNCH: '🆕',
      CLEARANCE: '🏷️',
      HOLIDAY: '🎉',
      CUSTOM: '✨'
    };
    
    const emoji = typeEmojis[campaign.type] || '✨';
    
    const text = `${emoji} ${campaign.name}!\n\n${campaign.description || `Get ${discount} on your order!`}\n\n${
      campaign.discountCode ? `🎁 Use code: ${campaign.discountCode}\n` : ''
    }🌿 Shop now at wholelotofnature.com\n\n⏰ Valid until ${campaign.endDate.toLocaleDateString()}`;
    
    const hashtags = [
      '#wholelotofnature',
      '#plantlover',
      '#houseplants',
      '#indoorplants',
      '#plantsofinstagram',
      `#${campaign.type.toLowerCase().replace('_', '')}`,
      '#bangalore',
      '#plantshop'
    ];
    
    return { text, hashtags };
  }
  
  /**
   * Pause a campaign
   */
  async pauseCampaign(campaignId: string): Promise<PromoCampaign> {
    const campaign = await prisma.promoCampaign.update({
      where: { id: campaignId },
      data: { status: 'PAUSED' }
    });
    
    await logAgentAction({
      agent: 'marketing',
      action: 'item_updated',
      status: 'SUCCESS',
      message: `Campaign "${campaign.name}" paused`,
      metadata: { campaignId }
    });
    
    return campaign;
  }
  
  /**
   * Get campaign statistics
   */
  async getCampaignStats(campaignId: string): Promise<CampaignStats | null> {
    const campaign = await prisma.promoCampaign.findUnique({
      where: { id: campaignId },
      include: {
        analytics: true
      }
    });
    
    if (!campaign) {
      return null;
    }
    
    // Aggregate analytics
    const analytics = campaign.analytics;
    
    const totalImpressions = analytics.reduce((sum, a) => sum + a.impressions, 0);
    const totalClicks = analytics.reduce((sum, a) => sum + a.clicks, 0);
    const totalConversions = analytics.reduce((sum, a) => sum + a.conversions, 0);
    const totalRevenue = analytics.reduce((sum, a) => sum + a.revenue, 0);
    const emailsSent = analytics.reduce((sum, a) => sum + a.emailsSent, 0);
    const emailsOpened = analytics.reduce((sum, a) => sum + a.emailsOpened, 0);
    const emailClicks = analytics.reduce((sum, a) => sum + a.emailClicks, 0);
    const socialReach = analytics.reduce((sum, a) => sum + a.socialReach, 0);
    const socialEngage = analytics.reduce((sum, a) => sum + a.socialEngage, 0);
    
    // Calculate discount cost for ROI
    const discountCost = totalConversions * (
      (campaign.discountPercent ? (campaign.discountPercent / 100) * (totalRevenue / totalConversions || 0) : 0) +
      (campaign.discountAmount || 0)
    );
    
    return {
      campaign,
      totalImpressions,
      totalClicks,
      totalConversions,
      totalRevenue,
      emailStats: {
        sent: emailsSent,
        opened: emailsOpened,
        clicked: emailClicks,
        openRate: emailsSent > 0 ? (emailsOpened / emailsSent) * 100 : 0,
        clickRate: emailsOpened > 0 ? (emailClicks / emailsOpened) * 100 : 0
      },
      socialStats: {
        reach: socialReach,
        engagement: socialEngage,
        engagementRate: socialReach > 0 ? (socialEngage / socialReach) * 100 : 0
      },
      conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
      roi: discountCost > 0 ? ((totalRevenue - discountCost) / discountCost) * 100 : 0
    };
  }
  
  /**
   * Track campaign conversion
   */
  async trackConversion(
    discountCode: string, 
    orderValue: number
  ): Promise<void> {
    const campaign = await prisma.promoCampaign.findUnique({
      where: { discountCode }
    });
    
    if (!campaign) {
      return;
    }
    
    // Update usage count
    await prisma.promoCampaign.update({
      where: { id: campaign.id },
      data: { usedCount: { increment: 1 } }
    });
    
    // Update daily analytics
    const today = new Date(new Date().toISOString().split('T')[0]);
    
    await prisma.campaignAnalytics.upsert({
      where: {
        campaignId_date: {
          campaignId: campaign.id,
          date: today
        }
      },
      create: {
        campaignId: campaign.id,
        date: today,
        conversions: 1,
        revenue: orderValue
      },
      update: {
        conversions: { increment: 1 },
        revenue: { increment: orderValue }
      }
    });
    
    // Check if max uses reached
    if (campaign.maxUses && campaign.usedCount + 1 >= campaign.maxUses) {
      await prisma.promoCampaign.update({
        where: { id: campaign.id },
        data: { status: 'COMPLETED' }
      });
    }
  }
  
  /**
   * Get all active campaigns
   */
  async getActiveCampaigns(): Promise<PromoCampaign[]> {
    return prisma.promoCampaign.findMany({
      where: {
        status: 'ACTIVE',
        startDate: { lte: new Date() },
        endDate: { gte: new Date() }
      },
      orderBy: { startDate: 'desc' }
    });
  }
  
  /**
   * Process scheduled campaigns
   */
  async processScheduledCampaigns(): Promise<number> {
    const now = new Date();
    
    // Activate scheduled campaigns that should start
    const toActivate = await prisma.promoCampaign.findMany({
      where: {
        status: 'SCHEDULED',
        startDate: { lte: now }
      }
    });
    
    for (const campaign of toActivate) {
      await prisma.promoCampaign.update({
        where: { id: campaign.id },
        data: { status: 'ACTIVE' }
      });
      
      await this.launchCampaign({ ...campaign, status: 'ACTIVE' });
    }
    
    // Complete campaigns that have ended
    await prisma.promoCampaign.updateMany({
      where: {
        status: 'ACTIVE',
        endDate: { lt: now }
      },
      data: { status: 'COMPLETED' }
    });
    
    return toActivate.length;
  }
  
  /**
   * Validate discount code
   */
  async validateDiscountCode(code: string, orderValue: number): Promise<{
    valid: boolean;
    error?: string;
    discount?: { type: 'percent' | 'amount'; value: number };
    campaignId?: string;
  }> {
    const campaign = await prisma.promoCampaign.findUnique({
      where: { discountCode: code }
    });
    
    if (!campaign) {
      return { valid: false, error: 'Invalid discount code' };
    }
    
    if (campaign.status !== 'ACTIVE') {
      return { valid: false, error: 'This discount code is not active' };
    }
    
    const now = new Date();
    if (now < campaign.startDate || now > campaign.endDate) {
      return { valid: false, error: 'This discount code has expired' };
    }
    
    if (campaign.maxUses && campaign.usedCount >= campaign.maxUses) {
      return { valid: false, error: 'This discount code has reached its usage limit' };
    }
    
    if (campaign.minOrderValue && orderValue < campaign.minOrderValue) {
      return { 
        valid: false, 
        error: `Minimum order value of ₹${campaign.minOrderValue} required` 
      };
    }
    
    return {
      valid: true,
      discount: campaign.discountPercent 
        ? { type: 'percent', value: campaign.discountPercent }
        : { type: 'amount', value: campaign.discountAmount || 0 },
      campaignId: campaign.id
    };
  }
}

// Export singleton instance
export const campaignManager = new CampaignManager();
