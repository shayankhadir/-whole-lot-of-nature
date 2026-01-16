import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Only allow in development or with a secret key
  const secret = new URL(globalThis.location?.href || '').searchParams.get('secret');
  const isDevOrSecret = process.env.NODE_ENV === 'development' || secret === process.env.DEBUG_SECRET;
  
  if (!isDevOrSecret && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    woocommerce: {
      WORDPRESS_URL: process.env.WORDPRESS_URL,
      NEXT_PUBLIC_WORDPRESS_URL: process.env.NEXT_PUBLIC_WORDPRESS_URL,
      WC_CONSUMER_KEY: process.env.WC_CONSUMER_KEY ? '***' + process.env.WC_CONSUMER_KEY.slice(-8) : 'NOT SET',
      WC_CONSUMER_SECRET: process.env.WC_CONSUMER_SECRET ? '***' + process.env.WC_CONSUMER_SECRET.slice(-8) : 'NOT SET',
    },
    frontend: {
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
    nextauth: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '***SET' : 'NOT SET',
    },
    allEnvKeys: Object.keys(process.env)
      .filter(key => !key.includes('SECRET') && !key.includes('KEY') && !key.includes('PASSWORD'))
      .sort()
  });
}
