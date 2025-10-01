import { test, expect } from '@playwright/test';

test.describe('Search and Filter Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display search and filter controls', async ({ page }) => {
    await expect(page.locator('input[placeholder="Enter product name..."]')).toBeVisible();
    await expect(page.locator('select')).toBeVisible();
    await expect(page.locator('input[placeholder="0"]')).toBeVisible();
    await expect(page.locator('input[placeholder="1000"]')).toBeVisible();
    await expect(page.getByText('Clear Filters')).toBeVisible();
  });

  test('should filter products by name search', async ({ page }) => {
    await page.waitForSelector('tbody tr');

    const initialCount = await page.locator('tbody tr').count();

    await page.locator('input[placeholder="Enter product name..."]').fill('iPhone');

    await page.waitForTimeout(500);

    const filteredCount = await page.locator('tbody tr').count();
    expect(filteredCount).toBeLessThan(initialCount);

    const productTitles = await page.locator('tbody tr td:nth-child(2) a').allTextContents();
    productTitles.forEach(title => {
      expect(title.toLowerCase()).toContain('iphone');
    });
  });

  test('should filter products by category', async ({ page }) => {
    await page.waitForSelector('tbody tr');

    const initialCount = await page.locator('tbody tr').count();

    await page.locator('select').selectOption('smartphones');

    await page.waitForTimeout(500);

    const filteredCount = await page.locator('tbody tr').count();
    expect(filteredCount).toBeLessThan(initialCount);

    const productCategories = await page.locator('tbody tr td:nth-child(4)').allTextContents();
    productCategories.forEach(category => {
      expect(category).toBe('smartphones');
    });
  });

  test('should filter products by price range', async ({ page }) => {
    await page.waitForSelector('tbody tr');

    await page.locator('input[placeholder="0"]').fill('100');

    await page.waitForTimeout(500);

    const productPrices = await page.locator('tbody tr td:nth-child(3) span').allTextContents();
    productPrices.forEach(priceText => {
      const price = parseFloat(priceText.replace('$', ''));
      expect(price).toBeGreaterThanOrEqual(100);
    });
  });

  test('should combine multiple filters', async ({ page }) => {
    await page.waitForSelector('tbody tr');

    await page.locator('input[placeholder="Enter product name..."]').fill('iPhone');
    await page.locator('select').selectOption('smartphones');
    await page.locator('input[placeholder="0"]').fill('500');

    await page.waitForTimeout(500);

    const productRows = page.locator('tbody tr');
    const count = await productRows.count();

    for (let i = 0; i < count; i++) {
      const row = productRows.nth(i);
      const title = await row.locator('td:nth-child(2) a').textContent();
      const category = await row.locator('td:nth-child(4)').textContent();
      const priceText = await row.locator('td:nth-child(3) span').textContent();
      const price = parseFloat(priceText!.replace('$', ''));

      expect(title!.toLowerCase()).toContain('iphone');
      expect(category).toBe('smartphones');
      expect(price).toBeGreaterThanOrEqual(500);
    }
  });

  test('should clear all filters', async ({ page }) => {
    await page.waitForSelector('tbody tr');

    await page.locator('input[placeholder="Enter product name..."]').fill('iPhone');
    await page.locator('select').selectOption('smartphones');

    await page.waitForTimeout(500);

    const filteredCount = await page.locator('tbody tr').count();

    await page.getByText('Clear Filters').click();

    await page.waitForTimeout(500);

    const allCount = await page.locator('tbody tr').count();
    expect(allCount).toBeGreaterThan(filteredCount);

    await expect(page.locator('input[placeholder="Enter product name..."]')).toHaveValue('');
    await expect(page.locator('select')).toHaveValue('');
  });

  test('should show product count', async ({ page }) => {
    await page.waitForSelector('tbody tr');

    await expect(page.getByText(/Showing \d+ of \d+ products/)).toBeVisible();
  });

  test('should update product count when filtering', async ({ page }) => {
    await page.waitForSelector('tbody tr');

    const initialCountText = await page.getByText(/Showing \d+ of \d+ products/).textContent();
    const initialCount = parseInt(initialCountText!.match(/(\d+)/)![1]);

    await page.locator('input[placeholder="Enter product name..."]').fill('iPhone');

    await page.waitForTimeout(500);

    const filteredCountText = await page.getByText(/Showing \d+ of \d+ products/).textContent();
    const filteredCount = parseInt(filteredCountText!.match(/(\d+)/)![1]);

    expect(filteredCount).toBeLessThan(initialCount);
  });
});
