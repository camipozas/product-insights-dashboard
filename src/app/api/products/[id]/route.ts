import { NextResponse } from 'next/server';
import { ProductIdSchema } from '@/types/schemas';
import { fetchProductById } from '@/lib/dummyjson';
import { logger } from '@/lib/logger';

/**
 * Get the product by ID
 * @param request - The request
 * @param params - The parameters
 * @returns The product
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const startTime = Date.now();
  const { id } = params;

  try {
    logger.info('Fetching product details', { productId: id });

    const idValidation = ProductIdSchema.safeParse(id);
    if (!idValidation.success) {
      logger.warn('Invalid product ID format', { productId: id });
      return NextResponse.json(
        {
          error: 'Invalid product ID',
          message: 'Product ID must be a positive number',
        },
        { status: 400 }
      );
    }

    const productId = idValidation.data;

    const product = await fetchProductById(productId);

    const duration = Date.now() - startTime;
    logger.apiRequest('GET', `/api/products/${id}`, duration, {
      productId,
      productTitle: product.title,
    });

    return NextResponse.json(product, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isNotFound = errorMessage.includes('not found');

    if (isNotFound) {
      logger.warn('Product not found', { productId: id, duration });
    } else {
      logger.apiError('GET', `/api/products/${id}`, 500, error, { productId: id, duration });
    }

    return NextResponse.json(
      {
        error: isNotFound ? 'Product not found' : 'Failed to fetch product',
        message: errorMessage,
      },
      { status: isNotFound ? 404 : 500 }
    );
  }
}
