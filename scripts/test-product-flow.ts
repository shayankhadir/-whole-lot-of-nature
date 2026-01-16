/**
 * Product Flow Testing & Validation Script
 * Tests the complete product page user journey and accessibility
 */

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  severity: 'critical' | 'warning' | 'info';
}

const results: TestResult[] = [];

// Helper function to add test results
function addResult(name: string, passed: boolean, message: string, severity: 'critical' | 'warning' | 'info' = 'warning') {
  results.push({ name, passed, message, severity });
  const icon = passed ? '✓' : '✗';
  const color = passed ? 'green' : severity === 'critical' ? 'red' : 'yellow';
  console.log(`[${icon}] ${name}: ${message}`);
}

// Test 1: Product API Connectivity
async function testProductAPI() {
  try {
    const response = await fetch('/api/products?per_page=10');
    const data = await response.json();
    addResult(
      'Product API',
      data.success && Array.isArray(data.data),
      `Found ${data.data?.length || 0} products`,
      'info'
    );
    return data.data || [];
  } catch (error) {
    addResult('Product API', false, String(error), 'critical');
    return [];
  }
}

// Test 2: Product Page Load Time
async function testProductPageLoadTime(productSlug: string) {
  try {
    const start = performance.now();
    const response = await fetch(`/shop/${productSlug}`);
    const end = performance.now();
    const loadTime = end - start;
    const passed = loadTime < 3000;
    addResult(
      'Page Load Time',
      passed,
      `${loadTime.toFixed(2)}ms (target: < 3000ms)`,
      passed ? 'info' : 'warning'
    );
  } catch (error) {
    addResult('Page Load Time', false, String(error), 'critical');
  }
}

// Test 3: Product Image Optimization
function testImageOptimization(images: any[]) {
  if (!images || images.length === 0) {
    addResult('Product Images', false, 'No product images found', 'warning');
    return;
  }
  
  const allHaveAlt = images.every((img) => img.alt);
  addResult(
    'Image Alt Text',
    allHaveAlt,
    `${images.filter((img) => img.alt).length}/${images.length} images have alt text`,
    allHaveAlt ? 'info' : 'warning'
  );
}

// Test 4: SEO Meta Tags
function testSEOMetaTags() {
  if (typeof document === 'undefined') {
    console.log('Skipping SEO test (server-side execution)');
    return;
  }
  
  const title = document.querySelector('title')?.textContent;
  const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content');
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
  
  addResult('SEO Title', !!title && title.length > 0 && title.length < 60, 
    title ? `"${title.substring(0, 50)}..."` : 'Missing', 'warning');
  
  addResult('Meta Description', !!metaDescription && metaDescription.length >= 120, 
    metaDescription ? `${metaDescription.length} characters` : 'Missing', 'warning');
  
  addResult('Canonical URL', !!canonical, canonical ? canonical : 'Missing', 'warning');
}

// Test 5: Mobile Responsiveness
function testMobileResponsiveness() {
  if (typeof window === 'undefined') return;
  
  const viewport = document.querySelector('meta[name="viewport"]');
  const hasMobileViewport = !!viewport?.getAttribute('content')?.includes('width=device-width');
  
  addResult('Mobile Viewport', hasMobileViewport, 
    'Viewport meta tag configured', hasMobileViewport ? 'info' : 'critical');
}

// Test 6: Accessibility Check
function testAccessibility() {
  if (typeof document === 'undefined') return;
  
  // Check buttons have labels
  const buttons = document.querySelectorAll('button');
  const buttonsWithLabels = Array.from(buttons).filter((btn) => 
    btn.textContent.trim() || btn.getAttribute('aria-label') || btn.title
  ).length;
  
  addResult('Button Accessibility', buttonsWithLabels === buttons.length,
    `${buttonsWithLabels}/${buttons.length} buttons have labels`, 
    buttonsWithLabels === buttons.length ? 'info' : 'warning');
  
  // Check form inputs have labels
  const inputs = document.querySelectorAll('input, textarea, select');
  const inputsWithLabels = Array.from(inputs).filter((input) => {
    const label = document.querySelector(`label[for="${input.id}"]`);
    return !!label || input.getAttribute('aria-label') || input.getAttribute('title') || input.getAttribute('placeholder');
  }).length;
  
  addResult('Form Accessibility', inputsWithLabels === inputs.length,
    `${inputsWithLabels}/${inputs.length} form fields have labels`,
    inputsWithLabels === inputs.length ? 'info' : 'warning');
  
  // Check heading hierarchy
  const h1s = document.querySelectorAll('h1');
  addResult('H1 Count', h1s.length === 1, `${h1s.length} H1 tags (should be 1)`, 
    h1s.length === 1 ? 'info' : 'warning');
}

// Test 7: Modal Behavior
function testModalBehavior() {
  if (typeof document === 'undefined') return;
  
  // Check for z-index conflicts
  const modals = document.querySelectorAll('[role="dialog"], .modal, [class*="modal"]');
  
  modals.forEach((modal) => {
    const zIndex = window.getComputedStyle(modal).zIndex;
    const isHighZIndex = parseInt(zIndex) >= 9999;
    addResult('Modal Z-index', isHighZIndex || zIndex === 'auto',
      `Z-index: ${zIndex}`, isHighZIndex ? 'info' : 'warning');
  });
}

// Test 8: Add to Cart Flow
async function testAddToCartFlow(productId: number) {
  try {
    // Simulate cart addition via API
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId, quantity: 1 })
    });
    
    const data = await response.json();
    addResult('Add to Cart API', response.ok, 
      response.ok ? 'Successfully added to cart' : 'Failed to add to cart', 
      response.ok ? 'info' : 'critical');
  } catch (error) {
    addResult('Add to Cart API', false, String(error), 'critical');
  }
}

// Test 9: Product Schema Markup
function testSchemaMarkup() {
  if (typeof document === 'undefined') return;
  
  const schemaScript = document.querySelector('script[type="application/ld+json"]');
  addResult('Product Schema', !!schemaScript, 
    schemaScript ? 'Product JSON-LD implemented' : 'Missing',
    schemaScript ? 'info' : 'warning');
}

// Test 10: Performance Metrics
function testPerformanceMetrics() {
  if (typeof window === 'undefined' || !window.performance) return;
  
  const perfData = window.performance.timing;
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
  const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;
  
  addResult('DOM Content Loaded', domReadyTime < 2000, 
    `${domReadyTime}ms (target: < 2000ms)`,
    domReadyTime < 2000 ? 'info' : 'warning');
  
  addResult('Page Load Time', pageLoadTime < 3000,
    `${pageLoadTime}ms (target: < 3000ms)`,
    pageLoadTime < 3000 ? 'info' : 'warning');
}

// Main test runner
export async function runProductTests() {
  console.log('🧪 Starting Product Page Tests...\n');
  
  // Fetch products
  const products = await testProductAPI();
  
  if (products.length > 0) {
    const firstProduct = products[0];
    console.log(`\n📦 Testing with product: "${firstProduct.name}"\n`);
    
    // Run product-specific tests
    testImageOptimization(firstProduct.images);
    testSEOMetaTags();
    testMobileResponsiveness();
    testAccessibility();
    testModalBehavior();
    testSchemaMarkup();
    testPerformanceMetrics();
  }
  
  // Generate report
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST REPORT');
  console.log('='.repeat(60) + '\n');
  
  const criticalFailed = results.filter((r) => !r.passed && r.severity === 'critical').length;
  const warningsFailed = results.filter((r) => !r.passed && r.severity === 'warning').length;
  const passed = results.filter((r) => r.passed).length;
  
  console.log(`✓ Passed: ${passed}/${results.length}`);
  console.log(`⚠ Warnings: ${warningsFailed}`);
  console.log(`✗ Critical: ${criticalFailed}`);
  console.log(`\n${{ passed, warningsFailed, criticalFailed }}`);
  
  return {
    passed: criticalFailed === 0,
    results,
    summary: { passed, warningsFailed, criticalFailed }
  };
}

// Run tests if this is main module
if (require.main === module) {
  runProductTests().then((result) => {
    process.exit(result.passed ? 0 : 1);
  });
}

export { TestResult };
