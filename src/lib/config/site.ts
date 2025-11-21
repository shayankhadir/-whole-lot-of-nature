const FALLBACK_EMAIL = 'store@wholelotofnature.com';

/**
 * Primary business contact email used across marketing pages, forms, and agents.
 * Falls back to store@wholelotofnature.com when env vars are missing so the UI stays consistent.
 */
export const BUSINESS_EMAIL =
  process.env.NEXT_PUBLIC_BUSINESS_EMAIL ||
  process.env.BUSINESS_EMAIL ||
  FALLBACK_EMAIL;

/**
 * Helper for server components that need a plain string at build time.
 */
export function getBusinessEmail() {
  return BUSINESS_EMAIL;
}
