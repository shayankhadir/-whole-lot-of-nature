export type OutreachLeadType = 'customer' | 'partner' | 'b2b' | 'influencer';

interface OutreachLead {
  name: string;
  company?: string;
  niche?: string;
  contact?: string;
  source?: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wholelotofnature.com';

const baseStyles = `
  font-family: 'Inter', 'Helvetica', Arial, sans-serif;
  color: #0f1f14;
  line-height: 1.6;
`;

const buttonStyles = `
  display: inline-block;
  padding: 12px 22px;
  border-radius: 999px;
  background: #2e7d32;
  color: #ffffff !important;
  font-weight: 600;
  text-decoration: none;
`;

const header = (title: string, subtitle: string) => `
  <div style="${baseStyles}">
    <h1 style="font-size: 22px; margin: 0 0 8px;">${title}</h1>
    <p style="margin: 0 0 20px; color: #315040;">${subtitle}</p>
  </div>
`;

const footer = `
  <p style="margin-top: 28px; font-size: 12px; color: #6b7f73;">
    Whole Lot of Nature · Bangalore · ${SITE_URL}
  </p>
`;

export function getOutreachTemplate(type: OutreachLeadType, lead: OutreachLead) {
  const name = lead.name || 'there';
  const company = lead.company ? ` at ${lead.company}` : '';
  const niche = lead.niche ? ` for ${lead.niche}` : '';
  const saleUrl = `${SITE_URL}/sale-24`;

  switch (type) {
    case 'customer':
      return {
        subject: `🌿 24-hour plant upgrade for you, ${name}`,
        html: `
          ${header('Your green space deserves a glow-up', 'We set aside a 24-hour collection for our best customers.')}
          <p>Hi ${name},</p>
          <p>Thank you for shopping with Whole Lot of Nature! We just launched a 24-hour sale featuring our top indoor favorites and care bundles.</p>
          <p><a href="${saleUrl}" style="${buttonStyles}">Unlock the 24-hour sale</a></p>
          <p>If you want a personal recommendation, just reply and we’ll curate a cart based on your space.</p>
          ${footer}
        `,
      };
    case 'partner':
      return {
        subject: `Partner spotlight opportunity${company}`,
        html: `
          ${header('Let’s collaborate on a plant-forward feature', 'We’re collecting partner spotlights this week.')}
          <p>Hi ${name},</p>
          <p>We admired your work${company}${niche}. We’re running a 24-hour plant offer and would love to include your community in a partner spotlight.</p>
          <p>Here’s the campaign link: <a href="${saleUrl}">${saleUrl}</a></p>
          <p>If you’d like a custom offer or a guest post, we can draft it within the next 24 hours.</p>
          ${footer}
        `,
      };
    case 'influencer':
      return {
        subject: `Collab invite: 24-hour plant glow-up${company}`,
        html: `
          ${header('Let’s co-create a plant transformation', 'Short campaign, high engagement.')}
          <p>Hey ${name},</p>
          <p>We’re curating a 24-hour plant glow-up and think your audience${niche} will love it. We can share a custom code and ship a featured plant set.</p>
          <p><a href="${saleUrl}" style="${buttonStyles}">Preview the offer</a></p>
          <p>Reply with your preferred collab format (reel, story, blog) and we’ll align today.</p>
          ${footer}
        `,
      };
    default:
      return {
        subject: `Bulk plant sourcing${company}`,
        html: `
          ${header('Plants that elevate your next project', 'Reliable supply + quick delivery in Bangalore.')}
          <p>Hello ${name},</p>
          <p>We supply curated plant sets for offices, interiors, and gifting${company}. We’re running a 24-hour sale and can extend bulk pricing${niche}.</p>
          <p><a href="${saleUrl}" style="${buttonStyles}">See the 24-hour offer</a></p>
          <p>Happy to send a quick proposal or call today.</p>
          ${footer}
        `,
      };
  }
}
