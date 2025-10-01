import { NextResponse } from 'next/server';
import { ProductIdSchema } from '@/types/schemas';
import { fetchProductById } from '@/lib/dummyjson';

/**
 * Get the product by ID
 * @param request - The request
 * @param params - The parameters
 * @returns The product
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const idValidation = ProductIdSchema.safeParse(id);
    if (!idValidation.success) {
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

    return NextResponse.json(product, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('Error fetching product:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isNotFound = errorMessage.includes('not found');

    return NextResponse.json(
      {
        error: isNotFound ? 'Product not found' : 'Failed to fetch product',
        message: errorMessage,
      },
      { status: isNotFound ? 404 : 500 }
    );
  }
}
