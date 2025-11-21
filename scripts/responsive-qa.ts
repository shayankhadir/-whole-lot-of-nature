#!/usr/bin/env tsx

/**
 * Responsive QA helper
 * Spins up Chromium via Playwright, visits the most important routes
 * at multiple breakpoints, and captures screenshots for manual review.
 */

import path from 'path';
import { mkdir } from 'fs/promises';
import { chromium, Browser, Page } from 'playwright';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const OUTPUT_DIR = path.resolve(process.cwd(), 'qa', 'screenshots');

const VIEWPORTS = [
  { label: 'mobile', width: 375, height: 812 },
  { label: 'tablet', width: 768, height: 1024 },
  { label: 'desktop', width: 1280, height: 720 },
  { label: 'xl', width: 1536, height: 864 },
];

const ROUTES = ['/', '/shop', '/about', '/account', '/plantsy', '/cart'];

async function visit(page: Page, route: string, viewport: typeof VIEWPORTS[number]) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  const url = new URL(route, BASE_URL).toString();
  const response = await page.goto(url, { waitUntil: 'networkidle' });
  if (!response || !response.ok()) {
    throw new Error(`Failed to load ${url} (${response?.status()})`);
  }
  const slug = route === '/' ? 'home' : route.replace(/\//g, '-').replace(/^-|-$/g, '');
  const filename = `${slug || 'home'}-${viewport.label}.png`;
  await page.screenshot({ path: path.join(OUTPUT_DIR, filename), fullPage: true });
  console.log(`✅ Captured ${route} @ ${viewport.label}`);
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const browser: Browser = await chromium.launch();
  const page = await browser.newPage();

  for (const route of ROUTES) {
    for (const viewport of VIEWPORTS) {
      await visit(page, route, viewport);
    }
  }

  await browser.close();
  console.log(`Screenshots saved to ${OUTPUT_DIR}`);
}

main().catch((error) => {
  console.error('Responsive QA failed:', error);
  process.exit(1);
});
