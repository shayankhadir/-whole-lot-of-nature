#!/usr/bin/env node
/**
 * Vercel Environment Validation Script
 * Run this before deploying to ensure all variables are set correctly
 * 
 * Usage: node scripts/validate-vercel-env.js
 */

const requiredVars = [
  { name: 'DATABASE_URL', category: 'Database', type: 'critical' },
  { name: 'SHADOW_DATABASE_URL', category: 'Database', type: 'critical' },
  { name: 'NEXTAUTH_SECRET', category: 'Authentication', type: 'critical' },
  { name: 'NEXTAUTH_URL', category: 'Authentication', type: 'critical' },
  { name: 'WORDPRESS_API_URL', category: 'WordPress', type: 'critical' },
  { name: 'WORDPRESS_URL', category: 'WordPress', type: 'critical' },
  { name: 'WC_CONSUMER_KEY', category: 'WooCommerce', type: 'critical' },
  { name: 'WC_CONSUMER_SECRET', category: 'WooCommerce', type: 'critical' },
  { name: 'NEXT_PUBLIC_SITE_URL', category: 'Frontend', type: 'recommended' },
  { name: 'CASHFREE_APP_ID', category: 'Payments', type: 'optional' },
  { name: 'CASHFREE_SECRET_KEY', category: 'Payments', type: 'optional' },
  { name: 'RESEND_API_KEY', category: 'Email', type: 'optional' },
  { name: 'INSTAGRAM_ACCESS_TOKEN', category: 'Social', type: 'optional' },
];

const fs = require('fs');
const path = require('path');

// Check local .env files
console.log('\n📋 Checking local environment files...\n');

const envFiles = ['.env', '.env.local', '.env.production'];
let foundLocalVars = {};

envFiles.forEach(file => {
  const envPath = path.join(process.cwd(), file);
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    const lines = content.split('\n');
    lines.forEach(line => {
      const match = line.match(/^([^=]+)=/);
      if (match) {
        foundLocalVars[match[1]] = true;
      }
    });
    console.log(`✅ Found ${file}`);
  }
});

// Check which variables are missing from local setup
console.log('\n🔍 Local Environment Variables Status:\n');

const missing = { critical: [], recommended: [], optional: [] };
const found = { critical: [], recommended: [], optional: [] };

requiredVars.forEach(({ name, type }) => {
  if (foundLocalVars[name]) {
    found[type].push(name);
  } else {
    missing[type].push(name);
  }
});

console.log('✅ FOUND:');
Object.keys(found).forEach(type => {
  if (found[type].length > 0) {
    console.log(`   ${type.toUpperCase()}: ${found[type].join(', ')}`);
  }
});

console.log('\n❌ MISSING:');
Object.keys(missing).forEach(type => {
  if (missing[type].length > 0) {
    console.log(`   ${type.toUpperCase()}: ${missing[type].join(', ')}`);
  }
});

// Instructions
console.log('\n📝 Setup Instructions:\n');
console.log('1. Create .env.local (copy from .env.example):');
console.log('   cp .env.example .env.local\n');
console.log('2. Update .env.local with your actual values\n');
console.log('3. For Vercel deployment, go to:');
console.log('   https://vercel.com/dashboard → Select your project → Settings → Environment Variables\n');
console.log('4. Add all CRITICAL and RECOMMENDED variables in Vercel:\n');

const criticalAndRecommended = requiredVars.filter(v => v.type !== 'optional');
criticalAndRecommended.forEach(({ name, type, category }) => {
  console.log(`   ${name} (${category}) - ${type}`);
});

console.log('\n✨ After setting variables in Vercel:');
console.log('   1. Go to Deployments');
console.log('   2. Click ... next to latest deployment');
console.log('   3. Select "Redeploy"');
console.log('   4. Check deployment logs for errors\n');

// Exit with appropriate code
const criticalMissing = missing.critical.length > 0;
process.exit(criticalMissing ? 1 : 0);
