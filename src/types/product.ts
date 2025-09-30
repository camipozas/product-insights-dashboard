export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
  rating: number;
  stock: number;
  images: string[];
}

export interface ProductSummary {
  id: number;
  title: string;
  price: number;
  category: string;
  thumbnail: string;
}

export interface DummyJSONProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductInsights {
  averagePrice: number;
  topCategory: string;
  totalProducts: number;
  categoryCount: Record<string, number>;
}

export interface APIError {
  error: string;
  message: string;
}
