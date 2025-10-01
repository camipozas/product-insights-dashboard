'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { Product } from '@/types/product';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Product not found');
          }
          throw new Error('Failed to fetch product');
        }

        const data = (await response.json()) as Product;
        setProduct(data);
        setSelectedImage(data.images[0] || data.thumbnail);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    void fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading product details...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container">
        <Link href="/" className="back-link">
          ← Back to Dashboard
        </Link>
        <div className="error">Error: {error || 'Product not found'}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <Link href="/" className="back-link">
        ← Back to Dashboard
      </Link>

      <article className="product-detail">
        <div className="product-detail-header">
          {/* Product Images */}
          <div className="product-images">
            <img src={selectedImage} alt={product.title} className="product-main-image" />
            {product.images.length > 1 && (
              <div className="product-thumbnails">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.title} - Image ${index + 1}`}
                    className={selectedImage === image ? 'active' : ''}
                    onClick={() => setSelectedImage(image)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h1>{product.title}</h1>

            <div className="product-meta">
              <div className="product-meta-item">
                <label>Price</label>
                <div className="value">${product.price.toFixed(2)}</div>
              </div>
              <div className="product-meta-item">
                <label>Rating</label>
                <div className="value">⭐ {product.rating.toFixed(1)}</div>
              </div>
              <div className="product-meta-item">
                <label>Stock</label>
                <div className="value">{product.stock}</div>
              </div>
            </div>

            <div className="product-meta-item">
              <label>Category</label>
              <span className="product-category">{product.category}</span>
            </div>

            <div className="product-description">
              <h2>Description</h2>
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
