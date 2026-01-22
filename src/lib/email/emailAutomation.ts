/**
 * Email Marketing Automation Service
 * Handles automated email campaigns: welcome, abandoned cart, order notifications
 */

import { Resend } from 'resend';
import {
  welcomeEmail,
  abandonedCartEmail,
  orderConfirmationEmail,
  shippingNotificationEmail,
  reviewRequestEmail,
  reEngagementEmail,
} from './templates';
import { getOutreachTemplate, type OutreachLeadType } from './outreachTemplates';

// Lazy initialization of Resend client
let resendClient: Resend | null = null;
function getResend(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

const FROM_EMAIL = process.env.MARKETING_EMAIL_FROM || 'Whole Lot of Nature <hello@wholelotofnature.com>';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wholelotofnature.com';

export interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

export interface AbandonedCart {
  email: string;
  customerName?: string;
  items: Array<{
    productId: number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  cartToken?: string;
  createdAt: Date;
  lastReminderSent?: Date;
  reminderCount: number;
}

export interface OrderData {
  orderId: string;
  email: string;
  customerName: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  total: number;
  trackingUrl?: string;
}

export interface OutreachLead {
  name: string;
  company?: string;
  niche?: string;
  contact?: string;
  source?: string;
}

export interface LeadDropReport {
  date: string;
  totalLeads: number;
  hotLeads: number;
  newLeads: number;
  contacted: number;
  sources: Record<string, number>;
  topLeads: Array<{ name: string; source: string; score?: number }>;
}

/**
 * Send welcome email to new subscriber
 */
export async function sendWelcomeEmail(
  email: string,
  customerName?: string,
  discountCode: string = 'WELCOME10'
): Promise<EmailResult> {
  try {
    const template = welcomeEmail({
      customerName,
      discountCode,
      unsubscribeUrl: `${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}`
    });

    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: template.subject,
      html: template.html
    });

    if (error) {
      console.error('[Email] Welcome email failed:', error);
      return { success: false, error: error.message };
    }

    console.log(`[Email] Welcome email sent to ${email}`, data?.id);
    
    // Log to database
    await logEmailEvent('welcome', email, data?.id);
    
    return { success: true, id: data?.id };
  } catch (error) {
    console.error('[Email] Welcome email error:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Send abandoned cart reminder
 */
export async function sendAbandonedCartEmail(
  cart: AbandonedCart,
  discountCode?: string,
  discountPercent?: number
): Promise<EmailResult> {
  try {
    const template = abandonedCartEmail({
      customerName: cart.customerName,
      cartItems: cart.items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        url: `${SITE_URL}/product/${item.productId}`
      })),
      discountCode,
      discountPercent,
      unsubscribeUrl: `${SITE_URL}/unsubscribe?email=${encodeURIComponent(cart.email)}`
    });

    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: cart.email,
      subject: template.subject,
      html: template.html
    });

    if (error) {
      console.error('[Email] Abandoned cart email failed:', error);
      return { success: false, error: error.message };
    }

    console.log(`[Email] Abandoned cart email sent to ${cart.email}`, data?.id);
    
    await logEmailEvent('abandoned_cart', cart.email, data?.id, {
      cartValue: cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      itemCount: cart.items.length,
      reminderNumber: cart.reminderCount + 1
    });
    
    return { success: true, id: data?.id };
  } catch (error) {
    console.error('[Email] Abandoned cart email error:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(order: OrderData): Promise<EmailResult> {
  try {
    const template = orderConfirmationEmail({
      customerName: order.customerName,
      orderNumber: order.orderId,
      orderTotal: order.total,
      cartItems: order.items,
      trackingUrl: order.trackingUrl
    });

    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: order.email,
      subject: template.subject,
      html: template.html
    });

    if (error) {
      console.error('[Email] Order confirmation email failed:', error);
      return { success: false, error: error.message };
    }

    console.log(`[Email] Order confirmation sent for order ${order.orderId}`, data?.id);
    
    await logEmailEvent('order_confirmation', order.email, data?.id, {
      orderId: order.orderId,
      orderTotal: order.total
    });
    
    return { success: true, id: data?.id };
  } catch (error) {
    console.error('[Email] Order confirmation error:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Send shipping notification email
 */
export async function sendShippingNotificationEmail(
  email: string,
  customerName: string,
  orderId: string,
  trackingUrl: string
): Promise<EmailResult> {
  try {
    const template = shippingNotificationEmail({
      customerName,
      orderNumber: orderId,
      trackingUrl
    });

    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: template.subject,
      html: template.html
    });

    if (error) {
      console.error('[Email] Shipping notification failed:', error);
      return { success: false, error: error.message };
    }

    console.log(`[Email] Shipping notification sent for order ${orderId}`, data?.id);
    
    await logEmailEvent('shipping', email, data?.id, { orderId, trackingUrl });
    
    return { success: true, id: data?.id };
  } catch (error) {
    console.error('[Email] Shipping notification error:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Send review request email (post-delivery)
 */
export async function sendReviewRequestEmail(
  email: string,
  customerName: string,
  orderId: string,
  productUrl?: string
): Promise<EmailResult> {
  try {
    const template = reviewRequestEmail({
      customerName,
      orderNumber: orderId,
      productUrl: productUrl || `${SITE_URL}/shop`,
      unsubscribeUrl: `${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}`
    });

    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: template.subject,
      html: template.html
    });

    if (error) {
      console.error('[Email] Review request email failed:', error);
      return { success: false, error: error.message };
    }

    console.log(`[Email] Review request sent to ${email}`, data?.id);
    
    await logEmailEvent('review_request', email, data?.id, { orderId });
    
    return { success: true, id: data?.id };
  } catch (error) {
    console.error('[Email] Review request error:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Send re-engagement email to inactive customers
 */
export async function sendReEngagementEmail(
  email: string,
  customerName?: string,
  discountCode: string = 'COMEBACK15',
  discountPercent: number = 15
): Promise<EmailResult> {
  try {
    const template = reEngagementEmail({
      customerName,
      discountCode,
      discountPercent,
      unsubscribeUrl: `${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}`
    });

    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: template.subject,
      html: template.html
    });

    if (error) {
      console.error('[Email] Re-engagement email failed:', error);
      return { success: false, error: error.message };
    }

    console.log(`[Email] Re-engagement email sent to ${email}`, data?.id);
    
    await logEmailEvent('reengagement', email, data?.id, { discountCode, discountPercent });
    
    return { success: true, id: data?.id };
  } catch (error) {
    console.error('[Email] Re-engagement error:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Send outreach email to lead
 */
export async function sendOutreachEmail(
  email: string,
  leadType: OutreachLeadType,
  lead: OutreachLead
): Promise<EmailResult> {
  try {
    const template = getOutreachTemplate(leadType, lead);

    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: template.subject,
      html: template.html,
    });

    if (error) {
      console.error('[Email] Outreach email failed:', error);
      return { success: false, error: error.message };
    }

    await logEmailEvent('outreach', email, data?.id, {
      leadType,
      leadName: lead.name,
      leadCompany: lead.company,
      leadSource: lead.source,
    });

    return { success: true, id: data?.id };
  } catch (error) {
    console.error('[Email] Outreach error:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Send daily lead drop report email
 */
export async function sendLeadDropReport(
  email: string,
  report: LeadDropReport
): Promise<EmailResult> {
  try {
    const summaryRows = Object.entries(report.sources)
      .map(([source, count]) => `<li>${source}: <strong>${count}</strong></li>`)
      .join('');

    const leadRows = report.topLeads
      .map((lead) => `<li>${lead.name} (${lead.source}) — score ${lead.score ?? 'N/A'}</li>`)
      .join('');

    const html = `
      <div style="font-family: Inter, Arial, sans-serif; color: #0f1f14;">
        <h2>Daily Lead Drop — ${report.date}</h2>
        <p>Total leads: <strong>${report.totalLeads}</strong></p>
        <p>Hot: <strong>${report.hotLeads}</strong> · New: <strong>${report.newLeads}</strong> · Contacted: <strong>${report.contacted}</strong></p>
        <h3>Sources</h3>
        <ul>${summaryRows}</ul>
        <h3>Top Leads</h3>
        <ul>${leadRows}</ul>
        <p>Run the Growth Agent for deeper insights and outreach.</p>
      </div>
    `;

    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Daily Lead Drop — ${report.date}`,
      html,
    });

    if (error) {
      console.error('[Email] Lead drop report failed:', error);
      return { success: false, error: error.message };
    }

    await logEmailEvent('lead_report', email, data?.id, report as unknown as Record<string, unknown>);

    return { success: true, id: data?.id };
  } catch (error) {
    console.error('[Email] Lead drop report error:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Log email event to database
 * Uses the EmailContact model if the contact exists
 */
async function logEmailEvent(
  type: string,
  email: string,
  emailId?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    // Import prisma dynamically to avoid issues
    const { prisma } = await import('@/lib/prisma');
    
    // Find or create contact
    let contact = await prisma.emailContact.findUnique({
      where: { email }
    });
    
    if (!contact) {
      // Create a basic contact for email tracking
      contact = await prisma.emailContact.create({
        data: {
          email,
          source: 'FORM',
          firstName: metadata?.customerName as string || null
        }
      });
    }
    
    // Map our type to EmailEventType enum
    const eventTypeMap: Record<string, string> = {
      'welcome': 'SUBSCRIBED',
      'abandoned_cart': 'CART_ABANDONED',
      'order_confirmation': 'PURCHASED',
      'shipping': 'CAMPAIGN_SENT',
      'review_request': 'CAMPAIGN_SENT',
      'reengagement': 'CAMPAIGN_SENT',
      'outreach': 'CAMPAIGN_SENT',
      'lead_report': 'CAMPAIGN_SENT'
    };
    
    const eventType = eventTypeMap[type] || 'CAMPAIGN_SENT';
    
    await prisma.emailEvent.create({
      data: {
        contactId: contact.id,
        type: eventType as 'SUBSCRIBED' | 'UNSUBSCRIBED' | 'PURCHASED' | 'CART_ABANDONED' | 'CAMPAIGN_SENT' | 'CAMPAIGN_OPEN' | 'CAMPAIGN_CLICK' | 'MANUAL_NOTE',
        payload: {
          emailId,
          originalType: type,
          ...metadata
        }
      }
    });
  } catch (error) {
    // Don't fail if logging fails
    console.error('[Email] Failed to log email event:', error);
  }
}

/**
 * Get email campaign statistics
 */
export async function getEmailStats(): Promise<{
  totalSent: number;
  byType: Record<string, number>;
  last24Hours: number;
  last7Days: number;
}> {
  try {
    const { prisma } = await import('@/lib/prisma');
    
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const [total, typeGroups, last24h, last7d] = await Promise.all([
      prisma.emailEvent.count(),
      prisma.emailEvent.groupBy({
        by: ['type'],
        _count: { type: true }
      }),
      prisma.emailEvent.count({
        where: { createdAt: { gte: oneDayAgo } }
      }),
      prisma.emailEvent.count({
        where: { createdAt: { gte: sevenDaysAgo } }
      })
    ]);
    
    const byType: Record<string, number> = {};
    typeGroups.forEach(group => {
      byType[group.type] = group._count.type;
    });
    
    return {
      totalSent: total,
      byType,
      last24Hours: last24h,
      last7Days: last7d
    };
  } catch (error) {
    console.error('[Email] Failed to get stats:', error);
    return {
      totalSent: 0,
      byType: {},
      last24Hours: 0,
      last7Days: 0
    };
  }
}
