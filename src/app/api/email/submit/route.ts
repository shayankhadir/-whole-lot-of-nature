/**
 * Public Email Submission Endpoint
 * Handles contact form + newsletter signups and routes them into the email intelligence pipeline.
 */

import { NextRequest, NextResponse } from 'next/server';
import { EmailSource } from '@prisma/client';
import EmailIntelligenceAgent from '@/lib/agents/emailIntelligenceAgent';
import { BUSINESS_EMAIL } from '@/lib/config/site';
import { buildBrandedEmail, sendEmail } from '@/lib/services/emailService';

const emailAgent = new EmailIntelligenceAgent();

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json().catch(() => null);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 });
    }

    const type = (payload.type as string) ?? 'contact';

    if (type === 'newsletter') {
      return handleNewsletter(payload);
    }

    return handleContact(payload);
  } catch (error: any) {
    console.error('Email submission error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Unable to process request' },
      { status: 500 }
    );
  }
}

async function handleContact(payload: any) {
  const name = String(payload.name || '').trim();
  const email = String(payload.email || '').trim();
  const message = String(payload.message || '').trim();
  const phone = payload.phone ? String(payload.phone).trim() : undefined;

  if (!name || !email || !message) {
    return NextResponse.json(
      { success: false, error: 'Name, email, and message are required.' },
      { status: 400 }
    );
  }

  const contact = await emailAgent.ingestContact({
    email,
    firstName: name,
    source: EmailSource.SUPPORT,
    tags: ['contact-form'],
    metadata: {
      phone,
      context: payload.context,
    },
  });

  const html = buildBrandedEmail({
    title: 'New Contact Request',
    intro: 'A visitor submitted a new inquiry via wholelotofnature.com',
    body: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-line">${message}</p>
    `,
    buttonText: 'Reply to customer',
    buttonUrl: `mailto:${email}`,
    footer: 'Sent automatically by Whole Lot of Nature automation stack.',
  });

  const emailResult = await sendEmail({
    to: BUSINESS_EMAIL,
    subject: `Contact form: ${name}`,
    html,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone ?? 'N/A'}\n\n${message}`,
  });

  if (!emailResult.success) {
    return NextResponse.json(
      { success: false, error: emailResult.error || 'Failed to send email' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, contactId: contact.id });
}

async function handleNewsletter(payload: any) {
  const email = String(payload.email || '').trim();
  const firstName = payload.firstName ? String(payload.firstName).trim() : undefined;

  if (!email) {
    return NextResponse.json({ success: false, error: 'Email is required.' }, { status: 400 });
  }

  const contact = await emailAgent.recordNewsletterSignup({
    email,
    firstName,
    tags: ['newsletter', 'site-signup'],
    preferences: payload.preferences,
  });

  return NextResponse.json({ success: true, contactId: contact.id });
}
