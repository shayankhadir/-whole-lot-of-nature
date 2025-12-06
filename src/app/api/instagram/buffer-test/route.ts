/**
 * API Route: Buffer Integration Test & Setup
 * Endpoint: GET/POST /api/instagram/buffer-test
 */

import { NextRequest, NextResponse } from 'next/server';
import { BufferService } from '@/lib/services/instagramService';

export const dynamic = 'force-dynamic';

interface BufferProfile {
  id: string;
  service: string;
  formatted_username?: string;
  service_username?: string;
  timezone?: string;
}

export async function GET() {
  const bufferService = new BufferService();

  if (!bufferService.isConfigured()) {
    return NextResponse.json({
      success: false,
      configured: false,
      message: 'Buffer not configured',
      instructions: [
        '1. Sign up at https://buffer.com',
        '2. Get API token from https://buffer.com/developers/api',
        '3. Add BUFFER_ACCESS_TOKEN to .env.local',
        '4. Restart server',
      ],
    });
  }

  try {
    // Test connection by getting profiles
    const profiles = await bufferService.getProfiles() as any[];
    const instagramProfiles = profiles.filter((p: any) => p.service === 'instagram');

    return NextResponse.json({
      success: true,
      configured: true,
      totalProfiles: profiles.length,
      instagramProfiles: instagramProfiles.length,
      profiles: instagramProfiles.map((p: any) => ({
        id: p.id,
        name: p.formatted_username || p.service_username,
        service: p.service,
        timezone: p.timezone,
      })),
      message: instagramProfiles.length > 0
        ? '✅ Buffer connected! Instagram ready for scheduling'
        : '⚠️ Buffer connected but no Instagram profiles found. Connect Instagram in Buffer app.',
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      configured: true,
      error: errorMessage,
      message: 'Buffer token invalid or expired',
    }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  const bufferService = new BufferService();

  if (!bufferService.isConfigured()) {
    return NextResponse.json({
      success: false,
      error: 'Buffer not configured. Add BUFFER_ACCESS_TOKEN to .env.local',
    }, { status: 400 });
  }

  try {
    const { action } = await request.json();

    if (action === 'test-post') {
      // Send a test post to Buffer (won't publish immediately)
      const profiles = await bufferService.getProfiles() as any[];
      const instagramProfile = profiles.find((p: any) => p.service === 'instagram');

      if (!instagramProfile) {
        return NextResponse.json({
          success: false,
          error: 'No Instagram profile connected to Buffer',
        }, { status: 400 });
      }

      const testPost = {
        caption: '🌿 Test post from your plant automation system! If you see this in Buffer, everything is working perfectly! ✅',
        hashtags: ['#PlantCare', '#Automation', '#Test'],
        scheduledTime: new Date(Date.now() + 3600000), // 1 hour from now
      };

      const result = await bufferService.schedulePost(
        instagramProfile.id,
        testPost,
        testPost.scheduledTime
      );

      return NextResponse.json({
        success: true,
        message: 'Test post scheduled to Buffer successfully!',
        scheduledFor: testPost.scheduledTime,
        result,
        nextSteps: [
          'Check Buffer app to see the scheduled post',
          'You can edit or delete it in Buffer',
          'If it looks good, start using the automation!',
        ],
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action',
    }, { status: 400 });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      error: errorMessage,
    }, { status: 500 });
  }
}
