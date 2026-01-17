/**
 * Environment Variable Validation
 * 
 * This module validates required environment variables at startup
 * to catch configuration issues early.
 */

interface EnvValidationResult {
  isValid: boolean;
  missing: string[];
  warnings: string[];
}

// Required in all environments
const REQUIRED_VARS = [
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
];

// Required for WooCommerce integration (products display)
const WOOCOMMERCE_VARS = [
  'NEXT_PUBLIC_WORDPRESS_URL',
  'WC_CONSUMER_KEY',
  'WC_CONSUMER_SECRET',
];

// Optional - Cashfree payment processing (not needed for products to display)
const OPTIONAL_PAYMENT_VARS = [
  'CASHFREE_APP_ID',
  'CASHFREE_SECRET_KEY',
  'CASHFREE_WEBHOOK_SECRET',
];

// Optional but recommended
const RECOMMENDED_VARS = [
  'NEXT_PUBLIC_GA_MEASUREMENT_ID',
  'ADMIN_EMAIL',
];

/**
 * Validates all required environment variables
 */
export function validateEnv(): EnvValidationResult {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required vars
  for (const varName of REQUIRED_VARS) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  // Check WooCommerce vars
  for (const varName of WOOCOMMERCE_VARS) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  // Check payment vars (now optional)
  for (const varName of OPTIONAL_PAYMENT_VARS) {
    if (!process.env[varName]) {
      warnings.push(`${varName} is not set (optional - Cashfree payments disabled)`);
    }
  }

  // Warn about recommended vars
  for (const varName of RECOMMENDED_VARS) {
    if (!process.env[varName]) {
      warnings.push(`${varName} is not set (recommended)`);
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
    warnings,
  };
}

/**
 * Validates and throws if critical env vars are missing
 * Call this in server startup to fail fast
 */
export function assertEnv(): void {
  const result = validateEnv();

  if (result.warnings.length > 0) {
    console.warn('⚠️  Environment variable warnings:');
    result.warnings.forEach(w => console.warn(`   - ${w}`));
  }

  if (!result.isValid) {
    console.error('❌ Missing required environment variables:');
    result.missing.forEach(m => console.error(`   - ${m}`));
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        `Missing required environment variables: ${result.missing.join(', ')}`
      );
    } else {
      console.warn('⚠️  Running in development mode with missing env vars');
    }
  } else {
    console.log('✅ All required environment variables are set');
  }
}

/**
 * Get a required env var or throw
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  return value;
}

/**
 * Get an optional env var with a default value
 */
export function optionalEnv(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}
