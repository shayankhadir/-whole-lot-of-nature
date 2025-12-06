import { BUSINESS_EMAIL } from '@/lib/config/site';

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  tags?: string[];
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

const RESEND_API_URL = 'https://api.resend.com/emails';

export async function sendEmail({ to, subject, html, text, from, tags, replyTo }: SendEmailParams): Promise<SendEmailResult> {
  const sender = from || process.env.MARKETING_EMAIL_FROM || `Whole Lot of Nature <${BUSINESS_EMAIL}>`;

  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY missing. Email will not be sent but payload is logged for debugging.');
    console.log({ to, subject, html });
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: sender,
        to,
        subject,
        html,
        text,
        tags,
        reply_to: replyTo,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || 'Failed to send email via Resend');
    }

    const data = await response.json();
    return { success: true, id: data.id };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error sending email:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

export function buildBrandedEmail({
  title,
  intro,
  body,
  buttonText,
  buttonUrl,
  footer,
}: {
  title: string;
  intro: string;
  body: string;
  buttonText?: string;
  buttonUrl?: string;
  footer?: string;
}): string {
  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${title}</title>
    </head>
    <body style="margin:0;padding:0;background:#f4f8f4;font-family:'Segoe UI',Arial,sans-serif;color:#1f2933;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center" style="padding:40px 16px;">
            <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;background:#ffffff;border-radius:28px;border:1px solid #d7eadd;overflow:hidden;box-shadow:0 18px 50px -15px rgba(16,185,129,0.35);">
              <tr>
                <td style="background:linear-gradient(135deg,#065f46,#10b981);padding:32px;color:#ecfdf5;text-align:center;">
                  <h1 style="margin:0;font-size:28px;line-height:1.3;">${title}</h1>
                  <p style="margin:12px 0 0;font-size:16px;color:#d1fae5;">${intro}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:32px 40px;font-size:16px;line-height:1.6;color:#1f2933;">
                  ${body}
                  ${buttonText && buttonUrl ? `
                    <div style="text-align:center;margin:32px 0;">
                      <a href="${buttonUrl}" style="display:inline-block;padding:14px 32px;background:#10b981;color:#fff;border-radius:999px;font-weight:600;text-decoration:none;box-shadow:0 12px 30px -12px rgba(16,185,129,0.8);">${buttonText}</a>
                    </div>
                  ` : ''}
                  <p style="font-size:13px;color:#6b7280;margin-top:40px;">${footer || 'You are receiving this email because you subscribed to updates from Whole Lot of Nature.'}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}
