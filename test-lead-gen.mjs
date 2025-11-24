#!/usr/bin/env node

// Simple test script for lead gen agent
const API_URL = 'http://localhost:3000/api/growth-agent/stats';

console.log('🧪 Testing Lead Gen Agent');
console.log('='.repeat(60));

async function testLeadGenAgent() {
  try {
    console.log('\n📊 Fetching growth agent statistics...');
    
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('\n✅ Agent Status:');
    console.log('   Status:', data.status);
    console.log('   Last Run:', data.lastRun || 'Never');
    console.log('   SEO Score:', data.seoScore);
    console.log('   Active Leads:', data.totalLeads || 0);
    console.log('   Hot Leads:', data.hotLeads || 0);
    console.log('   Contacted:', data.contacted || 0);
    console.log('   Converted:', data.converted || 0);
    
    console.log('\n📝 Recent Activities:');
    if (data.recentActivities && data.recentActivities.length > 0) {
      data.recentActivities.slice(0, 5).forEach((activity, i) => {
        console.log(`   ${i + 1}. [${activity.type}] ${activity.message}`);
      });
    } else {
      console.log('   No activities yet');
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Lead Gen Agent is working!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 Possible issues:');
    console.log('   - Dev server not running (run: npm run dev)');
    console.log('   - Growth agent API endpoint not implemented');
    console.log('   - Network connectivity issue');
  }
}

testLeadGenAgent();
