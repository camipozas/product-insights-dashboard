'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { ProductSummary, ProductInsights } from '@/types/product';

export default function DashboardPage() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [insights, setInsights] = useState<ProductInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [productsRes, insightsRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/products/insights'),
        ]);

        if (!productsRes.ok || !insightsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const productsData = (await productsRes.json()) as {
          products: ProductSummary[];
          total: number;
        };
        const insightsData = (await insightsRes.json()) as ProductInsights;

        setProducts(productsData.products);
        setInsights(insightsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    void fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Insights Section */}
      {insights && (
        <section className="insights">
          <div className="insight-card">
            <h3>Average Price</h3>
            <div className="value">${insights.averagePrice.toFixed(2)}</div>
          </div>
          <div className="insight-card">
            <h3>Top Category</h3>
            <div className="value">{insights.topCategory}</div>
          </div>
          <div className="insight-card">
            <h3>Total Products</h3>
            <div className="value">{insights.totalProducts}</div>
          </div>
        </section>
      )}

      {/* Product List */}
      <section className="product-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <Link href={`/products/${product.id}`}>
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="product-thumbnail"
                    />
                  </Link>
                </td>
                <td>
                  <Link href={`/products/${product.id}`} className="product-title">
                    {product.title}
                  </Link>
                </td>
                <td>
                  <span className="product-price">${product.price.toFixed(2)}</span>
                </td>
                <td>
                  <span className="product-category">{product.category}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
