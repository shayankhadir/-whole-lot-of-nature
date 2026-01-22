/**
 * Environment Variable Validation
 * This file validates all required environment variables at application startup
 * Prevents crashes due to missing critical configuration
 */

// Critical variables required for production
const REQUIRED_VARS = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'WORDPRESS_API_URL',
  'WC_CONSUMER_KEY',
  'WC_CONSUMER_SECRET',
] as const;

// Optional but recommended for production
const RECOMMENDED_VARS = [
  'CASHFREE_APP_ID',
  'CASHFREE_SECRET_KEY',
  'RESEND_API_KEY',
  'INSTAGRAM_ACCESS_TOKEN',
  'ANTHROPIC_API_KEY',
  'REPORT_EMAIL_TO',
  'SLACK_WEBHOOK_URL',
] as const;

/**
 * Validate required environment variables
 * Throws error if critical variables are missing
 */
export function validateEnvironment() {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const varName of REQUIRED_VARS) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  // Check recommended variables
  for (const varName of RECOMMENDED_VARS) {
    if (!process.env[varName]) {
      warnings.push(varName);
    }
  }

  // Fail hard if required variables are missing
  if (missing.length > 0) {
    const errorMsg = `
❌ CRITICAL: Missing required environment variables:
${missing.map(v => `   - ${v}`).join('\n')}

Please set these variables in:
1. Vercel project settings (for production)
2. .env.local file (for local development)
3. System environment variables

See VERCEL_ENV_REQUIRED.md for detailed setup instructions.
    `;
    throw new Error(errorMsg);
  }

  // Warn about recommended variables
  if (process.env.NODE_ENV === 'production' && warnings.length > 0) {
    console.warn('⚠️  Missing recommended environment variables:');
    warnings.forEach(v => console.warn(`   - ${v}`));
  }

  return {
    validated: true,
    missing,
    warnings,
  };
}

/**
 * Safe getter for environment variables with fallback
 */
export function getEnvVar(
  key: string,
  options?: { required?: boolean; fallback?: string }
): string {
  const value = process.env[key];

  if (!value) {
    if (options?.required) {
      throw new Error(
        `Required environment variable ${key} is not set. Check VERCEL_ENV_REQUIRED.md for setup.`
      );
    }
    if (options?.fallback) {
      console.warn(`Using fallback for ${key}: ${options.fallback}`);
      return options.fallback;
    }
    return '';
  }

  return value;
}

/**
 * Validate that database can be accessed
 * Called during server startup
 */
export async function validateDatabaseConnection() {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL is not set');
    }

    // Check basic URL format
    if (!dbUrl.startsWith('mysql://') && !dbUrl.startsWith('postgresql://')) {
      throw new Error(
        `Invalid DATABASE_URL format. Expected mysql:// or postgresql://, got: ${dbUrl.substring(0, 10)}...`
      );
    }

    console.log('✅ Database URL format is valid');
    return true;
  } catch (error) {
    console.error('❌ Database connection validation failed:', error);
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
    return false;
  }
}

/**
 * Validate API authentication tokens
 */
export function validateAPITokens() {
  const tokens = {
    wordpress: {
      key: process.env.WC_CONSUMER_KEY,
      secret: process.env.WC_CONSUMER_SECRET,
    },
    cashfree: {
      appId: process.env.CASHFREE_APP_ID,
      secretKey: process.env.CASHFREE_SECRET_KEY,
    },
    instagram: {
      token: process.env.INSTAGRAM_ACCESS_TOKEN,
    },
  };

  const issues: string[] = [];

  // Check WooCommerce credentials
  if (!tokens.wordpress.key || !tokens.wordpress.secret) {
    issues.push('WooCommerce API credentials incomplete');
  }

  // Check Cashfree credentials if enabled
  if (process.env.NEXT_PUBLIC_CASHFREE_MODE === 'production') {
    if (!tokens.cashfree.appId || !tokens.cashfree.secretKey) {
      issues.push('Cashfree payment credentials incomplete');
    }
  }

  if (issues.length > 0) {
    console.warn('⚠️  API credential issues detected:');
    issues.forEach(issue => console.warn(`   - ${issue}`));
  }

  return {
    hasWooCommerce: !!(tokens.wordpress.key && tokens.wordpress.secret),
    hasCashfree: !!(tokens.cashfree.appId && tokens.cashfree.secretKey),
    hasInstagram: !!tokens.instagram.token,
  };
}

// Export environment validation status
export const ENV_VALIDATED = (() => {
  try {
    validateEnvironment();
    return true;
  } catch (error) {
    console.error('Environment validation failed at startup');
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
    return false;
  }
})();
