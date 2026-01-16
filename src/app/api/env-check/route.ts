import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    woocommerce: {
      WORDPRESS_URL: process.env.WORDPRESS_URL || 'NOT SET',
      WC_CONSUMER_KEY_SET: !!process.env.WC_CONSUMER_KEY,
      WC_CONSUMER_SECRET_SET: !!process.env.WC_CONSUMER_SECRET,
    },
    frontend: {
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'NOT SET',
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'NOT SET',
      NEXT_PUBLIC_WORDPRESS_URL: process.env.NEXT_PUBLIC_WORDPRESS_URL || 'NOT SET',
    },
  });
}
