import { test, expect } from '@playwright/test';

test.describe('UI smoke', () => {
  const criticalRoutes = ['/', '/shop', '/cart', '/checkout', '/blog', '/admin/pages'];

  for (const route of criticalRoutes) {
    test(`route loads: ${route}`, async ({ page, baseURL }) => {
      test.setTimeout(route === '/' || route === '/shop' ? 120_000 : 30_000);
      const response = await page.goto(route, {
        waitUntil: 'domcontentloaded',
        timeout: route === '/' || route === '/shop' ? 120_000 : 30_000,
      });
      expect(response, 'missing response').not.toBeNull();
      expect(response!.ok(), `non-OK response for ${route}`).toBeTruthy();

      await expect(page.locator('text=404')).toHaveCount(0);
      await expect(page.getByRole('heading', { name: /not found/i })).toHaveCount(0);

      expect(baseURL).toBeTruthy();
    });
  }

  test('mobile header menu opens and closes', async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 120_000 });

    const openButton = page.getByRole('button', { name: 'Open navigation menu' });
    await expect(openButton).toBeVisible();
    await openButton.click({ force: true });

    await expect(page.getByText('Menu', { exact: true })).toBeVisible();

    const closeButton = page.getByRole('button', { name: 'Close menu' });
    await expect(closeButton).toBeVisible();
    await closeButton.click();

    await expect(page.getByText('Menu', { exact: true })).toHaveCount(0);
  });

  test('floating nav Chat toggles Plantsy on mobile', async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 120_000 });

    const chat = page.getByRole('button', { name: 'Chat' });
    await expect(chat).toBeVisible();

    await chat.click();
    await expect(page.getByText('Plantsy', { exact: true })).toBeVisible();

    await chat.click();
    await expect(page.getByText('Plantsy', { exact: true })).toHaveCount(0);
  });
});
