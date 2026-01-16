import { NextRequest, NextResponse } from 'next/server';

/**
 * CORS and Security Middleware
 * Handles cross-origin requests and adds security headers
 */

// Allow requests from these origins (whitelist approach)
const ALLOWED_ORIGINS = [
  'https://wholelotofnature.com',
  'https://www.wholelotofnature.com',
  'https://admin.wholelotofnature.com',
  ...(process.env.NODE_ENV === 'development'
    ? ['http://localhost:3000', 'http://localhost:3001']
    : []),
];

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Only apply CORS to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');

    // Check if origin is allowed
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
      );
      response.headers.set(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, X-CSRF-Token'
      );
      response.headers.set('Access-Control-Max-Age', '86400');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }

    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  return response;
}

// Apply middleware only to API routes
export const config = {
  matcher: ['/api/:path*'],
};
