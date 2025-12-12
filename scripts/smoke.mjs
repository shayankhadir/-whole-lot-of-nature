// Simple smoke test for local API endpoints
// Usage:
//   node scripts/smoke.mjs 1848

const productId = process.argv[2] || process.env.PRODUCT_ID || '1848';
const base = process.env.BASE_URL || 'http://localhost:3000';

async function getJson(url) {
  const res = await fetch(url);
  const text = await res.text();
  try {
    return { ok: res.ok, status: res.status, data: JSON.parse(text) };
  } catch {
    return { ok: res.ok, status: res.status, data: text };
  }
}

(async () => {
  try {
    const reviewsUrl = `${base}/api/reviews?product=${encodeURIComponent(productId)}`;
    const prodUrl = `${base}/api/products/${encodeURIComponent(productId)}`;

    console.log(`GET ${reviewsUrl}`);
    const reviews = await getJson(reviewsUrl);
    console.log('Reviews:', reviews.status, Array.isArray(reviews.data) ? `items=${reviews.data.length}` : reviews.data);

    console.log(`\nGET ${prodUrl}`);
    const product = await getJson(prodUrl);
    const payload = product?.data;
    const p = payload?.data && typeof payload.data === 'object' ? payload.data : payload;
    if (p && typeof p === 'object') {
      console.log('Product:', product.status, {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        in_stock: p.in_stock,
      });
    } else {
      console.log('Product:', product.status, p);
    }

    process.exit(0);
  } catch (err) {
    console.error('Smoke test failed:', err);
    process.exit(1);
  }
})();
