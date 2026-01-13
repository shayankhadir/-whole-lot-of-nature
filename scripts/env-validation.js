#!/usr/bin/env node

/**
 * Environment Validation Script
 * Runs comprehensive environment variable validation for production readiness
 */

const { validateEnv, assertEnv } = require('../src/lib/utils/validateEnv');

console.log('🚀 Starting Environment Validation...\n');

try {
  // Run validation
  const result = validateEnv();

  console.log('📋 Environment Validation Results:');
  console.log('=====================================');

  if (result.missing.length > 0) {
    console.log('\n❌ Missing Required Variables:');
    result.missing.forEach(variable => {
      console.log(`   - ${variable}`);
    });
  } else {
    console.log('\n✅ All required environment variables are set');
  }

  if (result.warnings.length > 0) {
    console.log('\n⚠️  Warnings (Recommended Variables):');
    result.warnings.forEach(warning => {
      console.log(`   - ${warning}`);
    });
  }

  console.log('\n=====================================');

  if (result.isValid) {
    console.log('🎉 Environment validation PASSED');
    console.log('✅ Ready for production deployment');
    process.exit(0);
  } else {
    console.log('❌ Environment validation FAILED');
    console.log('🔧 Please set the missing environment variables');
    process.exit(1);
  }

} catch (error) {
  console.error('💥 Error during environment validation:', error.message);
  process.exit(1);
}
