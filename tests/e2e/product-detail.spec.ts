import { test, expect } from '@playwright/test';

test.describe('Product Detail Page', () => {
  test('should display product details correctly as product details', async ({ page }) => {
    await page.goto('/products/1');

    await expect(page.getByText('← Back to Dashboard')).toBeVisible();
    await expect(page.locator('h1').last()).toBeVisible();

    await expect(page.getByText('Price')).toBeVisible();
    await expect(page.getByText('Rating')).toBeVisible();
    await expect(page.getByText('Stock')).toBeVisible();
    await expect(page.getByText('Category')).toBeVisible();

    await expect(page.getByText('Description')).toBeVisible();

    const mainImage = page.locator('.product-main-image');
    await expect(mainImage).toBeVisible();
  });

  test('should handle product image gallery as product image gallery', async ({ page }) => {
    await page.goto('/products/1');

    const thumbnails = page.locator('.product-thumbnails img');
    const thumbnailCount = await thumbnails.count();

    if (thumbnailCount > 1) {
      await thumbnails.nth(1).click();

      const mainImage = page.locator('.product-main-image');
      await expect(mainImage).toBeVisible();
    }
  });

  test('should navigate back to dashboard as back to dashboard', async ({ page }) => {
    await page.goto('/products/1');

    await page.getByText('← Back to Dashboard').click();

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Product Insights Dashboard' })).toBeVisible();
  });

  test('should handle 404 for non-existent product as not found', async ({ page }) => {
    await page.goto('/products/99999');

    await expect(page.getByText(/Error:/)).toBeVisible();
    await expect(page.getByText('← Back to Dashboard')).toBeVisible();
  });

  test('should handle invalid product ID as invalid data', async ({ page }) => {
    await page.goto('/products/invalid');

    await expect(page.getByText(/Error:/)).toBeVisible();
  });
});
