import { EmailSource, NewsletterStatus, EmailEventType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { WooCommerceService, WooCommerceCustomer } from '@/lib/services/woocommerceService';
import { sendEmail, buildBrandedEmail } from '@/lib/services/emailService';
import { BUSINESS_EMAIL } from '@/lib/config/site';

interface IngestContactInput {
  email: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
  source?: EmailSource;
  sourceReference?: string;
  metadata?: Record<string, any>;
  totalSpend?: number;
  lastInteraction?: Date;
}

interface NewsletterSignupInput extends IngestContactInput {
  preferences?: Record<string, any>;
}

interface OfferCampaignInput {
  subject: string;
  headline: string;
  body: string;
  offerHighlight: string;
  buttonText: string;
  buttonUrl: string;
  audienceTags?: string[];
  sampleOnly?: boolean;
}

export default class EmailIntelligenceAgent {
  async ingestContact(input: IngestContactInput) {
    const normalizedEmail = input.email.trim().toLowerCase();
    const existing = await prisma.emailContact.findUnique({ where: { email: normalizedEmail } });
    const tags = Array.from(new Set([...(existing?.tags as string[] | undefined ?? []), ...(input.tags ?? [])]));

    const contact = await prisma.emailContact.upsert({
      where: { email: normalizedEmail },
      update: {
        firstName: input.firstName ?? existing?.firstName ?? null,
        lastName: input.lastName ?? existing?.lastName ?? null,
        source: input.source ?? existing?.source ?? EmailSource.FORM,
        sourceReference: input.sourceReference ?? existing?.sourceReference ?? null,
        tags,
        metadata: this.mergeMetadata(existing?.metadata as Record<string, any> | null, input.metadata),
        totalSpend: typeof input.totalSpend === 'number' ? input.totalSpend : existing?.totalSpend ?? 0,
        lastInteraction: input.lastInteraction ?? existing?.lastInteraction ?? new Date(),
      },
      create: {
        email: normalizedEmail,
        firstName: input.firstName,
        lastName: input.lastName,
        source: input.source ?? EmailSource.FORM,
        sourceReference: input.sourceReference,
        tags,
        metadata: input.metadata ?? {},
        totalSpend: input.totalSpend ?? 0,
        lastInteraction: input.lastInteraction ?? new Date(),
      },
    });

    await this.refreshIntentForContact(contact.id);
    return contact;
  }

  async recordNewsletterSignup(input: NewsletterSignupInput) {
    const contact = await this.ingestContact({
      ...input,
      tags: Array.from(new Set([...(input.tags ?? []), 'newsletter'])),
      source: EmailSource.NEWSLETTER,
    });

    const subscription = await prisma.newsletterSubscription.upsert({
      where: { contactId: contact.id },
      update: {
        status: NewsletterStatus.ACTIVE,
        preferences: input.preferences ?? {},
      },
      create: {
        contactId: contact.id,
        status: NewsletterStatus.ACTIVE,
        preferences: input.preferences ?? {},
      },
    });

    await this.recordEvent(contact.id, EmailEventType.SUBSCRIBED, {
      channel: 'newsletter',
      preferences: input.preferences ?? {},
    });

    if (!subscription.welcomeSent) {
      await this.sendWelcomeEmail(contact.email, contact.firstName);
      await prisma.newsletterSubscription.update({
        where: { id: subscription.id },
        data: { welcomeSent: true, welcomeSentAt: new Date() },
      });
    }

    return contact;
  }

  async synchronizeWooCommerceCustomers(limit: number = 100) {
    const customers = await WooCommerceService.getCustomers(limit);
    let imported = 0;

    for (const customer of customers) {
      if (!customer.email) continue;
      imported++;
      await this.ingestContact({
        email: customer.email,
        firstName: customer.first_name,
        lastName: customer.last_name,
        source: EmailSource.ORDER,
        tags: ['woo-customer'],
        sourceReference: `wc-${customer.id}`,
        totalSpend: customer.total_spent ? parseFloat(customer.total_spent) : undefined,
        metadata: {
          ordersCount: customer.orders_count,
          billing: customer.billing,
        },
      });
    }

    return { imported, total: customers.length };
  }

  async refreshIntentScoresFromOrders() {
    const orders = await prisma.order.findMany({ include: { user: true } });
    for (const order of orders) {
      if (!order.user?.email) continue;
      await this.ingestContact({
        email: order.user.email,
        firstName: order.user.name ?? undefined,
        source: EmailSource.ORDER,
        tags: ['customer'],
        totalSpend: order.total,
        lastInteraction: order.updatedAt,
        metadata: {
          lastOrderId: order.id,
          status: order.status,
        },
      });
    }

    return { ordersProcessed: orders.length };
  }

  async sendOfferCampaign(options: OfferCampaignInput) {
    const contacts = await prisma.emailContact.findMany({
      where: options.audienceTags && options.audienceTags.length
        ? { tags: { path: '$', array_contains: options.audienceTags } }
        : undefined,
      take: options.sampleOnly ? 10 : 200,
    });

    const body = `
      <p>${options.body}</p>
      <p style="background:#ecfdf5;padding:16px;border-radius:16px;font-weight:600;">
        ${options.offerHighlight}
      </p>
    `;

    const html = buildBrandedEmail({
      title: options.headline,
      intro: 'Exclusive offer from Whole Lot of Nature',
      body,
      buttonText: options.buttonText,
      buttonUrl: options.buttonUrl,
      footer: `Questions? Reply to ${BUSINESS_EMAIL} or WhatsApp us for instant assistance.`,
    });

    if (contacts.length === 0) {
      return { success: false, sent: 0, error: 'No contacts in selection' };
    }

    if (options.sampleOnly) {
      const preview = await sendEmail({
        to: BUSINESS_EMAIL,
        subject: `[PREVIEW] ${options.subject}`,
        html,
      });
      return { success: preview.success, preview: true, sent: preview.success ? 1 : 0 };
    }

    const results = await Promise.allSettled(
      contacts.map((contact) =>
        sendEmail({
          to: contact.email,
          subject: options.subject,
          html,
        })
      )
    );

    const sent = results.filter((result) => result.status === 'fulfilled' && result.value.success).length;
    const failed = results.length - sent;

    return { success: failed === 0, sent, failed };
  }

  async getDashboardSnapshot() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const [contacts, newsletterActive, events] = await Promise.all([
      prisma.emailContact.count(),
      prisma.newsletterSubscription.count({ where: { status: NewsletterStatus.ACTIVE } }),
      prisma.emailEvent.count({ where: { createdAt: { gte: sevenDaysAgo } } })
    ]);

    return {
      totalContacts: contacts,
      activeNewsletter: newsletterActive,
      eventsLast7Days: events,
    };
  }

  async getContactSheet(limit: number = 200) {
    const contacts = await prisma.emailContact.findMany({
      orderBy: { updatedAt: 'desc' },
      take: limit,
      include: {
        intent: true,
        newsletter: true,
      },
    });

    return contacts.map((contact) => ({
      email: contact.email,
      name: `${contact.firstName ?? ''} ${contact.lastName ?? ''}`.trim() || contact.email,
      source: contact.source,
      tags: contact.tags as string[] | null,
      totalSpend: contact.totalSpend,
      intent: contact.intent?.intentType,
      intentScore: contact.intent?.score,
      newsletter: contact.newsletter?.status,
      lastInteraction: contact.lastInteraction,
    }));
  }

  private async sendWelcomeEmail(email: string, firstName?: string | null) {
    const html = buildBrandedEmail({
      title: 'Welcome to Whole Lot of Nature 🌿',
      intro: 'Thank you for joining our community',
      body: `
        <p>Hi ${firstName ?? 'there'},</p>
        <p>We are thrilled to have you with us. Expect personalized tips, exclusive offers, and early access to limited edition plant drops curated for Indian homes.</p>
        <ul>
          <li>Weekly care guides tailored to your plant goals</li>
          <li>Private offers on best-selling combos</li>
          <li>Access to our gardening specialists for quick help</li>
        </ul>
      `,
      buttonText: 'Browse New Arrivals',
      buttonUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://wholelotofnature.com'}/shop/new`,
      footer: 'Saved us to contacts yet? Emails land better when you do 👍',
    });

    await sendEmail({
      to: email,
      subject: 'You’re in! Welcome to the Whole Lot of Nature family 🌱',
      html,
    });
  }

  private async refreshIntentForContact(contactId: string) {
    const contact = await prisma.emailContact.findUnique({ where: { id: contactId } });
    if (!contact) return;

    const { intentType, score, signals } = this.calculateIntentSignals(contact);

    await prisma.emailIntent.upsert({
      where: { contactId },
      update: { intentType, score, signals, updatedAt: new Date() },
      create: { contactId, intentType, score, signals },
    });
  }

  private calculateIntentSignals(contact: { totalSpend: number; lastInteraction: Date | null; tags: unknown }) {
    let score = 50;
    const signals: Record<string, any> = {};
    const lastInteraction = contact.lastInteraction ? new Date(contact.lastInteraction) : null;

    if (contact.totalSpend > 5000) {
      score += 30;
      signals.highValue = true;
    } else if (contact.totalSpend > 1500) {
      score += 15;
      signals.frequentBuyer = true;
    }

    if (lastInteraction) {
      const days = (Date.now() - lastInteraction.getTime()) / (1000 * 60 * 60 * 24);
      signals.daysSinceInteraction = Math.round(days);
      if (days < 7) {
        score += 10;
      } else if (days > 30) {
        score -= 10;
      }
    }

    const tags = (contact.tags as string[] | null) ?? [];
    if (tags.includes('newsletter')) {
      score += 5;
      signals.newsletter = true;
    }

    let intentType = 'PROSPECT';
    if (score >= 80) intentType = 'LOYAL_BUYER';
    else if (score >= 65) intentType = 'HIGH_INTENT';
    else if (score <= 40) intentType = 'AT_RISK';

    return { intentType, score: Math.max(10, Math.min(100, score)), signals };
  }

  private mergeMetadata(existing?: Record<string, any> | null, incoming?: Record<string, any>) {
    if (!existing) return incoming ?? {};
    if (!incoming) return existing;
    return { ...existing, ...incoming };
  }
}
