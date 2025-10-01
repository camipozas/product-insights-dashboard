import { test, expect } from '@playwright/test';

test.describe('Product Insights Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main dashboard with insights and product list', async ({ page }) => {
    await expect(page).toHaveTitle(/Product Insights Dashboard/);

    await expect(page.getByRole('heading', { name: 'Product Insights Dashboard' })).toBeVisible();

    await expect(page.getByText('Average Price')).toBeVisible();
    await expect(page.getByText('Top Category')).toBeVisible();
    await expect(page.getByText('Total Products')).toBeVisible();

    await expect(page.locator('th').filter({ hasText: /^Image$/i })).toBeVisible();
    await expect(page.locator('th').filter({ hasText: /^Product Name$/i })).toBeVisible();
    await expect(page.locator('th').filter({ hasText: /^Price$/i })).toBeVisible();
    await expect(page.locator('th').filter({ hasText: /^Category$/i })).toBeVisible();

    const productRows = page.locator('tbody tr');
    await expect(productRows.first()).toBeVisible();
  });

  test('should navigate to product detail page when clicking a product', async ({ page }) => {
    await page.waitForSelector('tbody tr');

    const firstProduct = page.locator('tbody tr').first();
    const productLink = firstProduct.locator('a').first();
    await productLink.click();

    await expect(page).toHaveURL(/\/products\/\d+/);

    await expect(page.getByText('← Back to Dashboard')).toBeVisible();
    await expect(page.locator('h1').last()).toBeVisible();

    // Wait for product details to load
    await page.waitForSelector('img', { timeout: 5000 });
  });

  test('should display loading state initially as loading state', async ({ page }) => {
    await page.goto('/');

    await page.waitForSelector('tbody tr', { timeout: 10000 });

    await expect(page.getByText('Loading dashboard...')).not.toBeVisible();
    const productRows = page.locator('tbody tr');
    await expect(productRows.first()).toBeVisible();
  });

  test('should handle API errors gracefully as API error', async ({ page }) => {
    await page.route('**/api/products', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    await page.goto('/');

    await expect(page.getByText('Error')).toBeVisible();
  });
});
