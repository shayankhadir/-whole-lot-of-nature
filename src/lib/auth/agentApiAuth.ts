/**
 * API Key Authentication Helper for Agent Endpoints
 * Validates Bearer token against AGENT_API_SECRET environment variable
 */

import { NextRequest, NextResponse } from 'next/server';

export function validateAgentApiKey(request: NextRequest): boolean {
  // Allow requests without authentication in development
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  const apiSecret = process.env.AGENT_API_SECRET;
  
  // If no API secret is configured, allow the request (for backwards compatibility)
  if (!apiSecret) {
    console.warn('AGENT_API_SECRET not configured. Agent endpoints are unprotected.');
    return true;
  }

  const authHeader = request.headers.get('authorization');
  
  if (!authHeader) {
    return false;
  }

  // Extract Bearer token
  const token = authHeader.replace(/^Bearer\s+/i, '');
  
  return token === apiSecret;
}

export function createUnauthorizedResponse(): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: 'Unauthorized. Valid API key required.',
    },
    { status: 401 }
  );
}
