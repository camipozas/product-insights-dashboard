import { NextResponse } from 'next/server';
import { ProductSummarySchema } from '@/types/schemas';
import type { ProductSummary } from '@/types/schemas';
import { fetchAllProducts } from '@/lib/dummyjson';
import { logger } from '@/lib/logger';

/**
 * Get the products for the dashboard
 * @returns The products
 */
export async function GET() {
  const startTime = Date.now();
  
  try {
    logger.info('Fetching all products');
    
    const products = await fetchAllProducts();
    logger.debug('Products fetched successfully', { count: products.length });

    const trimmedProducts: ProductSummary[] = products.map((product) =>
      ProductSummarySchema.parse({
        id: product.id,
        title: product.title,
        price: product.price,
        category: product.category,
        thumbnail: product.thumbnail,
      })
    );

    const duration = Date.now() - startTime;
    logger.apiRequest('GET', '/api/products', duration, { 
      productsCount: trimmedProducts.length 
    });

    return NextResponse.json(
      { products: trimmedProducts, total: products.length },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.apiError('GET', '/api/products', 500, error, { duration });
    
    return NextResponse.json(
      {
        error: 'Failed to fetch products',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
