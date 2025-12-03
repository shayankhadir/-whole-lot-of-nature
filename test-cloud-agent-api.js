#!/usr/bin/env node

/**
 * Test script for Cloud Agent API endpoints
 * Tests both authenticated and unauthenticated requests
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const API_SECRET = process.env.AGENT_API_SECRET || 'test-secret';

async function testEndpoint(name, path, options = {}) {
  const url = new URL(path, BASE_URL);
  
  console.log(`\n🧪 Testing: ${name}`);
  console.log(`   URL: ${url.toString()}`);
  
  try {
    const response = await fetch(url.toString(), {
      method: options.method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options.authenticated ? { 'Authorization': `Bearer ${API_SECRET}` } : {}),
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    
    const data = await response.json();
    
    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log(`   Success: ${data.success ? '✅' : '❌'}`);
    
    if (data.error) {
      console.log(`   Error: ${data.error}`);
    }
    
    if (options.expectedStatus && response.status !== options.expectedStatus) {
      console.log(`   ⚠️  Expected status ${options.expectedStatus} but got ${response.status}`);
      return false;
    }
    
    return data.success;
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Cloud Agent API Tests');
  console.log('========================\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  const results = [];
  
  // Test 1: Unauthenticated request (should fail unless in dev with no secret)
  results.push(await testEndpoint(
    'Unauthenticated request to supervisor',
    '/api/agent/supervisor?action=run',
    { 
      authenticated: false,
      expectedStatus: API_SECRET ? 401 : 200
    }
  ));
  
  // Test 2: Authenticated request to supervisor
  results.push(await testEndpoint(
    'Authenticated request to supervisor (GET)',
    '/api/agent/supervisor',
    { 
      method: 'GET',
      authenticated: true
    }
  ));
  
  // Test 3: Invalid action
  results.push(await testEndpoint(
    'Invalid action',
    '/api/agent/supervisor?action=invalid',
    { 
      authenticated: true,
      expectedStatus: 400
    }
  ));
  
  // Test 4: Run specific agents
  results.push(await testEndpoint(
    'Run specific agents',
    '/api/agent/supervisor?action=run',
    { 
      authenticated: true,
      body: { agents: ['trend'] }
    }
  ));
  
  // Test 5: Agent run endpoint stats
  results.push(await testEndpoint(
    'Agent stats endpoint',
    '/api/agent/run?action=stats',
    { 
      method: 'GET',
      authenticated: true
    }
  ));
  
  console.log('\n\n📊 Test Summary');
  console.log('================');
  console.log(`Total tests: ${results.length}`);
  console.log(`Passed: ${results.filter(r => r).length}`);
  console.log(`Failed: ${results.filter(r => !r).length}`);
  
  if (results.every(r => r)) {
    console.log('\n✅ All tests passed!');
    process.exit(0);
  } else {
    console.log('\n❌ Some tests failed');
    process.exit(1);
  }
}

runTests().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});
