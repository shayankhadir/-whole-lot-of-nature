#!/usr/bin/env node

async function testPublisher() {
  console.log('Testing blog publisher...\n');

  try {
    // Test status
    console.log('1. Checking publisher status...');
    const statusRes = await fetch('http://localhost:3000/api/publisher/schedule?action=status', {
      method: 'POST'
    });
    const status = await statusRes.json();
    console.log('Status:', JSON.stringify(status, null, 2));

    // Test publish-now
    console.log('\n2. Testing immediate publish...');
    const publishRes = await fetch('http://localhost:3000/api/publisher/schedule?action=publish-now', {
      method: 'POST'
    });
    const publishResult = await publishRes.json();
    console.log('Publish Result:', JSON.stringify(publishResult, null, 2));

    // Test agent stats
    console.log('\n3. Checking agent stats...');
    const agentRes = await fetch('http://localhost:3000/api/agent/run?action=stats', {
      method: 'POST'
    });
    const agentStats = await agentRes.json();
    console.log('Agent Stats:', JSON.stringify(agentStats, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testPublisher();
