'use strict';

/**
 * Provision WooCommerce product categories and tags via WordPress REST API
 * Usage:
 *   set WORDPRESS_USER=your_user
 *   set WORDPRESS_PASSWORD=your_app_password
 *   set WORDPRESS_API_URL=https://wholelotofnature.com/wp-json
 *   node scripts/add-product-taxonomy.js
 */

const API_URL = process.env.WORDPRESS_API_URL || 'https://wholelotofnature.com/wp-json';
const USERNAME = process.env.WORDPRESS_USER;
const PASSWORD = process.env.WORDPRESS_PASSWORD;

if (!USERNAME || !PASSWORD) {
  console.error('❌ Missing WORDPRESS_USER or WORDPRESS_PASSWORD environment variables.');
  process.exit(1);
}

const PRODUCT_CATEGORY_ENDPOINT = 'wc/v3/products/categories';
const PRODUCT_TAG_ENDPOINT = 'wc/v3/products/tags';

const categoriesToAdd = [
  // Top-level categories
  { name: 'Soil & Growing Media', slug: 'soil-and-growing-media', description: 'Premium soils, mixes, and amendments for thriving plants.' },
  { name: 'Land Plants', slug: 'land-plants', description: 'Indoor and outdoor plants curated for every space.' },
  { name: 'Aquatic Life & Ecosystem', slug: 'aquatic-life-ecosystem', description: 'Aquatic plants and pond companions for balanced water ecosystems.' },
  { name: 'Wellness & Herbal Products', slug: 'wellness-herbal-products', description: 'Herbal supplements and natural body care crafted with plants.' },
  { name: 'Miniature Plant Decor', slug: 'miniature-plant-decor', description: 'Handmade miniatures and decor pieces inspired by nature.' },
  { name: 'Decor & Digital', slug: 'decor-and-digital', description: 'E-books, guides, and upcoming kits to support your gardening journey.' },
  // Soil & Growing Media subcategories
  { name: 'Soil Mixes', slug: 'soil-mixes', parentSlug: 'soil-and-growing-media' },
  { name: 'Soil-Less Mixes & Substrates', slug: 'soil-less-mixes-and-substrates', parentSlug: 'soil-and-growing-media' },
  { name: 'Amendments & Additives', slug: 'amendments-and-additives', description: 'Cocopeat, vermicompost, cinder rocks, and more for soil health.', parentSlug: 'soil-and-growing-media' },
  { name: 'Fertilizers & Organic Manures', slug: 'fertilizers-and-organic-manures', parentSlug: 'soil-and-growing-media' },
  // Land Plants subcategories
  { name: 'Indoor Plants', slug: 'indoor-plants', parentSlug: 'land-plants' },
  { name: 'Outdoor / Garden Plants', slug: 'outdoor-garden-plants', parentSlug: 'land-plants' },
  { name: 'Succulents & Cacti', slug: 'succulents-and-cacti', parentSlug: 'land-plants' },
  // Indoor Plants filters
  { name: 'Low Maintenance Plants', slug: 'low-maintenance-plants', parentSlug: 'indoor-plants' },
  { name: 'Air Purifying Plants', slug: 'air-purifying-plants', parentSlug: 'indoor-plants' },
  { name: 'Vastu / Lucky Plants', slug: 'vastu-lucky-plants', parentSlug: 'indoor-plants' },
  // Outdoor Plants filters
  { name: 'Native Plants', slug: 'native-plants', parentSlug: 'outdoor-garden-plants' },
  { name: 'Edible / Herb Plants', slug: 'edible-herb-plants', parentSlug: 'outdoor-garden-plants' },
  { name: 'Shade-Garden Plants', slug: 'shade-garden-plants', parentSlug: 'outdoor-garden-plants' },
  // Aquatic Life subcategories
  { name: 'Aquatic Plants', slug: 'aquatic-plants', parentSlug: 'aquatic-life-ecosystem' },
  { name: 'Aquatic Snails & Pond Life', slug: 'aquatic-snails-and-pond-life', parentSlug: 'aquatic-life-ecosystem' },
  // Wellness subcategories
  { name: 'Herbal Supplements', slug: 'herbal-supplements', parentSlug: 'wellness-herbal-products' },
  { name: 'Hair & Body Products', slug: 'hair-and-body-products', parentSlug: 'wellness-herbal-products' },
  { name: 'Herbal Powders & Extracts', slug: 'herbal-powders-and-extracts', parentSlug: 'wellness-herbal-products' },
  // Miniature decor subcategory
  { name: 'Clay Home Models & Miniatures', slug: 'clay-home-models-and-miniatures', parentSlug: 'miniature-plant-decor' },
  // Decor & Digital subcategories
  { name: 'E-Books & Guides', slug: 'e-books-and-guides', parentSlug: 'decor-and-digital' },
  { name: 'Seeds & Future Products', slug: 'seeds-and-future-products', description: 'Seed packs, upcoming gardening kits, and future collections.', parentSlug: 'decor-and-digital' },
];

const tagsToAdd = [
  'Vastu Plants',
  'Low Maintenance',
  'Beginner Friendly',
  'Beginner Friendly Plants',
  'Pet Safe Plants',
  'Oxygen Boosting',
  'Terrace Garden',
  'Balcony Garden',
  'Aquascape',
  'Pond Setup',
  'Pond Essential Combos',
  'Rare Plants',
  'Organic Certified',
  'Fair Trade',
  'Farmer Supported',
  'Eco-Friendly Packaging',
];

function authHeader() {
  const credentials = Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');
  return `Basic ${credentials}`;
}

function endpointUrl(resource) {
  return `${API_URL.replace(/\/?$/, '')}/${resource}`;
}

async function fetchAllTerms(resource) {
  const results = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = new URL(endpointUrl(resource));
    url.searchParams.set('per_page', '100');
    url.searchParams.set('page', String(page));

    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader(),
      },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Failed to fetch ${resource} (HTTP ${res.status}): ${body}`);
    }

    const data = await res.json();
    results.push(...data);

    if (data.length < 100) {
      hasMore = false;
    } else {
      page += 1;
    }
  }

  return results;
}

async function createTerm(resource, payload) {
  const res = await fetch(endpointUrl(resource), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to create term "${payload.name}" in ${resource} (HTTP ${res.status}): ${body}`);
  }

  return res.json();
}

async function updateTerm(resource, id, payload) {
  const res = await fetch(`${endpointUrl(resource)}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to update term ID ${id} in ${resource} (HTTP ${res.status}): ${body}`);
  }

  return res.json();
}

async function ensureCategories() {
  console.log(`📦 Fetching existing product categories...`);
  const existingCategories = await fetchAllTerms(PRODUCT_CATEGORY_ENDPOINT);
  const cache = new Map(existingCategories.map((term) => [term.slug, term]));

  existingCategories.forEach((term) => {
    console.log(`  • ${term.name} (${term.slug})`);
  });

  for (const category of categoriesToAdd) {
    let parentId = 0;
    if (category.parentSlug) {
      const parent = cache.get(category.parentSlug);
      if (!parent) {
        throw new Error(`Missing parent category for slug "${category.slug}". Parent "${category.parentSlug}" must be created first.`);
      }
      parentId = parent.id;
    }

    if (cache.has(category.slug)) {
      const existing = cache.get(category.slug);
      if (existing && existing.parent !== parentId && parentId !== undefined) {
        const updated = await updateTerm(PRODUCT_CATEGORY_ENDPOINT, existing.id, { parent: parentId });
        cache.set(updated.slug, updated);
        console.log(`  🔄 Updated parent for category: ${updated.name}`);
      } else {
        console.log(`  → Skipping existing category: ${category.name}`);
      }
      continue;
    }

    const payload = {
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parent: parentId,
    };

    const created = await createTerm(PRODUCT_CATEGORY_ENDPOINT, payload);
    cache.set(created.slug, created);
    console.log(`  ✅ Created category: ${created.name}`);
  }
}

function slugifyTag(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

async function ensureTags() {
  console.log(`\n🏷️ Fetching existing product tags...`);
  const existingTags = await fetchAllTerms(PRODUCT_TAG_ENDPOINT);
  const cache = new Map(existingTags.map((term) => [term.slug, term]));

  existingTags.forEach((term) => {
    console.log(`  • ${term.name} (${term.slug})`);
  });

  for (const tagName of tagsToAdd) {
    const slug = slugifyTag(tagName);
    if (cache.has(slug)) {
      console.log(`  → Skipping existing tag: ${tagName}`);
      continue;
    }

    const payload = {
      name: tagName,
      slug,
    };

    const created = await createTerm(PRODUCT_TAG_ENDPOINT, payload);
    cache.set(created.slug, created);
    console.log(`  ✅ Created tag: ${created.name}`);
  }
}

(async () => {
  try {
    console.log('🌿 Whole Lot of Nature – Product Taxonomy Provisioning\n');
    await ensureCategories();
    await ensureTags();
    console.log('\n✨ Done! Categories and tags are now up to date.');
  } catch (error) {
    console.error('\n❌ Error provisioning taxonomy:', error);
    process.exit(1);
  }
})();
