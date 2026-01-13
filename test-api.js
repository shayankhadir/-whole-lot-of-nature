async function testAPI() {
  try {
    console.log('Testing WooCommerce API endpoint...');
    const response = await fetch('http://localhost:3000/api/test-woocommerce');
    const data = await response.json();

    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

testAPI();
