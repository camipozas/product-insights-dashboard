import { test, expect } from '@playwright/test';

test.describe('API Endpoints', () => {
  test('GET /api/products should return product list as products', async ({ request }) => {
    const response = await request.get('/api/products');

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('products');
    expect(data).toHaveProperty('total');
    expect(Array.isArray(data.products)).toBe(true);
    expect(data.products.length).toBeGreaterThan(0);

    const product = data.products[0];
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('title');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('category');
    expect(product).toHaveProperty('thumbnail');
  });

  test('GET /api/products/insights should return insights as insights', async ({ request }) => {
    const response = await request.get('/api/products/insights');

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('averagePrice');
    expect(data).toHaveProperty('topCategory');
    expect(data).toHaveProperty('totalProducts');
    expect(data).toHaveProperty('categoryCount');

    expect(typeof data.averagePrice).toBe('number');
    expect(data.averagePrice).toBeGreaterThan(0);
    expect(typeof data.topCategory).toBe('string');
    expect(typeof data.totalProducts).toBe('number');
    expect(data.totalProducts).toBeGreaterThan(0);
    expect(typeof data.categoryCount).toBe('object');
  });

  test('GET /api/products/[id] should return product details as product', async ({ request }) => {
    const response = await request.get('/api/products/1');

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('title');
    expect(data).toHaveProperty('description');
    expect(data).toHaveProperty('price');
    expect(data).toHaveProperty('category');
    expect(data).toHaveProperty('rating');
    expect(data).toHaveProperty('stock');
    expect(data).toHaveProperty('thumbnail');
    expect(data).toHaveProperty('images');

    expect(Array.isArray(data.images)).toBe(true);
    expect(data.rating).toBeGreaterThanOrEqual(0);
    expect(data.rating).toBeLessThanOrEqual(5);
    expect(data.stock).toBeGreaterThanOrEqual(0);
  });

  test('GET /api/products/[id] should return 404 for non-existent product as not found', async ({
    request,
  }) => {
    const response = await request.get('/api/products/99999');

    expect(response.status()).toBe(404);

    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data).toHaveProperty('message');
    expect(data.error).toBe('Product not found');
  });

  test('GET /api/products/[id] should return 400 for invalid ID as invalid data', async ({
    request,
  }) => {
    const response = await request.get('/api/products/invalid');

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data).toHaveProperty('message');
    expect(data.error).toBe('Invalid product ID');
  });
});
