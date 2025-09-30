import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  category: z.string().min(1),
  thumbnail: z.string().url(),
  rating: z.number().min(0).max(5),
  stock: z.number().int().min(0),
  images: z.array(z.string().url()),
});

export const ProductSummarySchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  price: z.number().positive(),
  category: z.string().min(1),
  thumbnail: z.string().url(),
});

export const DummyJSONProductsResponseSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number().int().min(0),
  skip: z.number().int().min(0),
  limit: z.number().int().min(0),
});

export const ProductInsightsSchema = z.object({
  averagePrice: z.number().positive(),
  topCategory: z.string().min(1),
  totalProducts: z.number().int().positive(),
  categoryCount: z.record(z.string(), z.number().int().min(0)),
});

export const APIErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
});

export const ProductIdSchema = z.string().regex(/^\d+$/).transform(Number);

export type Product = z.infer<typeof ProductSchema>;
export type ProductSummary = z.infer<typeof ProductSummarySchema>;
export type DummyJSONProductsResponse = z.infer<typeof DummyJSONProductsResponseSchema>;
export type ProductInsights = z.infer<typeof ProductInsightsSchema>;
export type APIError = z.infer<typeof APIErrorSchema>;
