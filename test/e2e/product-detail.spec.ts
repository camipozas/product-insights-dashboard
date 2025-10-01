import { test, expect } from '@playwright/test';

test.describe('Product Detail Page', () => {
  test('should display product details correctly as product details', async ({ page }) => {
    await page.goto('/products/1');

    await expect(page.getByText('← Back to Dashboard')).toBeVisible();

    // Wait for product details to load
    await page.waitForSelector('h1', { timeout: 5000 });
    await expect(page.locator('h1').last()).toBeVisible();

    // Check that product image is visible
    await expect(page.locator('img').first()).toBeVisible();
  });

  test('should handle product image gallery as product image gallery', async ({ page }) => {
    await page.goto('/products/1');

    // Wait for images to load
    await page.waitForSelector('img', { timeout: 5000 });

    // Check that at least one image is visible
    const images = page.locator('img');
    const imageCount = await images.count();
    expect(imageCount).toBeGreaterThan(0);
  });

  test('should navigate back to dashboard as back to dashboard', async ({ page }) => {
    await page.goto('/products/1');

    await page.getByText('← Back to Dashboard').click();

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Product Insights Dashboard' })).toBeVisible();
  });

  test('should handle 404 for non-existent product as not found', async ({ page }) => {
    await page.goto('/products/99999');

    await expect(page.getByText('Error')).toBeVisible();
    await expect(page.getByText('Back to Dashboard')).toBeVisible();
  });

  test('should handle invalid product ID as invalid data', async ({ page }) => {
    await page.goto('/products/invalid');

    await expect(page.getByText('Error')).toBeVisible();
  });
});
