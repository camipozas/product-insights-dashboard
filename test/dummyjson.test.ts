import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchAllProducts, fetchProductById } from '../src/lib/dummyjson';

const mockFetch = vi.fn();
global.fetch = mockFetch as unknown as typeof fetch;

describe('DummyJSON utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchAllProducts()', () => {
    it('should fetch all products with pagination as products', async () => {
      const mockFirstPage = {
        products: [
          {
            id: 1,
            title: 'Product 1',
            description: 'Test description',
            price: 10,
            category: 'test',
            thumbnail: 'https://example.com/url1.jpg',
            rating: 4,
            stock: 10,
            images: ['https://example.com/url1.jpg'],
          },
          {
            id: 2,
            title: 'Product 2',
            description: 'Test description 2',
            price: 20,
            category: 'test',
            thumbnail: 'https://example.com/url2.jpg',
            rating: 5,
            stock: 5,
            images: ['https://example.com/url2.jpg'],
          },
        ],
        total: 2,
        skip: 0,
        limit: 30,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockFirstPage),
      } as Response);

      const result = await fetchAllProducts();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(mockFirstPage.products[0]);
      expect(result[1]).toEqual(mockFirstPage.products[1]);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://dummyjson.com/products?limit=30&skip=0',
        expect.objectContaining({ next: { revalidate: 3600 } })
      );
    });

    it('should handle API errors as API error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      await expect(fetchAllProducts()).rejects.toThrow('DummyJSON API returned 500');
    });

    it('should handle invalid data as invalid data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ invalid: 'data' }),
      } as Response);

      await expect(fetchAllProducts()).rejects.toThrow('Invalid data received from external API');
    });
  });

  describe('fetchProductById()', () => {
    it('should fetch a single product by ID as product', async () => {
      const mockProduct = {
        id: 1,
        title: 'Test Product',
        description: 'Test description',
        price: 10,
        category: 'test',
        thumbnail: 'https://example.com/url1.jpg',
        rating: 4,
        stock: 10,
        images: ['https://example.com/url1.jpg'],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProduct),
      } as Response);

      const result = await fetchProductById(1);

      expect(result).toEqual(mockProduct);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://dummyjson.com/products/1',
        expect.objectContaining({ next: { revalidate: 3600 } })
      );
    });

    it('should handle 404 errors as not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      await expect(fetchProductById(999)).rejects.toThrow('Product with ID 999 not found');
    });

    it('should handle invalid product data as invalid data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ invalid: 'product' }),
      } as Response);

      await expect(fetchProductById(1)).rejects.toThrow('Invalid data received from external API');
    });
  });
});
