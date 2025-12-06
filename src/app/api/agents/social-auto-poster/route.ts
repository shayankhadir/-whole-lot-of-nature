import { NextResponse } from 'next/server';
import socialAutoPosterAgent, { type SocialPostPlan } from '@/lib/agents/socialAutoPosterAgent';
import { buildBrandedEmail, sendEmail } from '@/lib/services/emailService';

export const runtime = 'nodejs';

function renderPlanHtml(posts: SocialPostPlan[] = []) {
  if (posts.length === 0) {
    return '<p>No new content available for the selected window.</p>';
  }

  const rows = posts
    .map((post: SocialPostPlan) => {
      return `
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid #e5f3ea;">
            <strong>${post.platform.toUpperCase()}</strong><br/>
            ${post.scheduleSlot}
          </td>
          <td style="padding:12px 16px;border-bottom:1px solid #e5f3ea;">
            <strong>${post.caption.split('\n')[0]}</strong><br/>
            <small>${post.contentType} → ${post.referenceUrl}</small>
          </td>
        </tr>
      `;
    })
    .join('');

  return `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-radius:20px;overflow:hidden;border:1px solid #d7eadd;">
      <thead>
        <tr style="background:#ebfaf1;text-transform:uppercase;font-size:13px;color:#065f46;">
          <th align="left" style="padding:12px 16px;">Schedule</th>
          <th align="left" style="padding:12px 16px;">Creative</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

export async function POST(request: Request) {
  try {
    const { productLimit, blogLimit, startDate, cronToken, email } = await request.json().catch(() => ({}));

    if (process.env.AUTOMATION_SECRET_TOKEN && cronToken !== process.env.AUTOMATION_SECRET_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const plan = await socialAutoPosterAgent.generateCalendar({
      productLimit: productLimit ? Number(productLimit) : undefined,
      blogLimit: blogLimit ? Number(blogLimit) : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
    });

    let emailResult;
    const recipient = email || process.env.SOCIAL_AUTOMATION_RECIPIENT;

    if (recipient) {
      const html = buildBrandedEmail({
        title: 'Fresh Social Calendar Ready',
        intro: 'Plants, soil mixes, and blog guides queued for the next sprint.',
        body: renderPlanHtml(plan.posts),
        buttonText: 'Open Content Dashboard',
        buttonUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://wholelotofnature.com'}/admin/pages`,
        footer: 'Automation powered by Whole Lot of Nature Agents.',
      });

      emailResult = await sendEmail({
        to: recipient,
        subject: 'Whole Lot of Nature — New Social Auto-Poster Plan',
        html,
      });
    }

    return NextResponse.json({
      success: true,
      plan,
      emailDispatched: Boolean(emailResult?.success),
      emailError: emailResult?.error,
    });
  } catch (error) {
    console.error('Social auto-poster API error:', error);
    return NextResponse.json({ error: 'Unable to generate calendar right now.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'POST with cronToken + optional limits to trigger the Social Auto-Poster agent.',
  });
}
