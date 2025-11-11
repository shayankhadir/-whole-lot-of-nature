#!/usr/bin/env node

/**
 * Script to add WordPress categories via REST API
 * Usage: npx ts-node scripts/add-categories.ts
 * 
 * Set environment variables:
 * - WORDPRESS_USER: Your WordPress admin username
 * - WORDPRESS_PASSWORD: Your WordPress application password (not regular password)
 * - WORDPRESS_API_URL: Your WordPress REST API URL (e.g., https://wholelotofnature.com/wp-json)
 */

import { Category, createCategory, getCategories } from '../src/lib/api/wordpressCategories';

type CategoryInput = {
  name: string;
  slug: string;
  description?: string;
  parentSlug?: string;
};

const PRODUCT_CATEGORY_TAXONOMY = 'product_cat';
const PRODUCT_TAG_TAXONOMY = 'product_tag';

const categoriesToAdd: CategoryInput[] = [
  // Top-level categories
  {
    name: 'Soil & Growing Media',
    slug: 'soil-and-growing-media',
    description: 'Premium soils, mixes, and amendments for thriving plants.',
  },
  {
    name: 'Land Plants',
    slug: 'land-plants',
    description: 'Indoor and outdoor plants curated for every space.',
  },
  {
    name: 'Aquatic Life & Ecosystem',
    slug: 'aquatic-life-ecosystem',
    description: 'Aquatic plants and pond companions for balanced water ecosystems.',
  },
  {
    name: 'Wellness & Herbal Products',
    slug: 'wellness-herbal-products',
    description: 'Herbal supplements and natural body care crafted with plants.',
  },
  {
    name: 'Miniature Plant Decor',
    slug: 'miniature-plant-decor',
    description: 'Handmade miniatures and decor pieces inspired by nature.',
  },
  {
    name: 'Decor & Digital',
    slug: 'decor-and-digital',
    description: 'E-books, guides, and upcoming kits to support your gardening journey.',
  },
  // Soil & Growing Media subcategories
  {
    name: 'Soil Mixes',
    slug: 'soil-mixes',
    parentSlug: 'soil-and-growing-media',
  },
  {
    name: 'Soil-Less Mixes & Substrates',
    slug: 'soil-less-mixes-and-substrates',
    parentSlug: 'soil-and-growing-media',
  },
  {
    name: 'Amendments & Additives',
    slug: 'amendments-and-additives',
    description: 'Cocopeat, vermicompost, cinder rocks, and more for soil health.',
    parentSlug: 'soil-and-growing-media',
  },
  {
    name: 'Fertilizers & Organic Manures',
    slug: 'fertilizers-and-organic-manures',
    parentSlug: 'soil-and-growing-media',
  },
  // Land Plants subcategories
  {
    name: 'Indoor Plants',
    slug: 'indoor-plants',
    parentSlug: 'land-plants',
  },
  {
    name: 'Outdoor / Garden Plants',
    slug: 'outdoor-garden-plants',
    parentSlug: 'land-plants',
  },
  {
    name: 'Succulents & Cacti',
    slug: 'succulents-and-cacti',
    parentSlug: 'land-plants',
  },
  // Indoor Plants filters
  {
    name: 'Low Maintenance Plants',
    slug: 'low-maintenance-plants',
    parentSlug: 'indoor-plants',
  },
  {
    name: 'Air Purifying Plants',
    slug: 'air-purifying-plants',
    parentSlug: 'indoor-plants',
  },
  {
    name: 'Vastu / Lucky Plants',
    slug: 'vastu-lucky-plants',
    parentSlug: 'indoor-plants',
  },
  // Outdoor Plants filters
  {
    name: 'Native Plants',
    slug: 'native-plants',
    parentSlug: 'outdoor-garden-plants',
  },
  {
    name: 'Edible / Herb Plants',
    slug: 'edible-herb-plants',
    parentSlug: 'outdoor-garden-plants',
  },
  {
    name: 'Shade-Garden Plants',
    slug: 'shade-garden-plants',
    parentSlug: 'outdoor-garden-plants',
  },
  // Aquatic Life subcategories
  {
    name: 'Aquatic Plants',
    slug: 'aquatic-plants',
    parentSlug: 'aquatic-life-ecosystem',
  },
  {
    name: 'Aquatic Snails & Pond Life',
    slug: 'aquatic-snails-and-pond-life',
    parentSlug: 'aquatic-life-ecosystem',
  },
  // Wellness subcategories
  {
    name: 'Herbal Supplements',
    slug: 'herbal-supplements',
    parentSlug: 'wellness-herbal-products',
  },
  {
    name: 'Hair & Body Products',
    slug: 'hair-and-body-products',
    parentSlug: 'wellness-herbal-products',
  },
  {
    name: 'Herbal Powders & Extracts',
    slug: 'herbal-powders-and-extracts',
    parentSlug: 'wellness-herbal-products',
  },
  // Miniature decor subcategory
  {
    name: 'Clay Home Models & Miniatures',
    slug: 'clay-home-models-and-miniatures',
    parentSlug: 'miniature-plant-decor',
  },
  // Decor & Digital subcategories
  {
    name: 'E-Books & Guides',
    slug: 'e-books-and-guides',
    parentSlug: 'decor-and-digital',
  },
  {
    name: 'Seeds & Future Products',
    slug: 'seeds-and-future-products',
    description: 'Seed packs, upcoming gardening kits, and future collections.',
    parentSlug: 'decor-and-digital',
  },
];

const tagsToAdd = [
  'Vastu Plants',
  'Low Maintenance',
  'Beginner Friendly',
  'Pet Safe Plants',
  'Oxygen Boosting',
  'Terrace Garden',
  'Balcony Garden',
  'Aquascape',
  'Pond Setup',
  'Organic Certified',
  'Fair Trade',
  'Farmer Supported',
  'Eco-Friendly Packaging',
];

async function main() {
  console.log('🌱 WordPress Categories Manager\n');

  // Check for credentials
  if (!process.env.WORDPRESS_USER || !process.env.WORDPRESS_PASSWORD) {
    console.error('❌ Error: WordPress credentials not set!');
    console.log('\nSet these environment variables:');
    console.log('  - WORDPRESS_USER: Your WordPress admin username');
    console.log('  - WORDPRESS_PASSWORD: Your WordPress application password');
    console.log('\nExample:');
    console.log('  set WORDPRESS_USER=admin');
    console.log('  set WORDPRESS_PASSWORD=xxxx xxxx xxxx xxxx');
    console.log('  npx ts-node scripts/add-categories.ts');
    process.exit(1);
  }

  console.log(`📋 Existing ${PRODUCT_CATEGORY_TAXONOMY} terms:\n`);
  
  try {
    // Fetch existing categories
  const existing = await getCategories({ per_page: 100 }, PRODUCT_CATEGORY_TAXONOMY);
  const categoryCache = new Map<string, Category>();
  existing.forEach((cat) => categoryCache.set(cat.slug, cat));
    if (existing.length > 0) {
      existing.forEach((cat) => {
        console.log(`  - ${cat.name} (${cat.slug})`);
      });
    } else {
      console.log('  No categories found');
    }

    console.log('\n📝 Adding or updating categories...\n');

    const createdCategories: Category[] = [];

    const findParentId = (parentSlug?: string): number | undefined => {
      if (!parentSlug) return undefined;
      const parent = categoryCache.get(parentSlug);
      if (parent) return parent.id;
      throw new Error(`Parent category with slug "${parentSlug}" not found. Please ensure parent categories are listed before their children.`);
    };

    for (const categoryInput of categoriesToAdd) {
      if (categoryCache.has(categoryInput.slug)) {
        console.log(`  • Skipping existing category: ${categoryInput.name}`);
        continue;
      }

      const parentId = findParentId(categoryInput.parentSlug);
      const created = await createCategory(
        {
          name: categoryInput.name,
          slug: categoryInput.slug,
          description: categoryInput.description,
          parent: parentId,
        },
        PRODUCT_CATEGORY_TAXONOMY
      );

      if (created) {
        categoryCache.set(created.slug, created);
        createdCategories.push(created);
        console.log(`  ✅ Created category: ${created.name}`);
      }
    }

    if (createdCategories.length === 0) {
      console.log('\nℹ️ No new categories created (all already exist).');
    }

    console.log('\n📦 Existing product tags:\n');
    const existingTags = await getCategories({ per_page: 100 }, PRODUCT_TAG_TAXONOMY);
    const tagCache = new Map<string, Category>();
    existingTags.forEach((tag) => tagCache.set(tag.slug, tag));

    if (existingTags.length > 0) {
      existingTags.forEach((tag) => {
        console.log(`  - ${tag.name} (${tag.slug})`);
      });
    } else {
      console.log('  No tags found');
    }

    console.log('\n🏷️ Adding product tags...\n');
    let createdTagCount = 0;
    for (const tagName of tagsToAdd) {
      const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      if (tagCache.has(slug)) {
        console.log(`  • Skipping existing tag: ${tagName}`);
        continue;
      }

      const createdTag = await createCategory(
        {
          name: tagName,
          slug,
        },
        PRODUCT_TAG_TAXONOMY
      );

      if (createdTag) {
        createdTagCount += 1;
        tagCache.set(createdTag.slug, createdTag);
        console.log(`  ✅ Created tag: ${createdTag.name}`);
      }
    }

    if (createdTagCount === 0) {
      console.log('\nℹ️ No new tags created (all already exist).');
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
