/**
 * API Key Authentication Helper for Agent Endpoints
 * Validates Bearer token against AGENT_API_SECRET environment variable
 */

import { NextRequest, NextResponse } from 'next/server';

export function validateAgentApiKey(request: NextRequest): boolean {
  const apiSecret = process.env.AGENT_API_SECRET;
  
  // In development, allow access only if no API secret is configured
  if (process.env.NODE_ENV === 'development' && !apiSecret) {
    return true;
  }

  // In production, API secret is required
  if (!apiSecret) {
    console.error('AGENT_API_SECRET not configured. Agent endpoints require authentication in production.');
    return false;
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
