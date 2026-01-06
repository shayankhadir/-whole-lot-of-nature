import { NextResponse } from 'next/server';
import crypto from 'crypto';

// In a real app, you'd store these tokens in a database with expiry
// For now, we'll log the token (in production, send via email service)

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // TODO: In production, implement these steps:
    // 1. Check if user exists in WooCommerce/database
    // 2. Store resetToken and resetTokenExpiry in database
    // 3. Send email with reset link using email service (SendGrid, Resend, etc.)
    
    // For now, log the token (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log(`Password reset requested for: ${email}`);
      console.log(`Reset token: ${resetToken}`);
      console.log(`Token expires: ${resetTokenExpiry.toISOString()}`);
      console.log(`Reset URL would be: ${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`);
    }

    // Send email via your email service
    // Example with a generic email service:
    /*
    await sendEmail({
      to: email,
      subject: 'Reset Your Password - Whole Lot of Nature',
      html: `
        <h1>Password Reset Request</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}">
          Reset Password
        </a>
        <p>This link expires in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    });
    */

    // Always return success to prevent email enumeration attacks
    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, reset instructions have been sent.',
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    
    // Don't reveal internal errors - always return generic success
    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, reset instructions have been sent.',
    });
  }
}
