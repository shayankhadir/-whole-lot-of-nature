const http = require('http');

console.log('Testing Next.js API endpoints...');

function testEndpoint(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data.substring(0, 300) + (data.length > 300 ? '...' : '')
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function runTests() {
  try {
    console.log('\n--- Testing /api/products ---');
    const productsResult = await testEndpoint('/api/products');
    console.log('Status:', productsResult.status);
    console.log('Response:', productsResult.data);

    console.log('\n--- Testing /api/test-woocommerce ---');
    const testResult = await testEndpoint('/api/test-woocommerce');
    console.log('Status:', testResult.status);
    console.log('Response:', testResult.data);

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

runTests();