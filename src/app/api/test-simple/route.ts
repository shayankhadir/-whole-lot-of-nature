import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'API is working',
    env_check: {
      WORDPRESS_URL: process.env.WORDPRESS_URL ? 'SET' : 'NOT SET',
      WC_CONSUMER_KEY: process.env.WC_CONSUMER_KEY ? 'SET' : 'NOT SET',
      WC_CONSUMER_SECRET: process.env.WC_CONSUMER_SECRET ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
      has_all: !!(process.env.WORDPRESS_URL && process.env.WC_CONSUMER_KEY && process.env.WC_CONSUMER_SECRET)
    }
  });
}
