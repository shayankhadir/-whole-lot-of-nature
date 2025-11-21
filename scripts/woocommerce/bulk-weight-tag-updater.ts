#!/usr/bin/env tsx

/**
 * Bulk Weight + Tag Updater
 * ---------------------------------------------
 * Heuristically assigns missing product weights and evergreen SEO tags
 * so WooCommerce shipping rules and storefront filters remain accurate.
 *
 * Usage:
 *   DRY_RUN=true tsx scripts/woocommerce/bulk-weight-tag-updater.ts
 *   tsx scripts/woocommerce/bulk-weight-tag-updater.ts
 *
 * Required env vars:
 *   WORDPRESS_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET
 */

import type { AxiosResponse } from 'axios';
import { woocommerceClient } from '@/lib/services/woocommerceService';

type WCTag = { id: number; name: string; slug: string };
type WCCategory = { id: number; name: string; slug: string };
type WCProduct = {
  id: number;
  name: string;
  slug: string;
  weight?: string;
  categories?: WCCategory[];
  tags?: WCTag[];
  type?: string;
};

const DRY_RUN = (process.env.DRY_RUN ?? '').toLowerCase() === 'true';
const PRODUCT_PAGE_SIZE = Number(process.env.WOO_PAGE_SIZE ?? 50);

const CATEGORY_WEIGHT_HINTS: Array<{ match: RegExp; weight: number }> = [
  { match: /(soil|mix|compost|fertilizer|manure)/i, weight: 3.5 },
  { match: /(aquatic|pond|water)/i, weight: 2.1 },
  { match: /(succulent|cactus)/i, weight: 0.4 },
  { match: /(miniature|decor|digital|ebook)/i, weight: 0.2 },
  { match: /(indoor|low|air|vastu|herb|herbal|wellness)/i, weight: 1.2 },
  { match: /(outdoor|garden|native|shade)/i, weight: 1.8 },
];

const TAG_PRESETS: Record<string, string[]> = {
  soil: ['Soil Mixes', 'Organic Amendments', 'StayLoyalToTheSoil'],
  aquatic: ['Aquascape Ready', 'Pond Friendly'],
  succulent: ['Low Maintenance', 'Beginner Friendly'],
  vastu: ['Vastu Approved', 'Fortune Friendly'],
  herbal: ['Wellness Essentials', 'Herbal Healing'],
  pet: ['Pet Safe Plants'],
  air: ['Air Purifier'],
};

function inferWeight(product: WCProduct): number {
  if (product.weight) {
    const parsed = Number(product.weight);
    if (!Number.isNaN(parsed) && parsed > 0) {
      return Number(parsed.toFixed(1));
    }
  }

  const title = product.name.toLowerCase();
  for (const hint of CATEGORY_WEIGHT_HINTS) {
    if (hint.match.test(title) || product.categories?.some((cat) => hint.match.test(cat.slug))) {
      return hint.weight;
    }
  }
  return 1.0;
}

function normalizeTag(tag: string) {
  return tag.trim().replace(/\s+/g, ' ');
}

function collectPresetTags(product: WCProduct): string[] {
  const names = new Set<string>();
  const slugString = `${product.slug} ${(product.categories || []).map((c) => c.slug).join(' ')}`;

  if (/soil|mix|manure|compost/i.test(slugString)) TAG_PRESETS.soil.forEach((t) => names.add(t));
  if (/aqua|pond|water/i.test(slugString)) TAG_PRESETS.aquatic.forEach((t) => names.add(t));
  if (/succulent|cactus/i.test(slugString)) TAG_PRESETS.succulent.forEach((t) => names.add(t));
  if (/vastu|lucky/i.test(slugString)) TAG_PRESETS.vastu.forEach((t) => names.add(t));
  if (/herb|herbal|wellness/i.test(slugString)) TAG_PRESETS.herbal.forEach((t) => names.add(t));
  if (/pet|dog|cat/i.test(slugString)) TAG_PRESETS.pet.forEach((t) => names.add(t));
  if (/air|oxygen/i.test(slugString)) TAG_PRESETS.air.forEach((t) => names.add(t));

  return Array.from(names).map(normalizeTag);
}

async function fetchAllProducts(): Promise<WCProduct[]> {
  let page = 1;
  const products: WCProduct[] = [];

  while (true) {
    const response: AxiosResponse<WCProduct[]> = await woocommerceClient.get('products', {
      per_page: PRODUCT_PAGE_SIZE,
      page,
      status: 'publish',
    });

    if (!Array.isArray(response.data) || response.data.length === 0) break;
    products.push(...response.data);
    if (response.data.length < PRODUCT_PAGE_SIZE) break;
    page += 1;
  }

  return products;
}

async function fetchAllTags(): Promise<Map<string, WCTag>> {
  let page = 1;
  const tags = new Map<string, WCTag>();

  while (true) {
    const response: AxiosResponse<WCTag[]> = await woocommerceClient.get('products/tags', {
      per_page: 100,
      page,
    });

    if (!Array.isArray(response.data) || response.data.length === 0) break;
    response.data.forEach((tag) => tags.set(tag.name.toLowerCase(), tag));
    if (response.data.length < 100) break;
    page += 1;
  }

  return tags;
}

async function ensureTag(name: string, cache: Map<string, WCTag>): Promise<WCTag> {
  const key = name.toLowerCase();
  const existing = cache.get(key);
  if (existing) return existing;

  const created: AxiosResponse<WCTag> = await woocommerceClient.post('products/tags', { name });
  cache.set(key, created.data);
  return created.data;
}

async function run() {
  console.log('🌿 Whole Lot of Nature — Bulk Weight + Tag Updater');
  console.log(`   Mode: ${DRY_RUN ? 'DRY RUN (no changes applied)' : 'LIVE UPDATE'}`);

  if (!process.env.WC_CONSUMER_KEY || !process.env.WC_CONSUMER_SECRET) {
    throw new Error('WC_CONSUMER_KEY and WC_CONSUMER_SECRET must be set.');
  }

  const [products, tagCache] = await Promise.all([fetchAllProducts(), fetchAllTags()]);
  console.log(`   Loaded ${products.length} published products`);

  let updated = 0;
  for (const product of products) {
    const newWeight = inferWeight(product);
    const presetTags = collectPresetTags(product);
    const currentTagNames = new Set((product.tags || []).map((tag) => normalizeTag(tag.name)));

    const missingTags = presetTags.filter((tag) => !currentTagNames.has(tag));
    const payload: Record<string, unknown> = {};

    if (!product.weight || Number(product.weight).toFixed(1) !== newWeight.toFixed(1)) {
      payload.weight = newWeight.toFixed(1);
    }

    if (missingTags.length > 0) {
      const resolvedTags = await Promise.all(missingTags.map((tag) => ensureTag(tag, tagCache)));
      const tagIds = new Set<number>((product.tags || []).map((tag) => tag.id));
      resolvedTags.forEach((tag) => tagIds.add(tag.id));
      payload.tags = Array.from(tagIds).map((id) => ({ id }));
    }

    if (Object.keys(payload).length === 0) continue;

    updated += 1;
    if (DRY_RUN) {
      console.log(`   • [DRY] ${product.name} →`, payload);
    } else {
      await woocommerceClient.put(`products/${product.id}`, payload);
      console.log(`   ✅ ${product.name} updated`);
    }
  }

  console.log(`\nDone. ${updated} product(s) ${DRY_RUN ? 'would be updated' : 'updated'}.
Remember to re-run with DRY_RUN=false once reviews look good.`);
}

run().catch((error) => {
  console.error('❌ Bulk update failed:', error.message);
  process.exit(1);
});
