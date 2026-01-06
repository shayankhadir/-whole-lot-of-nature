/**
 * Next.js Instrumentation
 * 
 * This file runs once when the Next.js server starts.
 * Use it to validate environment variables and initialize services.
 * 
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Only run on server
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { assertEnv } = await import('@/lib/utils/validateEnv');
    
    console.log('\n🌿 Whole Lot of Nature - Starting up...\n');
    
    // Validate environment variables
    assertEnv();
    
    console.log('\n✅ Server initialized successfully\n');
  }
}
