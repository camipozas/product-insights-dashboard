import { describe, it, expect } from 'vitest';
import {
  ProductSchema,
  ProductSummarySchema,
  ProductInsightsSchema,
  ProductIdSchema,
} from '../src/types/schemas';

describe('Zod schemas', () => {
  describe('ProductSchema', () => {
    it('should validate a valid product as product', () => {
      const validProduct = {
        id: 1,
        title: 'Test Product',
        description: 'Test description',
        price: 10.99,
        category: 'test',
        thumbnail: 'https://example.com/image.jpg',
        rating: 4.5,
        stock: 10,
        images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
      };

      const result = ProductSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });

    it('should reject invalid product data as invalid data', () => {
      const invalidProduct = {
        id: 'not-a-number',
        title: '',
        price: -10,
        category: 'test',
        thumbnail: 'not-a-url',
        rating: 6, // Invalid rating > 5
        stock: -1,
        images: 'not-an-array',
      };

      const result = ProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
    });
  });

  describe('ProductSummarySchema', () => {
    it('should validate a valid product summary as product summary', () => {
      const validSummary = {
        id: 1,
        title: 'Test Product',
        price: 10.99,
        category: 'test',
        thumbnail: 'https://example.com/image.jpg',
      };

      const result = ProductSummarySchema.safeParse(validSummary);
      expect(result.success).toBe(true);
    });

    it('should reject invalid summary data as invalid data', () => {
      const invalidSummary = {
        id: 'not-a-number',
        title: '',
        price: -10,
        category: '',
        thumbnail: 'not-a-url',
      };

      const result = ProductSummarySchema.safeParse(invalidSummary);
      expect(result.success).toBe(false);
    });
  });

  describe('ProductInsightsSchema', () => {
    it('should validate valid insights as insights', () => {
      const validInsights = {
        averagePrice: 10.99,
        topCategory: 'test',
        totalProducts: 100,
        categoryCount: { test: 50, other: 50 },
      };

      const result = ProductInsightsSchema.safeParse(validInsights);
      expect(result.success).toBe(true);
    });

    it('should reject invalid insights as invalid data', () => {
      const invalidInsights = {
        averagePrice: -10,
        topCategory: '',
        totalProducts: 0,
        categoryCount: 'not-an-object',
      };

      const result = ProductInsightsSchema.safeParse(invalidInsights);
      expect(result.success).toBe(false);
    });
  });

  describe('ProductIdSchema', () => {
    it('should validate numeric string IDs as number', () => {
      expect(ProductIdSchema.safeParse('1').success).toBe(true);
      expect(ProductIdSchema.safeParse('123').success).toBe(true);
    });

    it('should reject non-numeric IDs as invalid data', () => {
      expect(ProductIdSchema.safeParse('abc').success).toBe(false);
      expect(ProductIdSchema.safeParse('1.5').success).toBe(false);
      expect(ProductIdSchema.safeParse('').success).toBe(false);
    });

    it('should transform string to number as number', () => {
      const result = ProductIdSchema.safeParse('123');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(123);
      }
    });
  });
});
